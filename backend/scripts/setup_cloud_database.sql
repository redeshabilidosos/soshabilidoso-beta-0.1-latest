-- ============================================
-- SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS
-- SOS-HABILIDOSO - Para phpMyAdmin Remoto
-- ============================================
-- Este script crea todas las tablas necesarias
-- para la aplicación SOS-HABILIDOSO
-- ============================================

-- Configuración inicial
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- Configuración de caracteres UTF-8
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================
-- CREAR BASE DE DATOS (si no existe)
-- ============================================
-- Descomenta la siguiente línea si necesitas crear la BD
-- CREATE DATABASE IF NOT EXISTS soshabilidoso CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE soshabilidoso;

-- ============================================
-- TABLA: users (Usuarios)
-- ============================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL DEFAULT 0,
  `username` varchar(30) NOT NULL,
  `first_name` varchar(150) NOT NULL DEFAULT '',
  `last_name` varchar(150) NOT NULL DEFAULT '',
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `date_joined` datetime(6) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `avatar` varchar(100) DEFAULT NULL,
  `cover_photo` varchar(100) DEFAULT NULL,
  `bio` longtext DEFAULT NULL,
  `position` varchar(100) NOT NULL DEFAULT '',
  `team` varchar(100) NOT NULL DEFAULT '',
  `contact_number` varchar(20) NOT NULL DEFAULT '',
  `interests` json DEFAULT NULL,
  `social_links` json DEFAULT NULL,
  `is_private` tinyint(1) NOT NULL DEFAULT 0,
  `show_email` tinyint(1) NOT NULL DEFAULT 0,
  `show_phone` tinyint(1) NOT NULL DEFAULT 0,
  `followers_count` int unsigned NOT NULL DEFAULT 0,
  `following_count` int unsigned NOT NULL DEFAULT 0,
  `posts_count` int unsigned NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `last_active` datetime(6) NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `account_type` varchar(20) NOT NULL DEFAULT 'user',
  `company_name` varchar(200) NOT NULL DEFAULT '',
  `industry` varchar(100) NOT NULL DEFAULT '',
  `website` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `users_email_idx` (`email`),
  KEY `users_username_idx` (`username`),
  KEY `users_active_created_idx` (`is_active`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: user_follows (Seguimientos)
-- ============================================
DROP TABLE IF EXISTS `user_follows`;
CREATE TABLE `user_follows` (
  `id` char(36) NOT NULL,
  `follower_id` char(36) NOT NULL,
  `following_id` char(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_follows_unique` (`follower_id`, `following_id`),
  KEY `user_follows_follower_idx` (`follower_id`, `created_at`),
  KEY `user_follows_following_idx` (`following_id`, `created_at`),
  KEY `user_follows_following_fk` (`following_id`),
  CONSTRAINT `user_follows_follower_fk` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_follows_following_fk` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: friend_requests (Solicitudes de Amistad)
-- ============================================
DROP TABLE IF EXISTS `friend_requests`;
CREATE TABLE `friend_requests` (
  `id` char(36) NOT NULL,
  `sender_id` char(36) NOT NULL,
  `receiver_id` char(36) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'pending',
  `message` longtext NOT NULL DEFAULT '',
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `friend_requests_unique` (`sender_id`, `receiver_id`),
  KEY `friend_requests_receiver_idx` (`receiver_id`, `status`, `created_at`),
  KEY `friend_requests_sender_idx` (`sender_id`, `created_at`),
  KEY `friend_requests_receiver_fk` (`receiver_id`),
  CONSTRAINT `friend_requests_sender_fk` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `friend_requests_receiver_fk` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: friendships (Amistades)
-- ============================================
DROP TABLE IF EXISTS `friendships`;
CREATE TABLE `friendships` (
  `id` char(36) NOT NULL,
  `user1_id` char(36) NOT NULL,
  `user2_id` char(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `friendships_unique` (`user1_id`, `user2_id`),
  KEY `friendships_user1_idx` (`user1_id`, `created_at`),
  KEY `friendships_user2_idx` (`user2_id`, `created_at`),
  KEY `friendships_user2_fk` (`user2_id`),
  CONSTRAINT `friendships_user1_fk` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `friendships_user2_fk` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: posts (Publicaciones)
-- ============================================
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id` char(36) NOT NULL,
  `short_id` varchar(8) NOT NULL,
  `user_id` char(36) NOT NULL,
  `content` longtext NOT NULL DEFAULT '',
  `images` json DEFAULT NULL,
  `video` varchar(100) DEFAULT NULL,
  `thumbnail` varchar(100) DEFAULT NULL,
  `podcast_url` varchar(200) NOT NULL DEFAULT '',
  `streaming_url` varchar(200) NOT NULL DEFAULT '',
  `post_type` varchar(20) NOT NULL DEFAULT 'text',
  `category` varchar(20) NOT NULL DEFAULT '',
  `likes_count` int unsigned NOT NULL DEFAULT 0,
  `celebrations_count` int unsigned NOT NULL DEFAULT 0,
  `golazos_count` int unsigned NOT NULL DEFAULT 0,
  `comments_count` int unsigned NOT NULL DEFAULT 0,
  `shares_count` int unsigned NOT NULL DEFAULT 0,
  `views_count` int unsigned NOT NULL DEFAULT 0,
  `is_pinned` tinyint(1) NOT NULL DEFAULT 0,
  `is_archived` tinyint(1) NOT NULL DEFAULT 0,
  `allow_comments` tinyint(1) NOT NULL DEFAULT 1,
  `is_public` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `short_id` (`short_id`),
  KEY `posts_user_idx` (`user_id`, `created_at`),
  KEY `posts_category_idx` (`category`, `created_at`),
  KEY `posts_type_idx` (`post_type`, `created_at`),
  KEY `posts_public_idx` (`is_public`, `created_at`),
  CONSTRAINT `posts_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: post_reactions (Reacciones a Posts)
-- ============================================
DROP TABLE IF EXISTS `post_reactions`;
CREATE TABLE `post_reactions` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `post_id` char(36) NOT NULL,
  `reaction_type` varchar(15) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_reactions_unique` (`user_id`, `post_id`, `reaction_type`),
  KEY `post_reactions_post_idx` (`post_id`, `reaction_type`),
  KEY `post_reactions_user_idx` (`user_id`, `created_at`),
  KEY `post_reactions_post_fk` (`post_id`),
  CONSTRAINT `post_reactions_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_reactions_post_fk` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: comments (Comentarios)
-- ============================================
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `post_id` char(36) NOT NULL,
  `parent_id` char(36) DEFAULT NULL,
  `content` longtext NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `likes_count` int unsigned NOT NULL DEFAULT 0,
  `replies_count` int unsigned NOT NULL DEFAULT 0,
  `is_edited` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_post_idx` (`post_id`, `created_at`),
  KEY `comments_parent_idx` (`parent_id`, `created_at`),
  KEY `comments_user_idx` (`user_id`, `created_at`),
  KEY `comments_user_fk` (`user_id`),
  KEY `comments_parent_fk` (`parent_id`),
  CONSTRAINT `comments_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_post_fk` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_parent_fk` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: comment_likes (Likes en Comentarios)
-- ============================================
DROP TABLE IF EXISTS `comment_likes`;
CREATE TABLE `comment_likes` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `comment_id` char(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `comment_likes_unique` (`user_id`, `comment_id`),
  KEY `comment_likes_comment_idx` (`comment_id`, `created_at`),
  KEY `comment_likes_user_idx` (`user_id`, `created_at`),
  KEY `comment_likes_comment_fk` (`comment_id`),
  CONSTRAINT `comment_likes_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_likes_comment_fk` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: post_shares (Compartir Posts)
-- ============================================
DROP TABLE IF EXISTS `post_shares`;
CREATE TABLE `post_shares` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `post_id` char(36) NOT NULL,
  `message` longtext NOT NULL DEFAULT '',
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_shares_unique` (`user_id`, `post_id`),
  KEY `post_shares_user_idx` (`user_id`, `created_at`),
  KEY `post_shares_post_idx` (`post_id`, `created_at`),
  KEY `post_shares_post_fk` (`post_id`),
  CONSTRAINT `post_shares_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_shares_post_fk` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: post_views (Visualizaciones)
-- ============================================
DROP TABLE IF EXISTS `post_views`;
CREATE TABLE `post_views` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `post_id` char(36) NOT NULL,
  `ip_address` char(39) NOT NULL,
  `user_agent` longtext NOT NULL DEFAULT '',
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `post_views_post_idx` (`post_id`, `created_at`),
  KEY `post_views_user_idx` (`user_id`, `created_at`),
  KEY `post_views_ip_idx` (`ip_address`, `created_at`),
  KEY `post_views_user_fk` (`user_id`),
  CONSTRAINT `post_views_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_views_post_fk` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: post_bookmarks (Posts Guardados)
-- ============================================
DROP TABLE IF EXISTS `post_bookmarks`;
CREATE TABLE `post_bookmarks` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `post_id` char(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_bookmarks_unique` (`user_id`, `post_id`),
  KEY `post_bookmarks_user_idx` (`user_id`, `created_at`),
  KEY `post_bookmarks_post_fk` (`post_id`),
  CONSTRAINT `post_bookmarks_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_bookmarks_post_fk` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: post_reports (Reportes de Posts)
-- ============================================
DROP TABLE IF EXISTS `post_reports`;
CREATE TABLE `post_reports` (
  `id` char(36) NOT NULL,
  `reporter_id` char(36) NOT NULL,
  `post_id` char(36) NOT NULL,
  `reason` varchar(30) NOT NULL,
  `description` longtext NOT NULL DEFAULT '',
  `status` varchar(15) NOT NULL DEFAULT 'pending',
  `reviewed_by_id` char(36) DEFAULT NULL,
  `reviewed_at` datetime(6) DEFAULT NULL,
  `moderator_notes` longtext NOT NULL DEFAULT '',
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_reports_unique` (`reporter_id`, `post_id`),
  KEY `post_reports_status_idx` (`status`, `created_at`),
  KEY `post_reports_post_idx` (`post_id`, `created_at`),
  KEY `post_reports_post_fk` (`post_id`),
  KEY `post_reports_reviewed_fk` (`reviewed_by_id`),
  CONSTRAINT `post_reports_reporter_fk` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_reports_post_fk` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_reports_reviewed_fk` FOREIGN KEY (`reviewed_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: stories (Historias)
-- ============================================
DROP TABLE IF EXISTS `stories`;
CREATE TABLE `stories` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `content` longtext NOT NULL DEFAULT '',
  `media_type` varchar(10) NOT NULL DEFAULT 'image',
  `media_url` varchar(200) NOT NULL,
  `thumbnail_url` varchar(200) NOT NULL DEFAULT '',
  `duration` int NOT NULL DEFAULT 5,
  `background_color` varchar(7) NOT NULL DEFAULT '#000000',
  `views_count` int unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `expires_at` datetime(6) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stories_user_idx` (`user_id`, `created_at`),
  KEY `stories_active_idx` (`is_active`, `expires_at`),
  CONSTRAINT `stories_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: story_views (Visualizaciones de Historias)
-- ============================================
DROP TABLE IF EXISTS `story_views`;
CREATE TABLE `story_views` (
  `id` char(36) NOT NULL,
  `story_id` char(36) NOT NULL,
  `viewer_id` char(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `story_views_unique` (`story_id`, `viewer_id`),
  KEY `story_views_story_idx` (`story_id`, `created_at`),
  KEY `story_views_viewer_idx` (`viewer_id`, `created_at`),
  KEY `story_views_viewer_fk` (`viewer_id`),
  CONSTRAINT `story_views_story_fk` FOREIGN KEY (`story_id`) REFERENCES `stories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `story_views_viewer_fk` FOREIGN KEY (`viewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: community_categories (Categorías de Comunidades)
-- ============================================
DROP TABLE IF EXISTS `community_categories`;
CREATE TABLE `community_categories` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `description` longtext NOT NULL DEFAULT '',
  `icon` varchar(50) NOT NULL DEFAULT '',
  `color` varchar(7) NOT NULL DEFAULT '#00ff88',
  `image` varchar(100) DEFAULT NULL,
  `order` int NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: communities (Comunidades)
-- ============================================
DROP TABLE IF EXISTS `communities`;
CREATE TABLE `communities` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `description` longtext NOT NULL,
  `category_obj_id` char(36) DEFAULT NULL,
  `category` varchar(20) NOT NULL DEFAULT '',
  `parent_id` char(36) DEFAULT NULL,
  `type` varchar(10) NOT NULL DEFAULT 'public',
  `owner_id` char(36) NOT NULL,
  `profile_image` varchar(100) DEFAULT NULL,
  `cover_image` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `allow_posts` tinyint(1) NOT NULL DEFAULT 1,
  `require_approval` tinyint(1) NOT NULL DEFAULT 0,
  `location` varchar(100) NOT NULL DEFAULT '',
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `communities_category_fk` (`category_obj_id`),
  KEY `communities_parent_fk` (`parent_id`),
  KEY `communities_owner_fk` (`owner_id`),
  CONSTRAINT `communities_category_fk` FOREIGN KEY (`category_obj_id`) REFERENCES `community_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `communities_parent_fk` FOREIGN KEY (`parent_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `communities_owner_fk` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: community_memberships (Membresías)
-- ============================================
DROP TABLE IF EXISTS `community_memberships`;
CREATE TABLE `community_memberships` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `community_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `role` varchar(10) NOT NULL DEFAULT 'member',
  `joined_at` datetime(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_memberships_unique` (`community_id`, `user_id`),
  KEY `community_memberships_user_fk` (`user_id`),
  CONSTRAINT `community_memberships_community_fk` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `community_memberships_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: community_moderators (Moderadores - Relación Many-to-Many)
-- ============================================
DROP TABLE IF EXISTS `community_moderators`;
CREATE TABLE `community_moderators` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `community_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_moderators_unique` (`community_id`, `user_id`),
  KEY `community_moderators_user_fk` (`user_id`),
  CONSTRAINT `community_moderators_community_fk` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `community_moderators_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: community_social_links (Enlaces Sociales)
-- ============================================
DROP TABLE IF EXISTS `community_social_links`;
CREATE TABLE `community_social_links` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `community_id` char(36) NOT NULL,
  `platform` varchar(20) NOT NULL,
  `url` varchar(200) NOT NULL,
  `username` varchar(100) NOT NULL DEFAULT '',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_social_links_unique` (`community_id`, `platform`),
  CONSTRAINT `community_social_links_community_fk` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: community_posts (Publicaciones de Comunidad)
-- ============================================
DROP TABLE IF EXISTS `community_posts`;
CREATE TABLE `community_posts` (
  `id` char(36) NOT NULL,
  `community_id` char(36) NOT NULL,
  `author_id` char(36) NOT NULL,
  `content` longtext NOT NULL DEFAULT '',
  `post_type` varchar(10) NOT NULL DEFAULT 'text',
  `image` varchar(100) DEFAULT NULL,
  `video` varchar(100) DEFAULT NULL,
  `podcast` varchar(100) DEFAULT NULL,
  `video_url` varchar(200) DEFAULT NULL,
  `podcast_url` varchar(200) DEFAULT NULL,
  `live_url` varchar(200) DEFAULT NULL,
  `is_pinned` tinyint(1) NOT NULL DEFAULT 0,
  `is_approved` tinyint(1) NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `community_posts_community_fk` (`community_id`),
  KEY `community_posts_author_fk` (`author_id`),
  KEY `community_posts_pinned_idx` (`is_pinned`, `created_at`),
  CONSTRAINT `community_posts_community_fk` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `community_posts_author_fk` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: community_post_likes (Likes en Posts de Comunidad - Many-to-Many)
-- ============================================
DROP TABLE IF EXISTS `community_post_likes`;
CREATE TABLE `community_post_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `post_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_post_likes_unique` (`post_id`, `user_id`),
  KEY `community_post_likes_user_fk` (`user_id`),
  CONSTRAINT `community_post_likes_post_fk` FOREIGN KEY (`post_id`) REFERENCES `community_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `community_post_likes_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: community_post_comments (Comentarios de Posts de Comunidad)
-- ============================================
DROP TABLE IF EXISTS `community_post_comments`;
CREATE TABLE `community_post_comments` (
  `id` char(36) NOT NULL,
  `post_id` char(36) NOT NULL,
  `author_id` char(36) NOT NULL,
  `parent_id` char(36) DEFAULT NULL,
  `content` longtext NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `community_post_comments_post_fk` (`post_id`),
  KEY `community_post_comments_author_fk` (`author_id`),
  KEY `community_post_comments_parent_fk` (`parent_id`),
  CONSTRAINT `community_post_comments_post_fk` FOREIGN KEY (`post_id`) REFERENCES `community_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `community_post_comments_author_fk` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `community_post_comments_parent_fk` FOREIGN KEY (`parent_id`) REFERENCES `community_post_comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: community_comment_likes (Likes en Comentarios de Comunidad - Many-to-Many)
-- ============================================
DROP TABLE IF EXISTS `community_comment_likes`;
CREATE TABLE `community_comment_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_comment_likes_unique` (`comment_id`, `user_id`),
  KEY `community_comment_likes_user_fk` (`user_id`),
  CONSTRAINT `community_comment_likes_comment_fk` FOREIGN KEY (`comment_id`) REFERENCES `community_post_comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `community_comment_likes_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: notifications (Notificaciones)
-- ============================================
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `recipient_id` char(36) NOT NULL,
  `sender_id` char(36) DEFAULT NULL,
  `notification_type` varchar(30) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` longtext NOT NULL,
  `link` varchar(200) NOT NULL DEFAULT '',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `friend_request_id` char(36) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_recipient_idx` (`recipient_id`, `is_read`, `created_at`),
  KEY `notifications_sender_fk` (`sender_id`),
  KEY `notifications_friend_request_fk` (`friend_request_id`),
  CONSTRAINT `notifications_recipient_fk` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_sender_fk` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_friend_request_fk` FOREIGN KEY (`friend_request_id`) REFERENCES `friend_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: conversations (Conversaciones de Chat)
-- ============================================
DROP TABLE IF EXISTS `conversations`;
CREATE TABLE `conversations` (
  `id` char(36) NOT NULL,
  `is_group` tinyint(1) NOT NULL DEFAULT 0,
  `name` varchar(100) NOT NULL DEFAULT '',
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: conversation_participants (Participantes de Conversaciones - Many-to-Many)
-- ============================================
DROP TABLE IF EXISTS `conversation_participants`;
CREATE TABLE `conversation_participants` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `conversation_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `joined_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `conversation_participants_unique` (`conversation_id`, `user_id`),
  KEY `conversation_participants_user_fk` (`user_id`),
  CONSTRAINT `conversation_participants_conversation_fk` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `conversation_participants_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: messages (Mensajes)
-- ============================================
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` char(36) NOT NULL,
  `conversation_id` char(36) NOT NULL,
  `sender_id` char(36) NOT NULL,
  `content` longtext NOT NULL,
  `message_type` varchar(10) NOT NULL DEFAULT 'text',
  `file_url` varchar(200) NOT NULL DEFAULT '',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_conversation_idx` (`conversation_id`, `created_at`),
  KEY `messages_sender_fk` (`sender_id`),
  CONSTRAINT `messages_conversation_fk` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_sender_fk` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: reels (Reels/Videos Cortos)
-- ============================================
DROP TABLE IF EXISTS `reels`;
CREATE TABLE `reels` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `title` varchar(200) NOT NULL DEFAULT '',
  `description` longtext NOT NULL DEFAULT '',
  `video_url` varchar(200) NOT NULL,
  `thumbnail_url` varchar(200) NOT NULL DEFAULT '',
  `duration` int NOT NULL DEFAULT 0,
  `views_count` int unsigned NOT NULL DEFAULT 0,
  `likes_count` int unsigned NOT NULL DEFAULT 0,
  `comments_count` int unsigned NOT NULL DEFAULT 0,
  `shares_count` int unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reels_user_idx` (`user_id`, `created_at`),
  KEY `reels_active_idx` (`is_active`, `created_at`),
  CONSTRAINT `reels_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: reel_likes (Likes en Reels - Many-to-Many)
-- ============================================
DROP TABLE IF EXISTS `reel_likes`;
CREATE TABLE `reel_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reel_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reel_likes_unique` (`reel_id`, `user_id`),
  KEY `reel_likes_user_fk` (`user_id`),
  CONSTRAINT `reel_likes_reel_fk` FOREIGN KEY (`reel_id`) REFERENCES `reels` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reel_likes_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: reel_comments (Comentarios en Reels)
-- ============================================
DROP TABLE IF EXISTS `reel_comments`;
CREATE TABLE `reel_comments` (
  `id` char(36) NOT NULL,
  `reel_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reel_comments_reel_idx` (`reel_id`, `created_at`),
  KEY `reel_comments_user_fk` (`user_id`),
  CONSTRAINT `reel_comments_reel_fk` FOREIGN KEY (`reel_id`) REFERENCES `reels` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reel_comments_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: donations (Donaciones)
-- ============================================
DROP TABLE IF EXISTS `donations`;
CREATE TABLE `donations` (
  `id` char(36) NOT NULL,
  `athlete_name` varchar(200) NOT NULL,
  `athlete_bio` longtext NOT NULL,
  `athlete_image` varchar(100) DEFAULT NULL,
  `goal_amount` decimal(10,2) NOT NULL,
  `current_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `category` varchar(50) NOT NULL,
  `sport` varchar(100) NOT NULL DEFAULT '',
  `location` varchar(200) NOT NULL DEFAULT '',
  `thumbnail` varchar(100) DEFAULT NULL,
  `video_url` varchar(200) NOT NULL DEFAULT '',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_by_id` char(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `donations_category_idx` (`category`, `is_active`),
  KEY `donations_featured_idx` (`is_featured`, `is_active`),
  KEY `donations_created_by_fk` (`created_by_id`),
  CONSTRAINT `donations_created_by_fk` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: donation_contributions (Contribuciones a Donaciones)
-- ============================================
DROP TABLE IF EXISTS `donation_contributions`;
CREATE TABLE `donation_contributions` (
  `id` char(36) NOT NULL,
  `donation_id` char(36) NOT NULL,
  `donor_id` char(36) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `message` longtext NOT NULL DEFAULT '',
  `is_anonymous` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `donation_contributions_donation_idx` (`donation_id`, `created_at`),
  KEY `donation_contributions_donor_fk` (`donor_id`),
  CONSTRAINT `donation_contributions_donation_fk` FOREIGN KEY (`donation_id`) REFERENCES `donations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `donation_contributions_donor_fk` FOREIGN KEY (`donor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: classifieds (Clasificados)
-- ============================================
DROP TABLE IF EXISTS `classifieds`;
CREATE TABLE `classifieds` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` longtext NOT NULL,
  `category` varchar(50) NOT NULL,
  `subcategory` varchar(50) NOT NULL DEFAULT '',
  `price` decimal(10,2) DEFAULT NULL,
  `location` varchar(200) NOT NULL DEFAULT '',
  `contact_info` longtext NOT NULL DEFAULT '',
  `images` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `views_count` int unsigned NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classifieds_user_idx` (`user_id`, `created_at`),
  KEY `classifieds_category_idx` (`category`, `is_active`),
  KEY `classifieds_featured_idx` (`is_featured`, `is_active`),
  CONSTRAINT `classifieds_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: enterprises (Empresas)
-- ============================================
DROP TABLE IF EXISTS `enterprises`;
CREATE TABLE `enterprises` (
  `id` char(36) NOT NULL,
  `owner_id` char(36) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` longtext NOT NULL,
  `category` varchar(50) NOT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `cover_image` varchar(100) DEFAULT NULL,
  `website` varchar(200) NOT NULL DEFAULT '',
  `email` varchar(254) NOT NULL DEFAULT '',
  `phone` varchar(20) NOT NULL DEFAULT '',
  `address` longtext NOT NULL DEFAULT '',
  `location` varchar(200) NOT NULL DEFAULT '',
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `enterprises_owner_idx` (`owner_id`, `created_at`),
  KEY `enterprises_category_idx` (`category`, `is_active`),
  CONSTRAINT `enterprises_owner_fk` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: advertisements (Publicidad)
-- ============================================
DROP TABLE IF EXISTS `advertisements`;
CREATE TABLE `advertisements` (
  `id` char(36) NOT NULL,
  `advertiser_id` char(36) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` longtext NOT NULL DEFAULT '',
  `ad_type` varchar(20) NOT NULL,
  `image_url` varchar(200) NOT NULL DEFAULT '',
  `video_url` varchar(200) NOT NULL DEFAULT '',
  `link_url` varchar(200) NOT NULL DEFAULT '',
  `target_audience` json DEFAULT NULL,
  `budget` decimal(10,2) NOT NULL DEFAULT 0.00,
  `spent` decimal(10,2) NOT NULL DEFAULT 0.00,
  `impressions` int unsigned NOT NULL DEFAULT 0,
  `clicks` int unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `start_date` datetime(6) NOT NULL,
  `end_date` datetime(6) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `advertisements_advertiser_idx` (`advertiser_id`, `created_at`),
  KEY `advertisements_active_idx` (`is_active`, `start_date`, `end_date`),
  CONSTRAINT `advertisements_advertiser_fk` FOREIGN KEY (`advertiser_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: ad_impressions (Impresiones de Anuncios)
-- ============================================
DROP TABLE IF EXISTS `ad_impressions`;
CREATE TABLE `ad_impressions` (
  `id` char(36) NOT NULL,
  `advertisement_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `ip_address` char(39) NOT NULL,
  `user_agent` longtext NOT NULL DEFAULT '',
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ad_impressions_ad_idx` (`advertisement_id`, `created_at`),
  KEY `ad_impressions_user_fk` (`user_id`),
  CONSTRAINT `ad_impressions_ad_fk` FOREIGN KEY (`advertisement_id`) REFERENCES `advertisements` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ad_impressions_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: ad_clicks (Clics en Anuncios)
-- ============================================
DROP TABLE IF EXISTS `ad_clicks`;
CREATE TABLE `ad_clicks` (
  `id` char(36) NOT NULL,
  `advertisement_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `ip_address` char(39) NOT NULL,
  `user_agent` longtext NOT NULL DEFAULT '',
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ad_clicks_ad_idx` (`advertisement_id`, `created_at`),
  KEY `ad_clicks_user_fk` (`user_id`),
  CONSTRAINT `ad_clicks_ad_fk` FOREIGN KEY (`advertisement_id`) REFERENCES `advertisements` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ad_clicks_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: learning_sections (Secciones de Aprendizaje)
-- ============================================
DROP TABLE IF EXISTS `learning_sections`;
CREATE TABLE `learning_sections` (
  `id` char(36) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` longtext NOT NULL DEFAULT '',
  `icono` varchar(50) NOT NULL DEFAULT '',
  `color` varchar(7) NOT NULL DEFAULT '#00ff88',
  `orden` int NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: learning_topics (Temas de Aprendizaje)
-- ============================================
DROP TABLE IF EXISTS `learning_topics`;
CREATE TABLE `learning_topics` (
  `id` char(36) NOT NULL,
  `seccion_id` char(36) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` longtext NOT NULL DEFAULT '',
  `contenido` longtext NOT NULL DEFAULT '',
  `imagen` varchar(100) DEFAULT NULL,
  `imagen_url` varchar(200) NOT NULL DEFAULT '',
  `video` varchar(100) DEFAULT NULL,
  `video_url` varchar(200) NOT NULL DEFAULT '',
  `duracion_minutos` int NOT NULL DEFAULT 0,
  `orden` int NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `learning_topics_seccion_fk` (`seccion_id`),
  CONSTRAINT `learning_topics_seccion_fk` FOREIGN KEY (`seccion_id`) REFERENCES `learning_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: learning_progress (Progreso de Aprendizaje)
-- ============================================
DROP TABLE IF EXISTS `learning_progress`;
CREATE TABLE `learning_progress` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `tema_id` char(36) NOT NULL,
  `completado` tinyint(1) NOT NULL DEFAULT 0,
  `progreso_porcentaje` int NOT NULL DEFAULT 0,
  `tiempo_dedicado_minutos` int NOT NULL DEFAULT 0,
  `ultima_visita` datetime(6) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `learning_progress_unique` (`user_id`, `tema_id`),
  KEY `learning_progress_tema_fk` (`tema_id`),
  CONSTRAINT `learning_progress_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `learning_progress_tema_fk` FOREIGN KEY (`tema_id`) REFERENCES `learning_topics` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: media_files (Archivos Multimedia)
-- ============================================
DROP TABLE IF EXISTS `media_files`;
CREATE TABLE `media_files` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `file_size` bigint NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `thumbnail_url` varchar(500) NOT NULL DEFAULT '',
  `cloudinary_public_id` varchar(255) NOT NULL DEFAULT '',
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `media_files_user_idx` (`user_id`, `created_at`),
  KEY `media_files_type_idx` (`file_type`, `created_at`),
  CONSTRAINT `media_files_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: payments (Pagos)
-- ============================================
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'USD',
  `payment_method` varchar(50) NOT NULL,
  `payment_status` varchar(20) NOT NULL DEFAULT 'pending',
  `transaction_id` varchar(255) NOT NULL DEFAULT '',
  `description` longtext NOT NULL DEFAULT '',
  `metadata` json DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_user_idx` (`user_id`, `created_at`),
  KEY `payments_status_idx` (`payment_status`, `created_at`),
  CONSTRAINT `payments_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLAS DE DJANGO (Sistema)
-- ============================================

-- Tabla de sesiones de Django
DROP TABLE IF EXISTS `django_session`;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_idx` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de migraciones de Django
DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tipos de contenido de Django
DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_unique` (`app_label`, `model`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de permisos de Django
DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_unique` (`content_type_id`, `codename`),
  CONSTRAINT `auth_permission_content_type_fk` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de grupos de Django
DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de permisos de grupos (Many-to-Many)
DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_unique` (`group_id`, `permission_id`),
  KEY `auth_group_permissions_permission_fk` (`permission_id`),
  CONSTRAINT `auth_group_permissions_group_fk` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_group_permissions_permission_fk` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de grupos de usuarios (Many-to-Many)
DROP TABLE IF EXISTS `users_groups`;
CREATE TABLE `users_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` char(36) NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_groups_unique` (`user_id`, `group_id`),
  KEY `users_groups_group_fk` (`group_id`),
  CONSTRAINT `users_groups_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `users_groups_group_fk` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de permisos de usuarios (Many-to-Many)
DROP TABLE IF EXISTS `users_user_permissions`;
CREATE TABLE `users_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` char(36) NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_permissions_unique` (`user_id`, `permission_id`),
  KEY `users_user_permissions_permission_fk` (`permission_id`),
  CONSTRAINT `users_user_permissions_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `users_user_permissions_permission_fk` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de administración de Django
DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_fk` (`content_type_id`),
  KEY `django_admin_log_user_fk` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_fk` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar categorías de comunidades por defecto
INSERT INTO `community_categories` (`id`, `name`, `slug`, `description`, `icon`, `color`, `order`, `is_active`, `created_at`) VALUES
(UUID(), 'Deportes', 'deportes', 'Comunidades relacionadas con deportes y actividades físicas', '⚽', '#00ff88', 1, 1, NOW()),
(UUID(), 'Música', 'musica', 'Comunidades de música, artistas y géneros musicales', '🎵', '#ff0088', 2, 1, NOW()),
(UUID(), 'Arte', 'arte', 'Comunidades de arte, diseño y creatividad', '🎨', '#8800ff', 3, 1, NOW()),
(UUID(), 'Gaming', 'gaming', 'Comunidades de videojuegos y esports', '🎮', '#0088ff', 4, 1, NOW()),
(UUID(), 'Tecnología', 'tecnologia', 'Comunidades de tecnología, programación y desarrollo', '💻', '#00ffff', 5, 1, NOW()),
(UUID(), 'Educación', 'educacion', 'Comunidades educativas y de aprendizaje', '📚', '#ffaa00', 6, 1, NOW()),
(UUID(), 'Negocios', 'negocios', 'Comunidades de emprendimiento y negocios', '💼', '#ff6600', 7, 1, NOW()),
(UUID(), 'Salud', 'salud', 'Comunidades de salud, bienestar y fitness', '💪', '#00ff00', 8, 1, NOW());

-- Insertar secciones de aprendizaje por defecto
INSERT INTO `learning_sections` (`id`, `titulo`, `descripcion`, `icono`, `color`, `orden`, `is_active`, `created_at`, `updated_at`) VALUES
(UUID(), 'Fundamentos del Fútbol', 'Aprende los conceptos básicos del fútbol', '⚽', '#00ff88', 1, 1, NOW(), NOW()),
(UUID(), 'Técnicas Avanzadas', 'Mejora tus habilidades con técnicas profesionales', '🎯', '#ff0088', 2, 1, NOW(), NOW()),
(UUID(), 'Estrategia y Táctica', 'Comprende el juego desde una perspectiva estratégica', '🧠', '#0088ff', 3, 1, NOW(), NOW()),
(UUID(), 'Preparación Física', 'Entrena tu cuerpo para el máximo rendimiento', '💪', '#ffaa00', 4, 1, NOW(), NOW());

-- ============================================
-- FINALIZACIÓN
-- ============================================

COMMIT;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. Este script crea todas las tablas necesarias para SOS-HABILIDOSO
-- 2. Asegúrate de tener una base de datos creada antes de ejecutar
-- 3. Todas las tablas usan UTF-8 (utf8mb4) para soportar emojis
-- 4. Los IDs principales usan UUID (char(36)) para mejor distribución
-- 5. Las relaciones Many-to-Many usan tablas intermedias con AUTO_INCREMENT
-- 6. Todos los campos de fecha usan datetime(6) para microsegundos
-- 7. Las claves foráneas tienen ON DELETE CASCADE o SET NULL según corresponda
-- 8. Se incluyen índices para optimizar las consultas más comunes
--
-- DESPUÉS DE EJECUTAR ESTE SCRIPT:
-- 1. Actualiza el archivo .env con las credenciales de la BD remota
-- 2. Ejecuta las migraciones de Django: python manage.py migrate --fake-initial
-- 3. Crea un superusuario: python manage.py createsuperuser
-- 4. Carga datos de prueba si es necesario
--
-- ============================================
