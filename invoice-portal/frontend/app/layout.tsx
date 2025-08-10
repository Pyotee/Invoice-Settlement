export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'ui-sans-serif, system-ui' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
          <h1>Invoice Portal</h1>
          <nav style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <a href="/">Upload</a>
            <a href="/my-invoices">My Invoices</a>
            <a href="/admin">Admin Dashboard</a>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
