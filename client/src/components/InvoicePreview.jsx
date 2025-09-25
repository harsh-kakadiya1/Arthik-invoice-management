import React from 'react';
import { useInvoice } from '../context/InvoiceContext';
import InvoiceTemplate1 from '../templates/InvoiceTemplate1';
import InvoiceTemplate2 from '../templates/InvoiceTemplate2';
import InvoiceTemplate3 from '../templates/InvoiceTemplate3';
import InvoiceTemplate4 from '../templates/InvoiceTemplate4';

const InvoicePreview = () => {
  const { invoiceData } = useInvoice();

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

  return (
    <div className="w-full">
      <div className="transform scale-50 origin-top-left w-[200%] h-[200%] overflow-hidden invoice-preview-content">
        {renderTemplate()}
      </div>
    </div>
  );
};

export default InvoicePreview;
