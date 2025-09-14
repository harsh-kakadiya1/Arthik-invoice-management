import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { InvoiceProvider } from './context/InvoiceContext'
import ProtectedRoute from './components/Layout/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CreateInvoicePage from './pages/CreateInvoicePage'
import InvoiceViewPage from './pages/InvoiceViewPage'
import InvoiceEditPage from './pages/InvoiceEditPage'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/create-invoice',
    element: (
      <ProtectedRoute>
        <InvoiceProvider>
          <CreateInvoicePage />
        </InvoiceProvider>
      </ProtectedRoute>
    )
  },
  {
    path: '/invoice/:id',
    element: (
      <ProtectedRoute>
        <InvoiceViewPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/edit-invoice/:id',
    element: (
      <ProtectedRoute>
        <InvoiceEditPage />
      </ProtectedRoute>
    )
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
