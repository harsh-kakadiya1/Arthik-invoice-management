import React from 'react';
import { useForm } from 'react-hook-form';
import { useInvoice } from '../../context/InvoiceContext';
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const FromToStep = () => {
  const { invoiceData, updateInvoiceData } = useInvoice();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      sender: invoiceData.sender,
      receiver: invoiceData.receiver
    }
  });

  const onSubmit = (data) => {
    updateInvoiceData(data);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-light-text-primary mb-6">Sender & Receiver Information</h3>
        
        <div className="space-y-8">
          {/* Sender Information */}
          <div className="card">
            <h4 className="text-lg font-medium text-light-text-primary mb-4 flex items-center">
              <FiUser className="mr-2" />
              From (Your Information)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Company/Name *</label>
                <input
                  {...register('sender.name', { required: 'Name is required' })}
                  type="text"
                  className="form-input w-full"
                  placeholder="Your company or name"
                  onChange={(e) => {
                    updateInvoiceData({
                      sender: { ...invoiceData.sender, name: e.target.value }
                    });
                  }}
                />
                {errors.sender?.name && (
                  <p className="mt-1 text-sm text-state-danger">{errors.sender.name.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Email *</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                  <input
                    {...register('sender.email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="form-input w-full pl-10"
                    placeholder="your@email.com"
                    onChange={(e) => {
                      updateInvoiceData({
                        sender: { ...invoiceData.sender, email: e.target.value }
                      });
                    }}
                  />
                </div>
                {errors.sender?.email && (
                  <p className="mt-1 text-sm text-state-danger">{errors.sender.email.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                  <input
                    {...register('sender.phone')}
                    type="tel"
                    className="form-input w-full pl-10"
                    placeholder="+1 (555) 123-4567"
                    onChange={(e) => {
                      updateInvoiceData({
                        sender: { ...invoiceData.sender, phone: e.target.value }
                      });
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Address</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                  <input
                    {...register('sender.address')}
                    type="text"
                    className="form-input w-full pl-10"
                    placeholder="Street address"
                    onChange={(e) => {
                      updateInvoiceData({
                        sender: { ...invoiceData.sender, address: e.target.value }
                      });
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">City</label>
                <input
                  {...register('sender.city')}
                  type="text"
                  className="form-input w-full"
                  placeholder="City"
                  onChange={(e) => {
                    updateInvoiceData({
                      sender: { ...invoiceData.sender, city: e.target.value }
                    });
                  }}
                />
              </div>

              <div>
                <label className="form-label">ZIP Code</label>
                <input
                  {...register('sender.zipCode')}
                  type="text"
                  className="form-input w-full"
                  placeholder="ZIP/Postal code"
                  onChange={(e) => {
                    updateInvoiceData({
                      sender: { ...invoiceData.sender, zipCode: e.target.value }
                    });
                  }}
                />
              </div>

              <div className="md:col-span-2">
                <label className="form-label">Country</label>
                <input
                  {...register('sender.country')}
                  type="text"
                  className="form-input w-full"
                  placeholder="Country"
                  onChange={(e) => {
                    updateInvoiceData({
                      sender: { ...invoiceData.sender, country: e.target.value }
                    });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Receiver Information */}
          <div className="card">
            <h4 className="text-lg font-medium text-light-text-primary mb-4 flex items-center">
              <FiUser className="mr-2" />
              To (Client Information)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Client Name *</label>
                <input
                  {...register('receiver.name', { required: 'Client name is required' })}
                  type="text"
                  className="form-input w-full"
                  placeholder="Client company or name"
                  onChange={(e) => {
                    updateInvoiceData({
                      receiver: { ...invoiceData.receiver, name: e.target.value }
                    });
                  }}
                />
                {errors.receiver?.name && (
                  <p className="mt-1 text-sm text-state-danger">{errors.receiver.name.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                  <input
                    {...register('receiver.email', {
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="form-input w-full pl-10"
                    placeholder="client@email.com"
                    onChange={(e) => {
                      updateInvoiceData({
                        receiver: { ...invoiceData.receiver, email: e.target.value }
                      });
                    }}
                  />
                </div>
                {errors.receiver?.email && (
                  <p className="mt-1 text-sm text-state-danger">{errors.receiver.email.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                  <input
                    {...register('receiver.phone')}
                    type="tel"
                    className="form-input w-full pl-10"
                    placeholder="+1 (555) 123-4567"
                    onChange={(e) => {
                      updateInvoiceData({
                        receiver: { ...invoiceData.receiver, phone: e.target.value }
                      });
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Address</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                  <input
                    {...register('receiver.address')}
                    type="text"
                    className="form-input w-full pl-10"
                    placeholder="Street address"
                    onChange={(e) => {
                      updateInvoiceData({
                        receiver: { ...invoiceData.receiver, address: e.target.value }
                      });
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">City</label>
                <input
                  {...register('receiver.city')}
                  type="text"
                  className="form-input w-full"
                  placeholder="City"
                  onChange={(e) => {
                    updateInvoiceData({
                      receiver: { ...invoiceData.receiver, city: e.target.value }
                    });
                  }}
                />
              </div>

              <div>
                <label className="form-label">ZIP Code</label>
                <input
                  {...register('receiver.zipCode')}
                  type="text"
                  className="form-input w-full"
                  placeholder="ZIP/Postal code"
                  onChange={(e) => {
                    updateInvoiceData({
                      receiver: { ...invoiceData.receiver, zipCode: e.target.value }
                    });
                  }}
                />
              </div>

              <div className="md:col-span-2">
                <label className="form-label">Country</label>
                <input
                  {...register('receiver.country')}
                  type="text"
                  className="form-input w-full"
                  placeholder="Country"
                  onChange={(e) => {
                    updateInvoiceData({
                      receiver: { ...invoiceData.receiver, country: e.target.value }
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FromToStep;
