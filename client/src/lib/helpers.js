// Format number with commas
export const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Check if string is a data URL
export const isDataUrl = (str) => {
  if (!str) return false;
  return str.startsWith('data:');
};

// Generate unique invoice number
export const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${year}${month}${day}-${random}`;
};

// Calculate due date (30 days from invoice date)
export const calculateDueDate = (invoiceDate) => {
  const date = new Date(invoiceDate);
  date.setDate(date.getDate() + 30);
  return date;
};

// Convert number to words (basic implementation)
export const numberToWords = (amount) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const thousands = ['', 'Thousand', 'Million', 'Billion'];

  if (amount === 0) return 'Zero';

  let words = '';
  let groupIndex = 0;

  while (amount > 0) {
    const group = amount % 1000;
    if (group !== 0) {
      let groupWords = '';
      
      const hundreds = Math.floor(group / 100);
      const remainder = group % 100;
      
      if (hundreds > 0) {
        groupWords += ones[hundreds] + ' Hundred ';
      }
      
      if (remainder >= 20) {
        const tensDigit = Math.floor(remainder / 10);
        const onesDigit = remainder % 10;
        groupWords += tens[tensDigit];
        if (onesDigit > 0) {
          groupWords += '-' + ones[onesDigit];
        }
      } else if (remainder >= 10) {
        groupWords += teens[remainder - 10];
      } else if (remainder > 0) {
        groupWords += ones[remainder];
      }
      
      if (thousands[groupIndex]) {
        groupWords += ' ' + thousands[groupIndex];
      }
      
      words = groupWords + ' ' + words;
    }
    
    amount = Math.floor(amount / 1000);
    groupIndex++;
  }

  return words.trim();
};

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
