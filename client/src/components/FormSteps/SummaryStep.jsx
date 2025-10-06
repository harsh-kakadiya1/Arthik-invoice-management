import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '../../context/InvoiceContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { FiSave, FiDownload, FiEye, FiCheck } from 'react-icons/fi';
import api from '../../lib/api';
import { formatNumberWithCommas } from '../../lib/helpers';
import InvoicePreviewModal from '../InvoicePreviewModal';
import { generatePDF } from '../../lib/pdfGenerator';

const SummaryStep = ({ isEditMode = false, invoiceId = null }) => {
  const navigate = useNavigate();
  const { invoiceData, resetInvoiceData } = useInvoice();
  const { user } = useAuth();
  const { hideWarning, forceHideModal } = useNavigation();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedAsDraft, setSavedAsDraft] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Validate invoice data for complete invoices
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

  // No validation for drafts - save as-is
  const validateDraft = () => {
    return []; // No validation errors for drafts
  };

  const validationErrors = validateInvoice();
  const draftValidationErrors = validateDraft();
  
  // Don't show validation errors if we're saving as draft
  const shouldShowValidationErrors = validationErrors.length > 0 && !savedAsDraft;

  const handleSaveInvoice = async (saveAsDraft = false) => {
    setSaving(true);
    setError('');
    
    try {
      // Prepare invoice data with status
      const invoiceDataToSave = {
        ...invoiceData,
        status: saveAsDraft ? 'draft' : 'sent' // Set appropriate status
      };

      console.log('Saving invoice:', saveAsDraft ? 'as draft' : 'as complete', invoiceDataToSave);

      let response;
      if (isEditMode && invoiceId) {
        // Update existing invoice
        response = await api.put(`/invoices/${invoiceId}`, invoiceDataToSave);
      } else {
        // Create new invoice
        response = await api.post('/invoices', invoiceDataToSave);
      }
      
      console.log('Invoice saved successfully:', response.data);
      
      setSaved(true);
      setSavedAsDraft(saveAsDraft);
      hideWarning(); // Hide the unsaved changes warning
      forceHideModal(); // Force hide any modal that might be showing
      setTimeout(() => {
        if (!isEditMode) {
          resetInvoiceData();
        }
        navigate('/', { replace: true }); // Use React Router navigation
      }, 2000);
    } catch (error) {
      console.error('Error saving invoice:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'save'} invoice`);
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
            Invoice {savedAsDraft ? 'saved as draft' : (isEditMode ? 'updated' : 'saved')} successfully! Redirecting to dashboard...
          </div>
        )}

        {/* Validation Errors for Complete Invoice - Only show when not saving as draft */}
        {shouldShowValidationErrors && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            <h4 className="font-medium mb-2 text-red-700 dark:text-red-300">To save as a complete invoice, please fix these issues:</h4>
            <ul className="list-disc list-inside text-red-600 dark:text-red-400">
              {validationErrors.map((err, index) => (
                <li key={index} className="text-red-600 dark:text-red-400">{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Draft Info Message */}
        <div className="bg-blue-500 bg-opacity-10 border border-blue-500 text-blue-600 dark:text-blue-400 px-4 py-3 rounded-lg mb-6">
          <h4 className="font-medium mb-2">💡 Save as Draft</h4>
          <p className="text-sm">You can save your invoice as a draft at any time, even with incomplete information. No validation required!</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Invoice Summary */}
        <div className="card">
          <h4 className="text-lg font-medium text-white dark:text-gray-100 mb-6">Invoice Summary</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-white dark:text-gray-100 mb-2">Basic Information</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-gray-300">Invoice Number:</span>
                    <span className="text-white dark:text-gray-100">{invoiceData.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-gray-300">Invoice Date:</span>
                    <span className="text-white dark:text-gray-100">
                      {new Date(invoiceData.details.invoiceDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-gray-300">Due Date:</span>
                    <span className="text-white dark:text-gray-100">
                      {new Date(invoiceData.details.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-gray-300">Currency:</span>
                    <span className="text-white dark:text-gray-100">{invoiceData.details.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-gray-300">Template:</span>
                    <span className="text-white dark:text-gray-100 capitalize">{invoiceData.template}</span>
                  </div>
                </div>
              </div>

              {/* From/To Information */}
              <div>
                <h5 className="font-medium text-white dark:text-gray-100 mb-2">From</h5>
                <div className="text-sm text-gray-400 dark:text-gray-300">
                  <p className="font-medium text-white dark:text-gray-100">{invoiceData.sender.name}</p>
                  <p>{invoiceData.sender.email}</p>
                  {invoiceData.sender.phone && <p>{invoiceData.sender.phone}</p>}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-white dark:text-gray-100 mb-2">To</h5>
                <div className="text-sm text-gray-400 dark:text-gray-300">
                  <p className="font-medium text-white dark:text-gray-100">{invoiceData.receiver.name}</p>
                  {invoiceData.receiver.email && <p>{invoiceData.receiver.email}</p>}
                  {invoiceData.receiver.phone && <p>{invoiceData.receiver.phone}</p>}
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-white dark:text-gray-100 mb-2">Financial Summary</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-gray-300">Items:</span>
                    <span className="text-white dark:text-gray-100">{invoiceData.details.items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-gray-300">Subtotal:</span>
                    <span className="text-white dark:text-gray-100">
                      {formatNumberWithCommas(invoiceData.details.subTotal)} {invoiceData.details.currency}
                    </span>
                  </div>
                  {invoiceData.details.discountDetails?.amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 dark:text-gray-300">Discount:</span>
                      <span className="text-white dark:text-gray-100">
                        {invoiceData.details.discountDetails.amountType === 'amount' 
                          ? `${invoiceData.details.discountDetails.amount} ${invoiceData.details.currency}`
                          : `${invoiceData.details.discountDetails.amount}%`
                        }
                      </span>
                    </div>
                  )}
                  {invoiceData.details.gstDetails?.rate > 0 && (
                    <div className="flex justify-between">
                      <span className="text-light-text-secondary">GST:</span>
                      <span className="text-light-text-primary">
                        {invoiceData.details.gstDetails.rate}% ({invoiceData.details.gstDetails.inclusive ? 'Inclusive' : 'Exclusive'})
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
          <div className="mt-8 space-y-4">
            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleSaveInvoice(false)}
                disabled={saving || saved || shouldShowValidationErrors}
                className={`${shouldShowValidationErrors ? 'btn-disabled' : 'btn-primary'} flex items-center justify-center space-x-2 flex-1 min-h-[48px]`}
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
                onClick={() => handleSaveInvoice(true)}
                disabled={saving || saved}
                className="btn-secondary flex items-center justify-center space-x-2 flex-1 min-h-[48px]"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="h-4 w-4" />
                    <span>Save as Draft</span>
                  </>
                )}
              </button>
            </div>

            {/* Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownloadPDF}
                disabled={shouldShowValidationErrors}
                className={`${shouldShowValidationErrors ? 'btn-disabled' : 'btn-outline'} flex items-center justify-center space-x-2 flex-1 min-h-[48px]`}
              >
                <FiDownload className="h-4 w-4" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={handlePreview}
                disabled={shouldShowValidationErrors}
                className={`${shouldShowValidationErrors ? 'btn-disabled' : 'btn-outline'} flex items-center justify-center space-x-2 flex-1 min-h-[48px]`}
              >
                <FiEye className="h-4 w-4" />
                <span>Preview</span>
              </button>
            </div>
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
