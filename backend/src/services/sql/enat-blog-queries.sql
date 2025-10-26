-- users (authors) table
CREATE TABLE IF NOT EXISTS `user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(200) NOT NULL,
  `display_name` VARCHAR(120) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE (`email`)
) ENGINE=InnoDB;

-- blogs (owned by users) table
CREATE TABLE IF NOT EXISTS `blog` (
  `blog_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `blog_img` VARCHAR(255) NOT NULL,
  `blog_title` VARCHAR(255) NOT NULL,
  `blog_description` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  KEY `ix_blog_user` (`user_id`),
  CONSTRAINT `fk_blog_user`
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`blog_id`)
) ENGINE=InnoDB;

-- blog detail (articles) table
CREATE TABLE IF NOT EXISTS `blog_detail` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `blog_id` BIGINT UNSIGNED NOT NULL,
  `hash` VARCHAR(255) NOT NULL,
  `detail_description` TEXT NOT NULL,
  `blog_main_highlight` TEXT NOT NULL,
  `blog_post_wrap_up` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  UNIQUE KEY `ux_blog_detail_hash` (`hash`),
  KEY `ix_blog_detail_blog` (`blog_id`),
  CONSTRAINT `fk_blog_detail_blog`
    FOREIGN KEY (`blog_id`) REFERENCES `blog`(`blog_id`) ON DELETE CASCADE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- tags (normalized labels) table
CREATE TABLE IF NOT EXISTS `tag` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_tag_name` (`name`)
) ENGINE=InnoDB;

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
) ENGINE=InnoDB;

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
) ENGINE=InnoDB;

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
) ENGINE=InnoDB;


 -- Insert user with numeric IDs
INSERT INTO `user`(email, display_name) VALUES 
('abekyelesh@gmail.com', 'Abekyelesh kassa'),
('enat-blog@gmail.com', 'Enat health'),
('dr.samson@gmail.com', 'Dr samson abegaz');

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



