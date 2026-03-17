# Changelog

All notable changes to ELEVARE will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- WebSocket real-time chat
- Mobile application (iOS/Android)
- Multi-language support
- Career path visualization

---

## [1.4.0] - 2025

### Fixed
- **Ikigai page end-to-end fix** (`ai-services/services/behavioral_analyzer.py`, `ai-services/main.py`)
  - Renamed ikigai keys from `loves/goodAt/worldNeeds/paidFor` to `whatYouLove/whatYouAreGoodAt/whatTheWorldNeeds/whatYouCanBePaidFor` to match frontend and MongoDB schema
  - Fixed trait scale thresholds — traits are stored 0–10 and personality 0–1, not 0–100
  - Fixed critical bug where ikigai/traits were calculated but never saved to MongoDB (`db_manager.update_user_profile` was never called)

---

## [1.3.0] - 2025

### Fixed
- **Chat message order** (`frontend/src/pages/Reflection.jsx`)
  - Backend returns history sorted newest-first; frontend now reverses array before rendering so oldest messages appear at top
  - Fixed scroll-to-bottom to trigger after `initializing` completes

### Added (15 audit fixes)
- `ui/index.js`: export ConfirmModal, Tooltip, Skeleton, PageTransition, ErrorBoundary
- `server.js`: renamed `whatYoureGoodAt` → `whatYouAreGoodAt` (ikigai key mismatch)
- `server.js`: added `PUT /api/profile`, `PUT /api/auth/change-password`, `GET /api/profile/export`, `DELETE /api/auth/account`
- `server.js`: real streak calculation from conversation timestamps (was always 0)
- `conversationRoutes.js`: added `GET /history` alias route
- `hooks/useProfile.js` + `hooks/useConversations.js`: new reusable custom hooks
- `frontend/public/elevare-icon.svg`: ELEVARE branded favicon
- `frontend/index.html`: OG meta tags, proper favicon, description

### Fixed
- `Loading.jsx`: hardcoded `bg-white` replaced with `dark:bg-slate-900`
- `ErrorBoundary.jsx`: full dark mode support
- `Toast.jsx`: dark mode colors for all variants (success/error/warning/info)
- `Progress.jsx`: `dark:bg-slate-700` track color
- `AuthContext.jsx`: removed all debug `console.log` statements
- `tailwind.config.js`: added missing `primary-200` and `primary-300` shades

### Removed
- Deleted 9 dead files: `Chat.jsx`, `FloatingChat.jsx`, `components/Dashboard.jsx`, `server-new.js`, `db-new.js`, `memoryDB.js`, `auth-improved.js`, `auth-new.js`, `validate-improved.js`
- Deleted 18 root-level dev clutter files and redundant `.bat` scripts

---

## [1.2.0] - 2025

### Added — UX/UI Phase 2 (Polish & Accessibility)
- `ConfirmModal.jsx`: accessible modal replacing `window.confirm`, keyboard Escape support, danger/warning variants
- `Tooltip.jsx`: hover tooltip with top/bottom/left/right position prop
- `Skeleton.jsx`: `SkeletonCard`, `SkeletonDashboard`, `SkeletonList` loading states
- `PageTransition.jsx`: Framer Motion fade+slide route wrapper
- `NotFound.jsx`: 404 page with gradient text, back/home buttons
- `App.jsx`: `AnimatePresence` route transitions, loading splash, `ErrorBoundary` per route, dark mode init on load
- `Dashboard.jsx`: onboarding checklist with progress bar, `Tooltip` on trait pills, Crown on #1 career match
- `Reflection.jsx`: 500 char counter, "still thinking" message after 5s, user avatar initials, initializing state
- `Careers.jsx`: animated `MatchBar`, Crown + amber ring on best match, `SkeletonList` loader, `useToast` wired
- `Settings.jsx`: `ConfirmModal` replacing `window.confirm`, `useToast` for all feedback
- `Sidebar.jsx`: grouped nav into Discover/Insights/Account sections, keyboard focus-visible ring
- Charts: dark mode aware tick/grid/tooltip colors across all three chart components

### Fixed
- `Ikigai.jsx`: fixed data path bug (`response.data?.data?.profile`)
- `Personality.jsx`: fixed data path bug, loading/empty states
- `ProgressTracking.jsx`: real API data from `/profile` + `/conversations/history`, dynamic milestones, real activity calendar

---

## [1.1.0] - 2025

### Added — UX/UI Phase 1 (All Pages Rewritten)
- All pages rewritten with loading states, empty states, dark mode support
- `Button.jsx`: loading spinner, icon prop, danger variant, dark mode
- `Card.jsx`: dark mode CSS variables, hover lift prop
- `Badge.jsx`: dark mode, dot indicator, purple variant
- `Navbar.jsx`: dark mode support, functional notifications + user dropdown
- `DashboardLayout.jsx`: `PageTransition` wrapping, dark background
- `TraitsRadarChart.jsx`: dark mode aware, added `problemSolving` trait
- `PersonalityRadarChart.jsx`: dark mode aware, purple stroke
- `ProgressLineChart.jsx`: dark mode, sample data banner when no real data
- `index.css`: CSS variables for dark mode (`--bg`, `--surface`, `--border`), shared animations

---

## [1.0.0] - 2025

### Added — Initial Release
- Core AI chat system with Groq API (Llama 3.3 70B)
- Behavioral analysis — 8 traits: creativity, analyticalThinking, leadership, teamwork, communication, problemSolving, adaptability, empathy
- Big Five personality profiling (OCEAN model)
- Ikigai framework mapping
- Career recommendations engine
- JWT authentication with bcrypt password hashing
- MongoDB integration with in-memory fallback
- React frontend with TailwindCSS
- Python FastAPI AI microservice
- NLP pipeline: sentiment analysis, emotion detection, keyword extraction
- GitHub Actions CI/CD workflow
