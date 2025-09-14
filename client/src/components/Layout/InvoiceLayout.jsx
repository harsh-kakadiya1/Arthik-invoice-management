import React from 'react';

const InvoiceLayout = ({ data, children }) => {
  return (
    <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      {children}
    </div>
  );
};

export default InvoiceLayout;
