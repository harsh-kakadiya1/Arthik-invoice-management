import React, { useState } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { FiPlus, FiTrash2, FiPackage, FiMove, FiChevronUp, FiChevronDown } from 'react-icons/fi';

const LineItemsStep = () => {
  const { invoiceData, updateInvoiceData, addItem, removeItem, moveItem, duplicateItem, updateItem } = useInvoice();

  // Calculate subtotal
  const calculateSubtotal = () => {
    if (!invoiceData.details.items) return 0;
    return invoiceData.details.items.reduce((sum, item) => {
      return sum + (Number(item.quantity || 0) * Number(item.unitPrice || 0));
    }, 0);
  };

  // Calculate totals
  const subtotal = calculateSubtotal();
  const discountDetails = invoiceData.details.discountDetails || {};
  const taxDetails = invoiceData.details.taxDetails || {};
  const shippingDetails = invoiceData.details.shippingDetails || {};
  
  const discountAmount = discountDetails.enabled ? 
    (discountDetails.amountType === 'percentage' ? 
      (subtotal * (Number(discountDetails.amount) || 0) / 100) : 
      Number(discountDetails.amount) || 0) : 0;
  
  const afterDiscount = subtotal - discountAmount;
  
  const taxAmount = taxDetails.enabled ? 
    (taxDetails.amountType === 'percentage' ? 
      (afterDiscount * (Number(taxDetails.amount) || 0) / 100) : 
      Number(taxDetails.amount) || 0) : 0;
  
  const shippingAmount = shippingDetails.enabled ? 
    (shippingDetails.costType === 'percentage' ? 
      (afterDiscount * (Number(shippingDetails.cost) || 0) / 100) : 
      Number(shippingDetails.cost) || 0) : 0;
  
  const total = afterDiscount + taxAmount + shippingAmount;

  // Move item up
  const moveItemUp = (index) => {
    if (index > 0) {
      const newItems = [...invoiceData.details.items];
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
      updateInvoiceData({
        details: { ...invoiceData.details, items: newItems }
      });
    }
  };

  // Move item down
  const moveItemDown = (index) => {
    if (index < invoiceData.details.items.length - 1) {
      const newItems = [...invoiceData.details.items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      updateInvoiceData({
        details: { ...invoiceData.details, items: newItems }
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-light-text-primary mb-6">Line Items & Pricing</h3>
        
        <div className="space-y-6">
          {/* Items */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-medium text-light-text-primary flex items-center">
                <FiPackage className="mr-2" />
                Items & Services
              </h4>
              <button
                type="button"
                onClick={addItem}
                className="btn-primary flex items-center space-x-2"
              >
                <FiPlus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {invoiceData.details.items.map((item, index) => (
                <div key={index} className="p-6 border border-dark-border rounded-lg bg-dark-bg-primary">
                  {/* Item Header */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <FiPackage className="text-light-text-secondary" />
                      <span className="text-sm font-medium text-light-text-primary">
                        Item #{index + 1}
                      </span>
                    </div>
                    
                    {/* Move Controls */}
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => moveItemUp(index)}
                        disabled={index === 0}
                        className="p-2 text-light-text-secondary hover:text-brand-teal disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
                        title="Move up"
                      >
                        <FiChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItemDown(index)}
                        disabled={index === invoiceData.details.items.length - 1}
                        className="p-2 text-light-text-secondary hover:text-brand-teal disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
                        title="Move down"
                      >
                        <FiChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateItem(index)}
                        className="p-2 text-blue-500 hover:bg-blue-500 hover:bg-opacity-10 rounded transition-colors ml-2"
                        title="Copy item"
                      >
                        Copy
                      </button>
                      {invoiceData.details.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-state-danger hover:bg-state-danger hover:bg-opacity-10 rounded transition-colors"
                          title="Delete item"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* First Row: Item Name and Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="form-label">Item Name *</label>
                      <input
                        type="text"
                        className="form-input w-full"
                        placeholder="Product or service name"
                        value={invoiceData.details.items[index]?.name || ''}
                        onChange={(e) => {
                          const newItems = [...invoiceData.details.items];
                          newItems[index] = { ...newItems[index], name: e.target.value };
                          updateInvoiceData({
                            details: { ...invoiceData.details, items: newItems }
                          });
                        }}
                      />
                    </div>

                    <div>
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        className="form-input w-full"
                        placeholder="Brief description"
                        value={invoiceData.details.items[index]?.description || ''}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Second Row: Qty, Rate, and Total */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="form-label">Qty *</label>
                      <input
                        type="number"
                        min="1"
                        className="form-input w-full"
                        placeholder="1"
                        value={invoiceData.details.items[index]?.quantity || ''}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <label className="form-label">Rate *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-input w-full"
                        placeholder="0.00"
                        value={invoiceData.details.items[index]?.unitPrice || ''}
                        onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <label className="form-label">Total</label>
                      <div className="form-input bg-dark-bg-secondary text-light-text-primary font-medium">
                        ₹{((Number(invoiceData.details.items[index]?.quantity) || 0) * 
                          (Number(invoiceData.details.items[index]?.unitPrice) || 0)).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-end">
                      <div className="text-sm text-light-text-secondary">
                        Item {index + 1} of {invoiceData.details.items.length}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>


          </div>

          {/* Additional Charges - Enhanced like Invoify */}
          <div className="card">
            <h4 className="text-lg font-medium text-light-text-primary mb-6">Additional Charges</h4>
            
            {/* Toggle Switches for enabling charges */}
            <div className="flex justify-between items-center mb-6 p-4 bg-dark-bg-primary rounded-lg">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-light-text-primary">Discount</label>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={invoiceData.details.discountDetails?.enabled || false}
                  onChange={(e) => {
                    updateInvoiceData({
                      details: {
                        ...invoiceData.details,
                        discountDetails: {
                          ...invoiceData.details.discountDetails,
                          enabled: e.target.checked
                        }
                      }
                    });
                  }}
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-light-text-primary">Tax</label>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={invoiceData.details.taxDetails?.enabled || false}
                  onChange={(e) => {
                    updateInvoiceData({
                      details: {
                        ...invoiceData.details,
                        taxDetails: {
                          ...invoiceData.details.taxDetails,
                          enabled: e.target.checked
                        }
                      }
                    });
                  }}
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-light-text-primary">Shipping</label>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={invoiceData.details.shippingDetails?.enabled || false}
                  onChange={(e) => {
                    updateInvoiceData({
                      details: {
                        ...invoiceData.details,
                        shippingDetails: {
                          ...invoiceData.details.shippingDetails,
                          enabled: e.target.checked
                        }
                      }
                    });
                  }}
                />
              </div>
            </div>

            {/* Charge Input Fields */}
            <div className="space-y-4">
              {/* Discount Input */}
              {invoiceData.details.discountDetails?.enabled && (
                <div className="flex justify-between items-center p-3 border border-dark-border rounded-lg">
                  <span className="text-light-text-primary font-medium">Discount</span>
                  <div className="flex items-center space-x-3">
                    <select
                      className="form-input w-20 text-center"
                      value={invoiceData.details.discountDetails?.amountType || 'amount'}
                      onChange={(e) => {
                        updateInvoiceData({
                          details: {
                            ...invoiceData.details,
                            discountDetails: {
                              ...invoiceData.details.discountDetails,
                              amountType: e.target.value
                            }
                          }
                        });
                      }}
                    >
                      <option value="amount">INR</option>
                      <option value="percentage">%</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-input w-24 text-right"
                      placeholder="0.00"
                      value={invoiceData.details.discountDetails?.amount || ''}
                      onChange={(e) => {
                        updateInvoiceData({
                          details: {
                            ...invoiceData.details,
                            discountDetails: {
                              ...invoiceData.details.discountDetails,
                              amount: Number(e.target.value) || 0
                            }
                          }
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Tax Input */}
              {invoiceData.details.taxDetails?.enabled && (
                <div className="flex justify-between items-center p-3 border border-dark-border rounded-lg">
                  <span className="text-light-text-primary font-medium">Tax</span>
                  <div className="flex items-center space-x-3">
                    <select
                      className="form-input w-20 text-center"
                      value={invoiceData.details.taxDetails?.amountType || 'percentage'}
                      onChange={(e) => {
                        updateInvoiceData({
                          details: {
                            ...invoiceData.details,
                            taxDetails: {
                              ...invoiceData.details.taxDetails,
                              amountType: e.target.value
                            }
                          }
                        });
                      }}
                    >
                      <option value="amount">INR</option>
                      <option value="percentage">%</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-input w-24 text-right"
                      placeholder="0.00"
                      value={invoiceData.details.taxDetails?.amount || ''}
                      onChange={(e) => {
                        updateInvoiceData({
                          details: {
                            ...invoiceData.details,
                            taxDetails: {
                              ...invoiceData.details.taxDetails,
                              amount: Number(e.target.value) || 0
                            }
                          }
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Shipping Input */}
              {invoiceData.details.shippingDetails?.enabled && (
                <div className="flex justify-between items-center p-3 border border-dark-border rounded-lg">
                  <span className="text-light-text-primary font-medium">Shipping</span>
                  <div className="flex items-center space-x-3">
                    <select
                      className="form-input w-20 text-center"
                      value={invoiceData.details.shippingDetails?.costType || 'amount'}
                      onChange={(e) => {
                        updateInvoiceData({
                          details: {
                            ...invoiceData.details,
                            shippingDetails: {
                              ...invoiceData.details.shippingDetails,
                              costType: e.target.value
                            }
                          }
                        });
                      }}
                    >
                      <option value="amount">INR</option>
                      <option value="percentage">%</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-input w-24 text-right"
                      placeholder="0.00"
                      value={invoiceData.details.shippingDetails?.cost || ''}
                      onChange={(e) => {
                        updateInvoiceData({
                          details: {
                            ...invoiceData.details,
                            shippingDetails: {
                              ...invoiceData.details.shippingDetails,
                              cost: Number(e.target.value) || 0
                            }
                          }
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Total Summary */}
          <div className="bg-black-50 border-2 border-gray-200 rounded-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold">Subtotal:</span>
              <span className="text-lg font-bold">₹{subtotal.toFixed(2)}</span>
            </div>

            {discountDetails.enabled && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-medium">
                  Discount {discountDetails.isPercentage ? `(${discountDetails.value}%)` : '(Fixed)'}:
                </span>
                <span className="text-lg font-bold text-green-600">-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-medium">After Discount:</span>
              <span className="text-lg font-bold">₹{afterDiscount.toFixed(2)}</span>
            </div>

            {taxDetails.enabled && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-medium">
                  Tax {taxDetails.isPercentage ? `(${taxDetails.value}%)` : '(Fixed)'}:
                </span>
                <span className="text-lg font-bold text-red-600">₹{taxAmount.toFixed(2)}</span>
              </div>
            )}

            {shippingDetails.enabled && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-medium">
                  Shipping {shippingDetails.isPercentage ? `(${shippingDetails.value}%)` : '(Fixed)'}:
                </span>
                <span className="text-lg font-bold text-blue-600">₹{shippingAmount.toFixed(2)}</span>
              </div>
            )}

            <hr className="my-4 border-gray-300" />
            
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total Amount:</span>
              <span className="text-xl font-bold text-blue-600">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineItemsStep;
