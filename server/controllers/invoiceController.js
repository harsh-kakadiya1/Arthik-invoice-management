const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Invoice = require('../models/Invoice');

// @desc    Get all invoices for logged in user
// @route   GET /api/v1/invoices
// @access  Private
exports.getInvoices = asyncHandler(async (req, res, next) => {
  const invoices = await Invoice.find({ user: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: invoices.length,
    data: invoices
  });
});

// @desc    Get single invoice
// @route   GET /api/v1/invoices/:id
// @access  Private
exports.getInvoice = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return next(new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404));
  }

  // Make sure user owns invoice
  if (invoice.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this invoice`, 401));
  }

  res.status(200).json({
    success: true,
    data: invoice
  });
});

// @desc    Create new invoice
// @route   POST /api/v1/invoices
// @access  Private
exports.createInvoice = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Calculate totals
  const { items, discountDetails, gstDetails, shippingDetails } = req.body.details;
  
  // Calculate subtotal
  let subTotal = 0;
  items.forEach(item => {
    item.total = item.quantity * item.unitPrice;
    subTotal += item.total;
  });

  req.body.details.subTotal = subTotal;

  // Calculate total amount
  let totalAmount = subTotal;

  // Apply discount
  if (discountDetails && discountDetails.amount > 0) {
    if (discountDetails.amountType === 'percentage') {
      totalAmount -= (totalAmount * discountDetails.amount) / 100;
    } else {
      totalAmount -= discountDetails.amount;
    }
  }

  // Apply GST (only for exclusive)
  if (gstDetails && gstDetails.rate > 0 && !gstDetails.inclusive) {
    totalAmount += (totalAmount * gstDetails.rate) / 100;
  }

  // Apply shipping
  if (shippingDetails && shippingDetails.cost > 0) {
    if (shippingDetails.costType === 'percentage') {
      totalAmount += (totalAmount * shippingDetails.cost) / 100;
    } else {
      totalAmount += shippingDetails.cost;
    }
  }

  req.body.details.totalAmount = Math.round(totalAmount * 100) / 100;

  const invoice = await Invoice.create(req.body);

  res.status(201).json({
    success: true,
    data: invoice
  });
});

// @desc    Update invoice
// @route   PUT /api/v1/invoices/:id
// @access  Private
exports.updateInvoice = asyncHandler(async (req, res, next) => {
  let invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return next(new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404));
  }

  // Make sure user owns invoice
  if (invoice.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this invoice`, 401));
  }

  // Recalculate totals if items are being updated
  if (req.body.details && req.body.details.items) {
    const { items, discountDetails, gstDetails, shippingDetails } = req.body.details;
    
    let subTotal = 0;
    items.forEach(item => {
      item.total = item.quantity * item.unitPrice;
      subTotal += item.total;
    });

    req.body.details.subTotal = subTotal;

    let totalAmount = subTotal;

    if (discountDetails && discountDetails.amount > 0) {
      if (discountDetails.amountType === 'percentage') {
        totalAmount -= (totalAmount * discountDetails.amount) / 100;
      } else {
        totalAmount -= discountDetails.amount;
      }
    }

    if (gstDetails && gstDetails.rate > 0 && !gstDetails.inclusive) {
      totalAmount += (totalAmount * gstDetails.rate) / 100;
    }

    if (shippingDetails && shippingDetails.cost > 0) {
      if (shippingDetails.costType === 'percentage') {
        totalAmount += (totalAmount * shippingDetails.cost) / 100;
      } else {
        totalAmount += shippingDetails.cost;
      }
    }

    req.body.details.totalAmount = Math.round(totalAmount * 100) / 100;
  }

  invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: invoice
  });
});

// @desc    Delete invoice
// @route   DELETE /api/v1/invoices/:id
// @access  Private
exports.deleteInvoice = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return next(new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404));
  }

  // Make sure user owns invoice
  if (invoice.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this invoice`, 401));
  }

  await invoice.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
