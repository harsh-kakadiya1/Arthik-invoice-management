// Date formatting options
export const DATE_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

// Currency options
export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'INR', label: 'INR (₹)', symbol: '₹' },
  { value: 'CAD', label: 'CAD (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'AUD (A$)', symbol: 'A$' },
];

// Invoice templates
export const INVOICE_TEMPLATES = [
  { id: 'template1', name: 'Classic Blue', description: 'Clean and professional design' },
  { id: 'template2', name: 'Modern Minimal', description: 'Minimalist layout with focus on content' },
  { id: 'template3', name: 'Corporate', description: 'Traditional business invoice format' },
  { id: 'template4', name: 'Dark Sidebar', description: 'Modern design with dark sidebar' },
];

// Invoice statuses
export const INVOICE_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'text-gray-500' },
  { value: 'sent', label: 'Sent', color: 'text-blue-500' },
  { value: 'paid', label: 'Paid', color: 'text-green-500' },
  { value: 'overdue', label: 'Overdue', color: 'text-red-500' },
];

// Payment terms
export const PAYMENT_TERMS = [
  'Payment is due within 15 days',
  'Payment is due within 30 days',
  'Payment is due within 45 days',
  'Payment is due within 60 days',
  'Payment is due upon receipt',
  'Net 30 days',
  'Net 60 days',
];

// Default invoice data structure
export const DEFAULT_INVOICE_DATA = {
  invoiceNumber: '',
  sender: {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pinCode: ''
  },
  receiver: {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pinCode: ''
  },
  details: {
    invoiceDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    currency: 'INR',
    items: [
      {
        name: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      }
    ],
    subTotal: 0,
    discountDetails: {
      amount: 0,
      amountType: 'amount',
      enabled: false
    },
    taxDetails: {
      amount: 0,
      amountType: 'percentage',
      enabled: false
    },
    shippingDetails: {
      cost: 0,
      costType: 'amount',
      enabled: false
    },
    totalAmount: 0,
    totalAmountInWords: '',
    additionalNotes: '',
    paymentTerms: 'Payment is due within 30 days',
    paymentInformation: {
      bankName: '',
      accountName: '',
      accountNumber: ''
    },
    signature: {
      data: '',
      fontFamily: 'Great Vibes',
      type: 'text'
    },
    invoiceLogo: ''
  },
  template: 'template1',
  status: 'draft'
};
