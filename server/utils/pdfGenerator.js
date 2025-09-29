const puppeteer = require('puppeteer');

/**
 * Generate PDF from HTML content using Puppeteer
 * @param {string} htmlContent - The HTML content to convert to PDF
 * @param {Object} options - PDF generation options
 * @returns {Buffer} PDF buffer
 */
const generatePDFFromHTML = async (htmlContent, options = {}) => {
  let browser;
  let page;

  try {
    // Launch browser
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    page = await browser.newPage();
    
    // Set content and wait for it to load
    await page.setContent(htmlContent, {
      waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
      timeout: 30000,
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      width: '210mm',
      height: '297mm',
      margin: {
        top: '0.2in',
        bottom: '0.2in',
        left: '0.2in',
        right: '0.2in',
      },
      displayHeaderFooter: false,
      ...options
    });

    return pdfBuffer;

  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  } finally {
    // Clean up resources
    if (page) {
      try {
        await page.close();
      } catch (e) {
        console.error('Error closing page:', e);
      }
    }
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error('Error closing browser:', e);
      }
    }
  }
};

/**
 * Generate complete HTML document for PDF generation
 * @param {string} templateHTML - The template HTML content
 * @param {Object} invoiceData - Invoice data for the template
 * @returns {string} Complete HTML document
 */
const generateCompleteHTML = (templateHTML, invoiceData) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceData.details?.invoiceNumber || invoiceData.invoiceNumber || 'Download'}</title>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Great+Vibes&family=Allura&display=swap" rel="stylesheet">
  
  <style>
    /* Global Reset */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #1f2937;
      background: white;
      width: 210mm;
      height: 297mm;
      margin: 0;
      padding: 10px;
      overflow: hidden;
    }
    
    /* Print Styles */
    @media print {
      body {
        width: 210mm;
        height: 297mm;
        margin: 0;
        padding: 10px;
        overflow: hidden;
      }
      
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    
    /* Template Styles will be injected here */
    ${getTemplateCSS()}
  </style>
</head>
<body>
  ${templateHTML}
</body>
</html>`;
};

/**
 * Get CSS styles for all templates
 * @returns {string} CSS styles
 */
function getTemplateCSS() {
  return `
    /* Universal Utilities */
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-row { flex-direction: row; }
    .justify-between { justify-content: space-between; }
    .justify-end { justify-content: flex-end; }
    .items-start { align-items: flex-start; }
    .items-center { align-items: center; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    
    /* Width utilities */
    .w-full { width: 100%; }
    .w-1-3 { width: 33.333333%; }
    .w-2-3 { width: 66.666667%; }
    .max-w-sm { max-width: 24rem; }
    
    /* Background colors */
    .bg-white { background-color: #ffffff; }
    .bg-gray-50 { background-color: #f9fafb; }
    .bg-gray-100 { background-color: #f3f4f6; }
    .bg-gray-200 { background-color: #e5e7eb; }
    .bg-gray-900 { background-color: #111827; color: #ffffff; }
    .bg-blue-50 { background-color: #eff6ff; }
    .bg-blue-600 { background-color: #2563eb; color: #ffffff; }
    
    /* Template 4 Specific Styles */
    .template4-container {
      display: flex;
      flex-direction: row;
      height: 275mm;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      page-break-inside: avoid;
    }
    
    .template4-sidebar {
      width: 33.333333%;
      background-color: #111827;
      color: #ffffff;
      padding: 1rem;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }
    
    .template4-content {
      width: 66.666667%;
      padding: 1rem;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }
    
    .template4-sidebar .logo-img {
      margin-bottom: 1rem;
      opacity: 0.8;
    }
    
    .template4-sidebar .sender-name {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 0.25rem;
      color: #ffffff;
    }
    
    .template4-sidebar .sender-address {
      font-style: normal;
      font-size: 0.875rem;
      color: #d1d5db;
      margin-bottom: 1rem;
      line-height: 1.4;
    }
    
    .template4-sidebar .sender-contact {
      font-size: 0.875rem;
      color: #d1d5db;
      margin-bottom: 0.25rem;
    }
    
    .template4-sidebar .invoice-details-section {
      margin-top: 2rem;
    }
    
    .template4-sidebar .invoice-details-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #e5e7eb;
      margin-bottom: 0.5rem;
    }
    
    .template4-sidebar .invoice-detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }
    
    .template4-sidebar .invoice-detail-label {
      font-weight: 500;
      color: #9ca3af;
    }
    
    .template4-sidebar .invoice-detail-value {
      color: #f3f4f6;
    }
    
    .template4-content .invoice-title {
      text-align: right;
      margin-bottom: 2rem;
    }
    
    .template4-content .invoice-title h2 {
      font-size: 2.25rem;
      font-weight: 800;
      color: #1d4ed8;
      margin: 0;
    }
    
    .template4-content .bill-to-section {
      margin-bottom: 1.5rem;
    }
    
    .template4-content .bill-to-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }
    
    .template4-content .bill-to-name {
      font-weight: bold;
      color: #111827;
    }
    
    .template4-content .bill-to-address {
      font-style: normal;
      color: #4b5563;
      font-size: 0.875rem;
    }
    
    /* Text colors */
    .text-white { color: #ffffff; }
    .text-gray-300 { color: #d1d5db; }
    .text-gray-400 { color: #9ca3af; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-700 { color: #374151; }
    .text-gray-800 { color: #1f2937; }
    .text-gray-900 { color: #111827; }
    .text-blue-600 { color: #2563eb; }
    .text-blue-700 { color: #1d4ed8; }
    
    /* Font sizes */
    .text-xs { font-size: 0.75rem; line-height: 1rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
    
    /* Font weights */
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }
    .font-extrabold { font-weight: 800; }
    
    /* Spacing */
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .m-0 { margin: 0; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-3 { margin-top: 0.75rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    .pb-1 { padding-bottom: 0.25rem; }
    .pt-2 { padding-top: 0.5rem; }
    .pt-6 { padding-top: 1.5rem; }
    
    /* Borders */
    .border { border: 1px solid #d1d5db; }
    .border-b { border-bottom: 1px solid #e5e7eb; }
    .border-t { border-top: 1px solid #e5e7eb; }
    .border-gray-100 { border-color: #f3f4f6; }
    .border-gray-200 { border-color: #e5e7eb; }
    .border-blue-200 { border-color: #dbeafe; }
    .rounded-lg { border-radius: 0.5rem; }
    
    /* Template 4 Specific Styles - Duplicate removed */
    
    /* Grid system */
    .grid { display: grid; }
    .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-cols-5 { grid-template-columns: repeat(5, 1fr); }
    .gap-3 { gap: 0.75rem; }
    .gap-6 { gap: 1.5rem; }
    .gap-8 { gap: 2rem; }
    
    /* Space utilities */
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .space-y-3 > * + * { margin-top: 0.75rem; }
    
    /* Other utilities */
    .italic { font-style: italic; }
    .not-italic { font-style: normal; }
    .uppercase { text-transform: uppercase; }
    .overflow-hidden { overflow: hidden; }
    .min-h-800 { min-height: 800px; }
    
    /* Signature fonts */
    .signature-font,
    .font-signature {
      font-family: 'Dancing Script', 'Great Vibes', 'Allura', cursive !important;
    }
    
    /* Table styles */
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    
    th {
      background-color: #f3f4f6;
      font-weight: 600;
      font-size: 0.875rem;
      color: #6b7280;
      text-transform: uppercase;
    }
    
    /* Template 4 Items Table Styles */
    .items-table-container {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
    }
    
    .items-table .table-header {
      background-color: #f8fafc;
    }
    
    .items-table .item-header {
      text-align: left;
      padding: 1rem 0.75rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      width: 50%;
    }
    
    .items-table .qty-header {
      text-align: center;
      padding: 1rem 0.75rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      width: 15%;
    }
    
    .items-table .rate-header {
      text-align: right;
      padding: 1rem 0.75rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      width: 20%;
    }
    
    .items-table .amount-header {
      text-align: right;
      padding: 1rem 0.75rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      width: 15%;
    }
    
    .items-table .items-row {
      border-bottom: 1px solid #f3f4f6;
    }
    
    .items-table .items-row:hover {
      background-color: #fafbfc;
    }
    
    .items-table .item-description {
      padding: 0.75rem;
      vertical-align: top;
    }
    
    .items-table .item-quantity {
      padding: 0.75rem;
      vertical-align: top;
      text-align: center;
      color: #6b7280;
    }
    
    .items-table .item-rate {
      padding: 0.75rem;
      vertical-align: top;
      text-align: right;
      color: #6b7280;
    }
    
    .items-table .item-total {
      padding: 0.75rem;
      vertical-align: top;
      text-align: right;
      font-weight: 500;
      color: #1f2937;
    }
    
    /* Totals Section for Template 4 */
    .totals-container {
      min-width: 300px;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1.5rem;
    }
    
    .totals-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .totals-row:last-child {
      border-bottom: none;
    }
    
    .total-label {
      font-weight: 500;
      color: #6b7280;
      font-size: 0.875rem;
    }
    
    .total-value {
      font-weight: 500;
      color: #1f2937;
      font-size: 0.875rem;
    }
    
    .discount-value {
      color: #dc2626;
    }
    
    .total-final {
      border-top: 2px solid #e5e7eb;
      padding-top: 1rem;
      margin-top: 0.5rem;
    }
    
    .total-label-final {
      font-weight: 700;
      color: #1f2937;
      font-size: 1rem;
    }
    
    .total-value-final {
      font-weight: 700;
      color: #1f2937;
      font-size: 1.125rem;
    }
    
    .total-words {
      font-style: italic;
      color: #6b7280;
      font-size: 0.75rem;
      text-align: right;
      margin-top: 0.5rem;
    }
    
    /* Ensure single page layout */
    * {
      page-break-inside: avoid;
    }
    
    .template4-container {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .items-table-container {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .totals-container {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    /* Reduce font sizes for better fit */
    .template4-sidebar .sender-name {
      font-size: 1.25rem;
    }
    
    .template4-content .invoice-title h2 {
      font-size: 1.875rem;
    }
    
    .template4-sidebar .invoice-details-title {
      font-size: 1rem;
    }
    
    /* Compact spacing */
    .template4-sidebar .invoice-details-section {
      margin-top: 1rem;
    }
    
    .template4-content .bill-to-section {
      margin-bottom: 1rem;
    }
    
    .template4-content .invoice-title {
      margin-bottom: 1rem;
    }
  `;
}

module.exports = {
  generatePDFFromHTML,
  generateCompleteHTML
};