# STEAM Education Development Framework (SEDF) - Progress

## Current Version: v1.1.0
**Last Updated:** December 21, 2025

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
- **Backend:** Node.js on port 3001 (PM2 managed)
- **Database:** MySQL `coe_program_framework`
- **Web Server:** Nginx (reverse proxy)
- **Frontend Build (IP):** `/var/www/coe-program-framework/dist`
- **Frontend Build (Subdomain):** `/var/www/coe-subdomain/`

### Credentials
- **Finalize/Edit PIN:** 0218
- **Database User:** coe_user / CoeProgram2024!
- **MySQL Root:** root / NewPassword123!

---

## Completed Features

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

### Deploy to Contabo
```bash
git add -A
git commit -m "v1.0.x: Description"
git push origin main
ssh root@144.91.123.164 "cd /var/www/coe-program-framework && git pull origin main && npm run build"
```

### Restart Backend
```bash
ssh root@144.91.123.164 "pm2 restart coe-backend"
```

### Check Logs
```bash
ssh root@144.91.123.164 "pm2 logs coe-backend --lines 50"
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
