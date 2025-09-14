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
  
  // Calculate totals
  const subtotal = details.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const discountAmount = details.discountDetails?.amountType === 'percentage' 
    ? (subtotal * details.discountDetails.amount / 100)
    : (details.discountDetails?.amount || 0);
  const taxAmount = details.taxDetails?.amountType === 'percentage'
    ? ((subtotal - discountAmount) * details.taxDetails.amount / 100)
    : (details.taxDetails?.amount || 0);
  const shippingAmount = details.shippingDetails?.costType === 'percentage'
    ? (subtotal * details.shippingDetails.cost / 100)
    : (details.shippingDetails?.cost || 0);
  const total = subtotal - discountAmount + taxAmount + shippingAmount;

  return `
    <div class="invoice-container">
      <div class="header">
        <div class="company-info">
          <h1>${sender.name}</h1>
          <p>${sender.address}<br>
          ${sender.city}, ${sender.zipCode}<br>
          ${sender.country}</p>
          <p>Email: ${sender.email}<br>
          Phone: ${sender.phone}</p>
        </div>
        <div class="invoice-info">
          <h2>INVOICE</h2>
          <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
          <p><strong>Date:</strong> ${new Date(details.invoiceDate).toLocaleDateString()}</p>
          <p><strong>Due Date:</strong> ${new Date(details.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div class="parties">
        <div class="party">
          <h3>Bill To:</h3>
          <p><strong>${receiver.name}</strong><br>
          ${receiver.address || ''}<br>
          ${receiver.city ? receiver.city + ', ' : ''}${receiver.zipCode || ''}<br>
          ${receiver.country || ''}</p>
          ${receiver.email ? `<p>Email: ${receiver.email}</p>` : ''}
          ${receiver.phone ? `<p>Phone: ${receiver.phone}</p>` : ''}
        </div>
        <div class="party">
          <h3>Payment Terms:</h3>
          <p>${details.paymentTerms || 'Net 30'}</p>
          ${details.paymentInformation?.bankName ? `
            <h3>Payment Information:</h3>
            <p><strong>Bank:</strong> ${details.paymentInformation.bankName}<br>
            <strong>Account:</strong> ${details.paymentInformation.accountName}<br>
            <strong>Account #:</strong> ${details.paymentInformation.accountNumber}</p>
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
          ${details.items.map(item => `
            <tr>
              <td>
                <strong>${item.name}</strong>
                ${item.description ? `<br><small>${item.description}</small>` : ''}
              </td>
              <td>${item.quantity}</td>
              <td>${item.unitPrice.toFixed(2)} ${details.currency}</td>
              <td>${(item.quantity * item.unitPrice).toFixed(2)} ${details.currency}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <table>
          <tr>
            <td>Subtotal:</td>
            <td>${subtotal.toFixed(2)} ${details.currency}</td>
          </tr>
          ${discountAmount > 0 ? `
            <tr>
              <td>Discount:</td>
              <td>-${discountAmount.toFixed(2)} ${details.currency}</td>
            </tr>
          ` : ''}
          ${taxAmount > 0 ? `
            <tr>
              <td>Tax:</td>
              <td>${taxAmount.toFixed(2)} ${details.currency}</td>
            </tr>
          ` : ''}
          ${shippingAmount > 0 ? `
            <tr>
              <td>Shipping:</td>
              <td>${shippingAmount.toFixed(2)} ${details.currency}</td>
            </tr>
          ` : ''}
          <tr class="total-row">
            <td><strong>Total:</strong></td>
            <td><strong>${total.toFixed(2)} ${details.currency}</strong></td>
          </tr>
        </table>
      </div>

      <div style="clear: both;"></div>

      ${details.additionalNotes ? `
        <div style="margin-top: 30px;">
          <h3>Notes:</h3>
          <p>${details.additionalNotes}</p>
        </div>
      ` : ''}

      ${details.signature?.data ? `
        <div class="signature">
          <div class="signature-text" style="font-family: '${details.signature.fontFamily || 'Great Vibes'}', cursive;">
            ${details.signature.data}
          </div>
          <div style="border-top: 1px solid #333; width: 200px; margin-left: auto; margin-top: 5px;"></div>
          <small>Authorized Signature</small>
        </div>
      ` : ''}
    </div>
  `;
};
