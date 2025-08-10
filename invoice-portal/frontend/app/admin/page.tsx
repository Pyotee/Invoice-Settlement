'use client';

import useSWR from 'swr';

const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Page() {
  const { data, error, isLoading } = useSWR(`${api}/invoices`, fetcher);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div style={{ display:'flex', gap:12, marginBottom:12 }}>
        <div style={{ padding:12, border:'1px solid #ddd', borderRadius:8 }}>
          Total: {data?.data?.length ?? 0}
        </div>
        <div style={{ padding:12, border:'1px solid #ddd', borderRadius:8 }}>
          Under Review: {data?.data?.filter((x:any)=>x.status==='under_review').length ?? 0}
        </div>
        <div style={{ padding:12, border:'1px solid #ddd', borderRadius:8 }}>
          Approved: {data?.data?.filter((x:any)=>x.status==='approved').length ?? 0}
        </div>
        <div style={{ padding:12, border:'1px solid #ddd', borderRadius:8 }}>
          Settled: {data?.data?.filter((x:any)=>x.status==='settled').length ?? 0}
        </div>
      </div>
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
  );
}
