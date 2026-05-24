# Result

Next.js frontend for the **SJEC Student Result Portal** (STD Marks). Deploy on Vercel; connects to [MraksBackend](https://github.com/mohamedarap2024/MraksBackend) API.

## Local dev

```bash
npm install
cp .env.example .env.local
npm run dev    # http://localhost:3000
```

`.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5228/api
```

## Deploy (Vercel)

1. Import this repo on Vercel (Framework: **Next.js**, Root: `./`).
2. Set environment variable:

```
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND.vercel.app/api
```

3. **Redeploy** after saving env vars.

4. On backend Vercel, set `CORS_ORIGIN` to this app's URL (e.g. `https://result.vercel.app`) and redeploy backend.

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for full guide.

## Pages

| Path | Description |
|------|-------------|
| `/` | Public student ID search |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin CRUD + CSV upload |
| `/student/login` | Student login |
| `/student/dashboard` | Results + PDF download |
