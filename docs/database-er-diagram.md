# COE Program Framework - Database ER Diagram (Normalized)

## Database: `coe_program_framework`

**Last Updated:** January 2026  
**Version:** 2.0 (Normalized Organizations)

---

## Entity Relationship Diagram (Text Format)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                    COE PROGRAM FRAMEWORK DATABASE (NORMALIZED)                           │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │    roles     │
                                    ├──────────────┤
                                    │ PK role_id   │
                                    │    role_name │
                                    │    role_code │
                                    │    permissions│
                                    └──────┬───────┘
                                           │
                                           │ 1:N
                                           ▼
┌──────────────────┐              ┌──────────────────┐              ┌──────────────────┐
│     centers      │              │      users       │              │   audit_log      │
├──────────────────┤              ├──────────────────┤              ├──────────────────┤
│ PK center_id     │              │ PK user_id       │◄─────────────│ PK log_id        │
│    center_name   │              │    username      │              │ FK user_id       │
│    center_code   │              │    email         │              │    action        │
│    description   │              │    password_hash │              │    table_name    │
│    icon          │              │    first_name    │              │    record_id     │
│    color_theme   │              │    last_name     │              │    old_values    │
│    is_active     │              │ FK role_id       │              │    new_values    │
└────────┬─────────┘              │    is_active     │              │    ip_address    │
         │                        │    last_login    │              │    created_at    │
         │                        └────────┬─────────┘              └──────────────────┘
         │                                 │
         │ N:M                             │
         ▼                                 ▼
┌──────────────────┐              ┌──────────────────┐
│  user_centers    │              │organization_types│  ◄── NEW NORMALIZED TABLE
├──────────────────┤              ├──────────────────┤
│ PK user_center_id│              │ PK type_id       │
│ FK user_id       │              │    type_name     │
│ FK center_id     │              │    type_code     │
│    is_lead_conslt│              │    description   │
│    assigned_date │              │    is_active     │
└──────────────────┘              └────────┬─────────┘
                                           │
                                           │ 1:N
                                           ▼
                                  ┌──────────────────────┐
                                  │    organizations     │  ◄── NEW UNIFIED TABLE
                                  ├──────────────────────┤
                                  │ PK organization_id   │
                                  │ FK type_id           │──► organization_types
                                  │    name              │
                                  │    code              │
                                  │    industry_sector   │
                                  │    sub_type          │
                                  │    contact_person    │
                                  │    contact_email     │
                                  │    contact_phone     │
                                  │    website           │
                                  │    description       │
                                  │    is_active         │
                                  └──────────┬───────────┘
                                             │
                                             │ Replaces:
                                             │ - external_partners
                                             │ - placement_partners  
                                             │ - student_associations
                                             │
         ┌───────────────────────────────────┘
         │
         ▼
┌──────────────────┐
│  program_types   │
├──────────────────┤
│ PK program_type_id│
│    type_name     │
│    type_code     │
│    description   │
│    is_mandatory  │
│    display_order │
└────────┬─────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                           programs                               │
├─────────────────────────────────────────────────────────────────┤
│ PK program_id                                                    │
│ FK center_id          ──────────────────────► centers            │
│ FK program_type_id    ──────────────────────► program_types      │
│    module_name                                                   │
│    description                                                   │
│    duration_min_hours                                            │
│    duration_max_hours                                            │
│    duration_notes                                                │
│    status (draft/submitted/approved/active/archived)             │
│ FK created_by         ──────────────────────► users              │
│ FK approved_by        ──────────────────────► users              │
│    approved_at                                                   │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
          ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────┐
│  program_organizations  │     │cross_center_requests│
├─────────────────────────┤     ├─────────────────────┤
│ PK program_org_id       │     │ PK request_id       │
│ FK program_id           │     │ FK program_id       │
│ FK organization_id      │──►  │ FK requesting_center│
│    relationship_type    │     │    request_status   │
│    notes                │     │    request_notes    │
└─────────────────────────┘     └─────────────────────┘
         │
         │ Replaces:
         │ - program_partners
         │ - program_placements
         │ - program_associations
         │
         ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                    organizations                             │
    │  (unified table for all partner/association types)          │
    └─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    SUBMISSION WORKFLOW                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐
│ program_submissions │◄────────│  submission_notes   │
├─────────────────────┤         ├─────────────────────┤
│ PK submission_id    │         │ PK note_id          │
│ FK center_id        │         │ FK submission_id    │
│ FK submitted_by     │         │    note_content     │
│    submission_date  │         │    note_type        │
│    submission_status│         │ FK created_by       │
│    notes            │         └─────────────────────┘
│ FK reviewed_by      │
│    reviewed_at      │         ┌─────────────────────┐
│    review_comments  │◄────────│ submission_programs │
└─────────────────────┘         ├─────────────────────┤
                                │ PK sub_program_id   │
                                │ FK submission_id    │
                                │ FK program_id       │
                                └─────────────────────┘
```

---

## Tables Detail

### Core Tables

#### 1. `centers`
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| center_id | INT | PK | Auto-increment |
| center_name | VARCHAR(100) | UNI | Center name |
| center_code | VARCHAR(20) | UNI | Short code |
| description | TEXT | | Center description |
| icon | VARCHAR(10) | | Emoji icon |
| color_theme | VARCHAR(50) | | CSS color class |
| is_active | TINYINT(1) | | Active status |

#### 2. `programs`
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| program_id | INT | PK | Auto-increment |
| center_id | INT | FK | → centers |
| program_type_id | INT | FK | → program_types |
| module_name | VARCHAR(255) | | Program name |
| description | TEXT | | Description |
| duration_min_hours | DECIMAL(6,1) | | Min duration |
| duration_max_hours | DECIMAL(6,1) | | Max duration |
| duration_notes | VARCHAR(100) | | Duration notes |
| status | ENUM | | draft/submitted/approved/active/archived |
| created_by | INT | FK | → users |
| approved_by | INT | FK | → users |
| approved_at | TIMESTAMP | | Approval date |

#### 3. `program_types`
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| program_type_id | INT | PK | Auto-increment |
| type_name | VARCHAR(50) | UNI | Type name |
| type_code | VARCHAR(20) | UNI | ADVANCED/STEAM/CROSS_CENTER |
| description | TEXT | | Description |
| is_mandatory | TINYINT(1) | | Required for all centers |
| display_order | INT | | Sort order |

### Organizations (Normalized - NEW)

#### 4. `organization_types`
Categorizes all organizations into types
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| type_id | INT | PK | Auto-increment |
| type_name | VARCHAR(50) | UNI | Type name |
| type_code | VARCHAR(30) | UNI | EXTERNAL_PARTNER / PLACEMENT_PARTNER / STUDENT_ASSOCIATION |
| description | TEXT | | Type description |
| is_active | TINYINT(1) | | Active status |

**Current Types:**
| type_id | type_code | Description |
|---------|-----------|-------------|
| 1 | EXTERNAL_PARTNER | Industry, academic, government, or NGO partners |
| 2 | PLACEMENT_PARTNER | Organizations providing internships, jobs, training |
| 3 | STUDENT_ASSOCIATION | Student clubs and associations |

#### 5. `organizations`
Unified table for all partners and associations (replaces external_partners, placement_partners, student_associations)
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| organization_id | INT | PK | Auto-increment |
| type_id | INT | FK | → organization_types |
| name | VARCHAR(150) | | Organization name |
| code | VARCHAR(30) | | Short code (for associations) |
| industry_sector | VARCHAR(100) | | Industry sector |
| sub_type | VARCHAR(50) | | e.g., company/ngo for external, internship/job for placement |
| contact_person | VARCHAR(100) | | Contact name |
| contact_email | VARCHAR(100) | | Email |
| contact_phone | VARCHAR(20) | | Phone |
| website | VARCHAR(255) | | Website URL |
| description | TEXT | | Description |
| is_active | TINYINT(1) | | Active status |

### Junction Tables (Many-to-Many)

#### 6. `program_organizations`
Links programs to organizations (replaces program_partners, program_placements, program_associations)
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| program_organization_id | INT | PK | Auto-increment |
| program_id | INT | FK | → programs |
| organization_id | INT | FK | → organizations |
| relationship_type | ENUM | | primary/secondary/supporting/affiliated |
| notes | TEXT | | Notes |

#### 7. `cross_center_requests`
Cross-center program requests
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| request_id | INT | PK | Auto-increment |
| program_id | INT | FK | → programs |
| requesting_center_id | INT | FK | → centers |
| request_status | ENUM | | pending/approved/rejected |
| request_notes | TEXT | | Notes |

### User Management

#### 11. `users`
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| user_id | INT | PK | Auto-increment |
| username | VARCHAR(50) | UNI | Username |
| email | VARCHAR(100) | UNI | Email |
| password_hash | VARCHAR(255) | | Hashed password |
| first_name | VARCHAR(50) | | First name |
| last_name | VARCHAR(50) | | Last name |
| role_id | INT | FK | → roles |
| is_active | TINYINT(1) | | Active status |
| last_login | TIMESTAMP | | Last login time |

#### 12. `roles`
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| role_id | INT | PK | Auto-increment |
| role_name | VARCHAR(50) | UNI | Role name |
| role_code | VARCHAR(20) | UNI | Role code |
| permissions | LONGTEXT | | JSON permissions |

#### 13. `user_centers`
Links users to centers they manage
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| user_center_id | INT | PK | Auto-increment |
| user_id | INT | FK | → users |
| center_id | INT | FK | → centers |
| is_lead_consultant | TINYINT(1) | | Lead consultant flag |
| assigned_date | DATE | | Assignment date |

### Submission Workflow

#### 14. `program_submissions`
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| submission_id | INT | PK | Auto-increment |
| center_id | INT | FK | → centers |
| submitted_by | INT | FK | → users |
| submission_date | TIMESTAMP | | Submission date |
| submission_status | ENUM | | draft/submitted/under_review/approved/rejected |
| notes | TEXT | | Submission notes |
| reviewed_by | INT | FK | → users |
| reviewed_at | TIMESTAMP | | Review date |
| review_comments | TEXT | | Review comments |

#### 15. `submission_programs`
Links submissions to programs
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| submission_program_id | INT | PK | Auto-increment |
| submission_id | INT | FK | → program_submissions |
| program_id | INT | FK | → programs |

#### 16. `submission_notes`
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| note_id | INT | PK | Auto-increment |
| submission_id | INT | FK | → program_submissions |
| note_content | TEXT | | Note content |
| note_type | ENUM | | general/time_estimate/partnership/other |
| created_by | INT | FK | → users |

### Audit & Logging

#### 17. `audit_log`
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| log_id | INT | PK | Auto-increment |
| user_id | INT | FK | → users |
| action | VARCHAR(50) | | Action performed |
| table_name | VARCHAR(50) | | Affected table |
| record_id | INT | | Affected record ID |
| old_values | LONGTEXT | | Previous values (JSON) |
| new_values | LONGTEXT | | New values (JSON) |
| ip_address | VARCHAR(45) | | Client IP |
| created_at | TIMESTAMP | | Action timestamp |

---

## Foreign Key Relationships Summary

| From Table | Column | To Table | Column |
|------------|--------|----------|--------|
| audit_log | user_id | users | user_id |
| center_associations | center_id | centers | center_id |
| center_associations | association_id | student_associations | association_id |
| cross_center_requests | program_id | programs | program_id |
| cross_center_requests | requesting_center_id | centers | center_id |
| programs | center_id | centers | center_id |
| programs | program_type_id | program_types | program_type_id |
| programs | created_by | users | user_id |
| programs | approved_by | users | user_id |
| program_associations | program_id | programs | program_id |
| program_associations | association_id | student_associations | association_id |
| program_partners | program_id | programs | program_id |
| program_partners | partner_id | external_partners | partner_id |
| program_placements | program_id | programs | program_id |
| program_placements | placement_partner_id | placement_partners | placement_partner_id |
| program_submissions | center_id | centers | center_id |
| program_submissions | submitted_by | users | user_id |
| program_submissions | reviewed_by | users | user_id |
| submission_notes | submission_id | program_submissions | submission_id |
| submission_notes | created_by | users | user_id |
| submission_programs | submission_id | program_submissions | submission_id |
| submission_programs | program_id | programs | program_id |
| users | role_id | roles | role_id |
| user_centers | user_id | users | user_id |
| user_centers | center_id | centers | center_id |

---

## Database Views

| View Name | Description |
|-----------|-------------|
| vw_program_details | Complete program information with center and type details |
| vw_program_partners | Programs with their external partners |
| vw_program_associations | Programs with their student associations |

---

*Generated: January 2026*
*Database: MySQL/MariaDB*
*Project: COE Program Framework (SEDF)*
