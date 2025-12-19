# COE Program Framework

A comprehensive web application for Ananda College Center of Excellence to manage program/project identification across multiple centers.

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite 4** - Build tool
- **Tailwind CSS 3** - Styling
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL 8** - Database
- **JWT** - Authentication

## Project Structure

```
coe-program-framework/
├── src/                    # React frontend
│   ├── App.jsx
│   └── index.css
├── server/                 # Express backend
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── centers.js
│   │   ├── programs.js
│   │   ├── partners.js
│   │   ├── associations.js
│   │   └── submissions.js
│   ├── index.js
│   └── .env
├── database/
│   └── schema.sql          # MySQL schema (100% normalized)
└── package.json
```

## Database Schema (3NF/BCNF Normalized)

### Entity Tables
- `centers` - COE centers (AI, STEAM Hub, etc.)
- `program_types` - Advanced, STEAM, Cross-Center
- `programs` - Main program/module data
- `student_associations` - Student groups
- `external_partners` - External partnership companies
- `placement_partners` - Career guidance partners
- `users` - System users
- `roles` - User roles and permissions

### Junction Tables (Many-to-Many)
- `program_partners` - Programs ↔ External Partners
- `program_placements` - Programs ↔ Placement Partners
- `program_associations` - Programs ↔ Student Associations
- `cross_center_requests` - Cross-center program requests
- `user_centers` - Users ↔ Centers assignment

### Submission/Audit Tables
- `program_submissions` - Submission tracking
- `submission_programs` - Programs in submissions
- `submission_notes` - Additional notes
- `audit_log` - Change tracking

## Setup Instructions

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source d:/Winsurf/OAPF/coe-program-framework/database/schema.sql
```

Or import via MySQL Workbench.

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment
# Edit .env file with your MySQL credentials

# Start server
npm run dev
```

Server runs on `http://localhost:3001`

### 3. Frontend Setup

```bash
# From project root
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register user
- `GET /api/auth/me` - Get current user

### Centers
- `GET /api/centers` - List all centers
- `GET /api/centers/:id` - Get center details
- `GET /api/centers/summary/all` - Dashboard summary

### Programs
- `GET /api/programs` - List programs (with filters)
- `GET /api/programs/center/:centerId` - Programs by center
- `POST /api/programs` - Create program
- `PUT /api/programs/:id` - Update program
- `DELETE /api/programs/:id` - Delete program

### Partners
- `GET /api/partners/external` - External partners
- `GET /api/partners/placement` - Placement partners
- `POST /api/partners/external` - Add external partner
- `POST /api/partners/placement` - Add placement partner

### Associations
- `GET /api/associations` - All student associations
- `GET /api/associations/center/:centerId` - By center

### Submissions
- `GET /api/submissions` - List submissions
- `POST /api/submissions` - Create submission
- `PUT /api/submissions/:id/status` - Update status

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=coe_program_framework

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

## Features

- ✅ Center selection with visual icons
- ✅ Three program types: Advanced, STEAM, Cross-Center
- ✅ External partnerships tracking
- ✅ Career guidance/placement partners
- ✅ Student associations linking
- ✅ Report generation with PDF export
- ✅ Submission workflow
- ✅ User authentication
- ✅ Audit logging

## License

Ananda College Center of Excellence © 2024
