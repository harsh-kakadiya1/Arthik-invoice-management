import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useInvoice } from '../../context/InvoiceContext';
import { useAuth } from '../../context/AuthContext';
import { useClients } from '../../context/ClientContext';
import ClientAutoComplete from '../ClientAutoComplete';
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const FromToStep = () => {
  const { invoiceData, updateInvoiceData } = useInvoice();
  const { user } = useAuth();
  const { createClient } = useClients();
  const [showClientModal, setShowClientModal] = useState(false);
  const [newClientData, setNewClientData] = useState({});
  
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

  // Pre-fill sender information from user profile
  useEffect(() => {
    if (user?.profile) {
      // Check if sender data is empty or contains placeholder data
      const hasPlaceholderData = invoiceData.sender?.email === 'your@email.com' || 
                                invoiceData.sender?.phone === '+1 (555) 123-4567' ||
                                !invoiceData.sender?.name;
      
      if (hasPlaceholderData || (!invoiceData.sender?.name && user.profile.companyName)) {
        updateInvoiceData({
          sender: {
            name: user.profile.companyName || user.name,
            email: user.email,
            phone: user.profile.phone || '',
            address: user.profile.address || '',
            city: user.profile.city || '',
            pinCode: user.profile.pinCode || ''
          }
        });
      }
    }
  }, [user, updateInvoiceData]);

  const onSubmit = (data) => {
    updateInvoiceData(data);
  };

  const handleClientSelect = (client) => {
    updateInvoiceData({
      receiver: {
        name: client.name,
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        city: client.city || '',
        pinCode: client.pinCode || ''
      }
    });
  };

  const handleNewClient = async (clientName) => {
    setNewClientData({ name: clientName });
    setShowClientModal(true);
  };

  const handleCreateClient = async (clientData) => {
    try {
      const newClient = await createClient(clientData);
      handleClientSelect(newClient);
      setShowClientModal(false);
      setNewClientData({});
    } catch (error) {
      console.error('Error creating client:', error);
    }
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
                  value={invoiceData.sender?.name || ''}
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
                    value={invoiceData.sender?.email || ''}
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
                    value={invoiceData.sender?.phone || ''}
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
                    value={invoiceData.sender?.address || ''}
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
                  value={invoiceData.sender?.city || ''}
                  onChange={(e) => {
                    updateInvoiceData({
                      sender: { ...invoiceData.sender, city: e.target.value }
                    });
                  }}
                />
              </div>

              <div>
                <label className="form-label">Pin Code</label>
                <input
                  {...register('sender.pinCode')}
                  type="text"
                  className="form-input w-full"
                  placeholder="Pin code"
                  value={invoiceData.sender?.pinCode || ''}
                  onChange={(e) => {
                    updateInvoiceData({
                      sender: { ...invoiceData.sender, pinCode: e.target.value }
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
              <div className="md:col-span-2">
                <label className="form-label">Client Name *</label>
                <ClientAutoComplete
                  value={invoiceData.receiver?.name || ''}
                  onChange={(value) => {
                    updateInvoiceData({
                      receiver: { ...invoiceData.receiver, name: value }
                    });
                  }}
                  onClientSelect={handleClientSelect}
                  onNewClient={handleNewClient}
                  placeholder="Search for existing client or type new name"
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
                <label className="form-label">Pin Code</label>
                <input
                  {...register('receiver.pinCode')}
                  type="text"
                  className="form-input w-full"
                  placeholder="Pin code"
                  onChange={(e) => {
                    updateInvoiceData({
                      receiver: { ...invoiceData.receiver, pinCode: e.target.value }
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Client Modal */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Add New Client
              </h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateClient(newClientData);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={newClientData.name || ''}
                    onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="Enter client name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <input
                      type="email"
                      value={newClientData.email || ''}
                      onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="client@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <input
                      type="tel"
                      value={newClientData.phone || ''}
                      onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <input
                      type="text"
                      value={newClientData.address || ''}
                      onChange={(e) => setNewClientData({ ...newClientData, address: e.target.value })}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="Street address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                    <input
                      type="text"
                      value={newClientData.city || ''}
                      onChange={(e) => setNewClientData({ ...newClientData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pin Code</label>
                    <input
                      type="text"
                      value={newClientData.pinCode || ''}
                      onChange={(e) => setNewClientData({ ...newClientData, pinCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="123456"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowClientModal(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-black border border-transparent rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary border border-transparent rounded-md transition-colors duration-200"
                  >
                    Add Client
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FromToStep;
