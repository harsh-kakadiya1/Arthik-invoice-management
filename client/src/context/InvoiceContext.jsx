import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DEFAULT_INVOICE_DATA } from '../lib/variables';
import { generateInvoiceNumber, numberToWords } from '../lib/helpers';
import { useAutosave } from './AutosaveContext';

const InvoiceContext = createContext();

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider = ({ children, initialData, isEditMode = false, isDraftMode = false, invoiceId = null }) => {
  const { autosaveInvoice, updateInvoiceInPlace } = useAutosave();
  const isInitialMount = useRef(true);
  const lastAutosaveData = useRef(null);
  const updateTimeoutRef = useRef(null);

  const [invoiceData, setInvoiceData] = useState(() => {
    if (isEditMode && initialData) {
      console.log('Loading invoice data for edit mode:', initialData);
      // For edit mode, use the fetched invoice data
      const mergedData = {
        ...initialData,
        // Ensure we have all required fields with defaults
        sender: { ...DEFAULT_INVOICE_DATA.sender, ...initialData.sender },
        receiver: { ...DEFAULT_INVOICE_DATA.receiver, ...initialData.receiver },
        details: { ...DEFAULT_INVOICE_DATA.details, ...initialData.details }
      };
      console.log('Merged invoice data:', mergedData);
      return mergedData;
    }
    // For create mode, use default data
    return {
      ...DEFAULT_INVOICE_DATA,
      invoiceNumber: generateInvoiceNumber()
    };
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isDraft, setIsDraft] = useState(isDraftMode);

  const updateInvoiceData = (updates) => {
    setInvoiceData(prev => {
      const newData = { ...prev, ...updates };
      
      // Recalculate totals if items are updated
      if (updates.details?.items) {
        const items = updates.details.items;
        let subTotal = 0;
        
        items.forEach(item => {
          item.total = item.quantity * item.unitPrice;
          subTotal += item.total;
        });
        
        newData.details.subTotal = subTotal;
        
        // Calculate total amount
        let totalAmount = subTotal;
        
        // Apply discount
        const discount = newData.details.discountDetails;
        if (discount.amount > 0) {
          if (discount.amountType === 'percentage') {
            totalAmount -= (totalAmount * discount.amount) / 100;
          } else {
            totalAmount -= discount.amount;
          }
        }
        
        // Apply tax
        const tax = newData.details.taxDetails;
        if (tax.amount > 0) {
          if (tax.amountType === 'percentage') {
            totalAmount += (totalAmount * tax.amount) / 100;
          } else {
            totalAmount += tax.amount;
          }
        }
        
        // Apply shipping
        const shipping = newData.details.shippingDetails;
        if (shipping.cost > 0) {
          if (shipping.costType === 'percentage') {
            totalAmount += (totalAmount * shipping.cost) / 100;
          } else {
            totalAmount += shipping.cost;
          }
        }
        
        newData.details.totalAmount = Math.round(totalAmount * 100) / 100;
        newData.details.totalAmountInWords = numberToWords(Math.floor(newData.details.totalAmount));
      }
      
      return newData;
    });
  };

  // Autosave effect
  useEffect(() => {
    // Skip autosave on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Check if data has actually changed
    if (JSON.stringify(invoiceData) !== JSON.stringify(lastAutosaveData.current)) {
      if (isEditMode && invoiceId) {
        // For edit mode, update the existing invoice in-place
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }
        
        updateTimeoutRef.current = setTimeout(async () => {
          try {
            // Import api here to avoid circular dependency
            const { default: api } = await import('../lib/api');
            await api.put(`/invoices/${invoiceId}`, invoiceData);
            console.log('Invoice updated in-place:', invoiceId);
            lastAutosaveData.current = { ...invoiceData };
          } catch (error) {
            console.error('Error updating invoice in-place:', error);
          }
        }, 2000); // 2 second delay
      } else if (!isEditMode && invoiceData && (invoiceData.sender?.name || invoiceData.receiver?.name || invoiceData.details?.items?.length > 0)) {
        // For create mode, save as draft
        autosaveInvoice(invoiceData, isDraft, isEditMode, invoiceId);
        lastAutosaveData.current = { ...invoiceData };
      }
    }
  }, [invoiceData, isEditMode, isDraft, autosaveInvoice, invoiceId]);

  const resetInvoiceData = () => {
    setInvoiceData({
      ...DEFAULT_INVOICE_DATA,
      invoiceNumber: generateInvoiceNumber()
    });
    setCurrentStep(0);
  };

  const addItem = () => {
    const newItem = {
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    
    updateInvoiceData({
      details: {
        ...invoiceData.details,
        items: [...invoiceData.details.items, newItem]
      }
    });
  };

  const removeItem = (index) => {
    const newItems = invoiceData.details.items.filter((_, i) => i !== index);
    updateInvoiceData({
      details: {
        ...invoiceData.details,
        items: newItems
      }
    });
  };

  const moveItem = (fromIndex, toIndex) => {
    const items = [...invoiceData.details.items];
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);
    
    updateInvoiceData({
      details: {
        ...invoiceData.details,
        items
      }
    });
  };

  const duplicateItem = (index) => {
    const itemToDuplicate = invoiceData.details.items[index];
    if (itemToDuplicate) {
      const duplicatedItem = {
        ...itemToDuplicate,
        name: itemToDuplicate.name ? itemToDuplicate.name + ' (Copy)' : '',
        description: itemToDuplicate.description ? itemToDuplicate.description + ' (Copy)' : ''
      };
      
      const newItems = [...invoiceData.details.items];
      newItems.splice(index + 1, 0, duplicatedItem);
      
      updateInvoiceData({
        details: {
          ...invoiceData.details,
          items: newItems
        }
      });
    }
  };

  const updateItem = (index, field, value) => {
    const updatedItems = invoiceData.details.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    });

    updateInvoiceData({
      details: {
        ...invoiceData.details,
        items: updatedItems
      }
    });
  };

  const markAsFinal = () => {
    setIsDraft(false);
    // Trigger one final autosave as non-draft
    autosaveInvoice(invoiceData, false, isEditMode, invoiceId);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const value = {
    invoiceData,
    updateInvoiceData,
    resetInvoiceData,
    currentStep,
    setCurrentStep,
    addItem,
    removeItem,
    moveItem,
    duplicateItem,
    updateItem,
    isDraft,
    setIsDraft,
    markAsFinal
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};
