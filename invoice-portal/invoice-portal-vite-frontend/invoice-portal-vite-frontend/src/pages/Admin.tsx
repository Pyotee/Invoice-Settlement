import useSWR from 'swr'

const api = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Admin() {
  const { data, error, isLoading } = useSWR(`${api}/invoices`, fetcher)

  const total = data?.data?.length ?? 0
  const underReview = data?.data?.filter((x:any)=>x.status==='under_review').length ?? 0
  const approved = data?.data?.filter((x:any)=>x.status==='approved').length ?? 0
  const settled = data?.data?.filter((x:any)=>x.status==='settled').length ?? 0

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div style={{ display:'flex', gap:12, marginBottom:12 }}>
        <div style={{ padding:12, border:'1px solid #ddd', borderRadius:8 }}>Total: {total}</div>
        <div style={{ padding:12, border:'1px solid #ddd', borderRadius:8 }}>Under Review: {underReview}</div>
        <div style={{ padding:12, border:'1px solid #ddd', borderRadius:8 }}>Approved: {approved}</div>
        <div style={{ padding:12, border:'1px solid #ddd', borderRadius:8 }}>Settled: {settled}</div>
      </div>
      {isLoading && <p>Loading…</p>}
      {error && <p>Error loading invoices</p>}
      <table border={1} cellPadding={6} cellSpacing={0}>
        <thead>
          <tr>
            <th>Date</th><th>Vendor</th><th>Reference No</th><th>Invoice No</th><th>Amount</th><th>Currency</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((inv: any) => (
            <tr key={inv.id}>
              <td>{new Date(inv.created_at).toLocaleString()}</td>
              <td>(demo)</td>
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
