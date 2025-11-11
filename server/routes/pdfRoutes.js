const express = require('express');
const router = express.Router();
const { generateInvoicePDF } = require('../controllers/pdfController');
const { protect } = require('../middleware/auth');

// Generate PDF for invoice (protected route)
router.post('/generate-pdf', protect, generateInvoicePDF);

module.exports = router;