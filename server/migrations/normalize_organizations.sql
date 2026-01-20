-- ============================================================================
-- COE Program Framework - Database Normalization Migration
-- Merge external_partners, placement_partners, student_associations into
-- a single organizations table with organization_types
-- ============================================================================
-- Run this migration with: mysql -u coe_user -p coe_program_framework < normalize_organizations.sql
-- ============================================================================

-- Start transaction
START TRANSACTION;

-- ============================================================================
-- STEP 1: Create organization_types table
-- ============================================================================
CREATE TABLE IF NOT EXISTS organization_types (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    type_code VARCHAR(30) NOT NULL UNIQUE,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert organization types
INSERT INTO organization_types (type_name, type_code, description) VALUES
('External Partner', 'EXTERNAL_PARTNER', 'Industry, academic, government, or NGO partners for program collaboration'),
('Placement Partner', 'PLACEMENT_PARTNER', 'Organizations providing internships, jobs, training, or exposure opportunities'),
('Student Association', 'STUDENT_ASSOCIATION', 'Student clubs and associations involved in program activities');

-- ============================================================================
-- STEP 2: Create organizations table
-- ============================================================================
CREATE TABLE IF NOT EXISTS organizations (
    organization_id INT AUTO_INCREMENT PRIMARY KEY,
    type_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30),
    industry_sector VARCHAR(100),
    sub_type VARCHAR(50) COMMENT 'e.g., industry/academic/government/ngo for external, internship/job/training for placement',
    contact_person VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    website VARCHAR(255),
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES organization_types(type_id),
    INDEX idx_org_type (type_id),
    INDEX idx_org_name (name),
    INDEX idx_org_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- STEP 3: Migrate data from external_partners
-- ============================================================================
INSERT INTO organizations (type_id, name, code, industry_sector, sub_type, contact_person, contact_email, contact_phone, website, description, is_active, created_at, updated_at)
SELECT 
    1 AS type_id,  -- EXTERNAL_PARTNER
    partner_name AS name,
    NULL AS code,
    NULL AS industry_sector,
    partner_type AS sub_type,
    NULL AS contact_person,
    contact_email,
    contact_phone,
    website,
    address AS description,
    is_active,
    created_at,
    updated_at
FROM external_partners;

-- ============================================================================
-- STEP 4: Migrate data from placement_partners
-- ============================================================================
INSERT INTO organizations (type_id, name, code, industry_sector, sub_type, contact_person, contact_email, contact_phone, website, description, is_active, created_at, updated_at)
SELECT 
    2 AS type_id,  -- PLACEMENT_PARTNER
    partner_name AS name,
    NULL AS code,
    industry_sector,
    placement_type AS sub_type,
    contact_person,
    contact_email,
    contact_phone,
    NULL AS website,
    NULL AS description,
    is_active,
    created_at,
    updated_at
FROM placement_partners;

-- ============================================================================
-- STEP 5: Migrate data from student_associations
-- ============================================================================
INSERT INTO organizations (type_id, name, code, industry_sector, sub_type, contact_person, contact_email, contact_phone, website, description, is_active, created_at, updated_at)
SELECT 
    3 AS type_id,  -- STUDENT_ASSOCIATION
    association_name AS name,
    association_code AS code,
    NULL AS industry_sector,
    NULL AS sub_type,
    NULL AS contact_person,
    NULL AS contact_email,
    NULL AS contact_phone,
    NULL AS website,
    description,
    is_active,
    created_at,
    updated_at
FROM student_associations;

-- ============================================================================
-- STEP 6: Create program_organizations junction table
-- ============================================================================
CREATE TABLE IF NOT EXISTS program_organizations (
    program_organization_id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    organization_id INT NOT NULL,
    relationship_type ENUM('primary', 'secondary', 'supporting', 'affiliated') DEFAULT 'primary',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id) ON DELETE CASCADE,
    UNIQUE KEY unique_program_org (program_id, organization_id),
    INDEX idx_po_program (program_id),
    INDEX idx_po_org (organization_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- STEP 7: Migrate data from program_partners (external partners)
-- ============================================================================
INSERT INTO program_organizations (program_id, organization_id, relationship_type, notes, created_at)
SELECT 
    pp.program_id,
    o.organization_id,
    pp.partnership_type AS relationship_type,
    pp.partnership_notes AS notes,
    pp.created_at
FROM program_partners pp
JOIN external_partners ep ON pp.partner_id = ep.partner_id
JOIN organizations o ON o.name = ep.partner_name AND o.type_id = 1
ON DUPLICATE KEY UPDATE notes = VALUES(notes);

-- ============================================================================
-- STEP 8: Migrate data from program_placements (placement partners)
-- ============================================================================
INSERT INTO program_organizations (program_id, organization_id, relationship_type, notes, created_at)
SELECT 
    ppl.program_id,
    o.organization_id,
    'primary' AS relationship_type,
    ppl.placement_notes AS notes,
    ppl.created_at
FROM program_placements ppl
JOIN placement_partners plp ON ppl.placement_partner_id = plp.placement_partner_id
JOIN organizations o ON o.name = plp.partner_name AND o.type_id = 2
ON DUPLICATE KEY UPDATE notes = VALUES(notes);

-- ============================================================================
-- STEP 9: Migrate data from program_associations (student associations)
-- ============================================================================
INSERT INTO program_organizations (program_id, organization_id, relationship_type, notes, created_at)
SELECT 
    pa.program_id,
    o.organization_id,
    pa.involvement_type AS relationship_type,
    NULL AS notes,
    pa.created_at
FROM program_associations pa
JOIN student_associations sa ON pa.association_id = sa.association_id
JOIN organizations o ON o.name = sa.association_name AND o.type_id = 3
ON DUPLICATE KEY UPDATE relationship_type = VALUES(relationship_type);

-- ============================================================================
-- STEP 10: Create views for backward compatibility
-- ============================================================================

-- View for external partners (backward compatibility)
CREATE OR REPLACE VIEW vw_external_partners AS
SELECT 
    organization_id AS partner_id,
    name AS partner_name,
    sub_type AS partner_type,
    industry_sector,
    contact_person,
    contact_email,
    contact_phone,
    website,
    is_active,
    created_at,
    updated_at
FROM organizations
WHERE type_id = 1;

-- View for placement partners (backward compatibility)
CREATE OR REPLACE VIEW vw_placement_partners AS
SELECT 
    organization_id AS placement_partner_id,
    name AS partner_name,
    industry_sector,
    sub_type AS placement_type,
    contact_person,
    contact_email,
    contact_phone,
    is_active,
    created_at,
    updated_at
FROM organizations
WHERE type_id = 2;

-- View for student associations (backward compatibility)
CREATE OR REPLACE VIEW vw_student_associations AS
SELECT 
    organization_id AS association_id,
    name AS association_name,
    code AS association_code,
    description,
    is_active,
    created_at,
    updated_at
FROM organizations
WHERE type_id = 3;

-- View for program organizations with details
CREATE OR REPLACE VIEW vw_program_organizations AS
SELECT 
    po.program_organization_id,
    po.program_id,
    p.module_name AS program_name,
    po.organization_id,
    o.name AS organization_name,
    o.code AS organization_code,
    ot.type_id,
    ot.type_name AS organization_type,
    ot.type_code AS organization_type_code,
    o.industry_sector,
    o.sub_type,
    po.relationship_type,
    po.notes,
    po.created_at
FROM program_organizations po
JOIN programs p ON po.program_id = p.program_id
JOIN organizations o ON po.organization_id = o.organization_id
JOIN organization_types ot ON o.type_id = ot.type_id;

-- Commit transaction
COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES (run these to verify migration)
-- ============================================================================
-- SELECT 'Organization Types' AS table_name, COUNT(*) AS count FROM organization_types
-- UNION ALL
-- SELECT 'Organizations', COUNT(*) FROM organizations
-- UNION ALL
-- SELECT 'Program Organizations', COUNT(*) FROM program_organizations
-- UNION ALL
-- SELECT 'External Partners (original)', COUNT(*) FROM external_partners
-- UNION ALL
-- SELECT 'Placement Partners (original)', COUNT(*) FROM placement_partners
-- UNION ALL
-- SELECT 'Student Associations (original)', COUNT(*) FROM student_associations;

-- ============================================================================
-- CLEANUP (run these AFTER verifying migration is successful)
-- Uncomment and run separately after verification
-- ============================================================================
-- DROP TABLE IF EXISTS program_partners;
-- DROP TABLE IF EXISTS program_placements;
-- DROP TABLE IF EXISTS program_associations;
-- DROP TABLE IF EXISTS center_associations;
-- DROP TABLE IF EXISTS external_partners;
-- DROP TABLE IF EXISTS placement_partners;
-- DROP TABLE IF EXISTS student_associations;
