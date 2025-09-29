import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InvoiceProvider } from '../context/InvoiceContext';
import Header from '../components/Layout/Header';
import CreateInvoicePage from './CreateInvoicePage';
import api from '../lib/api';

const InvoiceEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoice();
  }, [id]);

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
            <button onClick={() => navigate('/')} className="btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <InvoiceProvider initialData={invoice} isEditMode={true} invoiceId={id}>
      <CreateInvoicePage isEditMode={true} invoiceId={id} />
    </InvoiceProvider>
  );
};

export default InvoiceEditPage;
