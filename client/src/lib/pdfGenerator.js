// Simple PDF generation utility without external dependencies
// This creates a basic PDF download functionality

export const generatePDF = async (invoiceData) => {
  try {
    // Create a new window with the invoice content
    const printWindow = window.open('', '_blank');
    
    // Generate HTML content for the invoice
    const htmlContent = generateInvoiceHTML(invoiceData);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
              color: black;
            }
            .invoice-container { 
              max-width: 800px; 
              margin: 0 auto; 
              background: white;
              padding: 20px;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #1B9AAA;
              padding-bottom: 20px;
            }
            .company-info h1 { 
              color: #1B9AAA; 
              margin: 0; 
              font-size: 28px;
            }
            .invoice-info { 
              text-align: right; 
            }
            .invoice-info h2 { 
              color: #333; 
              margin: 0 0 10px 0; 
            }
            .parties { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 30px; 
            }
            .party { 
              width: 45%; 
            }
            .party h3 { 
              color: #1B9AAA; 
              border-bottom: 1px solid #ddd; 
              padding-bottom: 5px;
            }
            .items-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 20px; 
            }
            .items-table th, .items-table td { 
              border: 1px solid #ddd; 
              padding: 12px; 
              text-align: left; 
            }
            .items-table th { 
              background-color: #1B9AAA; 
              color: white; 
            }
            .items-table tr:nth-child(even) { 
              background-color: #f9f9f9; 
            }
            .totals { 
              float: right; 
              width: 300px; 
              margin-top: 20px;
            }
            .totals table { 
              width: 100%; 
              border-collapse: collapse; 
            }
            .totals td { 
              padding: 8px; 
              border-bottom: 1px solid #ddd; 
            }
            .total-row { 
              font-weight: bold; 
              background-color: #1B9AAA; 
              color: white; 
            }
            .signature { 
              margin-top: 50px; 
              text-align: right; 
            }
            .signature-text { 
              font-family: 'Great Vibes', cursive; 
              font-size: 24px; 
              margin-bottom: 5px;
            }
            @media print {
              body { margin: 0; }
              .invoice-container { padding: 0; }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet">
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};

const generateInvoiceHTML = (invoiceData) => {
  const { sender, receiver, details, invoiceNumber } = invoiceData;
  
  // Ensure we have valid data
  const safeSender = sender || {};
  const safeReceiver = receiver || {};
  const safeDetails = details || {};
  const safeItems = safeDetails.items || [];
  
  // Calculate totals
  const subtotal = safeItems.reduce((sum, item) => {
    const quantity = item.quantity || 0;
    const unitPrice = item.unitPrice || 0;
    return sum + (quantity * unitPrice);
  }, 0);
  
  const discountAmount = safeDetails.discountDetails?.amountType === 'percentage' 
    ? (subtotal * (safeDetails.discountDetails.amount || 0) / 100)
    : (safeDetails.discountDetails?.amount || 0);
    
  const taxAmount = safeDetails.taxDetails?.amountType === 'percentage'
    ? ((subtotal - discountAmount) * (safeDetails.taxDetails.amount || 0) / 100)
    : (safeDetails.taxDetails?.amount || 0);
    
  const shippingAmount = safeDetails.shippingDetails?.costType === 'percentage'
    ? (subtotal * (safeDetails.shippingDetails.cost || 0) / 100)
    : (safeDetails.shippingDetails?.cost || 0);
    
  const total = subtotal - discountAmount + taxAmount + shippingAmount;

  return `
    <div class="invoice-container">
      <div class="header">
        <div class="company-info">
          <h1>${safeSender.name || 'Company Name'}</h1>
          <p>${safeSender.address || ''}<br>
          ${safeSender.city || ''}, ${safeSender.zipCode || ''}<br>
          ${safeSender.country || ''}</p>
          <p>Email: ${safeSender.email || ''}<br>
          Phone: ${safeSender.phone || ''}</p>
        </div>
        <div class="invoice-info">
          <h2>INVOICE</h2>
          <p><strong>Invoice #:</strong> ${invoiceNumber || 'N/A'}</p>
          <p><strong>Date:</strong> ${safeDetails.invoiceDate ? new Date(safeDetails.invoiceDate).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Due Date:</strong> ${safeDetails.dueDate ? new Date(safeDetails.dueDate).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>

      <div class="parties">
        <div class="party">
          <h3>Bill To:</h3>
          <p><strong>${safeReceiver.name || 'Client Name'}</strong><br>
          ${safeReceiver.address || ''}<br>
          ${safeReceiver.city ? safeReceiver.city + ', ' : ''}${safeReceiver.zipCode || ''}<br>
          ${safeReceiver.country || ''}</p>
          ${safeReceiver.email ? `<p>Email: ${safeReceiver.email}</p>` : ''}
          ${safeReceiver.phone ? `<p>Phone: ${safeReceiver.phone}</p>` : ''}
        </div>
        <div class="party">
          <h3>Payment Terms:</h3>
          <p>${safeDetails.paymentTerms || 'Net 30'}</p>
          ${safeDetails.paymentInformation?.bankName ? `
            <h3>Payment Information:</h3>
            <p><strong>Bank:</strong> ${safeDetails.paymentInformation.bankName}<br>
            <strong>Account:</strong> ${safeDetails.paymentInformation.accountName}<br>
            <strong>Account #:</strong> ${safeDetails.paymentInformation.accountNumber}</p>
          ` : ''}
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${safeItems.map(item => `
            <tr>
              <td>
                <strong>${item.name || 'Item'}</strong>
                ${item.description ? `<br><small>${item.description}</small>` : ''}
              </td>
              <td>${item.quantity || 0}</td>
              <td>${(item.unitPrice || 0).toFixed(2)} ${safeDetails.currency || 'USD'}</td>
              <td>${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)} ${safeDetails.currency || 'USD'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <table>
          <tr>
            <td>Subtotal:</td>
            <td>${subtotal.toFixed(2)} ${safeDetails.currency || 'USD'}</td>
          </tr>
          ${discountAmount > 0 ? `
            <tr>
              <td>Discount:</td>
              <td>-${discountAmount.toFixed(2)} ${safeDetails.currency || 'USD'}</td>
            </tr>
          ` : ''}
          ${taxAmount > 0 ? `
            <tr>
              <td>Tax:</td>
              <td>${taxAmount.toFixed(2)} ${safeDetails.currency || 'USD'}</td>
            </tr>
          ` : ''}
          ${shippingAmount > 0 ? `
            <tr>
              <td>Shipping:</td>
              <td>${shippingAmount.toFixed(2)} ${safeDetails.currency || 'USD'}</td>
            </tr>
          ` : ''}
          <tr class="total-row">
            <td><strong>Total:</strong></td>
            <td><strong>${total.toFixed(2)} ${safeDetails.currency || 'USD'}</strong></td>
          </tr>
        </table>
      </div>

      <div style="clear: both;"></div>

      ${safeDetails.additionalNotes ? `
        <div style="margin-top: 30px;">
          <h3>Notes:</h3>
          <p>${safeDetails.additionalNotes}</p>
        </div>
      ` : ''}

      ${safeDetails.signature?.data ? `
        <div class="signature">
          <div class="signature-text" style="font-family: '${safeDetails.signature.fontFamily || 'Great Vibes'}', cursive;">
            ${safeDetails.signature.data}
          </div>
          <div style="border-top: 1px solid #333; width: 200px; margin-left: auto; margin-top: 5px;"></div>
          <small>Authorized Signature</small>
        </div>
      ` : ''}
    </div>
  `;
};
