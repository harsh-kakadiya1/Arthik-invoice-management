const express = require('express');
const router = express.Router();
const { generateInvoicePDF } = require('../controllers/pdfController');

// Generate PDF for invoice
router.post('/generate-pdf', generateInvoicePDF);

module.exports = router;