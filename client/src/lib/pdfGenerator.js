// Server-side PDF Generator using Puppeteer for perfect template rendering
export const generatePDF = async (invoiceData) => {
  try {
    console.log('🚀 Starting server-side PDF generation...');
    
    // Get the authentication token
    const token = localStorage.getItem('token');
    
    // Send invoice data to server for PDF generation
    const response = await fetch('http://localhost:5001/api/v1/pdf/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(invoiceData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate PDF');
    }

    // Get PDF blob from response
    const pdfBlob = await response.blob();
    
    // Create download URL
    const url = window.URL.createObjectURL(pdfBlob);
    
    // Create temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${invoiceData.details.invoiceNumber || 'draft'}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('✅ PDF generated and downloaded successfully!');
    return true;

  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    
    // Show user-friendly error message
    alert(`PDF generation failed: ${error.message}`);
    
    return false;
  }
};

// Fallback client-side PDF generation (for testing)  
export const generatePDFClientSide = async (invoiceData) => {
  try {
    console.log('🚀 Starting fallback client-side PDF generation...');
    
    // Extended wait for complete template rendering
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Try to find template element
    let templateElement = document.querySelector('.invoice-preview-content') ||
                         document.querySelector('[data-testid="invoice-preview"]') ||
                         document.querySelector('.invoice-template');
    
    if (!templateElement) {
      // Content-based search
      const allElements = Array.from(document.querySelectorAll('div'));
      templateElement = allElements.find(el => {
        const text = el.textContent?.toLowerCase() || '';
        const hasInvoiceContent = text.includes('invoice') && text.includes('bill to');
        const isLargeEnough = el.offsetWidth > 500 && el.offsetHeight > 400;
        return hasInvoiceContent && isLargeEnough;
      });
    }
    
    if (!templateElement) {
      throw new Error('Cannot find template element for PDF generation');
    }
    
    // Simple print-based PDF generation
    const printWindow = window.open('', '_blank');
    const templateHTML = templateElement.outerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice-${invoiceData.details.invoiceNumber || 'draft'}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
            }
            ${getBasicPrintStyles()}
          </style>
        </head>
        <body>
          ${templateHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
    
    return true;
    
  } catch (error) {
    console.error('❌ Client-side PDF generation failed:', error);
    alert(`PDF generation failed: ${error.message}`);
    return false;
  }
};

// Basic print styles for fallback
const getBasicPrintStyles = () => {
  return `
    /* Template 4 Styles */
    .template4-container {
      display: flex !important;
      min-height: 100vh;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .template4-sidebar {
      width: 33.333333% !important;
      background-color: #1f2937 !important;
      color: white !important;
      padding: 2rem !important;
      flex-shrink: 0;
    }
    .template4-content {
      width: 66.666667% !important;
      padding: 2rem !important;
      background-color: white !important;
    }
    
    /* General Styles */
    .grid { display: grid !important; }
    .flex { display: flex !important; }
    .justify-between { justify-content: space-between !important; }
    .text-right { text-align: right !important; }
    .text-center { text-align: center !important; }
    .font-bold { font-weight: bold !important; }
    .font-semibold { font-weight: 600 !important; }
    .text-blue-600 { color: #2563eb !important; }
    .text-blue-700 { color: #1d4ed8 !important; }
    .text-gray-800 { color: #1f2937 !important; }
    .text-gray-600 { color: #4b5563 !important; }
    .text-gray-500 { color: #6b7280 !important; }
    .bg-gray-50 { background-color: #f9fafb !important; }
    .border { border: 1px solid #e5e7eb !important; }
    .border-b { border-bottom: 1px solid #e5e7eb !important; }
    .border-gray-200 { border-color: #e5e7eb !important; }
    .rounded-lg { border-radius: 0.5rem !important; }
    .p-1 { padding: 0.25rem !important; }
    .p-2 { padding: 0.5rem !important; }
    .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
    .px-1 { padding-left: 0.25rem !important; padding-right: 0.25rem !important; }
    .mt-2 { margin-top: 0.5rem !important; }
    .mt-4 { margin-top: 1rem !important; }
    .mt-6 { margin-top: 1.5rem !important; }
    .mt-8 { margin-top: 2rem !important; }
    .mb-2 { margin-bottom: 0.5rem !important; }
    .mb-4 { margin-bottom: 1rem !important; }
    .mb-6 { margin-bottom: 1.5rem !important; }
    .mb-8 { margin-bottom: 2rem !important; }
    .space-y-2 > * + * { margin-top: 0.5rem !important; }
    .space-y-1 > * + * { margin-top: 0.25rem !important; }
    .gap-3 { gap: 0.75rem !important; }
    .gap-x-3 { column-gap: 0.75rem !important; }
    .gap-y-1 { row-gap: 0.25rem !important; }
    .col-span-2 { grid-column: span 2 / span 2 !important; }
    .col-span-3 { grid-column: span 3 / span 3 !important; }
    .col-span-5 { grid-column: span 5 / span 5 !important; }
    .col-span-full { grid-column: 1 / -1 !important; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
    .grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; }
    .grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)) !important; }
    .text-xs { font-size: 0.75rem !important; }
    .text-sm { font-size: 0.875rem !important; }
    .text-lg { font-size: 1.125rem !important; }
    .text-xl { font-size: 1.25rem !important; }
    .text-2xl { font-size: 1.5rem !important; }
    .text-3xl { font-size: 1.875rem !important; }
    .text-4xl { font-size: 2.25rem !important; }
    .max-w-sm { max-width: 24rem !important; }
    .w-full { width: 100% !important; }
    .not-italic { font-style: normal !important; }
    .uppercase { text-transform: uppercase !important; }
    .font-medium { font-weight: 500 !important; }
    .font-extrabold { font-weight: 800 !important; }
    .italic { font-style: italic !important; }
    .inline-block { display: inline-block !important; }
    .hidden { display: none !important; }
    .block { display: block !important; }
    .pt-2 { padding-top: 0.5rem !important; }
    .pt-6 { padding-top: 1.5rem !important; }
    .pb-1 { padding-bottom: 0.25rem !important; }
    .pb-2 { padding-bottom: 0.5rem !important; }
    .border-t { border-top: 1px solid #e5e7eb !important; }
    .border-blue-200 { border-color: #dbeafe !important; }
    .border-gray-100 { border-color: #f3f4f6 !important; }
    .border-gray-300 { border-color: #d1d5db !important; }
    .text-gray-100 { color: #f3f4f6 !important; }
    .text-gray-200 { color: #e5e7eb !important; }
    .text-gray-300 { color: #d1d5db !important; }
    .text-gray-400 { color: #9ca3af !important; }
    .text-gray-700 { color: #374151 !important; }
    .text-gray-900 { color: #111827 !important; }
    .bg-white { background-color: white !important; }
    .min-h-screen { min-height: 100vh !important; }

    /* Print-specific overrides */
    @media print {
      .template4-container {
        width: 210mm !important;
        min-height: 297mm !important;
        margin: 0 !important;
        page-break-inside: avoid;
      }
      .template4-sidebar {
        background-color: #1f2937 !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      img {
        max-width: 100% !important;
        height: auto !important;
      }
    }
  `;
};