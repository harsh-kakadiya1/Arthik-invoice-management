# 📄 Arthik Invoice Management System

A complete, production-ready invoice management system built with the MERN stack (MongoDB, Express, React, Node.js). Create, manage, and generate professional PDF invoices with ease.

---

## ✨ Features

### 🔐 **Authentication & Security**
- Secure user registration and login (JWT + Bcrypt)
- Protected routes and API endpoints
- Session management with token expiry

### 📄 **Invoice Management**
- Create invoices with 5-step wizard
- Edit and delete invoices
- Auto-save drafts
- Status tracking (Draft, Sent, Paid, Overdue)
- Advanced search and filtering
- Sort by date, amount, client, status

### 🎨 **4 Professional Templates**
1. **Classic Blue** - Professional design with blue accents
2. **Modern Minimal** - Clean, content-focused layout
3. **Corporate** - Boxed layout with colored sections
4. **Dark Sidebar** - Modern design with dark left sidebar

### 💰 **Smart Calculations**
- Automatic subtotal calculation
- Flexible discount (percentage or fixed amount)
- GST/Tax support (inclusive or exclusive)
- Shipping charges
- Total amount in words (Indian numbering system)
- INR currency support (₹)

### 👥 **Client Management**
- Add, edit, and delete clients
- Search and auto-complete
- Reuse client information in invoices

### 📥 **PDF Generation**
- Server-side rendering with Puppeteer
- Perfect template matching
- Logo and signature embedding
- Professional A4 formatting
- Instant download

### 🎨 **UI/UX**
- Dark/Light theme toggle
- Fully responsive (Mobile, Tablet, Desktop)
- Modern, intuitive interface
- Loading states and error handling
- Unsaved changes warnings

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 14+ ([Download](https://nodejs.org/))
- **MongoDB** (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

1. **Setup Environment**
   ```bash
   cd Arthik-invoice-management
   node setup-env.js
   ```

2. **Install Dependencies**
   ```bash
   # Server
   cd server && npm install
   
   # Client
   cd ../client && npm install
   ```

3. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

4. **Start Application**
   ```bash
   # Terminal 1 - Backend Server
   cd server && npm run dev
   
   # Terminal 2 - Frontend Client
   cd client && npm run dev
   ```

5. **Open Browser**
   ```
   http://localhost:5173
   ```

---

## 📁 Project Structure

```
Arthik-invoice-management/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── templates/        # 4 Invoice templates
│   │   ├── context/          # React Context (State)
│   │   └── lib/              # Utilities & helpers
│   └── package.json
│
├── server/                   # Express Backend
│   ├── controllers/         # Business logic
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth & error handling
│   ├── utils/               # PDF generator & helpers
│   └── server.js            # Entry point
│
├── setup-env.js             # Environment setup script
├── LICENSE                  # MIT License
└── README.md               # This file
```

---

## 🔧 Configuration

### Server Environment Variables

Create `server/.env`:

```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/arthik-invoice
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### Client Environment Variables

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5001/api/v1
```

> **Note**: Run `node setup-env.js` to auto-create these files!

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **React Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Puppeteer** - PDF generation

---

## 📖 Usage Guide

### Creating Your First Invoice

1. **Register/Login**
   - Create an account or login
   
2. **Add Company Info** (Optional)
   - Go to Profile → Add logo and company details
   
3. **Add Client** (Optional)
   - Go to Clients → Add client information
   
4. **Create Invoice**
   - Click "Create Invoice"
   - **Step 1**: Fill sender/receiver details
   - **Step 2**: Set invoice number, dates
   - **Step 3**: Add line items with quantities
   - **Step 4**: Add payment terms & signature
   - **Step 5**: Choose template & save
   
5. **Download PDF**
   - Click "Download PDF" from dashboard or invoice view

---

## 🎯 API Endpoints

### Authentication
```
POST   /api/v1/auth/register    - Register user
POST   /api/v1/auth/login       - Login user
POST   /api/v1/auth/logout      - Logout user
GET    /api/v1/auth/me          - Get current user
PUT    /api/v1/auth/profile     - Update profile
```

### Invoices
```
GET    /api/v1/invoices         - Get all invoices
GET    /api/v1/invoices/:id     - Get single invoice
POST   /api/v1/invoices         - Create invoice
PUT    /api/v1/invoices/:id     - Update invoice
DELETE /api/v1/invoices/:id     - Delete invoice
```

### Clients
```
GET    /api/v1/clients          - Get all clients
GET    /api/v1/clients/:id      - Get single client
POST   /api/v1/clients          - Create client
PUT    /api/v1/clients/:id      - Update client
DELETE /api/v1/clients/:id      - Delete client
GET    /api/v1/clients/search   - Search clients
```

### PDF Generation
```
POST   /api/v1/pdf/generate-pdf - Generate invoice PDF
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
net start MongoDB  # Windows
sudo systemctl start mongod  # Linux/Mac
```

### Port Already in Use
- Change `PORT` in `server/.env` (default: 5001)
- Vite will auto-assign a new port for client

### Dependencies Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Puppeteer Installation Issues
```bash
npm install puppeteer --force
```

---

## 🔒 Security Features

- ✅ JWT token authentication
- ✅ Bcrypt password hashing
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Input validation (server-side)
- ✅ MongoDB injection prevention
- ✅ XSS protection

---

## 📊 Features Checklist

- ✅ User registration & login
- ✅ JWT authentication
- ✅ Create/Edit/Delete invoices
- ✅ 4 professional templates
- ✅ Client management
- ✅ Dashboard with filters
- ✅ Search & sort functionality
- ✅ PDF generation (Puppeteer)
- ✅ Signature support (draw/type/upload)
- ✅ Dark/Light theme
- ✅ Responsive design
- ✅ INR currency support
- ✅ GST/Tax calculations
- ✅ Discount & shipping
- ✅ Auto-save drafts
- ✅ Status management

---

## 🎓 Development

### Start Development Servers
```bash
# Backend (with auto-reload)
cd server && npm run dev

# Frontend (with HMR)
cd client && npm run dev
```

### Build for Production
```bash
# Build client
cd client && npm run build

# Start server in production
cd server && NODE_ENV=production npm start
```

---

## 📝 Environment Setup Script

The `setup-env.js` script automatically creates both `.env` files:

```bash
node setup-env.js
```

This creates:
- `server/.env` - Backend configuration
- `client/.env` - Frontend configuration

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with the MERN stack
- UI styled with Tailwind CSS
- PDF generation powered by Puppeteer
- Icons from React Icons

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Verify MongoDB is running
3. Check console logs in both terminals
4. Ensure `.env` files are properly configured

---

## 🌟 Quick Commands

```bash
# Setup
node setup-env.js

# Install all dependencies
cd server && npm install && cd ../client && npm install

# Start both servers (requires 2 terminals)
cd server && npm run dev
cd client && npm run dev

# Build for production
cd client && npm run build

# Start MongoDB
net start MongoDB  # Windows
sudo systemctl start mongod  # Linux/Mac
```

---

**Made with ❤️ for Indian Businesses**

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: November 2025
