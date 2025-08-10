'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const schema = z.object({
  referenceNo: z.string().min(1).max(50).regex(/^[A-Za-z0-9\-_/\.]+$/),
  amount: z.string().refine((v) => /^\d+(\.\d{1,2})?$/.test(v), 'Amount must be a number with up to 2 decimals'),
  currency: z.string().length(3),
  invoiceNo: z.string().optional(),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Page() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currency: 'KWD' }
  });

  const onSubmit = async (data: FormData) => {
    const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
    const res = await axios.post(`${api}/invoices`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    alert(res.data.ok ? 'Uploaded!' : `Error: ${res.data.message}`);
    if (res.data.ok) reset();
  };

  return (
    <div>
      <h2>Upload Invoice</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
        <label>
          Reference No
          <input {...register('referenceNo')} />
          {errors.referenceNo && <small style={{color:'red'}}>{errors.referenceNo.message as string}</small>}
        </label>
        <label>
          Amount
          <input {...register('amount')} />
          {errors.amount && <small style={{color:'red'}}>{errors.amount.message as string}</small>}
        </label>
        <label>
          Currency (ISO 4217)
          <input {...register('currency')} />
          {errors.currency && <small style={{color:'red'}}>{errors.currency.message as string}</small>}
        </label>
        <label>
          Invoice No (optional)
          <input {...register('invoiceNo')} />
        </label>
        <label>
          Issue Date (optional)
          <input type="date" {...register('issueDate')} />
        </label>
        <label>
          Due Date (optional)
          <input type="date" {...register('dueDate')} />
        </label>
        <button disabled={isSubmitting} type="submit">Submit</button>
      </form>
    </div>
  );
}
