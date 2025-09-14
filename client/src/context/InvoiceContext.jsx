import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_INVOICE_DATA } from '../lib/variables';
import { generateInvoiceNumber, numberToWords } from '../lib/helpers';

const InvoiceContext = createContext();

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider = ({ children }) => {
  const [invoiceData, setInvoiceData] = useState({
    ...DEFAULT_INVOICE_DATA,
    invoiceNumber: generateInvoiceNumber()
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

  const value = {
    invoiceData,
    updateInvoiceData,
    resetInvoiceData,
    currentStep,
    setCurrentStep,
    addItem,
    removeItem
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};
