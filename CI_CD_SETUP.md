# CI/CD Setup Guide for COE Program Framework

## Overview
This guide explains how to set up the CI/CD pipeline for the COE Program Framework using GitHub Actions.

## Prerequisites
- GitHub repository: ishanthasiribaddana/coeprogramframework
- Production server access (SSH key)
- Docker installed on production server

## GitHub Secrets Configuration

You need to configure the following secrets in your GitHub repository:

### Required Secrets

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `PROD_SSH_KEY` | Private SSH key for production server | Copy contents of `C:\Users\User\.ssh\id_ed25519_temco` |
| `PROD_HOST` | Production server IP address | `144.91.123.164` |
| `PROD_USER` | SSH username | `root` |

### How to Add GitHub Secrets

1. Go to your GitHub repository: https://github.com/ishanthasiribaddana/coeprogramframework
2. Navigate to: Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with the corresponding value

### Adding PROD_SSH_KEY
```powershell
# Copy the SSH key content
Get-Content C:\Users\User\.ssh\id_ed25519_temco | Set-Clipboard
```
Then paste this content into the GitHub secret value field.

## First-Time Server Setup

Before using CI/CD, set up the production server:

```bash
# SSH into production server
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164

# Create Docker network
sudo docker network create coe-network 2>/dev/null || true

# Create deployment directory
sudo mkdir -p /opt/temco/apps/coe

# Set permissions
sudo chown -R root:root /opt/temco/apps/coe
```

## Deploy docker-compose.yml to Server

```powershell
# Copy docker-compose.yml to server
scp f:\Winsurf\OAPF\coe-program-framework\docker-compose.yml root@144.91.123.164:/opt/temco/apps/coe/

# Copy .env.docker to server (rename to .env)
scp f:\Winsurf\OAPF\coe-program-framework\.env.docker root@144.91.123.164:/opt/temco/apps/coe/.env
```

## Update docker-compose.yml for Production

The docker-compose.yml needs to be updated for production deployment:

```yaml
version: '3.8'

services:
  coe-frontend:
    image: coe-frontend:latest
    container_name: coe-sedf-web
    ports:
      - "4030:4030"
    depends_on:
      - coe-backend
    networks:
      - coe-network
    restart: unless-stopped

  coe-backend:
    image: coe-backend:latest
    container_name: coe-sedf-api
    ports:
      - "4031:4031"
    environment:
      - DB_HOST=127.0.0.1
      - DB_PORT=3306
      - DB_USER=root
      - DB_PASSWORD=SH3iA7b9kUpd
      - DB_NAME=coe_program_framework
      - PORT=4031
      - NODE_ENV=production
      - JWT_SECRET=coe_program_framework_secret_key_2024
      - JWT_EXPIRES_IN=7d
    networks:
      - coe-network
    restart: unless-stopped

networks:
  coe-network:
    external: true
```

## How to Deploy

### Option 1: Using Release Workflow (Recommended)

Follow the steps in `RELEASE_WORKFLOW.md` to perform a release:
1. Detect current version
2. Calculate next version
3. Auto-detect changes
4. Generate commit message
5. Update package.json version
6. Update CHANGELOG.md
7. Validate builds
8. Commit and push
9. Create and push tag (triggers CI/CD)

### Option 2: Manual Tag Trigger

```bash
# Make your changes
git add -A
git commit -m "feat: your changes"
git push origin main

# Create and push tag (triggers CI/CD)
git tag -a v1.2.3 -m "v1.2.3 - Release summary"
git push origin v1.2.3
```

## CI/CD Pipeline Process

When you push a tag (v*), the GitHub Actions workflow will:

1. **Build Frontend** - npm run build
2. **Build Backend** - npm ci --only=production
3. **Build Docker Images** - docker build for frontend and backend
4. **Save as Tarballs** - docker save
5. **Transfer to Server** - SCP tarballs
6. **Load Images** - docker load on server
7. **Tag as Latest** - docker tag
8. **Restart Containers** - docker-compose restart
9. **Health Checks** - curl frontend and backend
10. **Verify Status** - docker ps

## Verification

After deployment, verify:

```bash
# Check frontend
curl -I https://coe-sedf.oapf.org/

# Check backend API
curl https://coe-sedf.oapf.org/api

# Check container status via SSH
ssh -i "C:\Users\User\.ssh\id_ed25519_temco" root@144.91.123.164 "docker ps --filter name=coe"
```

## Troubleshooting

### CI/CD Fails at SSH Step
- Verify PROD_SSH_KEY is correct
- Check SSH key has proper permissions (600)
- Verify server is accessible

### CI/CD Fails at Build Step
- Check package.json has correct dependencies
- Verify build commands work locally
- Check for syntax errors in code

### CI/CD Fails at Docker Step
- Verify Docker is installed on server
- Check Docker daemon is running
- Verify network permissions

### Containers Won't Start
- Check logs: `docker logs coe-frontend` or `docker logs coe-backend`
- Verify environment variables in .env
- Check port conflicts

## Rollback

If deployment fails, rollback to previous version:

```bash
# Find previous tag
git tag

# Re-deploy previous tag
git tag -a v1.2.2 -m "rollback to v1.2.2"
git push origin v1.2.2 --force
```

## Security Notes

- SSH key should have passphrase protection for local use
- GitHub secrets are encrypted and only accessible by workflows
- Never commit .env files to repository
- Rotate SSH keys periodically
- Monitor GitHub Actions logs for suspicious activity

## Next Steps

1. Configure GitHub secrets (PROD_SSH_KEY, PROD_HOST, PROD_USER)
2. Set up production server directory structure
3. Deploy docker-compose.yml to server
4. Test with a minor release first
5. Monitor CI/CD pipeline execution
6. Verify deployment success

For detailed release procedures, see `RELEASE_WORKFLOW.md`.
