// Date formatting options
export const DATE_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

// Currency options - India only
export const CURRENCY_OPTIONS = [
  { value: 'INR', label: 'INR (₹)', symbol: '₹' },
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
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
  { value: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { value: 'overdue', label: 'Overdue', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
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
