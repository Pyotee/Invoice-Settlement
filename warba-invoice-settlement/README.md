
# Warba Bank • Invoice Settlement (Demo UI)

A modern, deploy-ready React (Vite + TypeScript) + Tailwind app for uploading and archiving invoices.
Branded "Warba Bank • Invoice Settlement" with a provided Warba logo and external Unsplash visuals.

## Quick start
```bash
npm i
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy options

### Static hosting (Netlify, Cloudflare Pages, Vercel static)
1. `npm run build`
2. Upload the `dist/` folder.

### Docker (nginx serving static build)
```bash
docker build -t warba-invoice-settlement .
docker run -p 8080:80 warba-invoice-settlement
```
then open http://localhost:8080

## Notes
- This demo stores data in `localStorage` and uses object URLs for image thumbnails; swap with your backend for persistence.
- External images are from Unsplash, referenced by URL.
