# Invoice Portal (MVP Scaffold)

Bank-grade invoice collection & tracking platform.

## Stack
- Frontend: Next.js (App Router) + TypeScript + react-hook-form + zod
- Backend: NestJS + TypeORM + PostgreSQL
- Infra: Docker Compose (Postgres, Backend, Frontend, Mailhog), ClamAV placeholder

## Quick start
```bash
# 1) Copy the env templates
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2) Build & run
docker compose up --build

# 3) Open:
# Frontend: http://localhost:3000
# Backend:  http://localhost:4000/health
# Mailhog:  http://localhost:8025
```

### Default accounts
This scaffold ships without auth wired to an IdP to keep it simple. Vendor scoping is mocked with a header.
Add a header `x-vendor-id: 00000000-0000-0000-0000-000000000001` for a vendor user in the frontend (pre-set in API calls).

### What’s included
- Uploader form with **Reference No**, **Amount**, **Currency** (required)
- Backend endpoint `/invoices` to create invoice metadata
- List pages for **My Invoices** and **Admin Dashboard** (filters are stubs)
- Email flow routed to **Mailhog** (development only). In production, wire SES/SendGrid.
- S3 upload is stubbed with local storage; replace with S3 later.

### Next steps
- Replace mock auth with OIDC + MFA
- Add AV scan (ClamAV) & S3 pre-signed uploads
- Enforce Row-Level Security (RLS) in Postgres (or move to PG policies)
- Flesh out dashboard charts and filters
