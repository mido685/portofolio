# portofolio

## Deploy the API to Railway

The FastAPI service lives in `backend/`. In Railway, create a service from this
repository and set its **Root Directory** to `/backend`. Railway will use
`backend/railway.json` to install the Python requirements, start Uvicorn, and
check `/health`.

Add a PostgreSQL service to the Railway project, then set these variables on
the API service:

- `DATABASE_URL`: reference the PostgreSQL service's `DATABASE_URL` variable.
- `ADMIN_SECRET`: a long, random secret used by the portfolio admin page.
- `FRONTEND_ORIGINS`: the exact deployed Vercel site origin, such as
  `https://your-portfolio.vercel.app` (comma-separated if there is more than
  one origin).
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob token, required for admin image uploads.

The API initializes its tables on startup. Once Railway deploys, copy the
service's public URL and set `VITE_API_BASE` to that URL in the Vercel frontend
project's environment variables. Do not add a trailing slash. Redeploy the
frontend after changing the variable. Public API routes include `/api/projects`,
`/api/articles`, and `/api/testimonials`; the health check is `/health`.
