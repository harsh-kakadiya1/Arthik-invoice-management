import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiDownload, FiChevronDown } from 'react-icons/fi';
import MainLayout from '../components/Layout/MainLayout';
import api from '../lib/api';
import { formatDate } from '../lib/helpers';
import { INVOICE_STATUSES } from '../lib/variables';
import { generatePDF } from '../lib/pdfGenerator';

const DashboardPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showStatusDropdown && !event.target.closest('.status-dropdown')) {
        setShowStatusDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data.data);
    } catch (error) {
      setError('Failed to fetch invoices');
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      await api.delete(`/invoices/${id}`);
      setInvoices(invoices.filter(invoice => invoice._id !== id));
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice');
    }
  };

  const handleDownloadPDF = async (invoice) => {
    try {
      await generatePDF(invoice);
    } catch (error) {
      setError('Failed to generate PDF. Please try again.');
    }
  };

  const handleStatusUpdate = async (invoiceId, newStatus) => {
    setUpdatingStatus(invoiceId);
    setError('');
    
    try {
      const response = await api.put(`/invoices/${invoiceId}`, { status: newStatus });
      setInvoices(invoices.map(invoice => 
        invoice._id === invoiceId ? response.data.data : invoice
      ));
      setShowStatusDropdown(null);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDropdownToggle = (invoiceId, event) => {
    if (showStatusDropdown === invoiceId) {
      setShowStatusDropdown(null);
    } else {
      // Check if there's enough space below
      const rect = event.target.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // If there's more space above or not enough space below, show above
      if (spaceAbove > spaceBelow || spaceBelow < 200) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
      
      setShowStatusDropdown(invoiceId);
    }
  };

  const getStatusColor = (status) => {
    const statusObj = INVOICE_STATUSES.find(s => s.value === status);
    return statusObj ? statusObj.color : 'text-gray-500';
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-light-text-primary">Dashboard</h1>
            <p className="text-light-text-secondary mt-1">Manage your invoices</p>
          </div>
          <Link
            to="/create-invoice"
            className="btn-primary flex items-center space-x-2"
          >
            <FiPlus className="h-4 w-4" />
            <span>Create Invoice</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-teal">{invoices.length}</div>
              <div className="text-sm text-light-text-secondary">Total Invoices</div>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <div className="text-2xl font-bold text-state-success">
                {invoices.filter(inv => inv.status === 'paid').length}
              </div>
              <div className="text-sm text-light-text-secondary">Paid</div>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {invoices.filter(inv => inv.status === 'sent').length}
              </div>
              <div className="text-sm text-light-text-secondary">Sent</div>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <div className="text-2xl font-bold text-state-danger">
                {invoices.filter(inv => inv.status === 'overdue').length}
              </div>
              <div className="text-sm text-light-text-secondary">Overdue</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-state-danger bg-opacity-10 border border-state-danger text-state-danger px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Invoices Table */}
        <div className="card overflow-visible pb-8 min-h-[600px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-light-text-primary">Recent Invoices</h2>
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-light-text-secondary mb-4">
                <FiPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No invoices yet</p>
                <p className="text-sm">Create your first invoice to get started</p>
              </div>
              <Link to="/create-invoice" className="btn-primary">
                Create Invoice
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-visible">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-4 px-4 text-light-text-secondary font-medium">Invoice #</th>
                    <th className="text-left py-4 px-4 text-light-text-secondary font-medium">Client</th>
                    <th className="text-left py-4 px-4 text-light-text-secondary font-medium">Amount</th>
                    <th className="text-left py-4 px-4 text-light-text-secondary font-medium">Status</th>
                    <th className="text-left py-4 px-4 text-light-text-secondary font-medium">Date</th>
                    <th className="text-left py-4 px-4 text-light-text-secondary font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice._id} className="border-b border-dark-border hover:bg-dark-bg-primary transition-colors">
                      <td className="py-4 px-4 text-light-text-primary font-medium">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="py-4 px-4 text-light-text-primary">
                        {invoice.receiver.name}
                      </td>
                      <td className="py-4 px-4 text-light-text-primary">
                        {invoice.details.totalAmount} {invoice.details.currency}
                      </td>
                      <td className="py-4 px-4">
                        <div className="relative status-dropdown">
                          <button
                            onClick={(e) => handleDropdownToggle(invoice._id, e)}
                            disabled={updatingStatus === invoice._id}
                            className={`capitalize px-2 py-1 rounded-full text-sm font-medium flex items-center space-x-1 hover:opacity-80 transition-opacity ${getStatusColor(invoice.status)} ${updatingStatus === invoice._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <span>{invoice.status}</span>
                            <FiChevronDown className="h-3 w-3" />
                          </button>
                          
                          {showStatusDropdown === invoice._id && (
                            <div className={`absolute ${dropdownPosition === 'top' ? 'bottom-full left-0 mb-1' : 'top-full left-0 mt-1'} bg-white dark:bg-dark-bg-secondary border border-dark-border rounded-lg shadow-xl z-[9999] min-w-[120px] max-h-48 overflow-y-auto`}>
                              {INVOICE_STATUSES.map((status) => (
                                <button
                                  key={status.value}
                                  onClick={() => handleStatusUpdate(invoice._id, status.value)}
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-dark-bg-primary transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                    invoice.status === status.value ? 'bg-brand-teal bg-opacity-10 text-brand-teal' : 'text-light-text-primary'
                                  }`}
                                >
                                  {status.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-light-text-secondary">
                        {formatDate(invoice.details.invoiceDate)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/invoice/${invoice._id}`}
                            className="text-brand-teal hover:text-opacity-80 transition-colors"
                            title="View"
                          >
                            <FiEye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDownloadPDF(invoice)}
                            className="text-green-500 hover:text-opacity-80 transition-colors"
                            title="Download PDF"
                          >
                            <FiDownload className="h-4 w-4" />
                          </button>
                          <Link
                            to={`/edit-invoice/${invoice._id}`}
                            className="text-blue-500 hover:text-opacity-80 transition-colors"
                            title="Edit"
                          >
                            <FiEdit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => deleteInvoice(invoice._id)}
                            className="text-state-danger hover:text-opacity-80 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Placeholder rows to make the section bigger */}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`placeholder-${index}`} className="border-b border-dark-border opacity-20">
                      <td className="py-4 px-4 text-light-text-secondary">
                        &nbsp;
                      </td>
                      <td className="py-4 px-4 text-light-text-secondary">
                        &nbsp;
                      </td>
                      <td className="py-4 px-4 text-light-text-secondary">
                        &nbsp;
                      </td>
                      <td className="py-4 px-4 text-light-text-secondary">
                        &nbsp;
                      </td>
                      <td className="py-4 px-4 text-light-text-secondary">
                        &nbsp;
                      </td>
                      <td className="py-4 px-4 text-light-text-secondary">
                        &nbsp;
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
