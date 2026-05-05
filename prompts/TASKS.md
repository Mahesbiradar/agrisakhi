# AgriSakhi Task Tracker

## Backend (new — create agrisakhi_backend/ in project root)
- [x] B01 — Django setup + Railway config
- [x] B02 — Models (User, Job, Application, ServiceListing, Rating)
- [x] B03 — Serializers, Views, URLs
- [x] B04 — Tests (all must pass before moving to frontend)

## Frontend Phase 2 (modify existing src/ files)
- [x] F01 — Install packages + create src/lib/api.js + src/store/authStore.js + src/locales/ i18n
- [x] F02 — Add src/utils/cloudinary.js + src/utils/audio.js + AudioRecorder + ImageUpload components
- [x] F03 — Update RegisterPage + LoginPage to use real API (keep same UI)
- [x] F04 — Update FarmerDashboard + PostJobPage to use real API + add audio/image upload
- [x] F05 — Update LabourDashboard + JobDetailPage to use real API + audio playback
- [x] F06 — Update ProviderDashboard + AddServicePage to use real API + image upload
- [x] F07 — Update ProfilePage + add LanguageToggle component
- [x] F08 — Run all tests, fix errors, verify npm run build passes




## Bug Fixes & Improvements (before deployment)
- [x] FIX01 — CORS fix + proper error messages
- [x] FIX02 — Location detection: free text district, full address
- [x] FIX03 — Forgot password flow
- [x] FIX04 — Language toggle fixed + visible all pages
- [x] FIX05 — Responsive layout (mobile + tablet + desktop)
- [x] FIX06 — Admin role + admin dashboard
- [x] FIX07 — UX polish across all pages


## Deployment (after all above done)
- [ ] D01 — Railway backend deploy
- [ ] D02 — Netlify env vars + redeploy frontend
- [ ] D03 — Production smoke test