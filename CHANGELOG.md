# Changelog

All notable changes to ELEVARE are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Planned
- WebSocket real-time chat
- Mobile application (React Native)
- Multi-language support
- Career path visualization graph

---

## [2.0.0] - 2025

### Added — Production Hardening
- Helmet security headers on all backend responses
- MongoDB input sanitization (`express-mongo-sanitize`)
- `express-validator` input validation on all routes (register, login, message, profile)
- Strict auth rate limiter — 10 requests per 15 minutes on login and register endpoints
- CORS whitelist with multi-origin support via comma-separated `CORS_ORIGIN` env var
- Production-grade structured logger (`backend/utils/logger.js`) writing JSON to `logs/`
- Retry logic with exponential backoff in Groq LLM client (3 attempts)
- API key validation on AI service startup with clear warning messages
- Startup event in FastAPI that validates Groq key and MongoDB config
- Enhanced `/health` endpoints on both backend and AI service (checks DB + AI service + memory)
- `backend/middleware/validators.js` — reusable validation schemas
- `backend/tests/api.test.js` — integration tests covering auth, profile, conversations, recommendations
- `ai-services/tests/test_services.py` — unit tests for NLP processor and behavioral analyzer
- `jest.config.json` and test scripts in `backend/package.json`
- `pytest` and `pytest-asyncio` added to `ai-services/requirements.txt`
- `Dockerfile` for backend, frontend, and AI services
- `docker-compose.yml` for full-stack deployment with health checks
- `frontend/nginx.conf` — gzip, security headers, SPA routing
- `backend/railway.json` — Railway platform deployment config
- `.env.template` — single reference file for all environment variables
- `ai-services/.env.example` — AI service specific configuration
- `PRODUCTION_DEPLOYMENT.md` — MongoDB Atlas, Railway, Vercel, and Docker deployment guide
- `PRODUCTION_READY.md` — production readiness score card and checklist
- Added `groq`, `pydantic-settings`, `python-multipart` to AI service dependencies

### Fixed
- Removed committed `.env.dev` file containing development secrets
- Updated `.gitignore` to block all `.env.*` files except `.env.example`
- Reduced body parser limit from 10MB to 1MB
- Disabled FastAPI `/docs` and `/redoc` in production environment
- CI/CD pipeline fixed to skip non-existent lint and test scripts

### Security
- Generated cryptographically strong JWT secret (32-byte random)
- Password minimum length increased from 6 to 8 characters
- Password now requires uppercase, lowercase, and number

---

## [1.4.0] - 2025

### Fixed
- Ikigai page end-to-end fix (`ai-services/services/behavioral_analyzer.py`, `ai-services/main.py`)
  - Renamed ikigai keys from `loves/goodAt/worldNeeds/paidFor` to `whatYouLove/whatYouAreGoodAt/whatTheWorldNeeds/whatYouCanBePaidFor` to match frontend and MongoDB schema
  - Fixed trait scale thresholds — traits stored 0–10, personality 0–1
  - Fixed critical bug where ikigai/traits were calculated but never saved to MongoDB

---

## [1.3.0] - 2025

### Fixed
- Chat message order in `Reflection.jsx` — backend returns history newest-first, frontend now reverses before rendering
- Scroll-to-bottom now triggers after `initializing` state completes

### Added
- `ui/index.js` exports: ConfirmModal, Tooltip, Skeleton, PageTransition, ErrorBoundary
- `server.js`: added `PUT /api/profile`, `PUT /api/auth/change-password`, `GET /api/profile/export`, `DELETE /api/auth/account`
- `server.js`: real streak calculation from conversation timestamps
- `conversationRoutes.js`: `GET /history` alias route
- `hooks/useProfile.js` and `hooks/useConversations.js` custom hooks
- `frontend/public/elevare-icon.svg` — ELEVARE branded favicon
- `frontend/index.html`: OG meta tags, proper favicon, description

### Fixed
- `Loading.jsx`: hardcoded `bg-white` replaced with `dark:bg-slate-900`
- `ErrorBoundary.jsx`: full dark mode support
- `Toast.jsx`: dark mode colors for all variants
- `Progress.jsx`: `dark:bg-slate-700` track color
- `AuthContext.jsx`: removed debug `console.log` statements
- `tailwind.config.js`: added missing `primary-200` and `primary-300` shades

### Removed
- Deleted dead files: `Chat.jsx`, `FloatingChat.jsx`, `components/Dashboard.jsx`, `server-new.js`, `db-new.js`, `memoryDB.js`, `auth-improved.js`, `auth-new.js`, `validate-improved.js`
- Removed 18 root-level dev clutter files and redundant `.bat` scripts

---

## [1.2.0] - 2025

### Added — UX/UI Phase 2 (Polish & Accessibility)
- `ConfirmModal.jsx` — accessible modal replacing `window.confirm`, keyboard Escape support, danger/warning variants
- `Tooltip.jsx` — hover tooltip with position prop (top/bottom/left/right)
- `Skeleton.jsx` — `SkeletonCard`, `SkeletonDashboard`, `SkeletonList` loading states
- `PageTransition.jsx` — Framer Motion fade+slide route wrapper
- `NotFound.jsx` — 404 page with gradient text, back/home buttons
- `App.jsx`: `AnimatePresence` route transitions, loading splash, `ErrorBoundary` per route, dark mode init on load
- `Dashboard.jsx`: onboarding checklist with progress bar, Tooltip on trait pills, Crown on #1 career match
- `Reflection.jsx`: 500 char counter, "still thinking" message after 5s, user avatar initials
- `Careers.jsx`: animated MatchBar, Crown + amber ring on best match, SkeletonList loader
- `Settings.jsx`: ConfirmModal replacing `window.confirm`, useToast for all feedback
- `Sidebar.jsx`: grouped nav into Discover/Insights/Account sections
- Charts: dark mode aware tick/grid/tooltip colors across all three chart components

### Fixed
- `Ikigai.jsx`: fixed data path bug (`response.data?.data?.profile`)
- `Personality.jsx`: fixed data path bug, added loading/empty states
- `ProgressTracking.jsx`: real API data from `/profile` + `/conversations/history`, dynamic milestones, real activity calendar

---

## [1.1.0] - 2025

### Added — UX/UI Phase 1 (All Pages Rewritten)
- All pages rewritten with loading states, empty states, dark mode support
- `Button.jsx`: loading spinner, icon prop, danger variant, dark mode
- `Card.jsx`: dark mode CSS variables, hover lift prop
- `Badge.jsx`: dark mode, dot indicator, purple variant
- `Navbar.jsx`: dark mode, functional notifications and user dropdown
- `DashboardLayout.jsx`: PageTransition wrapping, dark background
- `TraitsRadarChart.jsx`: dark mode, added `problemSolving` trait
- `PersonalityRadarChart.jsx`: dark mode, purple stroke
- `ProgressLineChart.jsx`: dark mode, sample data banner when no real data
- `index.css`: CSS variables for dark mode (`--bg`, `--surface`, `--border`), shared animations

---

## [1.0.0] - 2025

### Added — Initial Release
- Core AI chat system with Groq API (Llama 3.3 70B)
- Behavioral analysis — 8 traits: creativity, analyticalThinking, leadership, teamwork, communication, problemSolving, adaptability, empathy
- Big Five personality profiling (OCEAN model)
- Ikigai framework mapping
- Career recommendations engine with confidence scores
- JWT authentication with bcrypt password hashing (12 rounds)
- MongoDB integration with in-memory fallback for development
- React frontend with TailwindCSS and Framer Motion
- Python FastAPI AI microservice
- NLP pipeline: sentiment analysis, emotion detection, keyword extraction
- GitHub Actions CI/CD workflow
