
-- =====================================================================
-- Core reference tables
-- =====================================================================

-- app roles
CREATE TABLE IF NOT EXISTS `app_role` (
  `id` INT UNSIGNED NOT NULL,
  `app_role_name` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_app_role_name` (`app_role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- onboarding stages
CREATE TABLE IF NOT EXISTS `onboarding_stage` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `stage_name` VARCHAR(50) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_stage_name` (`stage_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- users
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- user profile (1:1 with user)
CREATE TABLE IF NOT EXISTS `user_profile` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `onboarding_stage_id` INT UNSIGNED NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `user_name` VARCHAR(255) NOT NULL,
  `user_color` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(15) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_profile_user` (`user_id`),
  UNIQUE KEY `ux_profile_username` (`user_name`),
  UNIQUE KEY `ux_profile_phone` (`phone_number`),
  KEY `ix_profile_stage` (`onboarding_stage_id`),
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_profile_stage` FOREIGN KEY (`onboarding_stage_id`) REFERENCES `onboarding_stage`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- user password (1:1)
CREATE TABLE IF NOT EXISTS `user_password` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `password_hashed` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_password_user` (`user_id`),
  KEY `ix_password_user` (`user_id`),
  CONSTRAINT `fk_password_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- user roles (M:N)
CREATE TABLE IF NOT EXISTS `user_role` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `app_role_id` INT UNSIGNED NOT NULL,
  `updated_by` INT UNSIGNED NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_user_role_pair` (`user_id`,`app_role_id`),
  KEY `ix_user_role_user` (`user_id`),
  KEY `ix_user_role_role` (`app_role_id`),
  CONSTRAINT `fk_user_role_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_role_role` FOREIGN KEY (`app_role_id`) REFERENCES `app_role`(`id`),
  CONSTRAINT `fk_user_role_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- user profile picture (1:1)
CREATE TABLE IF NOT EXISTS `user_profile_picture` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `profile_picture` VARCHAR(255),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_picture_user` (`user_id`),
  KEY `ix_picture_user` (`user_id`),
  CONSTRAINT `fk_picture_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- department
CREATE TABLE IF NOT EXISTS `department` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `department_name` VARCHAR(255) NOT NULL,
  `department_description` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_department_name` (`department_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- doctor (1:1 with user)
CREATE TABLE IF NOT EXISTS `doctor` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `department_id` INT UNSIGNED NOT NULL,
  `doctor_picture` VARCHAR(255) NULL,
  `doctor_specialty` VARCHAR(255) NOT NULL,
  `doctor_description` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_doctor_user` (`user_id`),
  KEY `ix_doctor_department` (`department_id`),
  CONSTRAINT `fk_doctor_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_doctor_department` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- doctor social handles
CREATE TABLE IF NOT EXISTS `doctor_social_handle` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `doctor_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,        
  `handle_link` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_social_doctor_platform` (`doctor_id`, `name`),
  KEY `ix_social_doctor` (`doctor_id`),
  CONSTRAINT `fk_social_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctor`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- Availability (weekly template) + Dated, bookable slots
-- =====================================================================

-- weekly template: recurring availability
CREATE TABLE IF NOT EXISTS `doctor_available_time` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `doctor_id` INT UNSIGNED NOT NULL,
  `day_of_week` TINYINT UNSIGNED NOT NULL,    
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `slot_duration_min` SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  `buffer_before_min` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `buffer_after_min` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `timezone` VARCHAR(64) NULL,
  `effective_from` DATE NOT NULL,
  `effective_to` DATE NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_avail_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctor`(`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_avail_bounds` CHECK (`end_time` > `start_time`),
  CONSTRAINT `ck_avail_dow` CHECK (`day_of_week` BETWEEN 0 AND 6),
  UNIQUE KEY `ux_doctor_time_window` (`doctor_id`,`day_of_week`,`start_time`,`end_time`),
  KEY `ix_avail_doctor_dow` (`doctor_id`,`day_of_week`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- dated, bookable slots (materialized from the weekly template)
CREATE TABLE IF NOT EXISTS `doctor_timeslot` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `doctor_id` INT UNSIGNED NOT NULL,
  `start_datetime` DATETIME NOT NULL,
  `end_datetime` DATETIME NOT NULL,
  `status` ENUM('OPEN','HELD','BOOKED','CANCELLED') NOT NULL DEFAULT 'OPEN',
  `hold_expires_at` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_slot_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctor`(`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_slot_bounds` CHECK (`end_datetime` > `start_datetime`),
  UNIQUE KEY `ux_doctor_slot_start` (`doctor_id`, `start_datetime`),
  KEY `ix_slot_doctor_range` (`doctor_id`, `start_datetime`, `end_datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- Appointments + Assignment (link Appointment -> Timeslot)
-- =====================================================================

CREATE TABLE IF NOT EXISTS `appointment` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `case_description` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- one appointment occupies exactly one slot; a slot can be used once
CREATE TABLE IF NOT EXISTS `assign_appointment` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `appointment_id` INT UNSIGNED NOT NULL,
  `timeslot_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_appointment_once` (`appointment_id`),
  UNIQUE KEY `ux_timeslot_once` (`timeslot_id`),
  KEY `ix_assign_appt` (`appointment_id`),
  KEY `ix_assign_slot` (`timeslot_id`),
  CONSTRAINT `fk_assign_appt` FOREIGN KEY (`appointment_id`) REFERENCES `appointment`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assign_slot` FOREIGN KEY (`timeslot_id`) REFERENCES `doctor_timeslot`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- Blog & content
-- =====================================================================

-- blog
CREATE TABLE IF NOT EXISTS `blog` (
  `blog_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `blog_img` VARCHAR(255) NOT NULL,
  `blog_title` VARCHAR(255) NOT NULL,
  `blog_description` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`blog_id`),
  KEY `ix_blog_user` (`user_id`),
  CONSTRAINT `fk_blog_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- blog detail
CREATE TABLE IF NOT EXISTS `blog_detail` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `blog_id` BIGINT UNSIGNED NOT NULL,
  `hash` VARCHAR(255) NOT NULL,
  `blog_title` VARCHAR(255) NOT NULL,
  `detail_description` TEXT NOT NULL,
  `blog_main_highlight` TEXT NOT NULL,
  `blog_post_wrap_up` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_blog_detail_hash` (`hash`),
  KEY `ix_blog_detail_blog` (`blog_id`),
  CONSTRAINT `fk_blog_detail_blog` FOREIGN KEY (`blog_id`) REFERENCES `blog`(`blog_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- tags (normalized labels) table
CREATE TABLE IF NOT EXISTS `tag` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_tag_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- blog_detail ↔ tag (M:N) table
CREATE TABLE IF NOT EXISTS `blog_detail_tag` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `blog_detail_id` BIGINT UNSIGNED NOT NULL,
  `tag_id`         BIGINT UNSIGNED NOT NULL,
  `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`     TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_bdt_pair` (`blog_detail_id`, `tag_id`), 
  KEY `ix_bdt_detail` (`blog_detail_id`),
  KEY `ix_bdt_tag` (`tag_id`),
  CONSTRAINT `fk_bdt_detail`
    FOREIGN KEY (`blog_detail_id`) REFERENCES `blog_detail`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bdt_tag`
    FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- blog detail images table
CREATE TABLE IF NOT EXISTS `blog_detail_img` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `blog_detail_id` BIGINT UNSIGNED NOT NULL,
  `blog_img_url` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  UNIQUE KEY `ux_detail_img` (`blog_detail_id`, `blog_img_url`),
  KEY `ix_detail_img_detail` (`blog_detail_id`),
  CONSTRAINT `fk_detail_img_detail`
    FOREIGN KEY (`blog_detail_id`) REFERENCES `blog_detail`(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- related blog posts (recommendations) table
CREATE TABLE IF NOT EXISTS `related_blog_post` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `blog_id` BIGINT UNSIGNED NOT NULL,
  `blog_detail_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  UNIQUE KEY `ux_related_pair` (`blog_id`, `blog_detail_id`),
  KEY `ix_related_blog` (`blog_id`),
  KEY `ix_related_detail` (`blog_detail_id`),
  CONSTRAINT `fk_related_blog`
    FOREIGN KEY (`blog_id`) REFERENCES `blog`(`blog_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_related_detail`
    FOREIGN KEY (`blog_detail_id`) REFERENCES `blog_detail`(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- Misc content
-- =====================================================================

-- service
CREATE TABLE IF NOT EXISTS `service` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `service_icon_name` VARCHAR(255) NOT NULL,
  `service_title` VARCHAR(255) NOT NULL,
  `service_subtitle` VARCHAR(255) NOT NULL,
  `service_description` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- faq
CREATE TABLE IF NOT EXISTS `faq` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `faq_question` VARCHAR(255) NOT NULL,
  `faq_answer` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- testimonials
CREATE TABLE IF NOT EXISTS `testimonial` (
  `testimonial_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `testimonial_text` TEXT NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `job_title` VARCHAR(255) NOT NULL,
  `testifier_avatar` VARCHAR(255) NULL,
  `bg_color` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`testimonial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 -- Insert roles with numeric IDs
INSERT INTO app_role(id, app_role_name) VALUES 
(0,'guest'),
(1,'super_admin'),
(2,'admin'), 
(3,'doctor'), 
(4,'nurse'), 
(5,'patient');

-- Insert common tags for health care blogs
INSERT INTO `tag` (name) VALUES 
('Nutrition'),
('Mental Health'),
('Fitness'),
('Wellness'),
('Preventive Care'),
('Chronic Illness Management'),
('Healthcare Tips'),
('Health Technology');

-- -- Insert onboarding_stage with auto increment numeric IDs
 INSERT INTO `onboarding_stage` (`stage_name`, `description`) VALUES
('step1', 'Initial Registration'),
('step2', 'Add user Profile Picture'),
('completed', 'Onboarding Complete(welcome message)');


