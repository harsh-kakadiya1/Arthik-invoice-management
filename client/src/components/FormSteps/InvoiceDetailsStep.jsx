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

          {/* Company Logo Upload */}
          <div className="card">
            <h4 className="text-lg font-medium text-light-text-primary mb-4">Company Logo</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {invoiceData.details.invoiceLogo && (
                  <div className="flex-shrink-0">
                    <img
                      src={invoiceData.details.invoiceLogo}
                      alt="Company Logo"
                      className="h-16 w-16 object-contain border border-dark-border rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="logo-upload"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
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
                      }
                    }}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="btn-secondary cursor-pointer inline-flex items-center"
                  >
                    Upload Logo
                  </label>
                  <p className="text-sm text-light-text-secondary mt-1">
                    Upload your company logo (PNG, JPG, or SVG)
                  </p>
                </div>
                {invoiceData.details.invoiceLogo && (
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
                    className="text-state-danger hover:text-red-600 transition-colors p-2"
                    title="Remove logo"
                  >
                    Remove
                  </button>
                )}
              </div>
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
