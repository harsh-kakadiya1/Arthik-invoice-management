import React from 'react';
import { useForm } from 'react-hook-form';
import { useInvoice } from '../../context/InvoiceContext';
import { PAYMENT_TERMS } from '../../lib/variables';
import { FiCreditCard, FiFileText, FiEdit3 } from 'react-icons/fi';

const PaymentInfoStep = () => {
  const { invoiceData, updateInvoiceData } = useInvoice();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      details: {
        paymentTerms: invoiceData.details.paymentTerms,
        additionalNotes: invoiceData.details.additionalNotes,
        paymentInformation: invoiceData.details.paymentInformation,
        signature: invoiceData.details.signature
      }
    }
  });

  const onSubmit = (data) => {
    updateInvoiceData({
      details: {
        ...invoiceData.details,
        paymentTerms: data.details.paymentTerms,
        additionalNotes: data.details.additionalNotes,
        paymentInformation: data.details.paymentInformation,
        signature: data.details.signature
      }
    });
  };

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
                  {...register('details.paymentTerms')}
                  className="form-input w-full"
                  onChange={(e) => {
                    updateInvoiceData({
                      details: { ...invoiceData.details, paymentTerms: e.target.value }
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Bank Name</label>
                  <input
                    {...register('details.paymentInformation.bankName')}
                    type="text"
                    className="form-input w-full"
                    placeholder="Bank of Nations"
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
                  <label className="form-label">Account Name</label>
                  <input
                    {...register('details.paymentInformation.accountName')}
                    type="text"
                    className="form-input w-full"
                    placeholder="Your Company Inc."
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
                  <label className="form-label">Account Number</label>
                  <input
                    {...register('details.paymentInformation.accountNumber')}
                    type="text"
                    className="form-input w-full"
                    placeholder="1234567890"
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

          {/* Additional Notes */}
          <div className="card">
            <h4 className="text-lg font-medium text-light-text-primary mb-4 flex items-center">
              <FiFileText className="mr-2" />
              Additional Information
            </h4>
            
            <div>
              <label className="form-label">Additional Notes</label>
              <textarea
                {...register('details.additionalNotes')}
                className="form-input w-full resize-none"
                rows="4"
                placeholder="Thank you for your business! Please contact us if you have any questions."
                onChange={(e) => {
                  updateInvoiceData({
                    details: { ...invoiceData.details, additionalNotes: e.target.value }
                  });
                }}
              />
              <p className="mt-1 text-sm text-light-text-secondary">
                Add any additional information, special instructions, or thank you message.
              </p>
            </div>
          </div>

          {/* Signature */}
          <div className="card">
            <h4 className="text-lg font-medium text-light-text-primary mb-4 flex items-center">
              <FiEdit3 className="mr-2" />
              Signature
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Signature Text</label>
                <input
                  {...register('details.signature.data')}
                  type="text"
                  className="form-input w-full font-signature"
                  placeholder="Your Name"
                  style={{
                    fontFamily: `${invoiceData.details.signature?.fontFamily || 'Great Vibes'}, cursive`,
                    fontSize: '18px'
                  }}
                  onChange={(e) => {
                    updateInvoiceData({
                      details: {
                        ...invoiceData.details,
                        signature: {
                          ...invoiceData.details.signature,
                          data: e.target.value
                        }
                      }
                    });
                  }}
                />
                <p className="mt-1 text-sm text-light-text-secondary">
                  Enter your name or signature text
                </p>
              </div>

              <div>
                <label className="form-label">Font Family</label>
                <select
                  {...register('details.signature.fontFamily')}
                  className="form-input w-full"
                  onChange={(e) => {
                    updateInvoiceData({
                      details: {
                        ...invoiceData.details,
                        signature: {
                          ...invoiceData.details.signature,
                          fontFamily: e.target.value
                        }
                      }
                    });
                  }}
                >
                  <option value="Great Vibes">Great Vibes (Cursive)</option>
                  <option value="Dancing Script">Dancing Script</option>
                  <option value="Pacifico">Pacifico</option>
                  <option value="Kaushan Script">Kaushan Script</option>
                  <option value="Satisfy">Satisfy</option>
                </select>
              </div>
            </div>

            {/* Signature Preview */}
            {invoiceData.details.signature?.data && (
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <p className="text-sm text-gray-600 mb-2">Signature Preview:</p>
                <p
                  style={{
                    fontSize: 24,
                    fontWeight: 400,
                    fontFamily: `${invoiceData.details.signature.fontFamily}, cursive`,
                    color: "black",
                  }}
                >
                  {invoiceData.details.signature.data}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoStep;
