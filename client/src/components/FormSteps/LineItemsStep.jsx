import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { FiPlus, FiTrash2, FiPackage } from 'react-icons/fi';

const LineItemsStep = () => {
  const { invoiceData, updateInvoiceData, addItem, removeItem } = useInvoice();

  // Calculate subtotal
  const calculateSubtotal = () => {
    if (!invoiceData.details.items) return 0;
    return invoiceData.details.items.reduce((sum, item) => {
      return sum + (Number(item.quantity || 0) * Number(item.unitPrice || 0));
    }, 0);
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
                <div key={index} className="p-4 border border-dark-border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-4">
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

                    <div className="md:col-span-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-input w-full resize-none"
                        rows="2"
                        placeholder="Brief description"
                        value={invoiceData.details.items[index]?.description || ''}
                        onChange={(e) => {
                          const newItems = [...invoiceData.details.items];
                          newItems[index] = { ...newItems[index], description: e.target.value };
                          updateInvoiceData({
                            details: { ...invoiceData.details, items: newItems }
                          });
                        }}
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="form-label">Qty *</label>
                      <input
                        type="number"
                        min="1"
                        className="form-input w-full"
                        placeholder="1"
                        value={invoiceData.details.items[index]?.quantity || ''}
                        onChange={(e) => {
                          const newItems = [...invoiceData.details.items];
                          newItems[index] = { ...newItems[index], quantity: Number(e.target.value) || 0 };
                          updateInvoiceData({
                            details: { ...invoiceData.details, items: newItems }
                          });
                        }}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="form-label">Rate *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-input w-full"
                        placeholder="0.00"
                        value={invoiceData.details.items[index]?.unitPrice || ''}
                        onChange={(e) => {
                          const newItems = [...invoiceData.details.items];
                          newItems[index] = { ...newItems[index], unitPrice: Number(e.target.value) || 0 };
                          updateInvoiceData({
                            details: { ...invoiceData.details, items: newItems }
                          });
                        }}
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="form-label">Total</label>
                      <div className="form-input bg-dark-bg-primary text-light-text-secondary">
                        {((Number(invoiceData.details.items[index]?.quantity) || 0) * 
                          (Number(invoiceData.details.items[index]?.unitPrice) || 0)).toFixed(2)}
                      </div>
                    </div>

                    <div className="md:col-span-1 flex items-end">
                      {invoiceData.details.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-state-danger hover:bg-state-danger hover:bg-opacity-10 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal Display */}
            <div className="mt-6 p-4 bg-dark-bg-primary rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-light-text-primary font-medium">Subtotal:</span>
                <span className="text-light-text-primary font-semibold">
                  {calculateSubtotal().toFixed(2)} {invoiceData.details.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Charges */}
          <div className="card">
            <h4 className="text-lg font-medium text-light-text-primary mb-6">Additional Charges</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Discount */}
              <div>
                <label className="form-label">Discount</label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-input flex-1"
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
                    <select
                      className="form-input w-24"
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
                      <option value="amount">Fixed</option>
                      <option value="percentage">%</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tax */}
              <div>
                <label className="form-label">Tax</label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-input flex-1"
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
                    <select
                      className="form-input w-24"
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
                      <option value="percentage">%</option>
                      <option value="amount">Fixed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div>
                <label className="form-label">Shipping</label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-input flex-1"
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
                    <select
                      className="form-input w-24"
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
                      <option value="amount">Fixed</option>
                      <option value="percentage">%</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineItemsStep;
