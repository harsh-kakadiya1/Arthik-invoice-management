const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Invoice = require('../models/Invoice');

// @desc    Get all invoices for logged in user
// @route   GET /api/v1/invoices
// @access  Private
exports.getInvoices = asyncHandler(async (req, res, next) => {
  let query = { user: req.user.id };

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by date range
  if (req.query.startDate || req.query.endDate) {
    query['details.invoiceDate'] = {};
    if (req.query.startDate) {
      query['details.invoiceDate'].$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      query['details.invoiceDate'].$lte = new Date(req.query.endDate);
    }
  }

  // Filter by due date range
  if (req.query.dueStartDate || req.query.dueEndDate) {
    query['details.dueDate'] = {};
    if (req.query.dueStartDate) {
      query['details.dueDate'].$gte = new Date(req.query.dueStartDate);
    }
    if (req.query.dueEndDate) {
      query['details.dueDate'].$lte = new Date(req.query.dueEndDate);
    }
  }

  // Filter by amount range
  if (req.query.minAmount || req.query.maxAmount) {
    query['details.totalAmount'] = {};
    if (req.query.minAmount) {
      query['details.totalAmount'].$gte = parseFloat(req.query.minAmount);
    }
    if (req.query.maxAmount) {
      query['details.totalAmount'].$lte = parseFloat(req.query.maxAmount);
    }
  }

  // Filter by client name (case insensitive)
  if (req.query.clientName) {
    query['receiver.name'] = { $regex: req.query.clientName, $options: 'i' };
  }

  // Filter by invoice number
  if (req.query.invoiceNumber) {
    query.invoiceNumber = { $regex: req.query.invoiceNumber, $options: 'i' };
  }

  // Filter overdue invoices
  if (req.query.overdue === 'true') {
    query['details.dueDate'] = { $lt: new Date() };
    query.status = { $ne: 'paid' };
  }

  // Filter paid invoices
  if (req.query.paid === 'true') {
    query.status = 'paid';
  }

  // Filter unpaid invoices
  if (req.query.unpaid === 'true') {
    query.status = { $in: ['draft', 'sent', 'overdue'] };
  }

  // Sort options
  let sortBy = { createdAt: -1 }; // default sort
  if (req.query.sortBy) {
    const sortField = req.query.sortBy;
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'invoiceDate':
        sortBy = { 'details.invoiceDate': sortOrder };
        break;
      case 'dueDate':
        sortBy = { 'details.dueDate': sortOrder };
        break;
      case 'amount':
        sortBy = { 'details.totalAmount': sortOrder };
        break;
      case 'status':
        sortBy = { status: sortOrder };
        break;
      case 'client':
        sortBy = { 'receiver.name': sortOrder };
        break;
      default:
        sortBy = { createdAt: sortOrder };
    }
  }

  const invoices = await Invoice.find(query).sort(sortBy);

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
