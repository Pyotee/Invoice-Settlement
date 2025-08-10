
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, FileText, Search, Building2, Calendar, DollarSign, CheckCircle, AlertCircle, Trash2, ExternalLink } from 'lucide-react';

const HERO_IMG = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1400&auto=format&fit=crop";
const EMPTY_IMG = "https://images.unsplash.com/photo-1554224155-3a589877462c?q=80&w=1200&auto=format&fit=crop";

const STORAGE_KEY = "invoice-archive-warba-v1";

type Invoice = {
  id: string;
  fileName: string;
  size: number;
  uploadedAt: string;
  vendor: string;
  amount: number;
  currency: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  tags: string[];
  thumb?: string;
};

const demoInvoices: Invoice[] = [
  { id: uid(), fileName: "WARBA-INV-2025-0001.pdf", size: 256000, uploadedAt: new Date().toISOString(), vendor: "Local Vendor A", amount: 1280.5, currency: "KWD", status: "Pending", tags: ["Office","Q3"], thumb: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=500&auto=format&fit=crop" },
  { id: uid(), fileName: "WARBA-LOG-88421.pdf", size: 480000, uploadedAt: new Date(Date.now()-86400000*2).toISOString(), vendor: "Logistics Co", amount: 5420.0, currency: "KWD", status: "Approved", tags: ["Shipping"], thumb: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=500&auto=format&fit=crop" },
  { id: uid(), fileName: "WARBA-IT-77122.pdf", size: 196000, uploadedAt: new Date(Date.now()-86400000*10).toISOString(), vendor: "Initech", amount: 220.99, currency: "KWD", status: "Rejected", tags: ["IT","Licenses"], thumb: "https://images.unsplash.com/photo-1520607162513-78b6b31f47c5?q=80&w=500&auto=format&fit=crop" },
];

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B','KB','MB','GB','TB'];
  const i = Math.floor(Math.log(bytes)/Math.log(k));
  return parseFloat((bytes/Math.pow(k,i)).toFixed(2)) + ' ' + sizes[i];
};

function useLocalData() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
    return demoInvoices;
  });
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices)); } catch {} }, [invoices]);
  return [invoices, setInvoices] as const;
}

function StatusBadge({ status }: {status: Invoice['status']}) {
  const map = {
    Approved: 'border-emerald-300 text-emerald-700 bg-emerald-50',
    Pending: 'border-amber-300 text-amber-800 bg-amber-50',
    Rejected: 'border-rose-300 text-rose-700 bg-rose-50',
  } as const;
  const Icon = status === 'Approved' ? CheckCircle : status === 'Rejected' ? AlertCircle : Calendar;
  return <span className={['inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs', map[status]].join(' ')}><Icon className="h-3.5 w-3.5" /> {status}</span>;
}

function FileDrop({ onFiles }: { onFiles: (files: File[]) => void }){
  const [isOver, setIsOver] = useState(false);
  return (
    <div
      onDragOver={(e)=>{e.preventDefault(); setIsOver(true);}}
      onDragLeave={()=>setIsOver(false)}
      onDrop={(e)=>{e.preventDefault(); setIsOver(false); onFiles(Array.from(e.dataTransfer.files||[]));}}
      className={['rounded-2xl border-2 border-dashed p-8 text-center transition', isOver ? 'border-indigo-500 bg-indigo-50':'border-zinc-300 bg-white'].join(' ')}
    >
      <Upload className="mx-auto h-8 w-8 opacity-70" />
      <p className="mt-3 text-sm text-zinc-600">Drag & drop invoices here, or</p>
      <div className="mt-2">
        <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl border px-4 py-2 hover:shadow-sm">
          <Upload className="h-4 w-4" /> Browse files
          <input type="file" multiple accept="application/pdf,image/*" className="hidden" onChange={(e)=> onFiles(Array.from(e.target.files||[]))} />
        </label>
      </div>
      <p className="mt-2 text-xs text-zinc-500">PDF, PNG, JPG up to ~25 MB per file.</p>
    </div>
  )
}

function Info({label, value, icon}:{label:string, value:React.ReactNode, icon?:React.ReactNode}){
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs text-zinc-500 flex items-center gap-1">{icon} {label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  )
}

export default function App(){
  const [invoices, setInvoices] = useLocalData();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All'|Invoice['status']>('All');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Invoice|undefined>();

  const handleFiles = async (files: File[]) => {
    const mapped: Invoice[] = await Promise.all(files.map(async (f) => {
      const isImage = f.type.startsWith('image/');
      let thumb: string | undefined;
      if (isImage) thumb = URL.createObjectURL(f);
      return {
        id: uid(),
        fileName: f.name,
        size: f.size,
        uploadedAt: new Date().toISOString(),
        vendor: guessVendorFromName(f.name),
        amount: randomAmount(),
        currency: 'KWD',
        status: (['Approved','Pending','Rejected'] as const)[Math.floor(Math.random()*3)],
        tags: generateTags(),
        thumb,
      };
    }));
    setInvoices(prev => [...mapped, ...prev]);
  };

  const filtered = useMemo(()=>{
    return invoices.filter(inv => {
      const matchesQuery = [inv.fileName, inv.vendor, (inv.tags||[]).join(' ')].join(' ').toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      return matchesQuery && matchesStatus;
    })
  }, [invoices, query, statusFilter]);

  const exportCSV = () => {
    const headers = ["fileName","vendor","amount","currency","status","uploadedAt","size","tags"];
    const rows = invoices.map(i => [
      csvEscape(i.fileName),
      csvEscape(i.vendor),
      i.amount,
      i.currency,
      i.status,
      i.uploadedAt,
      i.size,
      csvEscape((i.tags||[]).join('|')),
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-100">
      <div className="relative overflow-hidden">
        <img src={HERO_IMG} alt="hero" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="relative container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/warba-logo.png" alt="Warba Bank" className="h-10 w-auto rounded" />
            <div className="leading-tight">
              <div className="text-xs uppercase tracking-wider text-zinc-600">Warba Bank</div>
              <h1 className="text-2xl font-semibold">Invoice Settlement</h1>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border hover:shadow-sm" onClick={() => document.getElementById('upload-open')?.scrollIntoView({behavior:'smooth'})}>
            <Upload className="h-4 w-4" /> Upload
          </button>
        </div>
      </div>

      <section id="upload-open" className="container mx-auto px-4 py-6">
        <div className="bg-white/70 backdrop-blur border border-zinc-200 rounded-2xl p-6">
          <motion.h2 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="text-xl font-semibold">Upload and archive your invoices</motion.h2>
          <div className="mt-4">
            <FileDrop onFiles={handleFiles} />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <div className="bg-white/70 backdrop-blur border border-zinc-200 rounded-2xl p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-lg font-medium">Archive</div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search invoices..." className="pl-9 pr-3 py-2 rounded-xl border w-64" />
              </div>
              <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value as any)} className="py-2 px-3 rounded-xl border">
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border hover:shadow-sm" onClick={exportCSV}>
                <Download className="h-4 w-4" /> Export CSV
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border overflow-hidden">
            <div className="grid grid-cols-[56px_1fr_1fr_120px_140px_120px_120px_40px] gap-3 px-3 py-2 text-xs font-medium text-zinc-600 bg-zinc-50">
              <div>File</div>
              <div>File name</div>
              <div>Vendor</div>
              <div>Size</div>
              <div>Uploaded</div>
              <div>Amount</div>
              <div>Status</div>
              <div></div>
            </div>
            <div className="divide-y">
              {filtered.length ? filtered.map(inv => (
                <div key={inv.id} className="grid grid-cols-[56px_1fr_1fr_120px_140px_120px_120px_40px] items-center gap-3 px-3 py-2 hover:bg-zinc-50">
                  <div className="h-12 w-14 overflow-hidden rounded-lg bg-zinc-100">
                    {inv.thumb ? <img src={inv.thumb} className="h-full w-full object-cover" /> : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-500">
                        <FileText className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <button className="text-left font-medium hover:underline" onClick={()=>{setSelected(inv); setOpen(true)}}>{inv.fileName}</button>
                  <div className="flex items-center gap-2 text-sm text-zinc-600"><Building2 className="h-4 w-4" /> {inv.vendor}</div>
                  <div className="text-sm text-zinc-600">{formatBytes(inv.size)}</div>
                  <div className="text-sm text-zinc-600">{new Date(inv.uploadedAt).toLocaleDateString()}</div>
                  <div className="font-medium flex items-center gap-1"><DollarSign className="h-4 w-4" />{inv.amount.toLocaleString(undefined,{minimumFractionDigits:2})} {inv.currency}</div>
                  <div><StatusBadge status={inv.status} /></div>
                  <button aria-label="Delete" onClick={()=> setInvoices(prev => prev.filter(x=>x.id!==inv.id))} className="justify-self-end text-zinc-500 hover:text-zinc-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )) : (
                <div className="flex flex-col items-center gap-3 py-14">
                  <img src={EMPTY_IMG} className="w-full max-w-sm rounded-2xl object-cover opacity-80" />
                  <div className="text-sm text-zinc-600">No invoices match your search.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {open && selected && (
        <>
          <div className="fixed inset-0 bg-black/30" onClick={()=>setOpen(false)} />
          <aside className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2"><FileText className="h-5 w-5" /> {selected.fileName}</h3>
              <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border hover:shadow-sm" onClick={()=>setOpen(false)}>Close</button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Info label="Vendor" value={selected.vendor} icon={<Building2 className="h-4 w-4" />} />
              <Info label="Status" value={<StatusBadge status={selected.status} />} />
              <Info label="Amount" value={`${selected.amount.toLocaleString(undefined,{minimumFractionDigits:2})} ${selected.currency}`} icon={<DollarSign className="h-4 w-4" />} />
              <Info label="Uploaded" value={new Date(selected.uploadedAt).toLocaleString()} icon={<Calendar className="h-4 w-4" />} />
            </div>
            {selected.tags?.length ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {selected.tags.map(t => <span key={t} className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs">{t}</span>)}
              </div>
            ) : null}
            <div className="mt-4 rounded-xl overflow-hidden border bg-zinc-50">
              {selected.thumb ? <img src={selected.thumb} className="w-full h-56 object-cover" /> : (
                <div className="aspect-video flex items-center justify-center text-zinc-500">
                  <FileText className="h-6 w-6" />
                </div>
              )}
            </div>
            <a href="#" className="inline-flex items-center gap-2 text-sm underline mt-3"><ExternalLink className="h-4 w-4" /> Open original</a>
          </aside>
        </>
      )}

      <footer className="container mx-auto px-4 pb-10 text-xs text-zinc-500">
        © {new Date().getFullYear()} Warba Bank — Demo UI for Invoice Settlement. Images from Unsplash.
      </footer>
    </div>
  );
}

// helpers
function guessVendorFromName(name: string){
  const parts = name.split(/[-_]/);
  return (parts[0] || 'Vendor').replace(/\.[^.]+$/, '');
}
function randomAmount(){
  return Math.round((Math.random()*9000 + 120) * 100) / 100;
}
function generateTags(){
  const pool = ["Office","Q1","Q2","Q3","Q4","IT","Services","Shipping","Legal","Subscriptions"];
  const count = Math.floor(Math.random()*3);
  return Array.from({length: count}, () => pool[Math.floor(Math.random()*pool.length)]);
}
function csvEscape(v: string = ''){
  const needs = /[",\n]/.test(v);
  return needs ? '"' + v.replace(/"/g, '""') + '"' : v;
}
function uid(){
  // crypto.randomUUID fallback for older environments
  try {
    // @ts-ignore
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
