# AgriSakhi Task Tracker

## Backend (new — create agrisakhi_backend/ in project root)
- [x] B01 — Django setup + Railway config
- [x] B02 — Models (User, Job, Application, ServiceListing, Rating)
- [x] B03 — Serializers, Views, URLs
- [x] B04 — Tests (all must pass before moving to frontend)

## Frontend Phase 2 (modify existing src/ files)
- [ ] F01 — Install packages + create src/lib/api.js + src/store/authStore.js + src/locales/ i18n
- [ ] F02 — Add src/utils/cloudinary.js + src/utils/audio.js + AudioRecorder + ImageUpload components
- [ ] F03 — Update RegisterPage + LoginPage to use real API (keep same UI)
- [ ] F04 — Update FarmerDashboard + PostJobPage to use real API + add audio/image upload
- [ ] F05 — Update LabourDashboard + JobDetailPage to use real API + audio playback
- [ ] F06 — Update ProviderDashboard + AddServicePage to use real API + image upload
- [ ] F07 — Update ProfilePage + add LanguageToggle component
- [ ] F08 — Run all tests, fix errors, verify npm run build passes

## Deployment (after all above done)
- [ ] D01 — Railway backend deploy
- [ ] D02 — Netlify env vars + redeploy frontend
- [ ] D03 — Production smoke test