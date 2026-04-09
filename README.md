# AgriSakhi

AgriSakhi is a mobile-first agriculture platform prototype built with React, Vite, and Tailwind CSS. It connects three user groups in one lightweight app:

- Farmers who want to post jobs and discover nearby labour and services
- Labourers who want to find nearby work opportunities
- Service providers who want to list machinery, spraying, seeds, testing, and other agricultural services

The app is designed around a 430px mobile shell and uses static mock data plus `localStorage` to simulate backend-driven flows.

## What’s Included

- Landing, login, and multi-step registration flow
- Role-based dashboards for farmer, labour, and provider users
- Protected routing with role-aware redirects
- Farmer job posting flow and personal jobs list
- Labour nearby jobs search and filtering
- Provider service listing flow and provider service dashboard
- Shared profile page for all roles
- Shared reusable UI components for jobs, services, users, bottom sheets, and toast notifications
- Netlify SPA deployment support

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router
- Lucide React icons
- `localStorage` for session and prototype persistence

## App Behavior

AgriSakhi is a frontend prototype, so data is handled locally:

- Seed users, jobs, and services are loaded from files under [`src/data`](d:\Projects\agrisakhi\agrisakhi\src\data)
- Logged-in user session is stored in `localStorage`
- Newly registered users are persisted to `localStorage`
- New jobs and services created in the UI are also persisted to `localStorage`

This means the app behaves like a small offline demo backend without requiring any server setup.

## Main Routes

Public routes:

- `/`
- `/login`
- `/register`

Protected routes:

- `/farmer`
- `/farmer/post-job`
- `/farmer/jobs`
- `/labour`
- `/provider`
- `/provider/add-service`
- `/profile`

## Demo Login Notes

Mock users are preloaded from [`users.js`](d:\Projects\agrisakhi\agrisakhi\src\data\users.js).

- Registered users use the exact password they created
- Seed mock users do not have stored passwords in the mock dataset, so the current prototype accepts any non-empty password for them

If you want strict password validation for seed accounts later, that can be added easily.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  components/   Shared UI pieces
  context/      Auth and app data context
  data/         Mock users, jobs, and services
  pages/        Route-level screens
  utils/        Helpers, colors, location logic, toast hook
public/
  _redirects    Netlify SPA fallback
```

## Deployment

This repo is prepared for Netlify:

- [`public/_redirects`](d:\Projects\agrisakhi\agrisakhi\public\_redirects) handles SPA route fallback
- [`netlify.toml`](d:\Projects\agrisakhi\agrisakhi\netlify.toml) configures build output

Build settings:

- Command: `npm run build`
- Publish directory: `dist`

## Design Notes

- Mobile-first layout with a centered 430px app shell
- Kannada-capable typography using Noto Sans Kannada
- Role-based color system for farmer, labour, and provider flows
- Touch-friendly controls sized for mobile interaction

## Future Improvements

- Real backend and authentication
- True profile editing
- Service editing and availability management
- Better analytics and job/service status tracking
- Kannada/English content localization beyond the prototype toggle

