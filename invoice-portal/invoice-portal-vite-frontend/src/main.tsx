import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import Upload from './pages/Upload'
import MyInvoices from './pages/MyInvoices'
import Admin from './pages/Admin'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Invoice Portal</h1>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <Link to="/">Upload</Link>
        <Link to="/my-invoices">My Invoices</Link>
        <Link to="/admin">Admin Dashboard</Link>
      </nav>
      {children}
    </div>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <Layout><Upload /></Layout> },
  { path: '/my-invoices', element: <Layout><MyInvoices /></Layout> },
  { path: '/admin', element: <Layout><Admin /></Layout> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
