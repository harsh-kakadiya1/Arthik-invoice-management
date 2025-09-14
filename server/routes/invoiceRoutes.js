const express = require('express');
const {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice
} = require('../controllers/invoiceController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all routes

router
  .route('/')
  .get(getInvoices)
  .post(createInvoice);

router
  .route('/:id')
  .get(getInvoice)
  .put(updateInvoice)
  .delete(deleteInvoice);

module.exports = router;
