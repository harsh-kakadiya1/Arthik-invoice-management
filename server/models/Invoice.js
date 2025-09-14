const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: [true, 'Please add an invoice number'],
    unique: true
  },
  sender: {
    name: {
      type: String,
      required: [true, 'Please add sender name']
    },
    email: {
      type: String,
      required: [true, 'Please add sender email']
    },
    phone: String,
    address: String,
    city: String,
    zipCode: String,
    country: String
  },
  receiver: {
    name: {
      type: String,
      required: [true, 'Please add receiver name']
    },
    email: String,
    phone: String,
    address: String,
    city: String,
    zipCode: String,
    country: String
  },
  details: {
    invoiceDate: {
      type: Date,
      required: [true, 'Please add invoice date'],
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: [true, 'Please add due date']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    items: [{
      name: {
        type: String,
        required: [true, 'Please add item name']
      },
      description: String,
      quantity: {
        type: Number,
        required: [true, 'Please add quantity'],
        min: 1
      },
      unitPrice: {
        type: Number,
        required: [true, 'Please add unit price'],
        min: 0
      },
      total: {
        type: Number,
        required: true
      }
    }],
    subTotal: {
      type: Number,
      required: true
    },
    discountDetails: {
      amount: {
        type: Number,
        default: 0
      },
      amountType: {
        type: String,
        enum: ['amount', 'percentage'],
        default: 'amount'
      }
    },
    taxDetails: {
      amount: {
        type: Number,
        default: 0
      },
      amountType: {
        type: String,
        enum: ['amount', 'percentage'],
        default: 'percentage'
      }
    },
    shippingDetails: {
      cost: {
        type: Number,
        default: 0
      },
      costType: {
        type: String,
        enum: ['amount', 'percentage'],
        default: 'amount'
      }
    },
    totalAmount: {
      type: Number,
      required: true
    },
    totalAmountInWords: String,
    additionalNotes: String,
    paymentTerms: String,
    paymentInformation: {
      bankName: String,
      accountName: String,
      accountNumber: String
    },
    signature: {
      data: String,
      fontFamily: String
    },
    invoiceLogo: String
  },
  template: {
    type: String,
    enum: ['template1', 'template2', 'template3', 'template4'],
    default: 'template1'
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
InvoiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
