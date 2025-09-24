import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiEdit, FiTrash2, FiChevronDown } from 'react-icons/fi';
import Header from '../components/Layout/Header';
import api from '../lib/api';
import { formatDate } from '../lib/helpers';
import { generatePDF } from '../lib/pdfGenerator';
import { INVOICE_STATUSES } from '../lib/variables';

const InvoiceViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showStatusDropdown && !event.target.closest('.status-dropdown')) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/invoices/${id}`);
      setInvoice(response.data.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await api.delete(`/invoices/${id}`);
        navigate('/');
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to delete invoice');
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(invoice);
    } catch (error) {
      setError('Failed to generate PDF. Please try again.');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdatingStatus(true);
    setError('');
    
    try {
      const response = await api.put(`/invoices/${id}`, { status: newStatus });
      setInvoice(response.data.data);
      setShowStatusDropdown(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg-primary">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-dark-bg-primary">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-light-text-primary mb-4">Invoice Not Found</h1>
            <p className="text-light-text-secondary mb-6">{error || 'The invoice you are looking for does not exist.'}</p>
            <Link to="/" className="btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-state-success';
      case 'sent':
        return 'text-blue-500';
      case 'overdue':
        return 'text-state-danger';
      default:
        return 'text-light-text-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg-primary">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-light-text-secondary hover:text-light-text-primary transition-colors"
            >
              <FiArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-light-text-primary">
              Invoice {invoice.invoiceNumber}
            </h1>
            <div className="relative status-dropdown">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                disabled={updatingStatus}
                className={`capitalize px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 hover:opacity-80 transition-opacity ${getStatusColor(invoice.status)} ${updatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span>{invoice.status}</span>
                <FiChevronDown className="h-3 w-3" />
              </button>
              
              {showStatusDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-dark-bg-secondary border border-dark-border rounded-lg shadow-xl z-[9999] min-w-[120px] max-h-48 overflow-y-auto">
                  {INVOICE_STATUSES.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusUpdate(status.value)}
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
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="btn-secondary flex items-center space-x-2"
            >
              <FiDownload className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <Link
              to={`/edit-invoice/${invoice._id}`}
              className="btn-primary flex items-center space-x-2"
            >
              <FiEdit className="h-4 w-4" />
              <span>Edit</span>
            </Link>
            <button
              onClick={handleDelete}
              className="text-state-danger hover:text-opacity-80 transition-colors p-2"
              title="Delete Invoice"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-light-text-primary mb-4">Invoice Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-light-text-secondary">Invoice Number:</span>
                  <p className="text-light-text-primary font-medium">{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <span className="text-light-text-secondary">Invoice Date:</span>
                  <p className="text-light-text-primary">{formatDate(invoice.details.invoiceDate)}</p>
                </div>
                <div>
                  <span className="text-light-text-secondary">Due Date:</span>
                  <p className="text-light-text-primary">{formatDate(invoice.details.dueDate)}</p>
                </div>
                <div>
                  <span className="text-light-text-secondary">Currency:</span>
                  <p className="text-light-text-primary">{invoice.details.currency}</p>
                </div>
              </div>
            </div>

            {/* From/To Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h4 className="text-lg font-medium text-light-text-primary mb-3">From</h4>
                <div className="text-sm space-y-1">
                  <p className="font-medium text-light-text-primary">{invoice.sender.name}</p>
                  <p className="text-light-text-secondary">{invoice.sender.email}</p>
                  {invoice.sender.phone && <p className="text-light-text-secondary">{invoice.sender.phone}</p>}
                  {invoice.sender.address && <p className="text-light-text-secondary">{invoice.sender.address}</p>}
                </div>
              </div>

              <div className="card">
                <h4 className="text-lg font-medium text-light-text-primary mb-3">To</h4>
                <div className="text-sm space-y-1">
                  <p className="font-medium text-light-text-primary">{invoice.receiver.name}</p>
                  {invoice.receiver.email && <p className="text-light-text-secondary">{invoice.receiver.email}</p>}
                  {invoice.receiver.phone && <p className="text-light-text-secondary">{invoice.receiver.phone}</p>}
                  {invoice.receiver.address && <p className="text-light-text-secondary">{invoice.receiver.address}</p>}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="card">
              <h4 className="text-lg font-medium text-light-text-primary mb-4">Items</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="text-left py-2 text-light-text-secondary font-medium">Item</th>
                      <th className="text-left py-2 text-light-text-secondary font-medium">Qty</th>
                      <th className="text-left py-2 text-light-text-secondary font-medium">Rate</th>
                      <th className="text-right py-2 text-light-text-secondary font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.details.items.map((item, index) => (
                      <tr key={index} className="border-b border-dark-border">
                        <td className="py-3">
                          <div>
                            <p className="font-medium text-light-text-primary">{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-light-text-secondary">{item.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-light-text-primary">{item.quantity}</td>
                        <td className="py-3 text-light-text-primary">{item.unitPrice}</td>
                        <td className="py-3 text-right text-light-text-primary font-medium">
                          {item.total} {invoice.details.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card h-fit">
            <h4 className="text-lg font-medium text-light-text-primary mb-4">Summary</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-light-text-secondary">Subtotal:</span>
                <span className="text-light-text-primary">{invoice.details.subTotal} {invoice.details.currency}</span>
              </div>
              
              {invoice.details.discountDetails?.amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-light-text-secondary">Discount:</span>
                  <span className="text-light-text-primary">
                    -{invoice.details.discountDetails.amount}
                    {invoice.details.discountDetails.amountType === 'percentage' ? '%' : ` ${invoice.details.currency}`}
                  </span>
                </div>
              )}
              
              {invoice.details.taxDetails?.amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-light-text-secondary">Tax:</span>
                  <span className="text-light-text-primary">
                    {invoice.details.taxDetails.amount}
                    {invoice.details.taxDetails.amountType === 'percentage' ? '%' : ` ${invoice.details.currency}`}
                  </span>
                </div>
              )}
              
              {invoice.details.shippingDetails?.cost > 0 && (
                <div className="flex justify-between">
                  <span className="text-light-text-secondary">Shipping:</span>
                  <span className="text-light-text-primary">
                    {invoice.details.shippingDetails.cost}
                    {invoice.details.shippingDetails.costType === 'percentage' ? '%' : ` ${invoice.details.currency}`}
                  </span>
                </div>
              )}
              
              <div className="border-t border-dark-border pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-light-text-primary">Total:</span>
                  <span className="text-xl font-bold text-brand-teal">
                    {invoice.details.totalAmount} {invoice.details.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewPage;
