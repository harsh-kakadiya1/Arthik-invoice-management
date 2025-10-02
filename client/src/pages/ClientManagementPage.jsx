import React, { useState } from 'react';
import { useClients } from '../context/ClientContext';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import MainLayout from '../components/Layout/MainLayout';

const ClientManagementPage = () => {
  const { clients, loading, error, createClient, updateClient, deleteClient } = useClients();
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pinCode: ''
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await updateClient(editingClient._id, formData);
      } else {
        await createClient(formData);
      }
      setShowModal(false);
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pinCode: ''
      });
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      city: client.city || '',
      pinCode: client.pinCode || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(clientId);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const openNewClientModal = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      pinCode: ''
    });
    setShowModal(true);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-light-text-primary">Client Management</h1>
            <p className="text-light-text-secondary mt-2">Manage your client information for quick invoice creation</p>
          </div>
          <button
            onClick={openNewClientModal}
            className="btn-primary flex items-center space-x-2"
          >
            <FiPlus className="h-4 w-4" />
            <span>Add Client</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input w-full pl-10"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div key={client._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-light-text-primary flex items-center">
                  <FiUser className="mr-2 h-4 w-4" />
                  {client.name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="text-brand-primary hover:text-brand-secondary transition-colors"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {client.email && (
                  <div className="flex items-center text-sm text-light-text-secondary">
                    <FiMail className="mr-2 h-3 w-3" />
                    {client.email}
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center text-sm text-light-text-secondary">
                    <FiPhone className="mr-2 h-3 w-3" />
                    {client.phone}
                  </div>
                )}
                {client.address && (
                  <div className="flex items-start text-sm text-light-text-secondary">
                    <FiMapPin className="mr-2 h-3 w-3 mt-0.5" />
                    <span>{client.address}</span>
                  </div>
                )}
                {(client.city || client.pinCode) && (
                  <div className="text-sm text-light-text-secondary">
                    {client.city && client.pinCode 
                      ? `${client.city} - ${client.pinCode}`
                      : client.city || client.pinCode
                    }
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiUser className="mx-auto h-12 w-12 text-light-text-muted mb-4" />
            <h3 className="text-lg font-medium text-light-text-primary mb-2">
              {searchTerm ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-light-text-secondary mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Add your first client to get started with invoice creation'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={openNewClientModal}
                className="btn-primary"
              >
                Add Your First Client
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-light-text-secondary">Loading clients...</p>
          </div>
        )}
      </div>

      {/* Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-light-text-primary mb-4">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input w-full"
                    placeholder="Enter client name"
                  />
                </div>

                <div>
                  <label className="form-label">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input w-full pl-10"
                      placeholder="client@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Phone</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="form-input w-full pl-10"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Address</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="form-input w-full pl-10"
                      placeholder="Street address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="form-input w-full"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="form-label">Pin Code</label>
                    <input
                      type="text"
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      className="form-input w-full"
                      placeholder="123456"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingClient ? 'Update Client' : 'Add Client'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ClientManagementPage;
