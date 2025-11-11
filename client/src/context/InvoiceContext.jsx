import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DEFAULT_INVOICE_DATA } from '../lib/variables';
import { generateInvoiceNumber, numberToWords } from '../lib/helpers';
import { useAuth } from './AuthContext';

const InvoiceContext = createContext();

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider = ({ children, initialData, isEditMode = false, invoiceId = null }) => {
  const { user } = useAuth();
  const isInitialMount = useRef(true);
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
    // For create mode, use default data with profile logo if available
    return {
      ...DEFAULT_INVOICE_DATA,
      invoiceNumber: generateInvoiceNumber(),
      details: {
        ...DEFAULT_INVOICE_DATA.details,
        invoiceLogo: user?.profile?.logo || ''
      }
    };
  });
  const [currentStep, setCurrentStep] = useState(0);

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
        
        // Apply GST (only for exclusive)
        const gst = newData.details.gstDetails;
        if (gst && gst.rate > 0 && !gst.inclusive) {
          totalAmount += (totalAmount * gst.rate) / 100;
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
    updateItem
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};
