# Sneakercare Permanent Deployment

This project is configured for a permanent Vercel deployment. The repository already uses a Vite frontend with serverless API routes, so Vercel is the safest hosting target because it can serve both the static site and `/api/*` routes.

## Production build

Use the repository package manager for installs and builds:

```bash
pnpm install --frozen-lockfile
pnpm build
```

The production frontend output is written to `dist/public`, while API routes are handled from `api/index.ts`.

## Vercel settings

The included `vercel.json` sets the following permanent deployment configuration:

| Setting | Value |
|---|---|
| Framework | `vite` |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Output directory | `dist/public` |
| API rewrite | `/api/(.*)` to `/api/index` |
| SPA rewrite | `/(.*)` to `/index.html` |

## Required production variables

Copy the variables from `.env.example` into the hosting provider’s environment settings. `DATABASE_URL` is required for bookings, gallery uploads, admin data, testimonials, and server-backed services. OAuth variables are required only if login/admin authentication is enabled.

## Making the Vercel deployment publicly accessible

If the production deployment opens a Vercel login page instead of the website, the Vercel project has deployment protection enabled. In Vercel, open the Sneakercare project and disable protection for the production deployment, or attach a public custom domain to the production project.

## Existing production deployment

GitHub shows successful Vercel production deployments for this repository. After pushing changes to the connected branch, Vercel should automatically create a new production deployment.
