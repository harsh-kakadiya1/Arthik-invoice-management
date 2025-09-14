import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useInvoice } from '../../context/InvoiceContext';
import { FiPlus, FiTrash2, FiPackage } from 'react-icons/fi';

const LineItemsStep = () => {
  const { invoiceData, updateInvoiceData, addItem, removeItem } = useInvoice();
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      details: {
        items: invoiceData.details.items,
        discountDetails: invoiceData.details.discountDetails,
        taxDetails: invoiceData.details.taxDetails,
        shippingDetails: invoiceData.details.shippingDetails
      }
    }
  });

  // Update form values when invoice data changes
  React.useEffect(() => {
    setValue('details.items', invoiceData.details.items);
    setValue('details.discountDetails', invoiceData.details.discountDetails);
    setValue('details.taxDetails', invoiceData.details.taxDetails);
    setValue('details.shippingDetails', invoiceData.details.shippingDetails);
  }, [invoiceData, setValue]);

  const { fields } = useFieldArray({
    control,
    name: "details.items"
  });

  const watchedItems = watch("details.items");
  const watchedDiscount = watch("details.discountDetails");
  const watchedTax = watch("details.taxDetails");
  const watchedShipping = watch("details.shippingDetails");

  const onSubmit = (data) => {
    // Calculate totals for each item
    const itemsWithTotals = data.details.items.map(item => ({
      ...item,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      total: Number(item.quantity) * Number(item.unitPrice)
    }));

    updateInvoiceData({
      details: {
        ...invoiceData.details,
        items: itemsWithTotals,
        discountDetails: {
          amount: Number(data.details.discountDetails.amount) || 0,
          amountType: data.details.discountDetails.amountType
        },
        taxDetails: {
          amount: Number(data.details.taxDetails.amount) || 0,
          amountType: data.details.taxDetails.amountType
        },
        shippingDetails: {
          cost: Number(data.details.shippingDetails.cost) || 0,
          costType: data.details.shippingDetails.costType
        }
      }
    });
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    if (!watchedItems) return 0;
    return watchedItems.reduce((sum, item) => {
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
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border border-dark-border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-4">
                      <label className="form-label">Item Name *</label>
                      <input
                        {...register(`details.items.${index}.name`, { 
                          required: 'Item name is required' 
                        })}
                        type="text"
                        className="form-input w-full"
                        placeholder="Product or service name"
                        onChange={(e) => {
                          const newItems = [...invoiceData.details.items];
                          newItems[index] = { ...newItems[index], name: e.target.value };
                          updateInvoiceData({
                            details: { ...invoiceData.details, items: newItems }
                          });
                        }}
                      />
                      {errors.details?.items?.[index]?.name && (
                        <p className="mt-1 text-sm text-state-danger">
                          {errors.details.items[index].name.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-3">
                      <label className="form-label">Description</label>
                      <textarea
                        {...register(`details.items.${index}.description`)}
                        className="form-input w-full resize-none"
                        rows="2"
                        placeholder="Brief description"
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
                        {...register(`details.items.${index}.quantity`, { 
                          required: 'Quantity is required',
                          min: { value: 1, message: 'Minimum quantity is 1' }
                        })}
                        type="number"
                        min="1"
                        className="form-input w-full"
                        placeholder="1"
                        onChange={(e) => {
                          const newItems = [...invoiceData.details.items];
                          newItems[index] = { ...newItems[index], quantity: Number(e.target.value) };
                          updateInvoiceData({
                            details: { ...invoiceData.details, items: newItems }
                          });
                        }}
                      />
                      {errors.details?.items?.[index]?.quantity && (
                        <p className="mt-1 text-sm text-state-danger">
                          {errors.details.items[index].quantity.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="form-label">Rate *</label>
                      <input
                        {...register(`details.items.${index}.unitPrice`, { 
                          required: 'Rate is required',
                          min: { value: 0, message: 'Rate must be positive' }
                        })}
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-input w-full"
                        placeholder="0.00"
                        onChange={(e) => {
                          const newItems = [...invoiceData.details.items];
                          newItems[index] = { ...newItems[index], unitPrice: Number(e.target.value) };
                          updateInvoiceData({
                            details: { ...invoiceData.details, items: newItems }
                          });
                        }}
                      />
                      {errors.details?.items?.[index]?.unitPrice && (
                        <p className="mt-1 text-sm text-state-danger">
                          {errors.details.items[index].unitPrice.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-1">
                      <label className="form-label">Total</label>
                      <div className="form-input bg-dark-bg-primary text-light-text-secondary">
                        {((Number(watchedItems?.[index]?.quantity) || 0) * 
                          (Number(watchedItems?.[index]?.unitPrice) || 0)).toFixed(2)}
                      </div>
                    </div>

                    <div className="md:col-span-1 flex items-end">
                      {fields.length > 1 && (
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
                      {...register('details.discountDetails.amount')}
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-input flex-1"
                      placeholder="0.00"
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
                      {...register('details.discountDetails.amountType')}
                      className="form-input w-24"
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
                      {...register('details.taxDetails.amount')}
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-input flex-1"
                      placeholder="0.00"
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
                      {...register('details.taxDetails.amountType')}
                      className="form-input w-24"
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
                      {...register('details.shippingDetails.cost')}
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-input flex-1"
                      placeholder="0.00"
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
                      {...register('details.shippingDetails.costType')}
                      className="form-input w-24"
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
