import React, { useState } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { PAYMENT_TERMS } from '../../lib/variables';
import { FiCreditCard, FiFileText, FiEdit3 } from 'react-icons/fi';
import SignatureModal from '../SignatureModal';

const PaymentInfoStep = () => {
  const { invoiceData, updateInvoiceData } = useInvoice();
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-light-text-primary mb-6">Payment Information & Notes</h3>
        
        <div className="space-y-6">
          {/* Payment Terms */}
          <div className="card">
            <h4 className="text-lg font-medium text-light-text-primary mb-4 flex items-center">
              <FiCreditCard className="mr-2" />
              Payment Terms
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Payment Terms</label>
                <select
                  className="form-input w-full"
                  value={invoiceData.details.paymentTerms}
                  onChange={(e) => {
                    updateInvoiceData({
                      details: {
                        ...invoiceData.details,
                        paymentTerms: e.target.value
                      }
                    });
                  }}
                >
                  {PAYMENT_TERMS.map((term, index) => (
                    <option key={index} value={term}>
                      {term}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Payment Information</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      className="form-input w-full"
                      placeholder="Bank Name"
                      value={invoiceData.details.paymentInformation?.bankName || ''}
                      onChange={(e) => {
                        updateInvoiceData({
                          details: {
                            ...invoiceData.details,
                            paymentInformation: {
                              ...invoiceData.details.paymentInformation,
                              bankName: e.target.value
                            }
                          }
                        });
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="form-input w-full"
                      placeholder="Account Name"
                      value={invoiceData.details.paymentInformation?.accountName || ''}
                      onChange={(e) => {
                        updateInvoiceData({
                          details: {
                            ...invoiceData.details,
                            paymentInformation: {
                              ...invoiceData.details.paymentInformation,
                              accountName: e.target.value
                            }
                          }
                        });
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="form-input w-full"
                      placeholder="Account Number"
                      value={invoiceData.details.paymentInformation?.accountNumber || ''}
                      onChange={(e) => {
                        updateInvoiceData({
                          details: {
                            ...invoiceData.details,
                            paymentInformation: {
                              ...invoiceData.details.paymentInformation,
                              accountNumber: e.target.value
                            }
                          }
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="card">
            <h4 className="text-lg font-medium text-light-text-primary mb-4 flex items-center">
              <FiFileText className="mr-2" />
              Additional Notes
            </h4>
            
            <div>
              <label className="form-label">Notes</label>
              <textarea
                className="form-input w-full"
                rows="4"
                placeholder="Add any additional notes, terms, or conditions..."
                value={invoiceData.details.additionalNotes || ''}
                onChange={(e) => {
                  updateInvoiceData({
                    details: {
                      ...invoiceData.details,
                      additionalNotes: e.target.value
                    }
                  });
                }}
              />
              <p className="mt-1 text-sm text-light-text-secondary">
                Any additional information you want to include on the invoice
              </p>
            </div>
          </div>

          {/* Enhanced Signature Section */}
          <div className="card">
            <h4 className="text-lg font-medium text-light-text-primary mb-4 flex items-center">
              <FiEdit3 className="mr-2" />
              Digital Signature
            </h4>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-light-text-secondary text-sm mb-2">
                    Add your signature to make the invoice official
                  </p>
                  {!invoiceData.details.signature?.data ? (
                    <button
                      type="button"
                      onClick={() => setIsSignatureModalOpen(true)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <FiEdit3 className="h-4 w-4" />
                      <span>Add Signature</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsSignatureModalOpen(true)}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <FiEdit3 className="h-4 w-4" />
                        <span>Edit Signature</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateInvoiceData({
                            details: {
                              ...invoiceData.details,
                              signature: null
                            }
                          });
                        }}
                        className="text-state-danger hover:text-red-600 transition-colors p-2"
                        title="Remove signature"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Signature Preview */}
              {invoiceData.details.signature?.data && (
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <p className="text-sm text-gray-600 mb-3">
                    Signature Preview:
                  </p>
                  {invoiceData.details.signature?.type === 'text' ? (
                    <p
                      style={{
                        fontSize: 28,
                        fontWeight: 400,
                        fontFamily: `${invoiceData.details.signature.fontFamily || 'Great Vibes'}, cursive`,
                        color: "black",
                      }}
                    >
                      {invoiceData.details.signature.data}
                    </p>
                  ) : (
                    <img
                      src={invoiceData.details.signature.data}
                      alt="Signature Preview"
                      className="h-16 w-auto max-w-full"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={(signatureData) => {
          updateInvoiceData({
            details: {
              ...invoiceData.details,
              signature: {
                data: signatureData.data,
                type: signatureData.type,
                fontFamily: signatureData.fontFamily || 'Great Vibes',
                color: signatureData.color
              }
            }
          });
        }}
        initialSignature={invoiceData.details.signature?.data}
      />
    </div>
  );
};

export default PaymentInfoStep;