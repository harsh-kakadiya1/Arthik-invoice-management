const { formatNumberWithCommas, isDataUrl } = require('./helpers');

/**
 * Render invoice template to HTML based on template selection
 * @param {Object} invoiceData - Invoice data containing all form values
 * @returns {string} HTML string of the rendered template
 */
const renderInvoiceTemplate = (invoiceData) => {
  const { sender, receiver, details, template } = invoiceData;
  
  // Determine template based on selection (support both templateId and template)
  let templateId = details.templateId || template || 'template1';
  
  // Convert template string to number for switch statement
  if (typeof templateId === 'string') {
    templateId = parseInt(templateId.replace('template', '')) || 1;
  }
  
  console.log('🎨 Rendering template:', templateId, 'from data:', { templateIdFromDetails: details.templateId, templateFromRoot: template });
  
  switch (templateId) {
    case 1:
      return renderTemplate1(invoiceData);
    case 2:
      return renderTemplate2(invoiceData);
    case 3:
      return renderTemplate3(invoiceData);
    case 4:
      return renderTemplate4(invoiceData);
    default:
      return renderTemplate1(invoiceData);
  }
};

/**
 * Template 1 - Classic Layout
 */
const renderTemplate1 = ({ sender, receiver, details }) => {
  const itemsHTML = details.items.map(item => `
    <div class="grid grid-cols-3 grid-cols-5 gap-y-1">
      <div class="col-span-full col-span-2 border-b border-gray-300">
        <p class="font-medium text-gray-800">${item.name}</p>
      </div>
      <div class="border-b border-gray-300">
        <p class="text-gray-800">${item.quantity}</p>
      </div>
      <div class="border-b border-gray-300">
        <p class="text-gray-800">${formatNumberWithCommas(item.unitPrice)} ${details.currency}</p>
      </div>
      <div class="border-b border-gray-300">
        <p class="text-right text-gray-800">${formatNumberWithCommas(item.total)} ${details.currency}</p>
      </div>
    </div>
  `).join('');

  return `
    <div>
      <div class="flex justify-between">
        <div>
          ${details.invoiceLogo ? `<img src="${details.invoiceLogo}" width="140" height="100" alt="Logo of ${sender.name}" />` : ''}
          <h1 class="mt-2 text-lg text-xl font-semibold text-blue-600">${sender.name}</h1>
        </div>
        <div class="text-right">
          <h2 class="text-2xl text-3xl font-semibold text-gray-800">Invoice #</h2>
          <span class="mt-1 block text-gray-500">${details.invoiceNumber}</span>
          <address class="mt-4 not-italic text-gray-800">
            ${sender.address}<br />
            ${sender.zipCode}, ${sender.city}<br />
            ${sender.country}<br />
          </address>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Bill to:</h3>
          <h3 class="text-lg font-semibold text-gray-800">${receiver.name}</h3>
          <address class="mt-2 not-italic text-gray-500">
            ${receiver.address ? receiver.address : ''}${receiver.zipCode ? `, ${receiver.zipCode}` : ''}<br />
            ${receiver.city}, ${receiver.country}<br />
          </address>
        </div>
        <div class="text-right space-y-2">
          <div class="grid grid-cols-1 gap-3 gap-2">
            <dl class="grid grid-cols-6 gap-x-3">
              <dt class="col-span-3 font-semibold text-gray-800">Invoice date:</dt>
              <dd class="col-span-3 text-gray-500">${new Date(details.invoiceDate).toLocaleDateString("en-US")}</dd>
            </dl>
            <dl class="grid grid-cols-6 gap-x-3">
              <dt class="col-span-3 font-semibold text-gray-800">Due date:</dt>
              <dd class="col-span-3 text-gray-500">${new Date(details.dueDate).toLocaleDateString("en-US")}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="mt-3">
        <div class="border border-gray-200 p-1 rounded-lg space-y-1">
          <div class="hidden grid grid-cols-5">
            <div class="col-span-2 text-xs font-medium text-gray-500 uppercase">Item</div>
            <div class="text-left text-xs font-medium text-gray-500 uppercase">Qty</div>
            <div class="text-left text-xs font-medium text-gray-500 uppercase">Rate</div>
            <div class="text-right text-xs font-medium text-gray-500 uppercase">Amount</div>
          </div>
          <div class="hidden block border-b border-gray-200"></div>
          ${itemsHTML}
          <div class="hidden border-b border-gray-200"></div>
        </div>
      </div>

      <div class="mt-2 flex justify-end">
        <div class="text-right space-y-2">
          <div class="grid grid-cols-1 gap-3 gap-2">
            <dl class="grid grid-cols-5 gap-x-3">
              <dt class="col-span-3 font-semibold text-gray-800">Subtotal:</dt>
              <dd class="col-span-2 text-gray-500">${formatNumberWithCommas(Number(details.subTotal))} ${details.currency}</dd>
            </dl>
            ${details.discountDetails?.amount > 0 ? `
              <dl class="grid grid-cols-5 gap-x-3">
                <dt class="col-span-3 font-semibold text-gray-800">Discount:</dt>
                <dd class="col-span-2 text-gray-500">
                  ${details.discountDetails.amountType === "amount" 
                    ? `- ${formatNumberWithCommas(details.discountDetails.amount)} ${details.currency}`
                    : `- ${details.discountDetails.amount}%`}
                </dd>
              </dl>
            ` : ''}
            ${details.taxDetails?.amount > 0 ? `
              <dl class="grid grid-cols-5 gap-x-3">
                <dt class="col-span-3 font-semibold text-gray-800">Tax:</dt>
                <dd class="col-span-2 text-gray-500">
                  ${details.taxDetails.amountType === "amount"
                    ? `+ ${formatNumberWithCommas(details.taxDetails.amount)} ${details.currency}`
                    : `+ ${details.taxDetails.amount}%`}
                </dd>
              </dl>
            ` : ''}
            ${details.shippingDetails?.cost > 0 ? `
              <dl class="grid grid-cols-5 gap-x-3">
                <dt class="col-span-3 font-semibold text-gray-800">Shipping:</dt>
                <dd class="col-span-2 text-gray-500">
                  ${details.shippingDetails.costType === "amount"
                    ? `+ ${formatNumberWithCommas(details.shippingDetails.cost)} ${details.currency}`
                    : `+ ${details.shippingDetails.cost}%`}
                </dd>
              </dl>
            ` : ''}
            <dl class="grid grid-cols-5 gap-x-3">
              <dt class="col-span-3 font-semibold text-gray-800">Total:</dt>
              <dd class="col-span-2 text-gray-500">${formatNumberWithCommas(Number(details.totalAmount))} ${details.currency}</dd>
            </dl>
            ${details.totalAmountInWords ? `
              <dl class="grid grid-cols-5 gap-x-3">
                <dt class="col-span-3 font-semibold text-gray-800">Total in words:</dt>
                <dd class="col-span-2 text-gray-500"><em>${details.totalAmountInWords} ${details.currency}</em></dd>
              </dl>
            ` : ''}
          </div>
        </div>
      </div>

      <div>
        <div class="my-4">
          ${details.additionalNotes ? `
            <div class="my-2">
              <p class="font-semibold text-blue-600">Additional notes:</p>
              <p class="font-regular text-gray-800">${details.additionalNotes}</p>
            </div>
          ` : ''}
          ${details.paymentTerms ? `
            <div class="my-2">
              <p class="font-semibold text-blue-600">Payment terms:</p>
              <p class="font-regular text-gray-800">${details.paymentTerms}</p>
            </div>
          ` : ''}
          ${details.paymentInformation?.bankName ? `
            <div class="my-2">
              <span class="font-semibold text-md text-gray-800">
                Please send the payment to this address
                <p class="text-sm">Bank: ${details.paymentInformation.bankName}</p>
                <p class="text-sm">Account name: ${details.paymentInformation.accountName}</p>
                <p class="text-sm">Account no: ${details.paymentInformation.accountNumber}</p>
              </span>
            </div>
          ` : ''}
        </div>
        <p class="text-gray-500 text-sm">
          If you have any questions concerning this invoice, use the following contact information:
        </p>
        <div>
          <p class="block text-sm font-medium text-gray-800">${sender.email}</p>
          <p class="block text-sm font-medium text-gray-800">${sender.phone}</p>
        </div>
      </div>

      ${details?.signature?.data ? `
        <div class="mt-6">
          <p class="font-semibold text-gray-800">Signature:</p>
          ${isDataUrl(details.signature.data) ? `
            <img src="${details.signature.data}" width="120" height="60" alt="Signature of ${sender.name}" style="max-width: 120px; height: auto;" />
          ` : `
            <p class="signature-font" style="font-size: 30px; font-weight: 400; color: black; font-family: '${details.signature.fontFamily || 'cursive'}', cursive;">
              ${details.signature.data}
            </p>
          `}
        </div>
      ` : ''}
    </div>
  `;
};

/**
 * Template 4 - Sidebar Layout (Your main template) - ENHANCED VERSION
 */
const renderTemplate4 = ({ sender, receiver, details }) => {
  const itemsHTML = details.items.map(item => `
    <tr class="items-row">
      <td class="item-description">
        <div class="font-medium text-gray-800">${item.name}</div>
      </td>
      <td class="item-quantity text-center">${item.quantity}</td>
      <td class="item-rate text-right">${formatNumberWithCommas(item.unitPrice)} ${details.currency}</td>
      <td class="item-total text-right font-medium">${formatNumberWithCommas(item.total)} ${details.currency}</td>
    </tr>
  `).join('');

  return `
    <div class="template4-container">
      <!-- Left Sidebar for Sender Info -->
      <div class="template4-sidebar">
        <div>
          ${details.invoiceLogo ? `
            <img src="${details.invoiceLogo}" width="100" height="70" alt="Logo of ${sender.name}" class="logo-img" />
          ` : ''}
          <h1 class="sender-name">${sender.name}</h1>
          <address class="sender-address">
            ${sender.address}, ${sender.zipCode}<br />
            ${sender.city}, ${sender.country}
          </address>
          <p class="sender-contact">Email: ${sender.email}</p>
          <p class="sender-contact">Phone: ${sender.phone}</p>
        </div>

        <div class="invoice-details-section">
          <h3 class="invoice-details-title">Invoice Details:</h3>
          <div class="invoice-details-list">
            <div class="invoice-detail-item">
              <span class="invoice-detail-label">Invoice #:</span>
              <span class="invoice-detail-value">${details.invoiceNumber}</span>
            </div>
            <div class="invoice-detail-item">
              <span class="invoice-detail-label">Invoice Date:</span>
              <span class="invoice-detail-value">${new Date(details.invoiceDate).toLocaleDateString("en-US")}</span>
            </div>
            <div class="invoice-detail-item">
              <span class="invoice-detail-label">Due Date:</span>
              <span class="invoice-detail-value">${new Date(details.dueDate).toLocaleDateString("en-US")}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Main Content -->
      <div class="template4-content">
        <div>
          <div class="invoice-title">
            <h2>INVOICE</h2>
          </div>

          <!-- Bill To -->
          <div class="bill-to-section">
            <h3 class="bill-to-title">Bill To:</h3>
            <h4 class="bill-to-name">${receiver.name}</h4>
            <address class="bill-to-address">
              ${receiver.address}<br />
              ${receiver.zipCode}, ${receiver.city}<br />
              ${receiver.country}
            </address>
          </div>

          <!-- Items Table -->
          <div class="mt-8">
            <div class="items-table-container">
              <table class="items-table">
                <thead>
                  <tr class="table-header">
                    <th class="item-header">Description</th>
                    <th class="qty-header">Qty</th>
                    <th class="rate-header">Rate</th>
                    <th class="amount-header">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Totals Summary -->
          <div class="mt-6 flex justify-end">
            <div class="totals-container">
              <div class="totals-row">
                <span class="total-label">Subtotal:</span>
                <span class="total-value">${formatNumberWithCommas(Number(details.subTotal))} ${details.currency}</span>
              </div>
              ${details.discountDetails?.amount > 0 ? `
                <div class="totals-row">
                  <span class="total-label">Discount:</span>
                  <span class="total-value discount-value">
                    ${details.discountDetails.amountType === "amount"
                      ? `- ${formatNumberWithCommas(details.discountDetails.amount)} ${details.currency}`
                      : `- ${details.discountDetails.amount}%`}
                  </span>
                </div>
              ` : ''}
              ${details.taxDetails?.amount > 0 ? `
                <div class="totals-row">
                  <span class="total-label">Tax:</span>
                  <span class="total-value">
                    ${details.taxDetails.amountType === "amount"
                      ? `+ ${formatNumberWithCommas(details.taxDetails.amount)} ${details.currency}`
                      : `+ ${details.taxDetails.amount}%`}
                  </span>
                </div>
              ` : ''}
              ${details.shippingDetails?.cost > 0 ? `
                <div class="totals-row">
                  <span class="total-label">Shipping:</span>
                  <span class="total-value">
                    ${details.shippingDetails.costType === "amount"
                      ? `+ ${formatNumberWithCommas(details.shippingDetails.cost)} ${details.currency}`
                      : `+ ${details.shippingDetails.cost}%`}
                  </span>
                </div>
              ` : ''}
              <div class="totals-row total-final">
                <span class="total-label-final">Total:</span>
                <span class="total-value-final">${formatNumberWithCommas(Number(details.totalAmount))} ${details.currency}</span>
              </div>
              ${details.totalAmountInWords ? `
                <div class="total-words">(${details.totalAmountInWords} ${details.currency})</div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Footer Notes and Signature -->
        <div class="mt-8 border-t border-gray-200 pt-6">
          ${details.additionalNotes ? `
            <div class="mb-4">
              <p class="font-semibold text-gray-800">Notes:</p>
              <p class="text-sm text-gray-600">${details.additionalNotes}</p>
            </div>
          ` : ''}
          ${details.paymentTerms ? `
            <div class="mb-4">
              <p class="font-semibold text-gray-800">Payment Terms:</p>
              <p class="text-sm text-gray-600">${details.paymentTerms}</p>
            </div>
          ` : ''}
          ${details.paymentInformation?.bankName ? `
            <div class="mb-4">
              <p class="font-semibold text-gray-800">Payment Information:</p>
              <div class="text-sm text-gray-600">
                <p>Bank: ${details.paymentInformation.bankName}</p>
                <p>Account Name: ${details.paymentInformation.accountName}</p>
                <p>Account Number: ${details.paymentInformation.accountNumber}</p>
              </div>
            </div>
          ` : ''}
          ${details?.signature?.data ? `
            <div class="mt-6">
              <p class="font-semibold text-gray-800 mb-1">Signature:</p>
              ${isDataUrl(details.signature.data) ? `
                <img src="${details.signature.data}" width="120" height="60" alt="Signature of ${sender.name}" class="border-b border-gray-300 pb-1" style="max-width: 120px; height: auto;" />
              ` : `
                <p class="signature-font border-b border-gray-300 pb-1 inline-block" style="font-size: 30px; font-weight: 400; color: black; font-family: '${details.signature.fontFamily || 'cursive'}', cursive;">
                  ${details.signature.data}
                </p>
              `}
            </div>
          ` : ''}
          <p class="text-xs text-gray-500 mt-6 text-center">Thank you for your business!</p>
        </div>
      </div>
    </div>
  `;
};

/**
 * Template 2 - Clean Layout (placeholder - you can implement based on your template)
 */
const renderTemplate2 = (invoiceData) => {
  // You can implement this similar to template 1 but with template 2 styles
  return renderTemplate1(invoiceData); // Fallback to template 1 for now
};

/**
 * Template 3 - Boxed Layout (placeholder - you can implement based on your template)
 */
const renderTemplate3 = (invoiceData) => {
  // You can implement this similar to template 1 but with template 3 styles
  return renderTemplate1(invoiceData); // Fallback to template 1 for now
};

module.exports = {
  renderInvoiceTemplate
};