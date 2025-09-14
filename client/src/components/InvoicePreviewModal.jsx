import React from 'react';
import { FiX, FiDownload, FiPrinter } from 'react-icons/fi';
import { useInvoice } from '../context/InvoiceContext';
import InvoiceTemplate1 from '../templates/InvoiceTemplate1';
import InvoiceTemplate2 from '../templates/InvoiceTemplate2';
import InvoiceTemplate3 from '../templates/InvoiceTemplate3';
import InvoiceTemplate4 from '../templates/InvoiceTemplate4';

const InvoicePreviewModal = ({ isOpen, onClose, onDownloadPDF }) => {
  const { invoiceData } = useInvoice();

  if (!isOpen) return null;

  const renderTemplate = () => {
    switch (invoiceData.template) {
      case 'template1':
        return <InvoiceTemplate1 data={invoiceData} />;
      case 'template2':
        return <InvoiceTemplate2 data={invoiceData} />;
      case 'template3':
        return <InvoiceTemplate3 data={invoiceData} />;
      case 'template4':
        return <InvoiceTemplate4 data={invoiceData} />;
      default:
        return <InvoiceTemplate1 data={invoiceData} />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Invoice Preview</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onDownloadPDF}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiDownload className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiPrinter className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          <div className="bg-white shadow-lg mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewModal;
