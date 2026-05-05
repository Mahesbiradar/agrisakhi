# AgriSakhi — Codex Agent Instructions

## Project Root: D:/  (frontend is here, no subfolder)
- src/          → React frontend (Phase 1 COMPLETE, do not delete existing files)
- agrisakhi_backend/  → Django backend (to be created by B01)
- prompts/      → Task prompt files
- TASKS.md, STATUS.md → Track progress

## What Phase 1 Built (DO NOT OVERWRITE THESE)
- src/components/: BottomNav, BottomSheet, JobCard, PageSkeleton, ProtectedRoute, ServiceCard, Toast, UserCard
- src/context/: AuthContext.jsx, DataContext.jsx
- src/data/: jobs.js, services.js, users.js
- src/pages/: All 10 pages (Landing, Login, Register, Farmer/Labour/Provider dashboards, PostJob, AddService, JobList, Profile)
- src/utils/: auth.js, location.js, roleColors.js, useDelayedLoading.js, useToast.js

## Phase 2 Goal
- Add Django backend (agrisakhi_backend/)
- Add API layer to frontend WITHOUT breaking existing Phase 1 UI
- Add Zustand store (src/store/), Axios client (src/lib/api.js), i18n (src/locales/)
- Migrate pages from mock data → real API calls one page at a time

## Rules
1. Read TASKS.md first — know what's done, do only the next pending task
2. Read the prompt file fully before writing code
3. NEVER delete or overwrite existing Phase 1 files unless the prompt explicitly says UPDATE
4. After each task: update TASKS.md (check the box), update STATUS.md
5. Backend: run python manage.py test after B03, B04
6. Frontend: run npm run build after every F task — must pass with 0 errors
7. Keep .env and .env.example files — never hardcode secrets

## Ports
Backend: http://localhost:8000
Frontend: http://localhost:5173 (already working)

## Key Existing Patterns to Follow
- Pages use useAuth() from AuthContext and useData() from DataContext
- Toast notifications via useToast() hook
- Loading states via useDelayedLoading() hook  
- Role colors via getRoleColor(role) from utils/roleColors.js
- All pages wrapped in <div className="max-w-[430px] mx-auto min-h-screen bg-gray-50 relative pb-20">