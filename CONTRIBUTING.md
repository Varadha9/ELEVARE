# Contributing to ELEVARE

Thank you for your interest in contributing! This document covers everything you need to get started.

---

## 🎯 Ways to Contribute

| Type | Description |
|------|-------------|
| 🐛 **Bug Reports** | Find and report issues via GitHub Issues |
| ✨ **Feature Requests** | Suggest new functionality |
| 📝 **Documentation** | Improve guides and docs |
| 🔧 **Code** | Bug fixes, features, optimizations |
| 🧪 **Testing** | Add or improve test coverage |
| 🎨 **UI/UX** | Design and accessibility improvements |

---

## 🚀 Getting Started

```bash
# 1. Fork & clone
git clone https://github.com/YOUR_USERNAME/ELEVARE.git
cd ELEVARE

# 2. Setup
.\setup.bat   # Windows

# 3. Create a branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/what-you-are-fixing

# 4. Make changes, then commit
git commit -m "feat: add your feature"

# 5. Push and open a PR against main
git push origin feature/your-feature-name
```

---

## 🌿 Branch Naming

| Prefix | Use for | Example |
|--------|---------|---------|
| `feature/` | New features | `feature/websocket-chat` |
| `fix/` | Bug fixes | `fix/chat-message-order` |
| `fix/` | Service-specific fixes | `fix/ai-services-ikigai` |
| `docs/` | Documentation only | `docs/update-api-reference` |
| `refactor/` | Code cleanup | `refactor/profile-controller` |

---

## 📋 Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type: short description

Optional longer body explaining why, not what.
```

**Types:**
- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation only
- `refactor` — code change that doesn't fix a bug or add a feature
- `style` — formatting, missing semicolons, etc.
- `test` — adding or updating tests
- `chore` — maintenance (deps, config, cleanup)

**Examples:**
```bash
feat: add streak calculation to profile endpoint
fix: correct chat message order in Reflection page
fix: make Ikigai page work end-to-end
docs: update README project structure
chore: remove dead files and dev clutter
```

---

## 📋 Code Style

**JavaScript/Node.js:**
- ES6+ features
- Meaningful variable names
- No `console.log` in production code

**Python:**
- Follow PEP 8
- Type hints where appropriate
- Docstrings for public functions

**React:**
- Functional components with hooks
- Dark mode support on all new components (`dark:` Tailwind classes)
- Loading + empty states on all data-fetching pages

---

## 🔍 Pull Request Checklist

Before opening a PR:

- [ ] Branch is up to date with `main`
- [ ] Code works locally end-to-end
- [ ] No `console.log` debug statements left in
- [ ] Dark mode tested if UI changes
- [ ] PR description explains what changed and why

---

## 🐛 Bug Report Template

When opening an issue:

```
**What happened:**
Brief description of the bug.

**Steps to reproduce:**
1. Go to ...
2. Click ...
3. See error

**Expected behaviour:**
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

## ✨ Feature Request Template

```
**Problem this solves:**
What is the current limitation?

**Proposed solution:**
What would you like to see?

**Alternatives considered:**
Any other approaches you thought of?
```

---

## 🔐 Security Issues

**Do not** open public issues for security vulnerabilities.  
Instead, open a [GitHub Issue](https://github.com/Varadha9/ELEVARE/issues) marked as **confidential**, or contact the maintainer directly via GitHub.

---

## 📞 Contact

- **Maintainer:** Varadha — [GitHub](https://github.com/Varadha9)
- **Issues:** [GitHub Issues](https://github.com/Varadha9/ELEVARE/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Varadha9/ELEVARE/discussions)

---

**Thank you for contributing to ELEVARE! 🚀**
