import React from 'react';
import { useForm } from 'react-hook-form';
import { useInvoice } from '../../context/InvoiceContext';
import { CURRENCY_OPTIONS, INVOICE_TEMPLATES } from '../../lib/variables';
import { FiCalendar, FiHash, FiDollarSign } from 'react-icons/fi';

const InvoiceDetailsStep = () => {
  const { invoiceData, updateInvoiceData } = useInvoice();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      invoiceNumber: invoiceData.invoiceNumber,
      details: {
        invoiceDate: new Date(invoiceData.details.invoiceDate).toISOString().split('T')[0],
        dueDate: new Date(invoiceData.details.dueDate).toISOString().split('T')[0],
        currency: invoiceData.details.currency
      },
      template: invoiceData.template
    }
  });

  const onSubmit = (data) => {
    updateInvoiceData({
      invoiceNumber: data.invoiceNumber,
      details: {
        ...invoiceData.details,
        invoiceDate: new Date(data.details.invoiceDate),
        dueDate: new Date(data.details.dueDate),
        currency: data.details.currency
      },
      template: data.template
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-light-text-primary mb-6">Invoice Details</h3>
        
        <div className="space-y-6">
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Invoice Number *</label>
                <div className="relative">
                  <FiHash className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                  <input
                    {...register('invoiceNumber', { required: 'Invoice number is required' })}
                    type="text"
                    className="form-input w-full pl-10"
                    placeholder="INV-2023-001"
                    onChange={(e) => {
                      updateInvoiceData({ invoiceNumber: e.target.value });
                    }}
                  />
                </div>
                {errors.invoiceNumber && (
                  <p className="mt-1 text-sm text-state-danger">{errors.invoiceNumber.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Currency *</label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                  <select
                    {...register('details.currency', { required: 'Currency is required' })}
                    className="form-input w-full pl-10"
                    onChange={(e) => {
                      updateInvoiceData({
                        details: { ...invoiceData.details, currency: e.target.value }
                      });
                    }}
                  >
                    {CURRENCY_OPTIONS.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.details?.currency && (
                  <p className="mt-1 text-sm text-state-danger">{errors.details.currency.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Invoice Date *</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                  <input
                    {...register('details.invoiceDate', { required: 'Invoice date is required' })}
                    type="date"
                    className="form-input w-full pl-10"
                    onChange={(e) => {
                      updateInvoiceData({
                        details: { ...invoiceData.details, invoiceDate: new Date(e.target.value) }
                      });
                    }}
                  />
                </div>
                {errors.details?.invoiceDate && (
                  <p className="mt-1 text-sm text-state-danger">{errors.details.invoiceDate.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Due Date *</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                  <input
                    {...register('details.dueDate', { required: 'Due date is required' })}
                    type="date"
                    className="form-input w-full pl-10"
                    onChange={(e) => {
                      updateInvoiceData({
                        details: { ...invoiceData.details, dueDate: new Date(e.target.value) }
                      });
                    }}
                  />
                </div>
                {errors.details?.dueDate && (
                  <p className="mt-1 text-sm text-state-danger">{errors.details.dueDate.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Company Logo Upload with Drag & Drop */}
          <div className="card">
            <h4 className="text-lg font-medium text-light-text-primary mb-4">Company Logo</h4>
            <div className="space-y-4">
              {invoiceData.details.invoiceLogo ? (
                <div className="flex items-center justify-between p-4 border border-dark-border rounded-lg bg-dark-bg-secondary">
                  <div className="flex items-center space-x-4">
                    <img
                      src={invoiceData.details.invoiceLogo}
                      alt="Company Logo"
                      className="h-16 w-16 object-contain border border-dark-border rounded-lg"
                    />
                    <div>
                      <p className="text-light-text-primary font-medium">Logo uploaded successfully</p>
                      <p className="text-sm text-light-text-secondary">Click to change or remove</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <label
                      htmlFor="logo-upload"
                      className="btn-secondary cursor-pointer"
                    >
                      Change
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        updateInvoiceData({
                          details: {
                            ...invoiceData.details,
                            invoiceLogo: ''
                          }
                        });
                      }}
                      className="btn-danger"
                      title="Remove logo"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-dark-border rounded-lg p-12 text-center hover:border-brand-teal transition-all duration-300 cursor-pointer group"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.add('border-brand-teal', 'bg-brand-teal', 'bg-opacity-5');
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.remove('border-brand-teal', 'bg-brand-teal', 'bg-opacity-5');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.remove('border-brand-teal', 'bg-brand-teal', 'bg-opacity-5');
                    
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      const file = files[0];
                      if (file.type.startsWith('image/')) {
                        if (file.size <= 10 * 1024 * 1024) { // 10MB limit
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            updateInvoiceData({
                              details: {
                                ...invoiceData.details,
                                invoiceLogo: event.target.result
                              }
                            });
                          };
                          reader.readAsDataURL(file);
                        } else {
                          alert('File size must be less than 10MB');
                        }
                      } else {
                        alert('Please upload an image file (PNG, JPG, or SVG)');
                      }
                    }
                  }}
                  onClick={() => document.getElementById('logo-upload').click()}
                >
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-dark-bg-secondary rounded-full flex items-center justify-center group-hover:bg-brand-teal group-hover:bg-opacity-10 transition-colors">
                      <svg className="w-8 h-8 text-light-text-secondary group-hover:text-brand-teal transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-light-text-primary mb-2">Upload Logo Here</p>
                      <p className="text-sm text-light-text-secondary mb-1">Click to upload image</p>
                      <p className="text-xs text-light-text-secondary">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="logo-upload"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.size <= 10 * 1024 * 1024) { // 10MB limit
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        updateInvoiceData({
                          details: {
                            ...invoiceData.details,
                            invoiceLogo: event.target.result
                          }
                        });
                      };
                      reader.readAsDataURL(file);
                    } else {
                      alert('File size must be less than 10MB');
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Template Selection */}
          <div className="card">
            <h4 className="text-lg font-medium text-light-text-primary mb-4">Choose Template</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INVOICE_TEMPLATES.map((template) => (
                <label key={template.id} className="cursor-pointer">
                  <input
                    {...register('template')}
                    type="radio"
                    value={template.id}
                    className="sr-only"
                    onChange={(e) => {
                      updateInvoiceData({ template: e.target.value });
                    }}
                  />
                  <div className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                    invoiceData.template === template.id
                      ? 'border-brand-teal bg-brand-teal bg-opacity-10'
                      : 'border-dark-border hover:border-brand-teal'
                  }`}>
                    <h5 className="font-medium text-light-text-primary">{template.name}</h5>
                    <p className="text-sm text-light-text-secondary mt-1">{template.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsStep;
