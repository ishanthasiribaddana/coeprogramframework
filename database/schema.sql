-- COE Program Framework Database Schema
-- 100% Normalized (3NF/BCNF)
-- Created for Ananda College Center of Excellence

-- =====================================================
-- DROP EXISTING TABLES (for clean setup)
-- =====================================================
DROP DATABASE IF EXISTS coe_program_framework;
CREATE DATABASE coe_program_framework;
USE coe_program_framework;

-- =====================================================
-- LOOKUP/REFERENCE TABLES (No dependencies)
-- =====================================================

-- Centers Table (1NF, 2NF, 3NF compliant)
CREATE TABLE centers (
    center_id INT AUTO_INCREMENT PRIMARY KEY,
    center_name VARCHAR(100) NOT NULL UNIQUE,
    center_code VARCHAR(20) NOT NULL UNIQUE,
    icon VARCHAR(10),
    color_gradient VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Program Types Table (Advanced, STEAM, Cross-Center)
CREATE TABLE program_types (
    program_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    type_code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Student Associations Table
CREATE TABLE student_associations (
    association_id INT AUTO_INCREMENT PRIMARY KEY,
    association_name VARCHAR(150) NOT NULL UNIQUE,
    association_code VARCHAR(30) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- External Partners Table (Companies, Organizations)
CREATE TABLE external_partners (
    partner_id INT AUTO_INCREMENT PRIMARY KEY,
    partner_name VARCHAR(150) NOT NULL,
    partner_type ENUM('company', 'organization', 'institution', 'government', 'ngo') DEFAULT 'company',
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    website VARCHAR(255),
    address TEXT,
    mou_status ENUM('none', 'pending', 'active', 'expired') DEFAULT 'none',
    mou_expiry_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_partner (partner_name, partner_type)
) ENGINE=InnoDB;

-- Career Guidance Placement Partners
CREATE TABLE placement_partners (
    placement_partner_id INT AUTO_INCREMENT PRIMARY KEY,
    partner_name VARCHAR(150) NOT NULL,
    industry_sector VARCHAR(100),
    placement_type ENUM('internship', 'job', 'training', 'exposure') DEFAULT 'exposure',
    contact_person VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_placement (partner_name, placement_type)
) ENGINE=InnoDB;

-- =====================================================
-- USER MANAGEMENT TABLES
-- =====================================================

-- Roles Table
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_code VARCHAR(20) NOT NULL UNIQUE,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Users Table (Lead Consultants, Admins)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- User-Center Assignment (Many-to-Many: A user can manage multiple centers)
CREATE TABLE user_centers (
    user_center_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    center_id INT NOT NULL,
    is_lead_consultant BOOLEAN DEFAULT FALSE,
    assigned_date DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (center_id) REFERENCES centers(center_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_center (user_id, center_id)
) ENGINE=InnoDB;

-- =====================================================
-- CORE PROGRAM TABLES
-- =====================================================

-- Programs Table (Main entity)
CREATE TABLE programs (
    program_id INT AUTO_INCREMENT PRIMARY KEY,
    center_id INT NOT NULL,
    program_type_id INT NOT NULL,
    module_name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_min_hours DECIMAL(6,1),
    duration_max_hours DECIMAL(6,1),
    duration_notes VARCHAR(100),
    status ENUM('draft', 'submitted', 'approved', 'active', 'archived') DEFAULT 'draft',
    created_by INT,
    approved_by INT,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (center_id) REFERENCES centers(center_id) ON DELETE RESTRICT,
    FOREIGN KEY (program_type_id) REFERENCES program_types(program_type_id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_center_type (center_id, program_type_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Cross-Center Program Requests (For Cross-Center Programs)
CREATE TABLE cross_center_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    requesting_center_id INT NOT NULL,
    request_notes TEXT,
    request_status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE CASCADE,
    FOREIGN KEY (requesting_center_id) REFERENCES centers(center_id) ON DELETE RESTRICT,
    UNIQUE KEY unique_program_request (program_id, requesting_center_id)
) ENGINE=InnoDB;

-- =====================================================
-- JUNCTION/ASSOCIATION TABLES (Many-to-Many Relationships)
-- =====================================================

-- Program-External Partners (Many-to-Many)
CREATE TABLE program_partners (
    program_partner_id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    partner_id INT NOT NULL,
    partnership_type ENUM('primary', 'secondary', 'supporting') DEFAULT 'primary',
    partnership_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE CASCADE,
    FOREIGN KEY (partner_id) REFERENCES external_partners(partner_id) ON DELETE CASCADE,
    UNIQUE KEY unique_program_partner (program_id, partner_id)
) ENGINE=InnoDB;

-- Program-Placement Partners (Many-to-Many)
CREATE TABLE program_placements (
    program_placement_id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    placement_partner_id INT NOT NULL,
    placement_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE CASCADE,
    FOREIGN KEY (placement_partner_id) REFERENCES placement_partners(placement_partner_id) ON DELETE CASCADE,
    UNIQUE KEY unique_program_placement (program_id, placement_partner_id)
) ENGINE=InnoDB;

-- Program-Student Associations (Many-to-Many)
CREATE TABLE program_associations (
    program_association_id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    association_id INT NOT NULL,
    involvement_type ENUM('primary', 'supporting', 'affiliated') DEFAULT 'affiliated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE CASCADE,
    FOREIGN KEY (association_id) REFERENCES student_associations(association_id) ON DELETE CASCADE,
    UNIQUE KEY unique_program_association (program_id, association_id)
) ENGINE=InnoDB;

-- Center-Student Associations (Which associations are relevant to which centers)
CREATE TABLE center_associations (
    center_association_id INT AUTO_INCREMENT PRIMARY KEY,
    center_id INT NOT NULL,
    association_id INT NOT NULL,
    relevance_level ENUM('high', 'medium', 'low') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (center_id) REFERENCES centers(center_id) ON DELETE CASCADE,
    FOREIGN KEY (association_id) REFERENCES student_associations(association_id) ON DELETE CASCADE,
    UNIQUE KEY unique_center_association (center_id, association_id)
) ENGINE=InnoDB;

-- =====================================================
-- SUBMISSION/REPORT TABLES
-- =====================================================

-- Program Submissions (When a center submits their program data)
CREATE TABLE program_submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    center_id INT NOT NULL,
    submitted_by INT NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submission_status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected') DEFAULT 'draft',
    notes TEXT,
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    review_comments TEXT,
    FOREIGN KEY (center_id) REFERENCES centers(center_id) ON DELETE RESTRICT,
    FOREIGN KEY (submitted_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_center_status (center_id, submission_status)
) ENGINE=InnoDB;

-- Submission-Program Link (Which programs are in which submission)
CREATE TABLE submission_programs (
    submission_program_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    program_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES program_submissions(submission_id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE CASCADE,
    UNIQUE KEY unique_submission_program (submission_id, program_id)
) ENGINE=InnoDB;

-- Additional Notes (Per submission)
CREATE TABLE submission_notes (
    note_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    note_content TEXT NOT NULL,
    note_type ENUM('general', 'time_estimate', 'partnership', 'other') DEFAULT 'general',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES program_submissions(submission_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================
-- AUDIT/HISTORY TABLES
-- =====================================================

-- Audit Log for tracking changes
CREATE TABLE audit_log (
    audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    user_id INT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_user_action (user_id, action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =====================================================
-- INITIAL DATA INSERTS
-- =====================================================

-- Insert Program Types
INSERT INTO program_types (type_name, type_code, description, is_mandatory, display_order) VALUES
('Advanced Programs', 'ADVANCED', 'Programs not currently conducted by the school that build employment-ready skills', TRUE, 1),
('STEAM Programs', 'STEAM', 'Programs that integrate across centers and complement STEAM Hub projects', TRUE, 2),
('Cross Center Programs', 'CROSS_CENTER', 'Programs requested from other centers to eliminate duplication', FALSE, 3);

-- Insert Centers
INSERT INTO centers (center_name, center_code, icon, color_gradient, description) VALUES
('AI Center', 'AI', '🤖', 'from-violet-500 to-purple-600', 'Artificial Intelligence and Machine Learning programs'),
('STEAM Hub', 'STEAM', '⚡', 'from-orange-500 to-red-600', 'Science, Technology, Engineering, Arts, and Mathematics integration hub'),
('Language Center', 'LANG', '📚', 'from-blue-500 to-cyan-600', 'Language skills and communication programs'),
('Auditorium', 'AUD', '🎭', 'from-pink-500 to-rose-600', 'Presentation, public speaking, and performance programs'),
('Science Center', 'SCI', '🔬', 'from-green-500 to-emerald-600', 'Scientific research and experimentation programs'),
('Entrepreneurship Center', 'ENTREP', '💼', 'from-amber-500 to-yellow-600', 'Business, startup, and entrepreneurship programs'),
('Media Center', 'MEDIA', '🎬', 'from-indigo-500 to-blue-600', 'Digital media, content creation, and marketing programs'),
('Mathematics Center', 'MATH', '📐', 'from-teal-500 to-cyan-600', 'Advanced mathematics and computational programs'),
('Fine Arts Center', 'FARTS', '🎨', 'from-fuchsia-500 to-pink-600', 'Visual arts, design, and creative programs'),
('Performing Arts Center', 'PARTS', '🎵', 'from-rose-500 to-red-600', 'Music, dance, and theatrical performance programs');

-- Insert Student Associations
INSERT INTO student_associations (association_name, association_code, description) VALUES
('Information and Communication Technology Unit', 'ICT', 'Technology and computing focused association'),
('Inventors'' Association', 'INVENTORS', 'Innovation and invention focused association'),
('Entrepreneurship Association', 'ENTREP_ASSOC', 'Business and startup focused association'),
('Engineering Technology Association', 'ENG_TECH', 'Engineering and technical skills association'),
('Robotics Association', 'ROBOTICS', 'Robotics and automation focused association'),
('Green Energy Association', 'GREEN_ENERGY', 'Sustainable energy and environment association'),
('Research and Exploration Society', 'RESEARCH', 'Scientific research and exploration association');

-- Insert Roles
INSERT INTO roles (role_name, role_code, permissions) VALUES
('Administrator', 'ADMIN', '{"all": true}'),
('Lead Consultant', 'LEAD_CONSULTANT', '{"centers": ["manage_programs", "submit", "view_reports"]}'),
('Reviewer', 'REVIEWER', '{"centers": ["review", "approve", "view_reports"]}'),
('Viewer', 'VIEWER', '{"centers": ["view"]}');

-- Insert Sample External Partners (from AI and STEAM Hub data)
INSERT INTO external_partners (partner_name, partner_type, mou_status) VALUES
('MagicBit', 'company', 'active'),
('Engineers Guild', 'organization', 'pending'),
('RoboticGen', 'company', 'active'),
('Revox', 'company', 'pending'),
('All Digital Specialty', 'company', 'pending'),
('NCinga', 'company', 'pending'),
('MicroImage', 'company', 'pending'),
('Calcey', 'company', 'pending'),
('Surge', 'company', 'pending');

-- Insert Sample Placement Partners
INSERT INTO placement_partners (partner_name, industry_sector, placement_type) VALUES
('Codegen', 'Software Development', 'internship'),
('Senzmate', 'IoT Solutions', 'internship'),
('IOTex', 'IoT Solutions', 'exposure'),
('TechFonist', 'Technology', 'exposure'),
('ELZIAN AGRO', 'Agriculture Technology', 'exposure'),
('RagenTec Systems', 'Technology', 'internship'),
('Zone24', 'Technology', 'exposure');

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Complete Program Details
CREATE VIEW vw_program_details AS
SELECT 
    p.program_id,
    p.module_name,
    p.description AS program_description,
    CONCAT(p.duration_min_hours, '-', p.duration_max_hours) AS duration_range,
    p.status,
    c.center_name,
    c.center_code,
    c.icon AS center_icon,
    pt.type_name AS program_type,
    pt.type_code AS program_type_code,
    p.created_at,
    p.updated_at
FROM programs p
JOIN centers c ON p.center_id = c.center_id
JOIN program_types pt ON p.program_type_id = pt.program_type_id;

-- View: Program with Partners
CREATE VIEW vw_program_partners AS
SELECT 
    p.program_id,
    p.module_name,
    c.center_name,
    GROUP_CONCAT(DISTINCT ep.partner_name SEPARATOR ', ') AS external_partners,
    GROUP_CONCAT(DISTINCT pp.partner_name SEPARATOR ', ') AS placement_partners
FROM programs p
JOIN centers c ON p.center_id = c.center_id
LEFT JOIN program_partners prp ON p.program_id = prp.program_id
LEFT JOIN external_partners ep ON prp.partner_id = ep.partner_id
LEFT JOIN program_placements ppl ON p.program_id = ppl.program_id
LEFT JOIN placement_partners pp ON ppl.placement_partner_id = pp.placement_partner_id
GROUP BY p.program_id, p.module_name, c.center_name;

-- View: Program with Associations
CREATE VIEW vw_program_associations AS
SELECT 
    p.program_id,
    p.module_name,
    c.center_name,
    GROUP_CONCAT(sa.association_name SEPARATOR ', ') AS student_associations
FROM programs p
JOIN centers c ON p.center_id = c.center_id
LEFT JOIN program_associations pa ON p.program_id = pa.program_id
LEFT JOIN student_associations sa ON pa.association_id = sa.association_id
GROUP BY p.program_id, p.module_name, c.center_name;

-- View: Center Summary
CREATE VIEW vw_center_summary AS
SELECT 
    c.center_id,
    c.center_name,
    c.center_code,
    c.icon,
    COUNT(DISTINCT CASE WHEN pt.type_code = 'ADVANCED' THEN p.program_id END) AS advanced_programs_count,
    COUNT(DISTINCT CASE WHEN pt.type_code = 'STEAM' THEN p.program_id END) AS steam_programs_count,
    COUNT(DISTINCT CASE WHEN pt.type_code = 'CROSS_CENTER' THEN p.program_id END) AS cross_center_programs_count,
    COUNT(DISTINCT p.program_id) AS total_programs
FROM centers c
LEFT JOIN programs p ON c.center_id = p.center_id
LEFT JOIN program_types pt ON p.program_type_id = pt.program_type_id
GROUP BY c.center_id, c.center_name, c.center_code, c.icon;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure: Get all programs for a center
CREATE PROCEDURE sp_get_center_programs(IN p_center_id INT)
BEGIN
    SELECT 
        p.program_id,
        p.module_name,
        pt.type_name AS program_type,
        CONCAT(COALESCE(p.duration_min_hours, ''), '-', COALESCE(p.duration_max_hours, '')) AS duration,
        GROUP_CONCAT(DISTINCT ep.partner_name SEPARATOR ', ') AS partnerships,
        GROUP_CONCAT(DISTINCT pp.partner_name SEPARATOR ', ') AS career_guidance,
        GROUP_CONCAT(DISTINCT sa.association_name SEPARATOR ', ') AS associations,
        p.status,
        p.created_at
    FROM programs p
    JOIN program_types pt ON p.program_type_id = pt.program_type_id
    LEFT JOIN program_partners prp ON p.program_id = prp.program_id
    LEFT JOIN external_partners ep ON prp.partner_id = ep.partner_id
    LEFT JOIN program_placements ppl ON p.program_id = ppl.program_id
    LEFT JOIN placement_partners pp ON ppl.placement_partner_id = pp.placement_partner_id
    LEFT JOIN program_associations pa ON p.program_id = pa.program_id
    LEFT JOIN student_associations sa ON pa.association_id = sa.association_id
    WHERE p.center_id = p_center_id
    GROUP BY p.program_id, p.module_name, pt.type_name, p.duration_min_hours, p.duration_max_hours, p.status, p.created_at
    ORDER BY pt.display_order, p.created_at;
END //

-- Procedure: Create a new program with associations
CREATE PROCEDURE sp_create_program(
    IN p_center_id INT,
    IN p_program_type_id INT,
    IN p_module_name VARCHAR(255),
    IN p_description TEXT,
    IN p_duration_min DECIMAL(6,1),
    IN p_duration_max DECIMAL(6,1),
    IN p_created_by INT,
    OUT p_program_id INT
)
BEGIN
    INSERT INTO programs (center_id, program_type_id, module_name, description, duration_min_hours, duration_max_hours, created_by)
    VALUES (p_center_id, p_program_type_id, p_module_name, p_description, p_duration_min, p_duration_max, p_created_by);
    
    SET p_program_id = LAST_INSERT_ID();
END //

-- Procedure: Generate center report
CREATE PROCEDURE sp_generate_center_report(IN p_center_id INT)
BEGIN
    -- Center Info
    SELECT center_name, center_code, icon, description 
    FROM centers WHERE center_id = p_center_id;
    
    -- Advanced Programs
    SELECT p.module_name, p.duration_min_hours, p.duration_max_hours,
           GROUP_CONCAT(DISTINCT ep.partner_name) AS partnerships,
           GROUP_CONCAT(DISTINCT pp.partner_name) AS placements,
           GROUP_CONCAT(DISTINCT sa.association_name) AS associations
    FROM programs p
    JOIN program_types pt ON p.program_type_id = pt.program_type_id
    LEFT JOIN program_partners prp ON p.program_id = prp.program_id
    LEFT JOIN external_partners ep ON prp.partner_id = ep.partner_id
    LEFT JOIN program_placements ppl ON p.program_id = ppl.program_id
    LEFT JOIN placement_partners pp ON ppl.placement_partner_id = pp.placement_partner_id
    LEFT JOIN program_associations pa ON p.program_id = pa.program_id
    LEFT JOIN student_associations sa ON pa.association_id = sa.association_id
    WHERE p.center_id = p_center_id AND pt.type_code = 'ADVANCED'
    GROUP BY p.program_id;
    
    -- STEAM Programs
    SELECT p.module_name, p.duration_min_hours, p.duration_max_hours,
           GROUP_CONCAT(DISTINCT ep.partner_name) AS partnerships,
           GROUP_CONCAT(DISTINCT pp.partner_name) AS placements,
           GROUP_CONCAT(DISTINCT sa.association_name) AS associations
    FROM programs p
    JOIN program_types pt ON p.program_type_id = pt.program_type_id
    LEFT JOIN program_partners prp ON p.program_id = prp.program_id
    LEFT JOIN external_partners ep ON prp.partner_id = ep.partner_id
    LEFT JOIN program_placements ppl ON p.program_id = ppl.program_id
    LEFT JOIN placement_partners pp ON ppl.placement_partner_id = pp.placement_partner_id
    LEFT JOIN program_associations pa ON p.program_id = pa.program_id
    LEFT JOIN student_associations sa ON pa.association_id = sa.association_id
    WHERE p.center_id = p_center_id AND pt.type_code = 'STEAM'
    GROUP BY p.program_id;
    
    -- Cross Center Programs
    SELECT p.module_name, rc.center_name AS requesting_center,
           p.duration_min_hours, p.duration_max_hours
    FROM programs p
    JOIN program_types pt ON p.program_type_id = pt.program_type_id
    LEFT JOIN cross_center_requests ccr ON p.program_id = ccr.program_id
    LEFT JOIN centers rc ON ccr.requesting_center_id = rc.center_id
    WHERE p.center_id = p_center_id AND pt.type_code = 'CROSS_CENTER';
END //

DELIMITER ;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_programs_center ON programs(center_id);
CREATE INDEX idx_programs_type ON programs(program_type_id);
CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_program_partners_program ON program_partners(program_id);
CREATE INDEX idx_program_placements_program ON program_placements(program_id);
CREATE INDEX idx_program_associations_program ON program_associations(program_id);
CREATE INDEX idx_submissions_center ON program_submissions(center_id);
CREATE INDEX idx_submissions_status ON program_submissions(submission_status);

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
