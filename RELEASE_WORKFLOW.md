# Release Workflow — COE Program Framework

> **Template Version:** 1.0 (Docker-based CI/CD)
> **Project:** COE Program Framework (SEDF)
> **Usage:** When the user says `/release` or asks to release/deploy, execute ALL of the following steps automatically.

**⚠️ MANDATORY RULE: ALL releases MUST go through this workflow. NEVER manually commit + tag + push outside of `/release`, even for "backend-only" or "one-file" hotfixes. Every release — no matter how small — MUST include steps 6 (version bump), 7 (CHANGELOG), 8 (build validation). Skipping any step causes version mismatches between local git, production backend, and production frontend.**

---

## Project Configuration

### General
- **Project Name**: COE Program Framework (SEDF)
- **Local Project Path**: f:\Winsurf\OAPF\coe-program-framework
- **GitHub Repo**: ishanthasiribaddana/coeprogramframework
- **Default Branch**: main
- **Starting Version**: v1.2.2 (current version)

### Production Server
- **IP**: 144.91.123.164
- **User**: root (SSH key auth)
- **SSH Key**: `C:\Users\User\.ssh\id_ed25519_temco` (Ed25519)
- **Project path on server**: /opt/temco/apps/coe
- **Database**: coe_program_framework (MySQL)
- **SSL**: Let's Encrypt (auto-renews)
- **Firewall**: UFW — ports 22, 80, 443, 4030, 4031 open

### GitHub Secrets Required
| Secret | Description |
|--------|-------------|
| `PROD_SSH_KEY` | Contents of `C:\Users\User\.ssh\id_ed25519_temco` (private key) |
| `PROD_HOST` | `144.91.123.164` |
| `PROD_USER` | `root` |

---

## Services (ALL deployed on every release)

| Service | Backend Build | Frontend Build | Container Name | Prod Port | Health Check |
|---------|--------------|----------------|----------------|-----------|-------------|
| COE Backend | `npm ci --only=production` | N/A | `coe-backend` | 127.0.0.1:4031 | `/api` |
| COE Frontend | N/A | `npm run build` | `coe-frontend` | 127.0.0.1:4030 | `/` (HTTP 200) |

---

## Production URLs

| App | Public URL | Status |
|-----|-----------|--------|
| COE Frontend | `https://coe-sedf.oapf.org/` | ✅ Live |
| COE Frontend (IP) | `http://144.91.123.164/coe/` | ✅ Live |
| Development Preview | `http://144.91.123.164:4030/` | Available |

---

## Docker Architecture

| Container | Image/Base | Internal Port | Production Port |
|-----------|-----------|---------------|-----------------|
| coe-frontend | Nginx + React dist | 4030 | 127.0.0.1:4030 |
| coe-backend | Node.js + Express | 4031 | 127.0.0.1:4031 |

**Database Connection:**
- MySQL: coe_program_framework database (hosted on production server)
- Database: coe_program_framework
- No Flyway migrations (manual SQL only)

---

## CI/CD Pipeline Overview

Pushing a tag (`v*`) to GitHub triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. **Build** — Builds Docker images (backend, frontend) on GitHub runners
2. **Package** — Saves images as compressed tarballs
3. **Transfer** — SCPs tarballs to production server
4. **Deploy** — Loads images on server via `docker load`, tags as latest, restarts containers
5. **Verify** — Runs health checks on all endpoints

**No container registry (GHCR) needed** — repo stays private, no PAT tokens that expire.

---

## 1. Detect the current version
// turbo
Run: `git tag --sort=-v:refname | Select-Object -First 1` in `f:\Winsurf\OAPF\coe-program-framework` to get the latest tag.
If no tags exist, the current version is `v0.0.0` (first release will be `v1.0.0`).

## 2. Calculate the next version
Parse the latest tag (e.g., `v1.2.2`) and increment the patch number by 1 (e.g., `v1.2.3`).
If the user specifies a version, use that instead.
If the user specifies `minor`, bump the minor version (e.g., `v1.3.0`).
If the user specifies `major`, bump the major version (e.g., `v2.0.0`).

## 3. Auto-detect changes
// turbo
Run: `git diff --name-only HEAD` and `git diff --name-only --cached HEAD` and `git ls-files --others --exclude-standard` in `f:\Winsurf\OAPF\coe-program-framework` to list all modified, staged, and new files.

## 4. Generate a commit message
Based on the changed files, generate a conventional commit message:
- If new features: `feat: <summary>`
- If bug fixes: `fix: <summary>`
- If refactoring: `refactor: <summary>`
- Include bullet points for each significant change
- Group by **Backend / Frontend / Database / Config**

## 5. Generate a release summary (one-line)
Create a short one-line summary for the tag annotation (max 80 chars).

## 6. Update `package.json` version
Edit `f:\Winsurf\OAPF\coe-program-framework\package.json`:
Replace the version string with the new version:
```json
"version": "X.Y.Z"
```

Also update `server/package.json` if it exists.

## 7. Update `CHANGELOG.md`
Edit `f:\Winsurf\OAPF\coe-program-framework\CHANGELOG.md`:
Add a new section at the TOP (after the header) following the Keep a Changelog format:
```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added/Changed/Fixed
- **Feature Name** — Description
  - Detail 1
  - Detail 2

### Services Affected
- Backend (Node.js)
- Frontend (React)

### Files Changed
- `path/to/file1` — what changed
- `path/to/file2` — what changed

---
```

## 8. Local build validation (ALL services)

### 8a. Frontend build
// turbo
Run: `npm run build` in `f:\Winsurf\OAPF\coe-program-framework`
If build fails, STOP and report the error.

### 8b. Backend build
// turbo
Run: `cd server && npm ci --only=production` in `f:\Winsurf\OAPF\coe-program-framework`
If build fails, STOP and report the error.

## 9. Pre-commit validation (GATE — do NOT skip)
Before staging, verify version consistency:

// turbo
Run: `Select-String -Path "package.json" -Pattern '"version": "X.Y.Z"'` in `f:\Winsurf\OAPF\coe-program-framework`
- If the target version string (e.g., `"version": "1.2.3"`) appears in `package.json` → PASS, continue.
- If NOT found → **STOP the release**. Step 6 was skipped. Go back and fix before continuing.

Also verify the CHANGELOG:
// turbo
Run: `Select-String -Path "CHANGELOG.md" -Pattern "X.Y.Z"` in `f:\Winsurf\OAPF\coe-program-framework`
- If found → PASS. If NOT → **STOP**.

## 10. Stage all changes
Run: `git add -A` in `f:\Winsurf\OAPF\coe-program-framework`

## 11. Commit
Run: `git commit -m "<commit message from step 4>"` in `f:\Winsurf\OAPF\coe-program-framework`

## 12. Push to main
Run: `git push origin main` in `f:\Winsurf\OAPF\coe-program-framework`

## 13. Create annotated tag
Run: `git tag -a vX.Y.Z -m "vX.Y.Z - <release summary from step 5>"` in `f:\Winsurf\OAPF\coe-program-framework`

## 14. Push tag (triggers CI/CD)
Run: `git push origin vX.Y.Z` in `f:\Winsurf\OAPF\coe-program-framework`

This triggers the full production CI/CD pipeline which auto-deploys all services:
1. **Backend Docker image** → Built on GitHub runners, saved as tarball, SCP'd to production, loaded via `docker load`
2. **Frontend Docker image** → Built on GitHub runners, saved as tarball, SCP'd to production, loaded via `docker load`
3. **Docker restart** → Containers restarted with new images
4. **Health checks** → Automated health checks on both services

## 15. Report
// turbo
Run: `git remote get-url origin` in `f:\Winsurf\OAPF\coe-program-framework` to get the repo URL.
Strip the `.git` suffix and append `/actions` to build the CI/CD link dynamically.

// turbo
Run: `git log -1 --format="%H"` in `f:\Winsurf\OAPF\coe-program-framework` to get the commit hash.

Print a summary:
- Version released
- Commit hash
- Number of files changed
- CI/CD pipeline link (derived from git remote, NOT hardcoded)
- Deployment layers:
  - Backend (Node.js)
  - Frontend (Nginx)

## 16. Post-deploy verification

Wait for CI/CD to complete (check the Actions link from step 15), then run these automated health checks via SSH:

### a. Backend health
Run: `ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "curl -s http://localhost:4031/api"` — expect JSON response.

### b. Frontend health
Run: `ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "curl -s -o /dev/null -w '%{http_code}' http://localhost:4030/"` — expect `200`.

### c. Docker container status
Run: `ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "docker ps --filter name=coe --format 'table {{.Names}}\t{{.Status}}'"` — expect 2 containers running (backend, frontend).

### d. Public URL verification
Run: `Invoke-WebRequest -Uri "https://coe-sedf.oapf.org/" -UseBasicParsing -TimeoutSec 15 | Select-Object StatusCode` — expect `200`.

### e. Manual spot-checks
Remind the user to verify the following on the production site:
- **Frontend** — Does the page load correctly?
- **API** — Can you access the API endpoints?
- **Database** — Is data loading correctly?
- **Browser console** — Any JavaScript errors?

## 17. Rollback (if needed)

If any check fails:

### a. Full rollback (re-deploy previous version)
Re-trigger the CI/CD pipeline for the previous tag:
```bash
git tag -d v<PREVIOUS_VERSION>
git tag -a v<PREVIOUS_VERSION> -m "rollback to v<PREVIOUS_VERSION>"
git push origin v<PREVIOUS_VERSION> --force
```
This rebuilds and re-deploys ALL services from the previous version's code.

### b. Manual per-service rollback (if only one service is broken)
SSH into the server and restore the previous Docker image:
```bash
# Example: rollback backend only
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "docker tag coe-backend:v<PREVIOUS_VERSION> coe-backend:latest"
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "cd /opt/temco/apps/coe && docker-compose restart coe-backend"

# Example: rollback frontend only
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "docker tag coe-frontend:v<PREVIOUS_VERSION> coe-frontend:latest"
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "cd /opt/temco/apps/coe && docker-compose restart coe-frontend"
```

---

## First-Time Server Setup

Only needed if `/opt/temco/apps/coe` does not exist on the production server:

```bash
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "sudo docker network create coe-network 2>/dev/null || true"
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "sudo mkdir -p /opt/temco/apps/coe"
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "sudo chown -R root:root /opt/temco/apps/coe"
```

SCP the docker-compose file and environment config:
```powershell
scp f:\Winsurf\OAPF\coe-program-framework\docker-compose.yml root@144.91.123.164:/opt/temco/apps/coe/
scp f:\Winsurf\OAPF\coe-program-framework\.env.docker root@144.91.123.164:/opt/temco/apps/coe/.env
```

Then push a tag to trigger CI/CD — it will build, SCP, and deploy automatically.

---

## Production Server Directory Structure

```
/opt/temco/apps/coe/
├── .env                            # Shared secrets
├── docker-compose.yml              # Docker compose configuration
├── frontend-${{ version }}.tar     # Frontend Docker image tarball
├── backend-${{ version }}.tar      # Backend Docker image tarball
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend Runtime | Node.js | 20 |
| Backend Framework | Express | Latest |
| Frontend Framework | React | 18 |
| Frontend Build | Vite | Latest |
| Frontend Server | Nginx | Alpine |
| Database | MySQL | 8.0 |
| Containerization | Docker | Latest |
| CI/CD | GitHub Actions | Latest |
