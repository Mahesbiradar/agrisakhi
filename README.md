# AgriSakhi

A full-stack agriculture platform for Karnataka that connects farmers, labourers, and service providers through location-based matching, voice job descriptions, and direct WhatsApp/call contact — available in English and ಕನ್ನಡ.

## What It Does

- **Farmers** post job requirements with images and voice descriptions, browse nearby labour and agri services, and manage applications
- **Labourers** find nearby jobs filtered by distance and wage, set daily availability, and contact farmers directly
- **Service providers** list machinery, spraying, seeds, soil testing, and other services with a coverage radius
- **Admins** view platform-wide stats and manage users

## Tech Stack

### Frontend

| Library | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 8 | Build tool |
| Tailwind CSS | 3 | Styling |
| React Router | 7 | Client-side routing (HashRouter) |
| TanStack Query | 5 | Server state, caching, mutations |
| Zustand | 5 | Auth store |
| Axios | 1 | HTTP client |
| framer-motion | 12 | Animations |
| react-i18next | 17 | EN / ಕನ್ನಡ translations |
| Lucide React | — | Icons |

### Backend

| Library | Purpose |
|---|---|
| Django 4.2 | Web framework |
| Django REST Framework | API layer |
| djangorestframework-simplejwt | JWT authentication |
| PostgreSQL | Database |
| Cloudinary | Media storage (optional) |
| django-cors-headers | CORS |
| django-filter | Query filtering |
| gunicorn | Production server |

## Project Structure

```
agrisakhi/
├── agrisakhi_backend/          Django project
│   ├── users/                  Custom user model, auth, profile
│   ├── jobs/                   Job listings, applications
│   ├── services/               Service listings with coverage area
│   └── agrisakhi_backend/      Django settings, URLs, WSGI
│
├── frontend/                   Vite + React project
│   └── src/
│       ├── assets/landing/     Local landing page images
│       ├── components/         Shared UI (AppLayout, AuthLayout, JobCard, BottomSheet…)
│       ├── lib/                API client (api.js), i18n config
│       ├── locales/            en.json, kn.json translation strings
│       ├── pages/              Route-level screens
│       ├── store/              Zustand authStore
│       └── utils/              Location helpers, audio, Cloudinary, toast hook
│
├── netlify.toml                Netlify build config (frontend)
└── README.md
```

## Routes

**Public**

| Path | Page |
|---|---|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Multi-step registration |
| `/forgot-password` | Password reset |

**Protected — Farmer**

| Path | Page |
|---|---|
| `/farmer` | Farmer dashboard — nearby labour and services |
| `/farmer/post-job` | Post a new job with image + voice |
| `/farmer/jobs` | My posted jobs |
| `/farmer/jobs/:id/applications` | Applications for a job |

**Protected — Labour**

| Path | Page |
|---|---|
| `/labour` | Labour dashboard — nearby jobs, availability toggle |

**Protected — Service Provider**

| Path | Page |
|---|---|
| `/provider` | Provider dashboard — my services, availability |
| `/provider/add-service` | Add a new service listing |

**Protected — All Roles**

| Path | Page |
|---|---|
| `/profile` | Profile — edit details, change password |
| `/jobs/:id` | Job detail — audio, contact buttons |

**Protected — Admin**

| Path | Page |
|---|---|
| `/admin` | Admin dashboard — platform stats and user list |

## Getting Started

### Backend

**Requirements:** Python 3.11+, PostgreSQL

```bash
cd agrisakhi_backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```env
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=agrisakhi
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
CORS_ORIGINS=http://localhost:5173

# Optional — leave blank to use local filesystem storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Run migrations and start the server:

```bash
python manage.py migrate
python manage.py createsuperuser   # optional admin account
python manage.py runserver
```

API is served at `http://localhost:8000/api/`.

### Frontend

**Requirements:** Node 20+

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000/api

# Optional Cloudinary direct upload
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

```bash
npm run dev       # development server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Key Features

**Authentication**
- Phone number is the login credential — no email required
- JWT access tokens (15 min) + refresh tokens (7 days, rotated on use)
- Role-based protected routes: farmer, labour, provider, admin

**Location matching**
- GPS coordinates captured on registration
- Haversine distance calculation on the backend
- Labour and services sorted by distance from the requesting farmer's location

**Voice job descriptions**
- Farmers can record audio when posting a job
- Audio playback on job detail and job cards

**Image uploads**
- Job images uploaded via Cloudinary (or local filesystem in dev)
- Role card images served from local `assets/landing/`

**Language toggle**
- EN / ಕನ್ನಡ switch available on all pages via react-i18next

**Admin dashboard**
- Live platform stats (total farmers, labourers, open jobs, services)
- User list with role and join date

## Deployment

**Backend — Railway**

The `agrisakhi_backend/railway.json` and `Procfile` configure Railway deployment. Set all env vars from `.env.example` in the Railway dashboard. The database should be a Railway-managed PostgreSQL instance.

**Frontend — Netlify**

`netlify.toml` at the project root points to `frontend/` as the base with `npm run build` and `dist` as the publish directory. `public/_redirects` handles SPA fallback routing.

## Development Notes

- The backend uses a custom `User` model (`AUTH_USER_MODEL = 'users.User'`) with `phone` as the `USERNAME_FIELD`
- Cloudinary storage is activated only when all three Cloudinary env vars are set; otherwise Django falls back to `FileSystemStorage` under `media/`
- The frontend uses `HashRouter` so deep links work on static hosts without server-side rewrite rules
- TanStack Query cache keys follow the pattern `['resource-name', id?]` — invalidation is scoped per mutation
