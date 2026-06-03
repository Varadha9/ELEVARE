# Contributing to ELEVARE

Thanks for your interest in contributing! Here's everything you need to get started.

---

## Ways to Contribute

- **Bug Reports** — Find and report issues via [GitHub Issues](https://github.com/Varadha9/ELEVARE/issues)
- **Feature Requests** — Suggest new functionality
- **Code** — Bug fixes, features, optimizations
- **Documentation** — Improve guides and docs
- **Testing** — Add or improve test coverage
- **UI/UX** — Design and accessibility improvements

---

## Getting Started

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/ELEVARE.git
cd ELEVARE

# 2. Set up environment
cp .env.template .env
# Fill in MONGODB_URI, JWT_SECRET, GROQ_API_KEY

# 3. Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ../ai-services && pip install -r requirements.txt

# 4. Create a branch
git checkout -b feature/your-feature
# or
git checkout -b fix/issue-description

# 5. Make changes, then test
cd backend && npm test
cd ../ai-services && pytest

# 6. Commit and push
git commit -m "feat: add your feature"
git push origin feature/your-feature

# 7. Open a Pull Request against main
```

---

## Branch Naming

| Prefix | Use for | Example |
|--------|---------|---------|
| `feature/` | New features | `feature/websocket-chat` |
| `fix/` | Bug fixes | `fix/chat-message-order` |
| `docs/` | Documentation only | `docs/update-api-reference` |
| `refactor/` | Code cleanup | `refactor/profile-controller` |
| `test/` | Tests only | `test/backend-api` |

---

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type: short description in present tense
```

**Types:**

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change, no new feature or fix |
| `test` | Adding or updating tests |
| `chore` | Maintenance, deps, config |

**Examples:**

```bash
feat: add streak calculation to profile endpoint
fix: correct chat message order in Reflection page
fix: save ikigai data to MongoDB after each conversation
docs: update API reference with new endpoints
test: add auth integration tests
chore: bump dependencies to latest versions
```

---

## Code Style

**JavaScript / Node.js**
- ES6+ (arrow functions, destructuring, async/await)
- Meaningful variable names
- No `console.log` in production code — use the logger
- Handle all promise rejections

**Python**
- Follow PEP 8
- Type hints on function signatures
- Docstrings for public functions and classes

**React**
- Functional components with hooks only
- Dark mode support on all new UI components (`dark:` Tailwind classes)
- Loading state + empty state on all data-fetching pages
- Use existing UI components from `src/components/ui/`

---

## Pull Request Checklist

Before opening a PR:

- [ ] Branch is up to date with `main`
- [ ] All tests pass (`npm test` + `pytest`)
- [ ] No `console.log` debug statements left in
- [ ] Dark mode tested if UI changes were made
- [ ] New environment variables documented in `.env.template`
- [ ] PR description explains what changed and why

---

## Bug Report Template

When opening an issue, include:

```
**What happened:**
Brief description of the bug.

**Steps to reproduce:**
1. Go to ...
2. Click ...
3. See error

**Expected behavior:**
What should have happened.

**Environment:**
- OS: Windows / macOS / Linux
- Node.js version:
- Python version:
- Browser:

**Logs / screenshots:**
Paste relevant output here.
```

---

## Feature Request Template

```
**Problem this solves:**
What is the current limitation?

**Proposed solution:**
What would you like to see?

**Alternatives considered:**
Any other approaches you thought of?
```

---

## Project Structure Overview

```
backend/        Node.js Express API
frontend/       React application
ai-services/    Python FastAPI AI microservice
docs/           Documentation
```

Key files to understand first:
- `backend/server.js` — all routes and middleware
- `ai-services/main.py` — AI service endpoints
- `ai-services/services/` — NLP, behavioral analysis, recommendations
- `frontend/src/pages/` — all application pages

---

## Security Issues

**Do not** open public issues for security vulnerabilities.

Instead, contact the maintainer directly via [GitHub](https://github.com/Varadha9) or open a confidential issue.

---

## Questions?

- [GitHub Issues](https://github.com/Varadha9/ELEVARE/issues)
- [GitHub Discussions](https://github.com/Varadha9/ELEVARE/discussions)
- Maintainer: [Varadha](https://github.com/Varadha9)

---

**Thank you for contributing to ELEVARE!**
