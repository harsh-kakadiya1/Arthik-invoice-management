const Client = require('../models/Client');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    Get all clients for a user
// @route   GET /api/clients
// @access  Private
exports.getClients = asyncHandler(async (req, res, next) => {
  const clients = await Client.find({ userId: req.user.id }).sort({ name: 1 });
  
  res.status(200).json({
    success: true,
    count: clients.length,
    data: clients
  });
});

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
exports.getClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!client) {
    return next(new ErrorResponse('Client not found', 404));
  }

  res.status(200).json({
    success: true,
    data: client
  });
});

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
exports.createClient = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.userId = req.user.id;

  const client = await Client.create(req.body);

  res.status(201).json({
    success: true,
    data: client
  });
});

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = asyncHandler(async (req, res, next) => {
  let client = await Client.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!client) {
    return next(new ErrorResponse('Client not found', 404));
  }

  // Make sure user is client owner
  if (client.userId.toString() !== req.user.id) {
    return next(new ErrorResponse('User not authorized to update this client', 401));
  }

  client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: client
  });
});

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
exports.deleteClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!client) {
    return next(new ErrorResponse('Client not found', 404));
  }

  // Make sure user is client owner
  if (client.userId.toString() !== req.user.id) {
    return next(new ErrorResponse('User not authorized to delete this client', 401));
  }

  await client.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Search clients by name
// @route   GET /api/clients/search?q=query
// @access  Private
exports.searchClients = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q || q.trim().length < 1) {
    return res.status(200).json({
      success: true,
      count: 0,
      data: []
    });
  }

  const clients = await Client.find({
    userId: req.user.id,
    name: { $regex: q, $options: 'i' }
  }).limit(10).sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: clients.length,
    data: clients
  });
});
