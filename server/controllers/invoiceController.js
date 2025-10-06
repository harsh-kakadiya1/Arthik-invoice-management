const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Invoice = require('../models/Invoice');

// @desc    Get all invoices for logged in user
// @route   GET /api/v1/invoices
// @access  Private
exports.getInvoices = asyncHandler(async (req, res, next) => {
  let query = { user: req.user.id };

  // Note: Status filtering is handled later in the payment status section

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

  // Filter paid invoices (highest priority)
  if (req.query.paid === 'true') {
    console.log('Setting paid filter - before:', query);
    query.status = 'paid';
    console.log('Setting paid filter - after:', query);
    console.log('Paid filter applied - query.status should be "paid":', query.status);
  }
  // Filter unpaid invoices
  else if (req.query.unpaid === 'true') {
    query.status = { $in: ['draft', 'sent', 'overdue'] };
  }
  // Filter overdue invoices
  else if (req.query.overdue === 'true') {
    query['details.dueDate'] = { $lt: new Date() };
    query.status = { $ne: 'paid' };
  }
  // Filter by specific status (draft, sent, etc.)
  else if (req.query.status) {
    query.status = req.query.status;
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

  console.log('Query being executed:', JSON.stringify(query, null, 2));
  console.log('Sort options:', JSON.stringify(sortBy, null, 2));
  const invoices = await Invoice.find(query).sort(sortBy);
  console.log('Found invoices:', invoices.length);
  console.log('Invoice statuses found:', invoices.map(inv => ({ id: inv._id, status: inv.status, number: inv.invoiceNumber })));

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

  // Check if this is a draft invoice
  const isDraft = req.body.status === 'draft';
  console.log('Creating invoice - isDraft:', isDraft, 'status:', req.body.status);
  console.log('Request body items:', req.body.details?.items);
  console.log('Request body sender:', req.body.sender);

  // For draft invoices, save as-is without any validation or default values
  if (isDraft) {
    console.log('=== DRAFT MODE ===');
    console.log('Saving draft invoice as-is without validation');
    console.log('Draft data received:', {
      sender: req.body.sender,
      receiver: req.body.receiver,
      invoiceNumber: req.body.invoiceNumber,
      items: req.body.details?.items,
      status: req.body.status
    });
    console.log('=== END DRAFT MODE ===');
  } else {
    // For complete invoices, use the existing logic
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
  }

  try {
    let invoice;
    
    if (isDraft) {
      // For drafts, bypass all validation and save as-is
      console.log('=== CREATING DRAFT INVOICE ===');
      console.log('Using direct MongoDB insert to bypass all validation');
      
      // Use direct MongoDB insertion to completely bypass Mongoose validation
      const result = await Invoice.collection.insertOne(req.body);
      console.log('Draft invoice inserted directly into MongoDB:', result.insertedId);
      
      // Fetch the created document to return it
      invoice = await Invoice.findById(result.insertedId);
      console.log('Draft invoice saved successfully!');
    } else {
      // For complete invoices, use full validation
      console.log('Creating complete invoice with full validation');
      invoice = await Invoice.create(req.body);
    }
    
    console.log('Invoice created successfully:', {
      id: invoice._id,
      status: invoice.status,
      invoiceNumber: invoice.invoiceNumber
    });

    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    throw error;
  }
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
    const isDraft = req.body.status === 'draft' || invoice.status === 'draft';
    const { items, discountDetails, gstDetails, shippingDetails } = req.body.details;
    
    let subTotal = 0;
    items.forEach(item => {
      if (isDraft && (!item.quantity || !item.unitPrice)) {
        item.total = 0;
      } else {
        item.total = item.quantity * item.unitPrice;
        subTotal += item.total;
      }
    });

    req.body.details.subTotal = subTotal;

    if (isDraft) {
      // For drafts, just use subtotal
      req.body.details.totalAmount = subTotal;
    } else {
      // For complete invoices, apply all calculations
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
