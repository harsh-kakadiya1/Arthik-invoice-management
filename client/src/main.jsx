import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { InvoiceProvider } from './context/InvoiceContext'
import { ThemeProvider } from './context/ThemeContext'
import { AutosaveProvider } from './context/AutosaveContext'
import { ClientProvider } from './context/ClientContext'
import AppWithSplash from './components/AppWithSplash'
import ProtectedRoute from './components/Layout/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CreateInvoicePage from './pages/CreateInvoicePage'
import InvoiceViewPage from './pages/InvoiceViewPage'
import InvoiceEditPage from './pages/InvoiceEditPage'
import ClientManagementPage from './pages/ClientManagementPage'
import ProfilePage from './pages/ProfilePage'
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
          <ClientProvider>
            <CreateInvoicePage />
          </ClientProvider>
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
  },
  {
    path: '/clients',
    element: (
      <ProtectedRoute>
        <ClientProvider>
          <ClientManagementPage />
        </ClientProvider>
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ClientProvider>
          <AutosaveProvider>
            <AppWithSplash>
              <RouterProvider router={router} />
            </AppWithSplash>
          </AutosaveProvider>
        </ClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
