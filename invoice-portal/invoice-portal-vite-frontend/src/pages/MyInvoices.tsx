import useSWR from 'swr'

const api = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function MyInvoices() {
  const { data, error, isLoading } = useSWR(`${api}/invoices`, fetcher)

  return (
    <div>
      <h2>My Invoices</h2>
      {isLoading && <p>Loading…</p>}
      {error && <p>Error loading invoices</p>}
      <table border={1} cellPadding={6} cellSpacing={0}>
        <thead>
          <tr>
            <th>Date</th><th>Reference No</th><th>Invoice No</th><th>Amount</th><th>Currency</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((inv: any) => (
            <tr key={inv.id}>
              <td>{new Date(inv.created_at).toLocaleString()}</td>
              <td>{inv.reference_no}</td>
              <td>{inv.invoice_no || '—'}</td>
              <td>{inv.amount}</td>
              <td>{inv.currency}</td>
              <td>{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
