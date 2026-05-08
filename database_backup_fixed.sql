-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: coe_program_framework
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_log`
--

DROP TABLE IF EXISTS `audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log` (
  `audit_id` bigint NOT NULL AUTO_INCREMENT,
  `table_name` varchar(50) NOT NULL,
  `record_id` int NOT NULL,
  `action` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`audit_id`),
  KEY `idx_table_record` (`table_name`,`record_id`),
  KEY `idx_user_action` (`user_id`,`action`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `audit_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_log`
--

LOCK TABLES `audit_log` WRITE;
/*!40000 ALTER TABLE `audit_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `center_associations`
--

DROP TABLE IF EXISTS `center_associations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `center_associations` (
  `center_association_id` int NOT NULL AUTO_INCREMENT,
  `center_id` int NOT NULL,
  `association_id` int NOT NULL,
  `relevance_level` enum('high','medium','low') DEFAULT 'medium',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`center_association_id`),
  UNIQUE KEY `unique_center_association` (`center_id`,`association_id`),
  KEY `association_id` (`association_id`),
  CONSTRAINT `center_associations_ibfk_1` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`) ON DELETE CASCADE,
  CONSTRAINT `center_associations_ibfk_2` FOREIGN KEY (`association_id`) REFERENCES `student_associations` (`association_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `center_associations`
--

LOCK TABLES `center_associations` WRITE;
/*!40000 ALTER TABLE `center_associations` DISABLE KEYS */;
/*!40000 ALTER TABLE `center_associations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `centers`
--

DROP TABLE IF EXISTS `centers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `centers` (
  `center_id` int NOT NULL AUTO_INCREMENT,
  `center_name` varchar(100) NOT NULL,
  `center_code` varchar(20) NOT NULL,
  `icon` varchar(10) DEFAULT NULL,
  `color_gradient` varchar(100) DEFAULT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`center_id`),
  UNIQUE KEY `center_name` (`center_name`),
  UNIQUE KEY `center_code` (`center_code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `centers`
--

LOCK TABLES `centers` WRITE;
/*!40000 ALTER TABLE `centers` DISABLE KEYS */;
INSERT INTO `centers` VALUES (1,'AI Center','AI','-°„∆+¶++','from-violet-500 to-purple-600','Artificial Intelligence and Machine Learning programs',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(2,'STEAM Hub','STEAM','+ˆ+£+°','from-orange-500 to-red-600','Science, Technology, Engineering, Arts, and Mathematics integration hub',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(3,'Language Center','LANG','-°„∆+¶+£','from-blue-500 to-cyan-600','Language skills and communication programs',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(4,'Auditorium','AUD','-°„∆+‰-Ì','from-pink-500 to-rose-600','Presentation, public speaking, and performance programs',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(5,'Science Center','SCI','-°„∆+¬-+','from-green-500 to-emerald-600','Scientific research and experimentation programs',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(6,'Entrepreneurship Center','ENTREP','-°„∆+Â‘Úÿ','from-amber-500 to-yellow-600','Business, startup, and entrepreneurship programs',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(7,'Media Center','MEDIA','-°„∆+‰-+','from-indigo-500 to-blue-600','Digital media, content creation, and marketing programs',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(8,'Mathematics Center','MATH','-°„∆+¶+Î','from-teal-500 to-cyan-600','Advanced mathematics and computational programs',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(9,'Fine Arts Center','FARTS','-°„∆+‰-+','from-fuchsia-500 to-pink-600','Visual arts, design, and creative programs',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(10,'Performing Arts Center','PARTS','-°„∆+‰+¸','from-rose-500 to-red-600','Music, dance, and theatrical performance programs',1,'2025-12-19 21:06:02','2025-12-19 21:06:02');
/*!40000 ALTER TABLE `centers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cross_center_requests`
--

DROP TABLE IF EXISTS `cross_center_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cross_center_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `requesting_center_id` int NOT NULL,
  `request_notes` text,
  `request_status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  UNIQUE KEY `unique_program_request` (`program_id`,`requesting_center_id`),
  KEY `requesting_center_id` (`requesting_center_id`),
  CONSTRAINT `cross_center_requests_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`) ON DELETE CASCADE,
  CONSTRAINT `cross_center_requests_ibfk_2` FOREIGN KEY (`requesting_center_id`) REFERENCES `centers` (`center_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cross_center_requests`
--

LOCK TABLES `cross_center_requests` WRITE;
/*!40000 ALTER TABLE `cross_center_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `cross_center_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `external_partners`
--

DROP TABLE IF EXISTS `external_partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `external_partners` (
  `partner_id` int NOT NULL AUTO_INCREMENT,
  `partner_name` varchar(150) NOT NULL,
  `partner_type` enum('company','organization','institution','government','ngo') DEFAULT 'company',
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `address` text,
  `mou_status` enum('none','pending','active','expired') DEFAULT 'none',
  `mou_expiry_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`partner_id`),
  UNIQUE KEY `unique_partner` (`partner_name`,`partner_type`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `external_partners`
--

LOCK TABLES `external_partners` WRITE;
/*!40000 ALTER TABLE `external_partners` DISABLE KEYS */;
INSERT INTO `external_partners` VALUES (1,'MagicBit','company',NULL,NULL,NULL,NULL,'active',NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(2,'Engineers Guild','organization',NULL,NULL,NULL,NULL,'pending',NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(3,'RoboticGen','company',NULL,NULL,NULL,NULL,'active',NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(4,'Revox','company',NULL,NULL,NULL,NULL,'pending',NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(5,'All Digital Specialty','company',NULL,NULL,NULL,NULL,'pending',NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(6,'NCinga','company',NULL,NULL,NULL,NULL,'pending',NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(7,'MicroImage','company',NULL,NULL,NULL,NULL,'pending',NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(8,'Calcey','company',NULL,NULL,NULL,NULL,'pending',NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(9,'Surge','company',NULL,NULL,NULL,NULL,'pending',NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02');
/*!40000 ALTER TABLE `external_partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `placement_partners`
--

DROP TABLE IF EXISTS `placement_partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `placement_partners` (
  `placement_partner_id` int NOT NULL AUTO_INCREMENT,
  `partner_name` varchar(150) NOT NULL,
  `industry_sector` varchar(100) DEFAULT NULL,
  `placement_type` enum('internship','job','training','exposure') DEFAULT 'exposure',
  `contact_person` varchar(100) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`placement_partner_id`),
  UNIQUE KEY `unique_placement` (`partner_name`,`placement_type`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `placement_partners`
--

LOCK TABLES `placement_partners` WRITE;
/*!40000 ALTER TABLE `placement_partners` DISABLE KEYS */;
INSERT INTO `placement_partners` VALUES (1,'Codegen','Software Development','internship',NULL,NULL,NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(2,'Senzmate','IoT Solutions','internship',NULL,NULL,NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(3,'IOTex','IoT Solutions','exposure',NULL,NULL,NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(4,'TechFonist','Technology','exposure',NULL,NULL,NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(5,'ELZIAN AGRO','Agriculture Technology','exposure',NULL,NULL,NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(6,'RagenTec Systems','Technology','internship',NULL,NULL,NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(7,'Zone24','Technology','exposure',NULL,NULL,NULL,1,'2025-12-19 21:06:02','2025-12-19 21:06:02');
/*!40000 ALTER TABLE `placement_partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_associations`
--

DROP TABLE IF EXISTS `program_associations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program_associations` (
  `program_association_id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `association_id` int NOT NULL,
  `involvement_type` enum('primary','supporting','affiliated') DEFAULT 'affiliated',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`program_association_id`),
  UNIQUE KEY `unique_program_association` (`program_id`,`association_id`),
  KEY `association_id` (`association_id`),
  KEY `idx_program_associations_program` (`program_id`),
  CONSTRAINT `program_associations_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`) ON DELETE CASCADE,
  CONSTRAINT `program_associations_ibfk_2` FOREIGN KEY (`association_id`) REFERENCES `student_associations` (`association_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_associations`
--

LOCK TABLES `program_associations` WRITE;
/*!40000 ALTER TABLE `program_associations` DISABLE KEYS */;
/*!40000 ALTER TABLE `program_associations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_partners`
--

DROP TABLE IF EXISTS `program_partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program_partners` (
  `program_partner_id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `partner_id` int NOT NULL,
  `partnership_type` enum('primary','secondary','supporting') DEFAULT 'primary',
  `partnership_notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`program_partner_id`),
  UNIQUE KEY `unique_program_partner` (`program_id`,`partner_id`),
  KEY `partner_id` (`partner_id`),
  KEY `idx_program_partners_program` (`program_id`),
  CONSTRAINT `program_partners_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`) ON DELETE CASCADE,
  CONSTRAINT `program_partners_ibfk_2` FOREIGN KEY (`partner_id`) REFERENCES `external_partners` (`partner_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_partners`
--

LOCK TABLES `program_partners` WRITE;
/*!40000 ALTER TABLE `program_partners` DISABLE KEYS */;
/*!40000 ALTER TABLE `program_partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_placements`
--

DROP TABLE IF EXISTS `program_placements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program_placements` (
  `program_placement_id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `placement_partner_id` int NOT NULL,
  `placement_notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`program_placement_id`),
  UNIQUE KEY `unique_program_placement` (`program_id`,`placement_partner_id`),
  KEY `placement_partner_id` (`placement_partner_id`),
  KEY `idx_program_placements_program` (`program_id`),
  CONSTRAINT `program_placements_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`) ON DELETE CASCADE,
  CONSTRAINT `program_placements_ibfk_2` FOREIGN KEY (`placement_partner_id`) REFERENCES `placement_partners` (`placement_partner_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_placements`
--

LOCK TABLES `program_placements` WRITE;
/*!40000 ALTER TABLE `program_placements` DISABLE KEYS */;
/*!40000 ALTER TABLE `program_placements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_submissions`
--

DROP TABLE IF EXISTS `program_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program_submissions` (
  `submission_id` int NOT NULL AUTO_INCREMENT,
  `center_id` int NOT NULL,
  `submitted_by` int NOT NULL,
  `submission_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `submission_status` enum('draft','submitted','under_review','approved','rejected') DEFAULT 'draft',
  `notes` text,
  `reviewed_by` int DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_comments` text,
  PRIMARY KEY (`submission_id`),
  KEY `submitted_by` (`submitted_by`),
  KEY `reviewed_by` (`reviewed_by`),
  KEY `idx_center_status` (`center_id`,`submission_status`),
  KEY `idx_submissions_center` (`center_id`),
  KEY `idx_submissions_status` (`submission_status`),
  CONSTRAINT `program_submissions_ibfk_1` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`) ON DELETE RESTRICT,
  CONSTRAINT `program_submissions_ibfk_2` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT,
  CONSTRAINT `program_submissions_ibfk_3` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_submissions`
--

LOCK TABLES `program_submissions` WRITE;
/*!40000 ALTER TABLE `program_submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `program_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_types`
--

DROP TABLE IF EXISTS `program_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program_types` (
  `program_type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(50) NOT NULL,
  `type_code` varchar(20) NOT NULL,
  `description` text,
  `is_mandatory` tinyint(1) DEFAULT '0',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`program_type_id`),
  UNIQUE KEY `type_name` (`type_name`),
  UNIQUE KEY `type_code` (`type_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_types`
--

LOCK TABLES `program_types` WRITE;
/*!40000 ALTER TABLE `program_types` DISABLE KEYS */;
INSERT INTO `program_types` VALUES (1,'Advanced Programs','ADVANCED','Programs not currently conducted by the school that build employment-ready skills',1,1,'2025-12-19 21:06:02'),(2,'STEAM Programs','STEAM','Programs that integrate across centers and complement STEAM Hub projects',1,2,'2025-12-19 21:06:02'),(3,'Cross Center Programs','CROSS_CENTER','Programs requested from other centers to eliminate duplication',0,3,'2025-12-19 21:06:02');
/*!40000 ALTER TABLE `program_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programs` (
  `program_id` int NOT NULL AUTO_INCREMENT,
  `center_id` int NOT NULL,
  `program_type_id` int NOT NULL,
  `module_name` varchar(255) NOT NULL,
  `description` text,
  `duration_min_hours` decimal(6,1) DEFAULT NULL,
  `duration_max_hours` decimal(6,1) DEFAULT NULL,
  `duration_notes` varchar(100) DEFAULT NULL,
  `status` enum('draft','submitted','approved','active','archived') DEFAULT 'draft',
  `created_by` int DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`program_id`),
  KEY `created_by` (`created_by`),
  KEY `approved_by` (`approved_by`),
  KEY `idx_center_type` (`center_id`,`program_type_id`),
  KEY `idx_status` (`status`),
  KEY `idx_programs_center` (`center_id`),
  KEY `idx_programs_type` (`program_type_id`),
  KEY `idx_programs_status` (`status`),
  CONSTRAINT `programs_ibfk_1` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`) ON DELETE RESTRICT,
  CONSTRAINT `programs_ibfk_2` FOREIGN KEY (`program_type_id`) REFERENCES `program_types` (`program_type_id`) ON DELETE RESTRICT,
  CONSTRAINT `programs_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `programs_ibfk_4` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
INSERT INTO `programs` VALUES (84,3,1,'lc','Partnerships: , Career Guidance: ',NULL,NULL,NULL,'approved',NULL,NULL,NULL,'2025-12-19 23:05:48','2025-12-20 04:14:34'),(85,3,1,'lang','Partnerships: , Career Guidance: ',NULL,NULL,NULL,'approved',NULL,NULL,NULL,'2025-12-20 04:08:21','2025-12-20 04:14:34'),(86,4,1,'1','Partnerships: , Career Guidance: ',NULL,NULL,NULL,'approved',NULL,NULL,NULL,'2025-12-20 04:18:16','2025-12-20 04:21:55'),(87,4,1,'3','Partnerships: , Career Guidance: ',NULL,NULL,NULL,'approved',NULL,NULL,NULL,'2025-12-20 04:18:16','2025-12-20 04:21:55');
/*!40000 ALTER TABLE `programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `role_code` varchar(20) NOT NULL,
  `permissions` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`),
  UNIQUE KEY `role_code` (`role_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrator','ADMIN','{\"all\": true}','2025-12-19 21:06:02'),(2,'Lead Consultant','LEAD_CONSULTANT','{\"centers\": [\"manage_programs\", \"submit\", \"view_reports\"]}','2025-12-19 21:06:02'),(3,'Reviewer','REVIEWER','{\"centers\": [\"review\", \"approve\", \"view_reports\"]}','2025-12-19 21:06:02'),(4,'Viewer','VIEWER','{\"centers\": [\"view\"]}','2025-12-19 21:06:02');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_associations`
--

DROP TABLE IF EXISTS `student_associations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_associations` (
  `association_id` int NOT NULL AUTO_INCREMENT,
  `association_name` varchar(150) NOT NULL,
  `association_code` varchar(30) NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`association_id`),
  UNIQUE KEY `association_name` (`association_name`),
  UNIQUE KEY `association_code` (`association_code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_associations`
--

LOCK TABLES `student_associations` WRITE;
/*!40000 ALTER TABLE `student_associations` DISABLE KEYS */;
INSERT INTO `student_associations` VALUES (1,'Information and Communication Technology Unit','ICT','Technology and computing focused association',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(2,'Inventors\' Association','INVENTORS','Innovation and invention focused association',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(3,'Entrepreneurship Association','ENTREP_ASSOC','Business and startup focused association',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(4,'Engineering Technology Association','ENG_TECH','Engineering and technical skills association',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(5,'Robotics Association','ROBOTICS','Robotics and automation focused association',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(6,'Green Energy Association','GREEN_ENERGY','Sustainable energy and environment association',1,'2025-12-19 21:06:02','2025-12-19 21:06:02'),(7,'Research and Exploration Society','RESEARCH','Scientific research and exploration association',1,'2025-12-19 21:06:02','2025-12-19 21:06:02');
/*!40000 ALTER TABLE `student_associations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submission_notes`
--

DROP TABLE IF EXISTS `submission_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submission_notes` (
  `note_id` int NOT NULL AUTO_INCREMENT,
  `submission_id` int NOT NULL,
  `note_content` text NOT NULL,
  `note_type` enum('general','time_estimate','partnership','other') DEFAULT 'general',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`note_id`),
  KEY `submission_id` (`submission_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `submission_notes_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `program_submissions` (`submission_id`) ON DELETE CASCADE,
  CONSTRAINT `submission_notes_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submission_notes`
--

LOCK TABLES `submission_notes` WRITE;
/*!40000 ALTER TABLE `submission_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `submission_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submission_programs`
--

DROP TABLE IF EXISTS `submission_programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submission_programs` (
  `submission_program_id` int NOT NULL AUTO_INCREMENT,
  `submission_id` int NOT NULL,
  `program_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`submission_program_id`),
  UNIQUE KEY `unique_submission_program` (`submission_id`,`program_id`),
  KEY `program_id` (`program_id`),
  CONSTRAINT `submission_programs_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `program_submissions` (`submission_id`) ON DELETE CASCADE,
  CONSTRAINT `submission_programs_ibfk_2` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submission_programs`
--

LOCK TABLES `submission_programs` WRITE;
/*!40000 ALTER TABLE `submission_programs` DISABLE KEYS */;
/*!40000 ALTER TABLE `submission_programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_centers`
--

DROP TABLE IF EXISTS `user_centers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_centers` (
  `user_center_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `center_id` int NOT NULL,
  `is_lead_consultant` tinyint(1) DEFAULT '0',
  `assigned_date` date DEFAULT (curdate()),
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_center_id`),
  UNIQUE KEY `unique_user_center` (`user_id`,`center_id`),
  KEY `center_id` (`center_id`),
  CONSTRAINT `user_centers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_centers_ibfk_2` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_centers`
--

LOCK TABLES `user_centers` WRITE;
/*!40000 ALTER TABLE `user_centers` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_centers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `role_id` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_center_summary`
--

DROP TABLE IF EXISTS `vw_center_summary`;
/*!50001 DROP VIEW IF EXISTS `vw_center_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_center_summary` AS SELECT 
 1 AS `center_id`,
 1 AS `center_name`,
 1 AS `center_code`,
 1 AS `icon`,
 1 AS `advanced_programs_count`,
 1 AS `steam_programs_count`,
 1 AS `cross_center_programs_count`,
 1 AS `total_programs`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_program_associations`
--

DROP TABLE IF EXISTS `vw_program_associations`;
/*!50001 DROP VIEW IF EXISTS `vw_program_associations`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_program_associations` AS SELECT 
 1 AS `program_id`,
 1 AS `module_name`,
 1 AS `center_name`,
 1 AS `student_associations`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_program_details`
--

DROP TABLE IF EXISTS `vw_program_details`;
/*!50001 DROP VIEW IF EXISTS `vw_program_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_program_details` AS SELECT 
 1 AS `program_id`,
 1 AS `module_name`,
 1 AS `program_description`,
 1 AS `duration_range`,
 1 AS `status`,
 1 AS `center_name`,
 1 AS `center_code`,
 1 AS `center_icon`,
 1 AS `program_type`,
 1 AS `program_type_code`,
 1 AS `created_at`,
 1 AS `updated_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_program_partners`
--

DROP TABLE IF EXISTS `vw_program_partners`;
/*!50001 DROP VIEW IF EXISTS `vw_program_partners`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_program_partners` AS SELECT 
 1 AS `program_id`,
 1 AS `module_name`,
 1 AS `center_name`,
 1 AS `external_partners`,
 1 AS `placement_partners`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vw_center_summary`
--

/*!50001 DROP VIEW IF EXISTS `vw_center_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_center_summary` AS select `c`.`center_id` AS `center_id`,`c`.`center_name` AS `center_name`,`c`.`center_code` AS `center_code`,`c`.`icon` AS `icon`,count(distinct (case when (`pt`.`type_code` = 'ADVANCED') then `p`.`program_id` end)) AS `advanced_programs_count`,count(distinct (case when (`pt`.`type_code` = 'STEAM') then `p`.`program_id` end)) AS `steam_programs_count`,count(distinct (case when (`pt`.`type_code` = 'CROSS_CENTER') then `p`.`program_id` end)) AS `cross_center_programs_count`,count(distinct `p`.`program_id`) AS `total_programs` from ((`centers` `c` left join `programs` `p` on((`c`.`center_id` = `p`.`center_id`))) left join `program_types` `pt` on((`p`.`program_type_id` = `pt`.`program_type_id`))) group by `c`.`center_id`,`c`.`center_name`,`c`.`center_code`,`c`.`icon` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_program_associations`
--

/*!50001 DROP VIEW IF EXISTS `vw_program_associations`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_program_associations` AS select `p`.`program_id` AS `program_id`,`p`.`module_name` AS `module_name`,`c`.`center_name` AS `center_name`,group_concat(`sa`.`association_name` separator ', ') AS `student_associations` from (((`programs` `p` join `centers` `c` on((`p`.`center_id` = `c`.`center_id`))) left join `program_associations` `pa` on((`p`.`program_id` = `pa`.`program_id`))) left join `student_associations` `sa` on((`pa`.`association_id` = `sa`.`association_id`))) group by `p`.`program_id`,`p`.`module_name`,`c`.`center_name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_program_details`
--

/*!50001 DROP VIEW IF EXISTS `vw_program_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_program_details` AS select `p`.`program_id` AS `program_id`,`p`.`module_name` AS `module_name`,`p`.`description` AS `program_description`,concat(`p`.`duration_min_hours`,'-',`p`.`duration_max_hours`) AS `duration_range`,`p`.`status` AS `status`,`c`.`center_name` AS `center_name`,`c`.`center_code` AS `center_code`,`c`.`icon` AS `center_icon`,`pt`.`type_name` AS `program_type`,`pt`.`type_code` AS `program_type_code`,`p`.`created_at` AS `created_at`,`p`.`updated_at` AS `updated_at` from ((`programs` `p` join `centers` `c` on((`p`.`center_id` = `c`.`center_id`))) join `program_types` `pt` on((`p`.`program_type_id` = `pt`.`program_type_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_program_partners`
--

/*!50001 DROP VIEW IF EXISTS `vw_program_partners`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_program_partners` AS select `p`.`program_id` AS `program_id`,`p`.`module_name` AS `module_name`,`c`.`center_name` AS `center_name`,group_concat(distinct `ep`.`partner_name` separator ', ') AS `external_partners`,group_concat(distinct `pp`.`partner_name` separator ', ') AS `placement_partners` from (((((`programs` `p` join `centers` `c` on((`p`.`center_id` = `c`.`center_id`))) left join `program_partners` `prp` on((`p`.`program_id` = `prp`.`program_id`))) left join `external_partners` `ep` on((`prp`.`partner_id` = `ep`.`partner_id`))) left join `program_placements` `ppl` on((`p`.`program_id` = `ppl`.`program_id`))) left join `placement_partners` `pp` on((`ppl`.`placement_partner_id` = `pp`.`placement_partner_id`))) group by `p`.`program_id`,`p`.`module_name`,`c`.`center_name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-20  9:53:33

