# AgriSakhi Deployment Guide

## Local Development

Backend:

```bash
cd agrisakhi_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py runserver
```

For local development, keep:

```env
DEBUG=True
DJANGO_PRODUCTION=False
DATABASE_URL=
USE_POSTGRES=False
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

The backend uses SQLite at `agrisakhi_backend/db.sqlite3` unless `USE_POSTGRES=True` or production mode is set.

Frontend:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Local frontend `.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

## Railway Backend

Deploy the backend as its own Railway service.

1. Create or open a Railway project.
2. Add a PostgreSQL service.
3. Add the backend service from this Git repository.
4. Set the Railway service root directory to `agrisakhi_backend`.
5. Confirm Railway uses `agrisakhi_backend/railway.json`.
6. Set environment variables from `agrisakhi_backend/.env.example`.
7. Deploy.
8. Confirm `/api/health/` returns a JSON status response.

Required Railway variables:

```env
SECRET_KEY=<long-random-secret>
DEBUG=False
DJANGO_PRODUCTION=True
DATABASE_URL=${{Postgres.DATABASE_URL}}
ALLOWED_HOSTS=.railway.app,.up.railway.app,your-custom-api-domain.com
CSRF_TRUSTED_ORIGINS=https://*.railway.app,https://*.up.railway.app,https://*.vercel.app,https://your-custom-api-domain.com
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
CORS_ALLOWED_ORIGIN_REGEXES=^https://.*\.vercel\.app$
SECURE_SSL_REDIRECT=False
JWT_ACCESS_TOKEN_MINUTES=15
JWT_REFRESH_TOKEN_DAYS=7
JWT_ROTATE_REFRESH_TOKENS=True
CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
```

Railway runs this before each deployment starts:

```bash
python manage.py migrate && python manage.py collectstatic --noinput
```

Railway starts the API with:

```bash
gunicorn agrisakhi_backend.wsgi:application --bind 0.0.0.0:$PORT --log-file -
```

## Vercel Frontend

Deploy the frontend as a Vercel project from the repository root.

1. Import the Git repository in Vercel.
2. Keep the project root as the repository root so `vercel.json` is used.
3. Set the framework preset to Vite if Vercel does not detect it.
4. Add the frontend environment variables below.
5. Deploy.

Required Vercel variables:

```env
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
VITE_CLOUDINARY_UPLOAD_PRESET=<unsigned-upload-preset>
```

The root `vercel.json` installs dependencies in `frontend/`, runs `npm run build`, publishes `frontend/dist`, and rewrites requests to `index.html` for SPA routing.

## Deployment Readiness Audit

| Area | Status | Notes |
|---|---|---|
| Environment variables | PASS | Backend and frontend examples are tracked; real `.env` files are ignored. |
| Local SQLite support | PASS | SQLite remains the default when production env vars are absent. |
| Railway PostgreSQL | PASS | `DATABASE_URL` is preferred and parsed without hardcoded credentials. |
| API URLs | PASS | Frontend API client reads `VITE_API_URL` and trims trailing slashes. |
| Authentication | PASS | JWT auth flow and routes are unchanged; token lifetimes are configurable. |
| CORS | PASS | Local origins are built in; production origins and regexes are env-driven. |
| CSRF and hosts | PASS | Local defaults plus Railway, Vercel, and custom-domain env support are configured. |
| Cloudinary | PASS | Backend media storage and frontend direct uploads are env-driven. |
| Railway compatibility | PASS | Config includes pre-deploy migrations, static collection, healthcheck, and Gunicorn `$PORT` binding. |
| Vercel compatibility | PASS | Monorepo Vite build and SPA rewrite are configured. |
| Git safety | PASS | Env files, SQLite DBs, static output, media, node modules, and builds are ignored. |

## Manual Actions

- Generate a new production `SECRET_KEY`.
- Attach Railway PostgreSQL and set `DATABASE_URL`.
- Create a Cloudinary unsigned upload preset if direct frontend uploads are required.
- Add the final Vercel URL to `CORS_ALLOWED_ORIGINS`.
- Add custom domains to `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, and `CORS_ALLOWED_ORIGINS` when they are configured.
