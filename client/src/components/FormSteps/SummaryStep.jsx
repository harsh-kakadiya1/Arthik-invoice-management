import React, { useState } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { useAuth } from '../../context/AuthContext';
import { FiSave, FiDownload, FiEye, FiCheck } from 'react-icons/fi';
import api from '../../lib/api';
import { formatNumberWithCommas } from '../../lib/helpers';
import InvoicePreviewModal from '../InvoicePreviewModal';
import { generatePDF } from '../../lib/pdfGenerator';

const SummaryStep = ({ isEditMode = false, invoiceId = null }) => {
  const { invoiceData, resetInvoiceData } = useInvoice();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Validate invoice data
  const validateInvoice = () => {
    const errors = [];
    
    // Check if there are items and at least one has a name
    if (!invoiceData.details.items || invoiceData.details.items.length === 0) {
      errors.push('Please add at least one item');
    } else {
      const validItems = invoiceData.details.items.filter(item => 
        item.name && item.name.trim() !== '' && item.quantity > 0 && item.unitPrice >= 0
      );
      if (validItems.length === 0) {
        errors.push('Please add item name, quantity, and rate for at least one item');
      }
    }
    
    return errors;
  };

  const validationErrors = validateInvoice();

  const handleSaveInvoice = async () => {
    setSaving(true);
    setError('');
    
    try {
      let response;
      if (isEditMode && invoiceId) {
        // Update existing invoice
        response = await api.put(`/invoices/${invoiceId}`, invoiceData);
      } else {
        // Create new invoice
        response = await api.post('/invoices', invoiceData);
      }
      
      setSaved(true);
      setTimeout(() => {
        if (!isEditMode) {
          resetInvoiceData();
        }
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'save'} invoice`);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(invoiceData);
    } catch (error) {
      setError('Failed to generate PDF. Please try again.');
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-light-text-primary mb-6">
          Review & {isEditMode ? 'Update' : 'Save'} Invoice
        </h3>
        
        {/* Success Message */}
        {saved && (
          <div className="bg-state-success bg-opacity-10 border border-state-success text-state-success px-4 py-3 rounded-lg mb-6 flex items-center">
            <FiCheck className="mr-2" />
            Invoice {isEditMode ? 'updated' : 'saved'} successfully! Redirecting to dashboard...
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-state-danger bg-opacity-10 border border-state-danger text-state-danger px-4 py-3 rounded-lg mb-6">
            <ul className="list-disc list-inside">
              {validationErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-state-danger bg-opacity-10 border border-state-danger text-state-danger px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Invoice Summary */}
        <div className="card">
          <h4 className="text-lg font-medium text-light-text-primary mb-6">Invoice Summary</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-light-text-primary mb-2">Basic Information</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-light-text-secondary">Invoice Number:</span>
                    <span className="text-light-text-primary">{invoiceData.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-text-secondary">Invoice Date:</span>
                    <span className="text-light-text-primary">
                      {new Date(invoiceData.details.invoiceDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-text-secondary">Due Date:</span>
                    <span className="text-light-text-primary">
                      {new Date(invoiceData.details.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-text-secondary">Currency:</span>
                    <span className="text-light-text-primary">{invoiceData.details.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-text-secondary">Template:</span>
                    <span className="text-light-text-primary capitalize">{invoiceData.template}</span>
                  </div>
                </div>
              </div>

              {/* From/To Information */}
              <div>
                <h5 className="font-medium text-light-text-primary mb-2">From</h5>
                <div className="text-sm text-light-text-secondary">
                  <p className="font-medium text-light-text-primary">{invoiceData.sender.name}</p>
                  <p>{invoiceData.sender.email}</p>
                  {invoiceData.sender.phone && <p>{invoiceData.sender.phone}</p>}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-light-text-primary mb-2">To</h5>
                <div className="text-sm text-light-text-secondary">
                  <p className="font-medium text-light-text-primary">{invoiceData.receiver.name}</p>
                  {invoiceData.receiver.email && <p>{invoiceData.receiver.email}</p>}
                  {invoiceData.receiver.phone && <p>{invoiceData.receiver.phone}</p>}
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-light-text-primary mb-2">Financial Summary</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-light-text-secondary">Items:</span>
                    <span className="text-light-text-primary">{invoiceData.details.items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-text-secondary">Subtotal:</span>
                    <span className="text-light-text-primary">
                      {formatNumberWithCommas(invoiceData.details.subTotal)} {invoiceData.details.currency}
                    </span>
                  </div>
                  {invoiceData.details.discountDetails?.amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-light-text-secondary">Discount:</span>
                      <span className="text-light-text-primary">
                        {invoiceData.details.discountDetails.amountType === 'amount' 
                          ? `${invoiceData.details.discountDetails.amount} ${invoiceData.details.currency}`
                          : `${invoiceData.details.discountDetails.amount}%`
                        }
                      </span>
                    </div>
                  )}
                  {invoiceData.details.taxDetails?.amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-light-text-secondary">Tax:</span>
                      <span className="text-light-text-primary">
                        {invoiceData.details.taxDetails.amountType === 'amount' 
                          ? `${invoiceData.details.taxDetails.amount} ${invoiceData.details.currency}`
                          : `${invoiceData.details.taxDetails.amount}%`
                        }
                      </span>
                    </div>
                  )}
                  {invoiceData.details.shippingDetails?.cost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-light-text-secondary">Shipping:</span>
                      <span className="text-light-text-primary">
                        {invoiceData.details.shippingDetails.costType === 'amount' 
                          ? `${invoiceData.details.shippingDetails.cost} ${invoiceData.details.currency}`
                          : `${invoiceData.details.shippingDetails.cost}%`
                        }
                      </span>
                    </div>
                  )}
                  <div className="border-t border-dark-border pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-light-text-primary">Total:</span>
                      <span className="text-brand-teal text-lg">
                        {formatNumberWithCommas(invoiceData.details.totalAmount)} {invoiceData.details.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="mt-6">
            <h5 className="font-medium text-light-text-primary mb-3">Items</h5>
            <div className="space-y-2">
              {invoiceData.details.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-dark-bg-primary rounded-lg">
                  <div>
                    <p className="font-medium text-light-text-primary">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-light-text-secondary">{item.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-light-text-primary">
                      {item.quantity} × {item.unitPrice} = {item.total} {invoiceData.details.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSaveInvoice}
              disabled={saving || saved || validationErrors.length > 0}
              className={`${validationErrors.length > 0 ? 'btn-disabled' : 'btn-primary'} flex items-center justify-center space-x-2 flex-1 min-h-[48px]`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : saved ? (
                <>
                  <FiCheck className="h-4 w-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <FiSave className="h-4 w-4" />
                  <span>{isEditMode ? 'Update Invoice' : 'Save Invoice'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={validationErrors.length > 0}
              className={`${validationErrors.length > 0 ? 'btn-disabled' : 'btn-secondary'} flex items-center justify-center space-x-2 flex-1 min-h-[48px]`}
            >
              <FiDownload className="h-4 w-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handlePreview}
              disabled={validationErrors.length > 0}
              className={`${validationErrors.length > 0 ? 'btn-disabled' : 'btn-outline'} flex items-center justify-center space-x-2 flex-1 min-h-[48px]`}
            >
              <FiEye className="h-4 w-4" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      <InvoicePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onDownloadPDF={handleDownloadPDF}
      />
    </div>
  );
};

export default SummaryStep;
