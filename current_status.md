# STEAM Education Development Framework (SEDF) - Progress

## Current Version: v1.2.2
**Last Updated:** January 20, 2026

---

## Port Allocation Registry

**Centralized Port Registry Location:** `C:\Users\User\dev-infrastructure\PORT_ALLOCATION_REGISTRY.md`

This application's ports are documented in the centralized port allocation registry along with all other applications. For complete port information across all environments, refer to:
- `PORT_ALLOCATION_REGISTRY.md` - Master registry for all applications
- `LOCAL_PORTS.md` - Local development ports
- `SERVER_PORTS.md` - Remote server ports

---

## Deployment Status

### Production Server (Contabo)
- **SEDF App URL (Primary):** https://coe-sedf.oapf.org/
- **SEDF App URL (IP):** http://144.91.123.164/coe/
- **Recovery App URL:** http://144.91.123.164/
- **Server IP:** 144.91.123.164
- **SSL:** ✅ Let's Encrypt (auto-renews)
- **Status:** ✅ Live and Running

### Server Configuration
- **Backend:** Node.js on port 4031 (Docker container: coe-sedf-api)
- **Frontend:** Nginx on port 4030 (Docker container: coe-sedf-web)
- **Local Development:** Backend on port 4031, Frontend on port 4030 (Option 1 Compliant)
- **Database:** MySQL `coe_program_framework`
- **Web Server:** Nginx (reverse proxy to Docker containers)
- **Deployment Method:** Docker Compose (containers created Feb 2026)
- **Codebase:** v1.2.2 (GitHub commits from Jan 20, 2026)

### SSH Access
```powershell
# Key-based auth (preferred)
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" -o IdentitiesOnly=yes -o StrictHostKeyChecking=no root@144.91.123.164
```

| Field | Value |
|-------|-------|
| **IP** | `144.91.123.164` |
| **Hostname** | `vmi2971185` (Contabo) |
| **User** | `root` |
| **SSH Key** | `C:\Users\User\.ssh\id_ed25519_temco` |
| **OS** | Ubuntu (Linux) |
| **Web Server** | Nginx |

### Credentials
- **Finalize/Edit PIN:** 0218
- **Database User:** coe_user / CoeProgram2024!
- **MySQL Root:** root / NewPassword123!

---

## Completed Features

### v1.2.2 (Jan 20, 2026)
- **"Add as new" option** in autocomplete dropdowns when no match found
- **New organizations saved** to database immediately
- **Organization lists refresh** after adding new items

### v1.2.1 (Jan 20, 2026)
- **Duration field moved** to first row with Module Name
- **Label shortened** to "Dur: (Hrs)"
- **Duration field right-aligned**

### v1.2.0 (Jan 20, 2026)
- **Autocomplete** for External Partnerships, Placement Partners, Student Associations
- **Save button in cards** (active when all fields filled)
- **Database normalization**: `organizations` + `organization_types` + `program_organizations`
- **Backend uses** `program_organizations` junction table
- **PM2 ecosystem config**: `/server/ecosystem.config.cjs`
- **Dropdown visibility and onBlur** fixes

### v1.1.0 (Dec 21, 2025)
- **Renamed to STEAM Education Development Framework (SEDF)**
- Configured SSL certificate for `coe-sedf.oapf.org` subdomain (Let's Encrypt)
- Fixed API to use relative `/api` path (fixes HTTPS mixed content issue)
- Enabled editing for AI Center and STEAM Hub (previously read-only)
- Fixed program cards loading from database instead of hardcoded data
- Activated Finalize button for AI Center and STEAM Hub
- Updated program section descriptions from `Three type of programs.txt`
- Updated Guide page with full program type descriptions
- Added OAPF logo as favicon
- Updated footer with OAPF project credit and copyright
- Deployed separate build for subdomain at `/var/www/coe-subdomain/`

### v1.0.7 (Dec 20, 2025)
- Removed Application URL element from Guide page

### v1.0.6 (Dec 20, 2025)
- Added guide tile for Save, Finalize & Edit functions

### v1.0.5 (Dec 20, 2025)
- Fixed race condition causing program cards to flash and disappear after loading

### v1.0.4 (Dec 20, 2025)
- Fixed nginx configuration for /coe subpath
- Both Recovery and COE apps running on same server

### v1.0.3 (Dec 20, 2025)
- Deployed to Contabo server
- Configured nginx reverse proxy
- Set up PM2 for Node.js process management

### v1.0.2 (Dec 20, 2025)
- Added localStorage fallback for GitHub Pages
- Updated API paths for production deployment

### v1.0.1 (Dec 20, 2025)
- Fixed program card duplication after save/edit
- Fixed finalized state persistence
- Enabled editing finalized programs without duplicates
- Added duplicate detection by module name
- Synced edit mode changes to database status field

### v1.0.0 (Dec 20, 2025)
- Initial stable release
- Program cards for Advanced, STEAM, and Cross Center programs
- Save/Load functionality with MySQL database
- Finalize and Edit modes with PIN protection
- Report generation and download
- Center Leader Guide

---

## Architecture

### Frontend (React + Vite)
- `src/App.jsx` - Main application component
- `src/Guide.jsx` - Center Leader Guide
- `src/api.js` - API service (connects to Contabo server)
- `vite.config.js` - Build config with `/coe/` base path

### Backend (Node.js + Express)
- `server/index.js` - Express server entry point
- `server/routes/programs.js` - Program CRUD API
- `server/config/database.js` - MySQL connection

### Database (MySQL)
- `programs` table - Stores program cards
- `centers` table - Center definitions
- `partners` table - External partnerships

---

## Deployment Commands

### Deploy to Contabo (Docker)
```bash
git add -A
git commit -m "v1.x.x: Description"
git push origin main
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "cd /path/to/docker-compose && docker-compose pull && docker-compose up -d --build"
```

### Restart Docker Containers
```bash
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "docker restart coe-sedf-api coe-sedf-web"
```

### Check Docker Logs
```bash
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "docker logs coe-sedf-api --tail 50"
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "docker logs coe-sedf-web --tail 50"
```

### Check Container Status
```bash
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "docker ps | grep coe-sedf"
```

### Database Query
```bash
ssh root@144.91.123.164 "mysql -e 'USE coe_program_framework; SELECT * FROM programs;'"
```

---

## Pending Tasks
- None currently

---

## Known Issues
- None currently
