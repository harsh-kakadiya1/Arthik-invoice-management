const asyncHandler = require('../middleware/asyncHandler');
const { generatePDFFromHTML, generateCompleteHTML } = require('../utils/pdfGenerator');
const { renderInvoiceTemplate } = require('../utils/templateRenderer');

// @desc    Generate PDF from invoice data
// @route   POST /api/invoice/generate-pdf
// @access  Private
const generateInvoicePDF = asyncHandler(async (req, res) => {
  try {
    const invoiceData = req.body;

    if (!invoiceData) {
      return res.status(400).json({
        success: false,
        message: 'Invoice data is required'
      });
    }

    console.log('📋 Generating PDF for invoice:', invoiceData.details?.invoiceNumber);
    console.log('🎨 Template ID selected:', invoiceData.details?.templateId);

    // Render the invoice template to HTML
    const templateHTML = renderInvoiceTemplate(invoiceData);
    
    // Generate complete HTML document
    const completeHTML = generateCompleteHTML(templateHTML, invoiceData);
    
    // Generate PDF from HTML
    const pdfBuffer = await generatePDFFromHTML(completeHTML);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceData.details?.invoiceNumber || 'download'}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);

    console.log('✅ PDF generated successfully');

  } catch (error) {
    console.error('❌ PDF generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message
    });
  }
});

module.exports = {
  generateInvoicePDF
};