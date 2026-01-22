-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3307:3307
-- Tiempo de generación: 21-01-2026 a las 01:44:27
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: habilidosos_db
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla advertising_adclick
--

CREATE TABLE advertising_adclick (
  id char(32) NOT NULL,
  ip_address char(39) DEFAULT NULL,
  user_agent longtext NOT NULL,
  clicked_at datetime(6) NOT NULL,
  ad_id char(32) NOT NULL,
  user_id char(32) DEFAULT NULL,
  impression_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla advertising_adclick
--

INSERT INTO advertising_adclick (id, ip_address, user_agent, clicked_at, ad_id, user_id, impression_id) VALUES
('1bfa61d63c6d4ff7b7a4e22332f3abdf', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-16 14:51:18.274881', 'f3964c7897734cd5844f6a586803ba97', 'bd22ec1c4dbe48f3a018e96b2cd61304', '5e520020a36042fb9ff258f486592145'),
('2b00b607ecbd410980be3e2dd0ee9520', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-16 16:04:52.853435', 'f3964c7897734cd5844f6a586803ba97', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('4d74f56e43ae4fc4a508bf85ad1dda07', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-16 16:25:00.300869', '8a926e24953742e18f4d2d7515e90972', '6f053d432986406289a54b930e90924f', '1e82e3fbf19a48a3a16e02a5061c2962'),
('5da907b7e3824c83b5cee2bb088ae277', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-15 17:06:30.111969', 'cbd0cf243dce40f59127a329d3995de8', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'b97adb3c04aa4b1886762702e1bdd89d'),
('686956fd23ed4e808d1f0ae17e66eeae', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-17 16:51:49.719969', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304', '6eaac6e70e9f480f8b56a498f7e9b08a'),
('b063358970164966bd5ffbcdcf8d8083', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-15 17:13:00.565664', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'e64586b484cc462a8f7b408603f1abf7'),
('d210927e1f6f4db1a8ce022a1bb97030', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-16 11:46:43.086400', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304', '1999c6f5b5244313a6d2493ab556cd7c'),
('d96e9e884d65449b95ad4532ca580e34', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-15 17:10:02.366493', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304', '8382f12718394498866776d12bec5542'),
('e41f9f8c4a6c46fda80607ed21e78773', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-15 17:03:39.551994', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304', '906713e4a9ae443ca8af8fd9ee1c1c48');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla advertising_adimpression
--

CREATE TABLE advertising_adimpression (
  id char(32) NOT NULL,
  session_id varchar(100) NOT NULL,
  ip_address char(39) DEFAULT NULL,
  user_agent longtext NOT NULL,
  position_in_feed int(11) NOT NULL,
  viewed_at datetime(6) NOT NULL,
  ad_id char(32) NOT NULL,
  user_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla advertising_adimpression
--

INSERT INTO advertising_adimpression (id, session_id, ip_address, user_agent, position_in_feed, viewed_at, ad_id, user_id) VALUES
('0529020984204ce2a3a233844ce29fdc', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 14, '2025-12-15 17:08:59.655897', 'cbd0cf243dce40f59127a329d3995de8', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('110aeac738f243b1b1e2583324444bec', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-15 18:02:14.513968', '8a926e24953742e18f4d2d7515e90972', '6f053d432986406289a54b930e90924f'),
('1999c6f5b5244313a6d2493ab556cd7c', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-16 11:46:32.004031', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('1e82e3fbf19a48a3a16e02a5061c2962', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-16 16:24:19.907650', '8a926e24953742e18f4d2d7515e90972', '6f053d432986406289a54b930e90924f'),
('1fbf696b949d42e8a9c7ed18a8e5034a', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 19, '2025-12-15 17:06:40.094074', '924295e7761e44d782d7947761aab817', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('2941df87090944738fc3298b87901161', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-16 14:22:29.726984', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('461d7f48323d4d948c38edbf51a54590', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 9, '2025-12-15 17:08:54.957434', '924295e7761e44d782d7947761aab817', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('4cfad48d01284a4881009b493188aa9e', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-17 17:48:51.565854', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('586cf8fb942247f381c3650c9460eb7f', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-20 11:18:26.193550', '8a926e24953742e18f4d2d7515e90972', '6f053d432986406289a54b930e90924f'),
('5e520020a36042fb9ff258f486592145', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-16 14:51:13.996868', 'f3964c7897734cd5844f6a586803ba97', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('690e137f6729439b9c9790a2774546ac', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-15 19:01:27.119770', '8a926e24953742e18f4d2d7515e90972', '6f053d432986406289a54b930e90924f'),
('6b7ab943f9ff40db9710240d1020f973', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 9, '2025-12-15 17:09:56.107993', 'cbd0cf243dce40f59127a329d3995de8', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('6eaac6e70e9f480f8b56a498f7e9b08a', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-17 16:51:29.901184', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('6f78c9eb124a4ad79a5c4f2fdeb0159c', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-16 16:11:17.060211', 'f3964c7897734cd5844f6a586803ba97', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('8382f12718394498866776d12bec5542', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 14, '2025-12-15 17:09:59.967896', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('84b626323cc04f63a8dbf48fd4f2d69a', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-15 17:06:20.728712', '46b5f3634566494f9937fba10833f799', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('86648f5e7f9a40c4a2eaf8c577417785', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-17 18:59:16.644450', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('86f9b2ff2f6d490eb560a82cd84c69ae', '', '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', 4, '2025-12-21 02:56:47.555663', '8a926e24953742e18f4d2d7515e90972', '6f053d432986406289a54b930e90924f'),
('8a5fc5f566ee468e9071e95b5406581c', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 19, '2025-12-15 17:09:02.204193', '46b5f3634566494f9937fba10833f799', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('8cc39d155af445aeaf0c5b71970e1c31', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-16 16:35:41.186379', '8a926e24953742e18f4d2d7515e90972', '6f053d432986406289a54b930e90924f'),
('906713e4a9ae443ca8af8fd9ee1c1c48', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-15 17:03:34.947108', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('999d3b86f59646c5afad42caf2b701c5', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-15 17:09:53.184867', '924295e7761e44d782d7947761aab817', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('a937828c6d9743bbbe7ee9aaa0103452', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-15 17:12:32.938146', 'c3446c5dbb7540be88b17f900b8f0289', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('ab6f8b93df354e32ad973875760f4688', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 14, '2025-12-15 17:06:38.101632', 'c3446c5dbb7540be88b17f900b8f0289', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('ac89bfd333db4926a9e43eb8c5d14903', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-19 10:53:28.877845', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('b97adb3c04aa4b1886762702e1bdd89d', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 9, '2025-12-15 17:06:27.118179', 'cbd0cf243dce40f59127a329d3995de8', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('cf5feead6c4148efb42bdc7fc1511b41', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-15 17:08:52.457898', 'c3446c5dbb7540be88b17f900b8f0289', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('d63ed00ee09848c5bdcddd8107797021', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-19 11:40:58.514764', '8a926e24953742e18f4d2d7515e90972', '6f053d432986406289a54b930e90924f'),
('dd2e100c80994f1d8f1c2338ce35081f', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-16 16:30:07.091614', '8a926e24953742e18f4d2d7515e90972', '6f053d432986406289a54b930e90924f'),
('df51f14fa68649618e92c76c6839286f', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 19, '2025-12-15 17:11:01.140743', '46b5f3634566494f9937fba10833f799', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('e64586b484cc462a8f7b408603f1abf7', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 9, '2025-12-15 17:12:35.369771', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('e8f3379012dd49f38e0fe9e549249fe2', '', '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', 4, '2025-12-27 20:27:58.319118', '8a926e24953742e18f4d2d7515e90972', '6f053d432986406289a54b930e90924f'),
('fa24d48d41764478a12ca9f2183b95fe', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-19 18:44:31.589620', '8a926e24953742e18f4d2d7515e90972', '6f053d432986406289a54b930e90924f'),
('fe78c9c0714e4d9a9d5d758d87ca59f8', '', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 4, '2025-12-16 14:26:06.571884', '8a926e24953742e18f4d2d7515e90972', 'bd22ec1c4dbe48f3a018e96b2cd61304');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla advertising_advertisement
--

CREATE TABLE advertising_advertisement (
  id char(32) NOT NULL,
  title varchar(200) NOT NULL,
  description longtext NOT NULL,
  advertiser_name varchar(200) NOT NULL,
  advertiser_email varchar(254) NOT NULL,
  ad_type varchar(20) NOT NULL,
  position varchar(20) NOT NULL,
  image varchar(100) DEFAULT NULL,
  video_url varchar(200) NOT NULL,
  link_url varchar(200) NOT NULL,
  call_to_action varchar(50) NOT NULL,
  target_countries longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(target_countries)),
  target_cities longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(target_cities)),
  target_age_min int(11) DEFAULT NULL,
  target_age_max int(11) DEFAULT NULL,
  target_interests longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(target_interests)),
  budget decimal(12,2) NOT NULL,
  cost_per_click decimal(8,4) NOT NULL,
  cost_per_impression decimal(8,4) NOT NULL,
  impressions int(11) NOT NULL,
  clicks int(11) NOT NULL,
  conversions int(11) NOT NULL,
  total_spent decimal(12,2) NOT NULL,
  status varchar(20) NOT NULL,
  start_date datetime(6) NOT NULL,
  end_date datetime(6) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  approved_at datetime(6) DEFAULT NULL,
  rejection_reason longtext NOT NULL,
  approved_by_id char(32) DEFAULT NULL,
  advertiser_logo varchar(100) DEFAULT NULL,
  carousel_images longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(carousel_images)),
  created_by_id char(32) DEFAULT NULL,
  daily_budget decimal(10,2) NOT NULL,
  is_active tinyint(1) NOT NULL,
  max_clicks int(11) NOT NULL,
  max_impressions int(11) NOT NULL,
  max_impressions_per_day int(11) NOT NULL,
  max_impressions_per_user int(11) NOT NULL,
  priority int(11) NOT NULL,
  show_every_n_posts int(11) NOT NULL,
  show_from_hour int(11) NOT NULL,
  show_on_weekdays longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(show_on_weekdays)),
  show_until_hour int(11) NOT NULL,
  target_gender varchar(10) NOT NULL,
  unique_views int(11) NOT NULL,
  video varchar(100) DEFAULT NULL,
  video_completions int(11) NOT NULL,
  video_views int(11) NOT NULL,
  weight int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla advertising_advertisement
--

INSERT INTO advertising_advertisement (id, title, description, advertiser_name, advertiser_email, ad_type, position, image, video_url, link_url, call_to_action, target_countries, target_cities, target_age_min, target_age_max, target_interests, budget, cost_per_click, cost_per_impression, impressions, clicks, conversions, total_spent, status, start_date, end_date, created_at, updated_at, approved_at, rejection_reason, approved_by_id, advertiser_logo, carousel_images, created_by_id, daily_budget, is_active, max_clicks, max_impressions, max_impressions_per_day, max_impressions_per_user, priority, show_every_n_posts, show_from_hour, show_on_weekdays, show_until_hour, target_gender, unique_views, video, video_completions, video_views, weight) VALUES
('46b5f3634566494f9937fba10833f799', 'Gatorade - Hidratación Deportiva', 'Recupera lo que pierdes. La bebida oficial de los campeones.', 'Gatorade', 'ads@gatorade.com', 'image', 'between_posts', '', '', 'https://gatorade.com', 'Conoce Más', '[]', '[]', NULL, NULL, '[]', 2000.00, 0.0000, 0.0000, 3, 0, 0, 0.00, 'paused', '2025-12-02 20:51:07.132558', '2026-01-01 20:51:07.132558', '2025-12-02 20:51:07.156159', '2025-12-02 20:51:07.156165', NULL, '', NULL, '', '[]', '4912c5171c6d48d4bdbcfbd889a9143c', 50.00, 0, 0, 0, 3, 10, 2, 10, 0, '[]', 23, 'all', 1, '', 0, 0, 100),
('8a926e24953742e18f4d2d7515e90972', 'Fundacion Habilidosos', 'Inscripciones abiertas para la temporada 2025. Entrena con los mejores.', 'Habilidosos FC', 'fundahabilidosos@gmail.com', 'video', 'feed', 'ads/images/logo_sos3x.png', '', 'https://fundahabilidosos.com/', 'Inscríbete', '[]', '[]', NULL, NULL, '[]', 1000.00, 0.0000, 0.0000, 20, 6, 0, 0.00, 'active', '2025-12-02 20:51:07.000000', '2026-01-01 20:51:07.000000', '2025-12-02 20:51:07.165368', '2025-12-15 17:12:16.217822', NULL, '', NULL, 'ads/logos/Logo_Habilidosos_MR_blanco4x_TAPVdnq.png', '[]', '4912c5171c6d48d4bdbcfbd889a9143c', 30.00, 1, 0, 0, 3, 10, 2, 8, 0, '[]', 23, 'all', 2, 'ads/videos/manejobalon.mp4', 2, 2, 80),
('924295e7761e44d782d7947761aab817', 'Adidas - Impossible is Nothing', 'Los nuevos guayos Predator. Domina el campo con precisión.', 'Adidas', 'marketing@adidas.com', 'video', 'feed', '', 'https://www.youtube.com/watch?v=example', 'https://adidas.com.co', 'Ver Colección', '[]', '[]', NULL, NULL, '[]', 3000.00, 0.0000, 0.0000, 3, 0, 0, 0.00, 'paused', '2025-12-02 20:51:07.132558', '2026-01-01 20:51:07.132558', '2025-12-02 20:51:07.149817', '2025-12-02 20:51:07.149823', NULL, '', NULL, '', '[]', '4912c5171c6d48d4bdbcfbd889a9143c', 80.00, 0, 0, 0, 3, 10, 3, 7, 0, '[]', 23, 'all', 1, '', 0, 0, 150),
('c3446c5dbb7540be88b17f900b8f0289', 'Nike - Just Do It', 'Descubre la nueva colección de ropa deportiva Nike. Rendimiento y estilo en cada movimiento.', 'Nike Colombia', 'ads@nike.com', 'image', 'feed', '', '', 'https://nike.com/co', 'Comprar Ahora', '[]', '[]', NULL, NULL, '[]', 5000.00, 0.0000, 0.0000, 3, 0, 0, 0.00, 'paused', '2025-12-02 20:51:07.132558', '2026-01-01 20:51:07.132558', '2025-12-02 20:51:07.135418', '2025-12-02 20:51:07.135424', NULL, '', NULL, '', '[]', '4912c5171c6d48d4bdbcfbd889a9143c', 100.00, 0, 0, 0, 3, 10, 4, 5, 0, '[]', 23, 'all', 1, '', 0, 0, 200),
('cbd0cf243dce40f59127a329d3995de8', 'PlayStation - FIFA 25', 'El fútbol nunca se sintió tan real. Disponible ahora.', 'PlayStation', 'ads@playstation.com', 'video', 'feed', '', 'https://www.youtube.com/watch?v=fifa25', 'https://playstation.com/fifa25', 'Comprar Juego', '[]', '[]', NULL, NULL, '[]', 10000.00, 0.0000, 0.0000, 3, 1, 0, 0.00, 'paused', '2025-12-02 20:51:07.132558', '2026-01-01 20:51:07.132558', '2025-12-02 20:51:07.170445', '2025-12-02 20:51:07.170451', NULL, '', NULL, '', '[]', '4912c5171c6d48d4bdbcfbd889a9143c', 200.00, 0, 0, 0, 3, 10, 5, 6, 0, '[]', 23, 'all', 1, '', 0, 0, 250),
('f3964c7897734cd5844f6a586803ba97', 'Comunidad Educativa', 'Educacion Deportiva SOS-HABILIDOSO', 'Habilidosos FC', 'fundahabilidosos@gmail.com', 'image', 'feed', '', '', 'http://localhost:4000/capacitaciones', 'Comienza tu capacitación deportiva.', '[]', '[]', NULL, NULL, '[]', 0.00, 0.0000, 0.0000, 2, 2, 0, 0.00, 'paused', '2025-12-16 00:00:00.000000', '2025-12-30 00:00:00.000000', '2025-12-16 14:49:25.414536', '2025-12-16 14:49:25.414536', NULL, '', NULL, '', '[]', '294820a41aad4ff0abb05e9f5886555c', 0.00, 0, 0, 0, 3, 10, 2, 5, 0, '[]', 23, 'all', 1, '', 0, 0, 100);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla advertising_advideoview
--

CREATE TABLE advertising_advideoview (
  id char(32) NOT NULL,
  watch_duration int(11) NOT NULL,
  video_duration int(11) NOT NULL,
  completed tinyint(1) NOT NULL,
  viewed_at datetime(6) NOT NULL,
  ad_id char(32) NOT NULL,
  user_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla advertising_advideoview
--

INSERT INTO advertising_advideoview (id, watch_duration, video_duration, completed, viewed_at, ad_id, user_id) VALUES
('b33261c18eff47d996b6c368d261f9de', 109, 109, 1, '2025-12-19 11:42:48.827786', '8a926e24953742e18f4d2d7515e90972', '6f053d432986406289a54b930e90924f'),
('e7cdd7ca9d064b09a2e340304584a53b', 109, 109, 1, '2025-12-19 11:44:40.471149', '8a926e24953742e18f4d2d7515e90972', '6f053d432986406289a54b930e90924f');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla advertising_payments
--

CREATE TABLE advertising_payments (
  id char(32) NOT NULL,
  ad_title varchar(200) NOT NULL,
  ad_content longtext NOT NULL,
  ad_image varchar(100) DEFAULT NULL,
  ad_url varchar(200) NOT NULL,
  status varchar(25) NOT NULL,
  impressions int(10) UNSIGNED NOT NULL CHECK (impressions >= 0),
  clicks int(10) UNSIGNED NOT NULL CHECK (clicks >= 0),
  starts_at datetime(6) DEFAULT NULL,
  expires_at datetime(6) DEFAULT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  enterprise_id char(32) DEFAULT NULL,
  pricing_plan_id char(32) NOT NULL,
  transaction_id char(32) DEFAULT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla analytics_useractivity
--

CREATE TABLE analytics_useractivity (
  id char(36) NOT NULL DEFAULT uuid(),
  usuario_id char(36) NOT NULL,
  accion varchar(100) NOT NULL,
  pagina varchar(255) NOT NULL,
  elemento varchar(255) DEFAULT NULL,
  timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  metadata longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(metadata))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla analytics_userinteraction
--

CREATE TABLE analytics_userinteraction (
  id char(36) NOT NULL DEFAULT uuid(),
  usuario_id char(36) NOT NULL,
  tipo_interaccion enum('like','comment','share','follow','view') NOT NULL,
  objeto_tipo varchar(50) NOT NULL,
  objeto_id varchar(100) NOT NULL,
  timestamp timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla analytics_userlocation
--

CREATE TABLE analytics_userlocation (
  id char(36) NOT NULL DEFAULT uuid(),
  usuario_id char(36) NOT NULL,
  pais varchar(100) DEFAULT NULL,
  departamento varchar(100) DEFAULT NULL,
  ciudad varchar(100) DEFAULT NULL,
  barrio varchar(100) DEFAULT NULL,
  latitud decimal(10,8) DEFAULT NULL,
  longitud decimal(11,8) DEFAULT NULL,
  precision_metros int(11) DEFAULT NULL,
  fecha_actualizacion timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla analytics_userpreferences
--

CREATE TABLE analytics_userpreferences (
  id char(36) NOT NULL DEFAULT uuid(),
  usuario_id char(36) NOT NULL,
  categoria_interes varchar(100) NOT NULL,
  nivel_interes int(11) DEFAULT 5 CHECK (nivel_interes between 1 and 10),
  tiempo_dedicado int(11) DEFAULT 0,
  ultima_actualizacion timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla analytics_usersearchhistory
--

CREATE TABLE analytics_usersearchhistory (
  id char(36) NOT NULL DEFAULT uuid(),
  usuario_id char(36) NOT NULL,
  termino_busqueda varchar(255) NOT NULL,
  categoria varchar(100) DEFAULT NULL,
  resultados_encontrados int(11) DEFAULT 0,
  timestamp timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla analytics_usersession
--

CREATE TABLE analytics_usersession (
  id char(36) NOT NULL DEFAULT uuid(),
  usuario_id char(36) NOT NULL,
  fecha_inicio timestamp NOT NULL DEFAULT current_timestamp(),
  fecha_fin timestamp NULL DEFAULT NULL,
  duracion_minutos int(11) DEFAULT 0,
  dispositivo enum('mobile','desktop','tablet') DEFAULT 'desktop',
  navegador varchar(100) DEFAULT NULL,
  ip_address varchar(45) DEFAULT NULL,
  ubicacion_pais varchar(100) DEFAULT NULL,
  ubicacion_ciudad varchar(100) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla analytics_usersocialconnections
--

CREATE TABLE analytics_usersocialconnections (
  id char(36) NOT NULL DEFAULT uuid(),
  usuario_id char(36) NOT NULL,
  amigo_id char(36) NOT NULL,
  tipo_conexion enum('friend','follow','block') DEFAULT 'follow',
  fecha_conexion timestamp NOT NULL DEFAULT current_timestamp(),
  interacciones_comunes int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla auth_group
--

CREATE TABLE auth_group (
  id int(11) NOT NULL,
  name varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla auth_group
--

INSERT INTO auth_group (id, name) VALUES
(4, 'Administradores de Usuarios'),
(2, 'Editores de Contenido'),
(3, 'Gestores de Publicidad'),
(1, 'Moderadores');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla auth_group_permissions
--

CREATE TABLE auth_group_permissions (
  id bigint(20) NOT NULL,
  group_id int(11) NOT NULL,
  permission_id int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla auth_group_permissions
--

INSERT INTO auth_group_permissions (id, group_id, permission_id) VALUES
(6, 1, 24),
(2, 1, 38),
(3, 1, 39),
(1, 1, 40),
(5, 1, 43),
(4, 1, 44),
(8, 1, 114),
(9, 1, 115),
(7, 1, 116),
(10, 2, 37),
(12, 2, 38),
(13, 2, 39),
(11, 2, 40),
(18, 2, 93),
(20, 2, 94),
(19, 2, 96),
(14, 2, 113),
(16, 2, 114),
(17, 2, 115),
(15, 2, 116),
(21, 3, 129),
(23, 3, 130),
(24, 3, 131),
(22, 3, 132),
(26, 3, 136),
(25, 3, 164),
(27, 3, 168),
(32, 4, 12),
(28, 4, 21),
(30, 4, 22),
(31, 4, 23),
(29, 4, 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla auth_permission
--

CREATE TABLE auth_permission (
  id int(11) NOT NULL,
  name varchar(255) NOT NULL,
  content_type_id int(11) NOT NULL,
  codename varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla auth_permission
--

INSERT INTO auth_permission (id, name, content_type_id, codename) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add content type', 4, 'add_contenttype'),
(14, 'Can change content type', 4, 'change_contenttype'),
(15, 'Can delete content type', 4, 'delete_contenttype'),
(16, 'Can view content type', 4, 'view_contenttype'),
(17, 'Can add session', 5, 'add_session'),
(18, 'Can change session', 5, 'change_session'),
(19, 'Can delete session', 5, 'delete_session'),
(20, 'Can view session', 5, 'view_session'),
(21, 'Can add Usuario', 6, 'add_user'),
(22, 'Can change Usuario', 6, 'change_user'),
(23, 'Can delete Usuario', 6, 'delete_user'),
(24, 'Can view Usuario', 6, 'view_user'),
(25, 'Can add Seguimiento', 7, 'add_follow'),
(26, 'Can change Seguimiento', 7, 'change_follow'),
(27, 'Can delete Seguimiento', 7, 'delete_follow'),
(28, 'Can view Seguimiento', 7, 'view_follow'),
(29, 'Can add Solicitud de Amistad', 8, 'add_friendrequest'),
(30, 'Can change Solicitud de Amistad', 8, 'change_friendrequest'),
(31, 'Can delete Solicitud de Amistad', 8, 'delete_friendrequest'),
(32, 'Can view Solicitud de Amistad', 8, 'view_friendrequest'),
(33, 'Can add Amistad', 9, 'add_friendship'),
(34, 'Can change Amistad', 9, 'change_friendship'),
(35, 'Can delete Amistad', 9, 'delete_friendship'),
(36, 'Can view Amistad', 9, 'view_friendship'),
(37, 'Can add Publicación', 10, 'add_post'),
(38, 'Can change Publicación', 10, 'change_post'),
(39, 'Can delete Publicación', 10, 'delete_post'),
(40, 'Can view Publicación', 10, 'view_post'),
(41, 'Can add Comentario', 11, 'add_comment'),
(42, 'Can change Comentario', 11, 'change_comment'),
(43, 'Can delete Comentario', 11, 'delete_comment'),
(44, 'Can view Comentario', 11, 'view_comment'),
(45, 'Can add Post Guardado', 12, 'add_postbookmark'),
(46, 'Can change Post Guardado', 12, 'change_postbookmark'),
(47, 'Can delete Post Guardado', 12, 'delete_postbookmark'),
(48, 'Can view Post Guardado', 12, 'view_postbookmark'),
(49, 'Can add Reacción', 13, 'add_postreaction'),
(50, 'Can change Reacción', 13, 'change_postreaction'),
(51, 'Can delete Reacción', 13, 'delete_postreaction'),
(52, 'Can view Reacción', 13, 'view_postreaction'),
(53, 'Can add Reporte de Post', 14, 'add_postreport'),
(54, 'Can change Reporte de Post', 14, 'change_postreport'),
(55, 'Can delete Reporte de Post', 14, 'delete_postreport'),
(56, 'Can view Reporte de Post', 14, 'view_postreport'),
(57, 'Can add Compartir Post', 15, 'add_postshare'),
(58, 'Can change Compartir Post', 15, 'change_postshare'),
(59, 'Can delete Compartir Post', 15, 'delete_postshare'),
(60, 'Can view Compartir Post', 15, 'view_postshare'),
(61, 'Can add Visualización de Post', 16, 'add_postview'),
(62, 'Can change Visualización de Post', 16, 'change_postview'),
(63, 'Can delete Visualización de Post', 16, 'delete_postview'),
(64, 'Can view Visualización de Post', 16, 'view_postview'),
(65, 'Can add Like de Comentario', 17, 'add_commentlike'),
(66, 'Can change Like de Comentario', 17, 'change_commentlike'),
(67, 'Can delete Like de Comentario', 17, 'delete_commentlike'),
(68, 'Can view Like de Comentario', 17, 'view_commentlike'),
(69, 'Can add Participante de Chat', 18, 'add_chatparticipant'),
(70, 'Can change Participante de Chat', 18, 'change_chatparticipant'),
(71, 'Can delete Participante de Chat', 18, 'delete_chatparticipant'),
(72, 'Can view Participante de Chat', 18, 'view_chatparticipant'),
(73, 'Can add Sala de Chat', 19, 'add_chatroom'),
(74, 'Can change Sala de Chat', 19, 'change_chatroom'),
(75, 'Can delete Sala de Chat', 19, 'delete_chatroom'),
(76, 'Can view Sala de Chat', 19, 'view_chatroom'),
(77, 'Can add Invitación a Chat', 20, 'add_chatinvitation'),
(78, 'Can change Invitación a Chat', 20, 'change_chatinvitation'),
(79, 'Can delete Invitación a Chat', 20, 'delete_chatinvitation'),
(80, 'Can view Invitación a Chat', 20, 'view_chatinvitation'),
(81, 'Can add Mensaje', 21, 'add_message'),
(82, 'Can change Mensaje', 21, 'change_message'),
(83, 'Can delete Mensaje', 21, 'delete_message'),
(84, 'Can view Mensaje', 21, 'view_message'),
(85, 'Can add Reacción a Mensaje', 22, 'add_messagereaction'),
(86, 'Can change Reacción a Mensaje', 22, 'change_messagereaction'),
(87, 'Can delete Reacción a Mensaje', 22, 'delete_messagereaction'),
(88, 'Can view Reacción a Mensaje', 22, 'view_messagereaction'),
(89, 'Can add Mensaje Leído', 23, 'add_messageread'),
(90, 'Can change Mensaje Leído', 23, 'change_messageread'),
(91, 'Can delete Mensaje Leído', 23, 'delete_messageread'),
(92, 'Can view Mensaje Leído', 23, 'view_messageread'),
(93, 'Can add Comunidad', 24, 'add_community'),
(94, 'Can change Comunidad', 24, 'change_community'),
(95, 'Can delete Comunidad', 24, 'delete_community'),
(96, 'Can view Comunidad', 24, 'view_community'),
(97, 'Can add Publicación de Comunidad', 25, 'add_communitypost'),
(98, 'Can change Publicación de Comunidad', 25, 'change_communitypost'),
(99, 'Can delete Publicación de Comunidad', 25, 'delete_communitypost'),
(100, 'Can view Publicación de Comunidad', 25, 'view_communitypost'),
(101, 'Can add Comentario', 26, 'add_communitypostcomment'),
(102, 'Can change Comentario', 26, 'change_communitypostcomment'),
(103, 'Can delete Comentario', 26, 'delete_communitypostcomment'),
(104, 'Can view Comentario', 26, 'view_communitypostcomment'),
(105, 'Can add Enlace Social', 27, 'add_communitysociallink'),
(106, 'Can change Enlace Social', 27, 'change_communitysociallink'),
(107, 'Can delete Enlace Social', 27, 'delete_communitysociallink'),
(108, 'Can view Enlace Social', 27, 'view_communitysociallink'),
(109, 'Can add Membresía', 28, 'add_communitymembership'),
(110, 'Can change Membresía', 28, 'change_communitymembership'),
(111, 'Can delete Membresía', 28, 'delete_communitymembership'),
(112, 'Can view Membresía', 28, 'view_communitymembership'),
(113, 'Can add Reel', 29, 'add_reel'),
(114, 'Can change Reel', 29, 'change_reel'),
(115, 'Can delete Reel', 29, 'delete_reel'),
(116, 'Can view Reel', 29, 'view_reel'),
(117, 'Can add reel comment', 30, 'add_reelcomment'),
(118, 'Can change reel comment', 30, 'change_reelcomment'),
(119, 'Can delete reel comment', 30, 'delete_reelcomment'),
(120, 'Can view reel comment', 30, 'view_reelcomment'),
(121, 'Can add Archivo Multimedia', 31, 'add_mediafile'),
(122, 'Can change Archivo Multimedia', 31, 'change_mediafile'),
(123, 'Can delete Archivo Multimedia', 31, 'delete_mediafile'),
(124, 'Can view Archivo Multimedia', 31, 'view_mediafile'),
(125, 'Can add Álbum Multimedia', 32, 'add_mediaalbum'),
(126, 'Can change Álbum Multimedia', 32, 'change_mediaalbum'),
(127, 'Can delete Álbum Multimedia', 32, 'delete_mediaalbum'),
(128, 'Can view Álbum Multimedia', 32, 'view_mediaalbum'),
(129, 'Can add Anuncio', 33, 'add_advertisement'),
(130, 'Can change Anuncio', 33, 'change_advertisement'),
(131, 'Can delete Anuncio', 33, 'delete_advertisement'),
(132, 'Can view Anuncio', 33, 'view_advertisement'),
(133, 'Can add Click en Anuncio', 34, 'add_adclick'),
(134, 'Can change Click en Anuncio', 34, 'change_adclick'),
(135, 'Can delete Click en Anuncio', 34, 'delete_adclick'),
(136, 'Can view Click en Anuncio', 34, 'view_adclick'),
(137, 'Can add Billetera', 35, 'add_userwallet'),
(138, 'Can change Billetera', 35, 'change_userwallet'),
(139, 'Can delete Billetera', 35, 'delete_userwallet'),
(140, 'Can view Billetera', 35, 'view_userwallet'),
(141, 'Can add Transacción', 36, 'add_transaction'),
(142, 'Can change Transacción', 36, 'change_transaction'),
(143, 'Can delete Transacción', 36, 'delete_transaction'),
(144, 'Can view Transacción', 36, 'view_transaction'),
(145, 'Can add Suscripción', 37, 'add_subscription'),
(146, 'Can change Suscripción', 37, 'change_subscription'),
(147, 'Can delete Suscripción', 37, 'delete_subscription'),
(148, 'Can view Suscripción', 37, 'view_subscription'),
(149, 'Can add Ingreso de Plataforma', 38, 'add_platformrevenue'),
(150, 'Can change Ingreso de Plataforma', 38, 'change_platformrevenue'),
(151, 'Can delete Ingreso de Plataforma', 38, 'delete_platformrevenue'),
(152, 'Can view Ingreso de Plataforma', 38, 'view_platformrevenue'),
(153, 'Can add Notificación', 39, 'add_notification'),
(154, 'Can change Notificación', 39, 'change_notification'),
(155, 'Can delete Notificación', 39, 'delete_notification'),
(156, 'Can view Notificación', 39, 'view_notification'),
(157, 'Can add Participante', 40, 'add_participante'),
(158, 'Can change Participante', 40, 'change_participante'),
(159, 'Can delete Participante', 40, 'delete_participante'),
(160, 'Can view Participante', 40, 'view_participante'),
(161, 'Can add Impresión de Anuncio', 41, 'add_adimpression'),
(162, 'Can change Impresión de Anuncio', 41, 'change_adimpression'),
(163, 'Can delete Impresión de Anuncio', 41, 'delete_adimpression'),
(164, 'Can view Impresión de Anuncio', 41, 'view_adimpression'),
(165, 'Can add Vista de Video', 42, 'add_advideoview'),
(166, 'Can change Vista de Video', 42, 'change_advideoview'),
(167, 'Can delete Vista de Video', 42, 'delete_advideoview'),
(168, 'Can view Vista de Video', 42, 'view_advideoview'),
(169, 'Can add Categoría', 43, 'add_communitycategory'),
(170, 'Can change Categoría', 43, 'change_communitycategory'),
(171, 'Can delete Categoría', 43, 'delete_communitycategory'),
(172, 'Can view Categoría', 43, 'view_communitycategory'),
(173, 'Can add Like de Clasificado', 44, 'add_classifiedlike'),
(174, 'Can change Like de Clasificado', 44, 'change_classifiedlike'),
(175, 'Can delete Like de Clasificado', 44, 'delete_classifiedlike'),
(176, 'Can view Like de Clasificado', 44, 'view_classifiedlike'),
(177, 'Can add Reseña de Servicio', 45, 'add_servicereview'),
(178, 'Can change Reseña de Servicio', 45, 'change_servicereview'),
(179, 'Can delete Reseña de Servicio', 45, 'delete_servicereview'),
(180, 'Can view Reseña de Servicio', 45, 'view_servicereview'),
(181, 'Can add Reporte de Clasificado', 46, 'add_classifiedreport'),
(182, 'Can change Reporte de Clasificado', 46, 'change_classifiedreport'),
(183, 'Can delete Reporte de Clasificado', 46, 'delete_classifiedreport'),
(184, 'Can view Reporte de Clasificado', 46, 'view_classifiedreport'),
(185, 'Can add Trabajo Freelancer', 47, 'add_freelancerclassified'),
(186, 'Can change Trabajo Freelancer', 47, 'change_freelancerclassified'),
(187, 'Can delete Trabajo Freelancer', 47, 'delete_freelancerclassified'),
(188, 'Can view Trabajo Freelancer', 47, 'view_freelancerclassified'),
(189, 'Can add Vista de Clasificado', 48, 'add_classifiedview'),
(190, 'Can change Vista de Clasificado', 48, 'change_classifiedview'),
(191, 'Can delete Vista de Clasificado', 48, 'delete_classifiedview'),
(192, 'Can view Vista de Clasificado', 48, 'view_classifiedview'),
(193, 'Can add Contacto de Clasificado', 49, 'add_classifiedcontact'),
(194, 'Can change Contacto de Clasificado', 49, 'change_classifiedcontact'),
(195, 'Can delete Contacto de Clasificado', 49, 'delete_classifiedcontact'),
(196, 'Can view Contacto de Clasificado', 49, 'view_classifiedcontact'),
(197, 'Can add Servicio Clasificado', 50, 'add_serviceclassified'),
(198, 'Can change Servicio Clasificado', 50, 'change_serviceclassified'),
(199, 'Can delete Servicio Clasificado', 50, 'delete_serviceclassified'),
(200, 'Can view Servicio Clasificado', 50, 'view_serviceclassified'),
(201, 'Can add Producto Clasificado', 51, 'add_productclassified'),
(202, 'Can change Producto Clasificado', 51, 'change_productclassified'),
(203, 'Can delete Producto Clasificado', 51, 'delete_productclassified'),
(204, 'Can view Producto Clasificado', 51, 'view_productclassified'),
(205, 'Can add Logro de Usuario', 52, 'add_usuariologro'),
(206, 'Can change Logro de Usuario', 52, 'change_usuariologro'),
(207, 'Can delete Logro de Usuario', 52, 'delete_usuariologro'),
(208, 'Can view Logro de Usuario', 52, 'view_usuariologro'),
(209, 'Can add Sección', 53, 'add_seccion'),
(210, 'Can change Sección', 53, 'change_seccion'),
(211, 'Can delete Sección', 53, 'delete_seccion'),
(212, 'Can view Sección', 53, 'view_seccion'),
(213, 'Can add Tema', 54, 'add_tema'),
(214, 'Can change Tema', 54, 'change_tema'),
(215, 'Can delete Tema', 54, 'delete_tema'),
(216, 'Can view Tema', 54, 'view_tema'),
(217, 'Can add Punto Clave', 55, 'add_temapuntoclave'),
(218, 'Can change Punto Clave', 55, 'change_temapuntoclave'),
(219, 'Can delete Punto Clave', 55, 'delete_temapuntoclave'),
(220, 'Can view Punto Clave', 55, 'view_temapuntoclave'),
(221, 'Can add Contenido de Tema', 56, 'add_temacontenido'),
(222, 'Can change Contenido de Tema', 56, 'change_temacontenido'),
(223, 'Can delete Contenido de Tema', 56, 'delete_temacontenido'),
(224, 'Can view Contenido de Tema', 56, 'view_temacontenido'),
(225, 'Can add Progreso de Usuario', 57, 'add_progresousuario'),
(226, 'Can change Progreso de Usuario', 57, 'change_progresousuario'),
(227, 'Can delete Progreso de Usuario', 57, 'delete_progresousuario'),
(228, 'Can view Progreso de Usuario', 57, 'view_progresousuario'),
(229, 'Can add Logro', 58, 'add_logro'),
(230, 'Can change Logro', 58, 'change_logro'),
(231, 'Can delete Logro', 58, 'delete_logro'),
(232, 'Can view Logro', 58, 'view_logro'),
(233, 'Can add Participante 2026', 59, 'add_participante2026'),
(234, 'Can change Participante 2026', 59, 'change_participante2026'),
(235, 'Can delete Participante 2026', 59, 'delete_participante2026'),
(236, 'Can view Participante 2026', 59, 'view_participante2026'),
(237, 'Can add Historia', 60, 'add_story'),
(238, 'Can change Historia', 60, 'change_story'),
(239, 'Can delete Historia', 60, 'delete_story'),
(240, 'Can view Historia', 60, 'view_story'),
(241, 'Can add Visualización de Historia', 61, 'add_storyview'),
(242, 'Can change Visualización de Historia', 61, 'change_storyview'),
(243, 'Can delete Visualización de Historia', 61, 'delete_storyview'),
(244, 'Can view Visualización de Historia', 61, 'view_storyview'),
(245, 'Can add Respuesta de Historia', 62, 'add_storyreply'),
(246, 'Can change Respuesta de Historia', 62, 'change_storyreply'),
(247, 'Can delete Respuesta de Historia', 62, 'delete_storyreply'),
(248, 'Can view Respuesta de Historia', 62, 'view_storyreply'),
(249, 'Can add Reacción de Historia', 63, 'add_storyreaction'),
(250, 'Can change Reacción de Historia', 63, 'change_storyreaction'),
(251, 'Can delete Reacción de Historia', 63, 'delete_storyreaction'),
(252, 'Can view Reacción de Historia', 63, 'view_storyreaction'),
(253, 'Can add Categoría de Deporte', 64, 'add_sportcategory'),
(254, 'Can change Categoría de Deporte', 64, 'change_sportcategory'),
(255, 'Can delete Categoría de Deporte', 64, 'delete_sportcategory'),
(256, 'Can view Categoría de Deporte', 64, 'view_sportcategory'),
(257, 'Can add Perfil de Deportista', 65, 'add_athleteprofile'),
(258, 'Can change Perfil de Deportista', 65, 'change_athleteprofile'),
(259, 'Can delete Perfil de Deportista', 65, 'delete_athleteprofile'),
(260, 'Can view Perfil de Deportista', 65, 'view_athleteprofile'),
(261, 'Can add Medio del Deportista', 66, 'add_athletemedia'),
(262, 'Can change Medio del Deportista', 66, 'change_athletemedia'),
(263, 'Can delete Medio del Deportista', 66, 'delete_athletemedia'),
(264, 'Can view Medio del Deportista', 66, 'view_athletemedia'),
(265, 'Can add Donación', 67, 'add_donation'),
(266, 'Can change Donación', 67, 'change_donation'),
(267, 'Can delete Donación', 67, 'delete_donation'),
(268, 'Can view Donación', 67, 'view_donation'),
(269, 'Can add Empresa', 68, 'add_enterprise'),
(270, 'Can change Empresa', 68, 'change_enterprise'),
(271, 'Can delete Empresa', 68, 'delete_enterprise'),
(272, 'Can view Empresa', 68, 'view_enterprise'),
(273, 'Can add Seguimiento de Empresa', 69, 'add_enterprisefollow'),
(274, 'Can change Seguimiento de Empresa', 69, 'change_enterprisefollow'),
(275, 'Can delete Seguimiento de Empresa', 69, 'delete_enterprisefollow'),
(276, 'Can view Seguimiento de Empresa', 69, 'view_enterprisefollow'),
(277, 'Can add Cuenta de Pago', 70, 'add_paymentaccount'),
(278, 'Can change Cuenta de Pago', 70, 'change_paymentaccount'),
(279, 'Can delete Cuenta de Pago', 70, 'delete_paymentaccount'),
(280, 'Can view Cuenta de Pago', 70, 'view_paymentaccount'),
(281, 'Can add Configuración de Plataforma', 71, 'add_platformsettings'),
(282, 'Can change Configuración de Plataforma', 71, 'change_platformsettings'),
(283, 'Can delete Configuración de Plataforma', 71, 'delete_platformsettings'),
(284, 'Can view Configuración de Plataforma', 71, 'view_platformsettings'),
(285, 'Can add Plan de Precios', 72, 'add_pricingplan'),
(286, 'Can change Plan de Precios', 72, 'change_pricingplan'),
(287, 'Can delete Plan de Precios', 72, 'delete_pricingplan'),
(288, 'Can view Plan de Precios', 72, 'view_pricingplan'),
(289, 'Can add Transacción', 73, 'add_transaction'),
(290, 'Can change Transacción', 73, 'change_transaction'),
(291, 'Can delete Transacción', 73, 'delete_transaction'),
(292, 'Can view Transacción', 73, 'view_transaction'),
(293, 'Can add Pago de Clasificado Empresarial', 74, 'add_enterpriseclassifiedpayment'),
(294, 'Can change Pago de Clasificado Empresarial', 74, 'change_enterpriseclassifiedpayment'),
(295, 'Can delete Pago de Clasificado Empresarial', 74, 'delete_enterpriseclassifiedpayment'),
(296, 'Can view Pago de Clasificado Empresarial', 74, 'view_enterpriseclassifiedpayment'),
(297, 'Can add Donación', 75, 'add_donationtransaction'),
(298, 'Can change Donación', 75, 'change_donationtransaction'),
(299, 'Can delete Donación', 75, 'delete_donationtransaction'),
(300, 'Can view Donación', 75, 'view_donationtransaction'),
(301, 'Can add Pago de Publicidad', 76, 'add_advertisingpayment'),
(302, 'Can change Pago de Publicidad', 76, 'change_advertisingpayment'),
(303, 'Can delete Pago de Publicidad', 76, 'delete_advertisingpayment'),
(304, 'Can view Pago de Publicidad', 76, 'view_advertisingpayment'),
(305, 'Can add Configuración del Sitio', 77, 'add_sitesettings'),
(306, 'Can change Configuración del Sitio', 77, 'change_sitesettings'),
(307, 'Can delete Configuración del Sitio', 77, 'delete_sitesettings'),
(308, 'Can view Configuración del Sitio', 77, 'view_sitesettings');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla chat_invitations
--

CREATE TABLE chat_invitations (
  id char(32) NOT NULL,
  status varchar(10) NOT NULL,
  message longtext NOT NULL,
  created_at datetime(6) NOT NULL,
  responded_at datetime(6) DEFAULT NULL,
  expires_at datetime(6) NOT NULL,
  invitee_id char(32) NOT NULL,
  inviter_id char(32) NOT NULL,
  chat_room_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla chat_participants
--

CREATE TABLE chat_participants (
  id char(32) NOT NULL,
  role varchar(10) NOT NULL,
  other_user_nickname varchar(50) NOT NULL,
  chat_background varchar(20) NOT NULL,
  chat_color varchar(30) NOT NULL,
  other_message_color varchar(30) NOT NULL,
  notifications_enabled tinyint(1) NOT NULL,
  sound_enabled tinyint(1) NOT NULL,
  is_muted tinyint(1) NOT NULL,
  is_blocked tinyint(1) NOT NULL,
  joined_at datetime(6) NOT NULL,
  last_read_at datetime(6) NOT NULL,
  user_id char(32) NOT NULL,
  chat_room_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla chat_participants
--

INSERT INTO chat_participants (id, role, other_user_nickname, chat_background, chat_color, other_message_color, notifications_enabled, sound_enabled, is_muted, is_blocked, joined_at, last_read_at, user_id, chat_room_id) VALUES
('0be1413649fb42d3a3e3473112de5b53', 'member', '', '', '', '', 1, 1, 0, 0, '2025-12-13 05:23:59.498673', '2026-01-19 17:16:33.781623', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'eaf6777252484757b628ede0bc918c68'),
('181bf09969e8441e990a71ad8ea3c11f', 'member', '', '', '', '', 1, 1, 0, 0, '2025-12-21 00:55:54.933679', '2026-01-19 16:12:03.542128', 'bd22ec1c4dbe48f3a018e96b2cd61304', '8321f9f9db4a47e28398ccaf8f782732'),
('35f595977b5147d3845eb77446448058', 'member', '', '', '', '', 1, 1, 0, 0, '2025-12-21 00:55:54.949684', '2025-12-21 00:55:54.952679', '4cccc11a7e634423bf92808272ad4b52', '8321f9f9db4a47e28398ccaf8f782732'),
('4686d12a255747b3a0dec7ce872f0fd7', 'member', '', '', '', '', 1, 1, 0, 0, '2025-12-13 02:24:13.811295', '2026-01-19 16:12:06.198277', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'cadbdb195c194d9ca23407060754e886'),
('51df8314ec184dc58423d11bf88e7df9', 'member', '', '', '', '', 1, 1, 0, 0, '2025-12-02 05:04:54.722050', '2025-12-02 05:04:54.728655', '84c5e41a9e4348548886b797643f91f8', 'cc80982c9bbd443aac567353b8570e3e'),
('55eeb55a20ba4fe09df1ad5b6d3f9155', 'member', '', '', '', '', 1, 1, 0, 0, '2025-12-02 05:04:54.697165', '2025-12-02 05:04:54.705141', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'cc80982c9bbd443aac567353b8570e3e'),
('5c4788242d8c438c808f01beb5ad5e11', 'member', '', '', '', '', 1, 1, 0, 0, '2025-12-21 02:51:45.883183', '2025-12-21 02:51:46.668632', '6f053d432986406289a54b930e90924f', '59b04a0e635241149f92865faf329c07'),
('636d3721be7246ba8c7645b5aecd8add', 'member', '', '', '', '', 1, 1, 0, 0, '2025-12-16 14:28:09.696682', '2025-12-16 14:28:09.702592', 'e3702132b6cb45d2a390e6b1b5f254ab', '7b353b9306b5419fa6bca1261339257e'),
('6bc8df9c901a4b2084b030bc555c3d84', 'member', '', '', '', '', 1, 1, 0, 0, '2025-12-21 02:51:45.897723', '2025-12-21 02:51:45.900803', 'e3702132b6cb45d2a390e6b1b5f254ab', '59b04a0e635241149f92865faf329c07'),
('ace96a9f3c874b749bdcd0ae9772b305', 'member', '', '', '', '', 1, 1, 0, 0, '2025-12-13 02:24:13.846968', '2025-12-13 02:24:13.855566', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'cadbdb195c194d9ca23407060754e886'),
('aeaadda75e4842f0b94756fedecd2a76', 'member', '', '', '', '', 1, 1, 0, 0, '2025-12-13 05:24:07.586114', '2025-12-13 05:24:07.590267', '4265f3cd6c7a493b9e35efbacd3b3a6b', '36fc76299c6b4793bfc8c89461facd4e'),
('d3a16b3ad533445ea27f27a5d8de5adf', 'member', '', '', '', '', 1, 1, 0, 0, '2025-12-13 05:24:07.579106', '2025-12-21 02:51:27.883898', '6f053d432986406289a54b930e90924f', '36fc76299c6b4793bfc8c89461facd4e'),
('e9bd872c61fb478680c3e522b17b5d03', 'member', '', '', '', '', 1, 1, 0, 0, '2025-12-16 14:28:09.677681', '2025-12-16 14:28:09.688877', 'bd22ec1c4dbe48f3a018e96b2cd61304', '7b353b9306b5419fa6bca1261339257e'),
('f3ef85f1836b4455ae997e0b2f33dfff', 'member', '', '', '', '', 1, 1, 0, 0, '2025-12-13 05:23:59.487257', '2025-12-22 11:24:30.277068', '6f053d432986406289a54b930e90924f', 'eaf6777252484757b628ede0bc918c68');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla chat_rooms
--

CREATE TABLE chat_rooms (
  id char(32) NOT NULL,
  name varchar(100) NOT NULL,
  chat_type varchar(15) NOT NULL,
  description longtext NOT NULL,
  avatar varchar(100) DEFAULT NULL,
  is_active tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  last_activity datetime(6) NOT NULL,
  created_by_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla chat_rooms
--

INSERT INTO chat_rooms (id, name, chat_type, description, avatar, is_active, created_at, updated_at, last_activity, created_by_id) VALUES
('36fc76299c6b4793bfc8c89461facd4e', '', 'private', '', '', 1, '2025-12-13 05:24:07.572591', '2025-12-13 05:24:07.572591', '2025-12-21 02:51:33.254825', '6f053d432986406289a54b930e90924f'),
('59b04a0e635241149f92865faf329c07', '', 'private', '', '', 1, '2025-12-21 02:51:45.873078', '2025-12-21 02:51:45.873078', '2025-12-21 02:51:45.873078', '6f053d432986406289a54b930e90924f'),
('7b353b9306b5419fa6bca1261339257e', '', 'private', '', '', 1, '2025-12-16 14:28:09.669843', '2025-12-16 14:28:09.669843', '2025-12-16 14:28:09.669843', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('8321f9f9db4a47e28398ccaf8f782732', '', 'private', '', '', 1, '2025-12-21 00:55:54.913449', '2025-12-21 00:55:54.913449', '2025-12-21 18:05:19.192435', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('cadbdb195c194d9ca23407060754e886', '', 'private', '', '', 1, '2025-12-13 02:24:13.778451', '2025-12-13 02:24:13.779450', '2026-01-19 11:30:46.128301', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('cc80982c9bbd443aac567353b8570e3e', '', 'private', '', '', 1, '2025-12-02 05:04:54.654190', '2025-12-02 05:04:54.654425', '2025-12-02 05:04:54.654465', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('eaf6777252484757b628ede0bc918c68', '', 'private', '', '', 1, '2025-12-13 05:23:59.465876', '2025-12-13 05:23:59.465876', '2026-01-19 17:17:06.064168', '6f053d432986406289a54b930e90924f');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla classifieds_contacts
--

CREATE TABLE classifieds_contacts (
  id char(32) NOT NULL,
  classified_type varchar(20) NOT NULL,
  classified_id char(32) NOT NULL,
  message longtext NOT NULL,
  is_read tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  receiver_id char(32) NOT NULL,
  sender_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla classifieds_freelancer
--

CREATE TABLE classifieds_freelancer (
  id char(32) NOT NULL,
  short_id varchar(8) NOT NULL,
  title varchar(200) NOT NULL,
  description longtext NOT NULL,
  price decimal(12,2) NOT NULL,
  currency varchar(3) NOT NULL,
  negotiable tinyint(1) NOT NULL,
  location varchar(200) NOT NULL,
  latitude decimal(9,6) DEFAULT NULL,
  longitude decimal(9,6) DEFAULT NULL,
  images longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(images)),
  status varchar(20) NOT NULL,
  is_featured tinyint(1) NOT NULL,
  views_count int(10) UNSIGNED NOT NULL CHECK (views_count >= 0),
  likes_count int(10) UNSIGNED NOT NULL CHECK (likes_count >= 0),
  contacts_count int(10) UNSIGNED NOT NULL CHECK (contacts_count >= 0),
  tags longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(tags)),
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  expires_at datetime(6) DEFAULT NULL,
  category varchar(50) NOT NULL,
  skills longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(skills)),
  portfolio_url varchar(200) NOT NULL,
  portfolio_images longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(portfolio_images)),
  delivery_time varchar(20) NOT NULL,
  project_type varchar(20) NOT NULL,
  years_experience int(10) UNSIGNED NOT NULL CHECK (years_experience >= 0),
  rating decimal(3,2) NOT NULL,
  reviews_count int(10) UNSIGNED NOT NULL CHECK (reviews_count >= 0),
  completed_projects int(10) UNSIGNED NOT NULL CHECK (completed_projects >= 0),
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla classifieds_freelancer
--

INSERT INTO classifieds_freelancer (id, short_id, title, description, price, currency, negotiable, location, latitude, longitude, images, status, is_featured, views_count, likes_count, contacts_count, tags, created_at, updated_at, expires_at, category, skills, portfolio_url, portfolio_images, delivery_time, project_type, years_experience, rating, reviews_count, completed_projects, user_id) VALUES
('c45c37746c3643e59b4670d0ea1939d9', 'RLN2YUOV', 'Diseño de Logotipos Profesionales', 'Diseño de identidad visual para tu marca.', 500000.00, 'COP', 1, 'Remoto', NULL, NULL, '[]', 'active', 0, 0, 0, 0, '[]', '2025-12-03 18:56:20.287573', '2025-12-03 18:56:20.287589', NULL, 'graphic_design', '[\"Photoshop\", \"Illustrator\", \"Figma\"]', '', '[]', '1week', 'one_time', 5, 0.00, 0, 0, 'e3702132b6cb45d2a390e6b1b5f254ab');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla classifieds_likes
--

CREATE TABLE classifieds_likes (
  id char(32) NOT NULL,
  classified_type varchar(20) NOT NULL,
  classified_id char(32) NOT NULL,
  created_at datetime(6) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla classifieds_products
--

CREATE TABLE classifieds_products (
  id char(32) NOT NULL,
  short_id varchar(8) NOT NULL,
  title varchar(200) NOT NULL,
  description longtext NOT NULL,
  price decimal(12,2) NOT NULL,
  currency varchar(3) NOT NULL,
  negotiable tinyint(1) NOT NULL,
  location varchar(200) NOT NULL,
  latitude decimal(9,6) DEFAULT NULL,
  longitude decimal(9,6) DEFAULT NULL,
  images longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(images)),
  status varchar(20) NOT NULL,
  is_featured tinyint(1) NOT NULL,
  views_count int(10) UNSIGNED NOT NULL CHECK (views_count >= 0),
  likes_count int(10) UNSIGNED NOT NULL CHECK (likes_count >= 0),
  contacts_count int(10) UNSIGNED NOT NULL CHECK (contacts_count >= 0),
  tags longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(tags)),
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  expires_at datetime(6) DEFAULT NULL,
  category varchar(50) NOT NULL,
  `condition` varchar(20) NOT NULL,
  brand varchar(100) NOT NULL,
  model varchar(100) NOT NULL,
  delivery_available tinyint(1) NOT NULL,
  delivery_cost decimal(10,2) DEFAULT NULL,
  pickup_available tinyint(1) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla classifieds_products
--

INSERT INTO classifieds_products (id, short_id, title, description, price, currency, negotiable, location, latitude, longitude, images, status, is_featured, views_count, likes_count, contacts_count, tags, created_at, updated_at, expires_at, category, `condition`, brand, model, delivery_available, delivery_cost, pickup_available, user_id) VALUES
('016ae87405e74d1ebd585c9e2c777547', 'PI4Z2K70', 'iPhone 13 Pro Max - Prueba', 'Teléfono en excelente estado, poco uso.', 2500000.00, 'COP', 1, 'Bogotá, Colombia', NULL, NULL, '[\"https://example.com/image1.jpg\"]', 'active', 0, 0, 0, 0, '[\"iphone\", \"apple\", \"smartphone\"]', '2025-12-03 18:56:20.242654', '2025-12-03 18:56:20.242740', NULL, 'electronics', 'like_new', '', '', 0, NULL, 1, 'e3702132b6cb45d2a390e6b1b5f254ab');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla classifieds_reports
--

CREATE TABLE classifieds_reports (
  id char(32) NOT NULL,
  classified_type varchar(20) NOT NULL,
  classified_id char(32) NOT NULL,
  reason varchar(30) NOT NULL,
  description longtext NOT NULL,
  status varchar(15) NOT NULL,
  reviewed_at datetime(6) DEFAULT NULL,
  created_at datetime(6) NOT NULL,
  reporter_id char(32) NOT NULL,
  reviewed_by_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla classifieds_reviews
--

CREATE TABLE classifieds_reviews (
  id char(32) NOT NULL,
  classified_type varchar(20) NOT NULL,
  classified_id char(32) NOT NULL,
  rating int(10) UNSIGNED NOT NULL CHECK (rating >= 0),
  comment longtext NOT NULL,
  created_at datetime(6) NOT NULL,
  provider_id char(32) NOT NULL,
  reviewer_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla classifieds_services
--

CREATE TABLE classifieds_services (
  id char(32) NOT NULL,
  short_id varchar(8) NOT NULL,
  title varchar(200) NOT NULL,
  description longtext NOT NULL,
  price decimal(12,2) NOT NULL,
  currency varchar(3) NOT NULL,
  negotiable tinyint(1) NOT NULL,
  location varchar(200) NOT NULL,
  latitude decimal(9,6) DEFAULT NULL,
  longitude decimal(9,6) DEFAULT NULL,
  images longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(images)),
  status varchar(20) NOT NULL,
  is_featured tinyint(1) NOT NULL,
  views_count int(10) UNSIGNED NOT NULL CHECK (views_count >= 0),
  likes_count int(10) UNSIGNED NOT NULL CHECK (likes_count >= 0),
  contacts_count int(10) UNSIGNED NOT NULL CHECK (contacts_count >= 0),
  tags longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(tags)),
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  expires_at datetime(6) DEFAULT NULL,
  category varchar(50) NOT NULL,
  availability varchar(200) NOT NULL,
  typical_duration varchar(20) NOT NULL,
  coverage_area varchar(200) NOT NULL,
  coverage_radius_km int(10) UNSIGNED DEFAULT NULL CHECK (coverage_radius_km >= 0),
  price_type varchar(20) NOT NULL,
  rating decimal(3,2) NOT NULL,
  reviews_count int(10) UNSIGNED NOT NULL CHECK (reviews_count >= 0),
  instant_booking tinyint(1) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla classifieds_services
--

INSERT INTO classifieds_services (id, short_id, title, description, price, currency, negotiable, location, latitude, longitude, images, status, is_featured, views_count, likes_count, contacts_count, tags, created_at, updated_at, expires_at, category, availability, typical_duration, coverage_area, coverage_radius_km, price_type, rating, reviews_count, instant_booking, user_id) VALUES
('8908b71abf3d4c07a2e0816bf90c0af4', 'AP8UFD4I', 'Servicio de Limpieza Profesional', 'Limpieza profunda de hogares y oficinas.', 80000.00, 'COP', 0, 'Medellín, Colombia', NULL, NULL, '[]', 'active', 0, 0, 0, 0, '[]', '2025-12-03 18:56:20.274051', '2025-12-03 18:56:20.274098', NULL, 'cleaning', 'Lun-Vie 8AM-6PM', '2-3hours', '', NULL, 'service', 0.00, 0, 0, 'e3702132b6cb45d2a390e6b1b5f254ab');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla classifieds_views
--

CREATE TABLE classifieds_views (
  id char(32) NOT NULL,
  classified_type varchar(20) NOT NULL,
  classified_id char(32) NOT NULL,
  ip_address char(39) NOT NULL,
  user_agent longtext NOT NULL,
  created_at datetime(6) NOT NULL,
  user_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla comments
--

CREATE TABLE comments (
  id char(32) NOT NULL,
  content longtext NOT NULL,
  image varchar(100) DEFAULT NULL,
  likes_count int(10) UNSIGNED NOT NULL CHECK (likes_count >= 0),
  replies_count int(10) UNSIGNED NOT NULL CHECK (replies_count >= 0),
  is_edited tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  parent_id char(32) DEFAULT NULL,
  user_id char(32) NOT NULL,
  post_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla comments
--

INSERT INTO comments (id, content, image, likes_count, replies_count, is_edited, created_at, updated_at, parent_id, user_id, post_id) VALUES
('012ebba3380047fca6b3ede804b5e087', 'jajaj', '', 0, 0, 0, '2025-12-22 12:31:40.840069', '2025-12-22 12:31:40.840069', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304', '13347ecb35b54ed89065643f926bea01'),
('089f19e3d6084347a9cdc0966d6c7eea', 'que caja', '', 0, 0, 0, '2025-12-22 12:31:44.964216', '2025-12-22 12:31:44.964216', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304', '13347ecb35b54ed89065643f926bea01'),
('17484e941672448f8dbc128d994e5807', 'gfgffg', '', 0, 0, 0, '2026-01-15 18:07:15.210485', '2026-01-15 18:07:15.210485', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304', 'd72fbee5c076487c94d0f4170f15723b'),
('1f0659ec6f7941dc9a47962f2fccbc7f', '@jazmin', '', 0, 0, 0, '2025-12-22 12:54:16.527485', '2025-12-22 12:54:16.530124', '833044e5ee074c1dbe06255a5f486e95', 'bd22ec1c4dbe48f3a018e96b2cd61304', '13347ecb35b54ed89065643f926bea01'),
('24d1c3c1afac49389ff3b0e93f65c2d6', 'njfyjy', '', 0, 0, 0, '2025-12-03 19:51:33.197586', '2025-12-03 19:51:33.200444', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304', '1c7a29d6688540e797c1bd3ad528ed23'),
('296805ffc743430e9a90753861a076a9', '@jazmin ggg', '', 0, 0, 0, '2025-12-22 13:08:46.583972', '2025-12-22 13:08:46.583972', '833044e5ee074c1dbe06255a5f486e95', 'bd22ec1c4dbe48f3a018e96b2cd61304', '13347ecb35b54ed89065643f926bea01'),
('2b234ad8d5fb4fee82664be86447a529', 'khjnmlk,', '', 0, 0, 0, '2025-12-02 23:38:15.454782', '2025-12-02 23:38:15.454969', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', '2dd1763d352947b69b5b230d03f87de3'),
('5ebccfbdc7514f6c8ed70c3617fccf4a', 'ñojlkn', '', 0, 0, 0, '2025-12-02 05:03:59.064139', '2025-12-02 05:03:59.064169', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', '746fb170e55749aaab839e0e9efada4b'),
('833044e5ee074c1dbe06255a5f486e95', 'fea', '', 2, 0, 0, '2025-12-13 06:54:45.109191', '2025-12-13 06:54:45.109581', NULL, '6f053d432986406289a54b930e90924f', '13347ecb35b54ed89065643f926bea01'),
('afcbc2d0cb564ad097f6b1418e7ab05c', 'jhgbjhb', '', 0, 0, 0, '2025-12-02 05:02:31.610420', '2025-12-02 05:02:31.610451', NULL, '294820a41aad4ff0abb05e9f5886555c', 'ba60f72242ca4bb6b80fb0e8b8caec75'),
('b36c836a82c54cba9e8db3a633a279fe', 'panchito!!!', '', 1, 0, 0, '2025-12-13 06:55:27.336458', '2025-12-13 06:55:27.336458', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', '13347ecb35b54ed89065643f926bea01'),
('ca90239e4fcb4b119fb8e674c32df7fc', 'Genial!', '', 0, 0, 0, '2025-12-10 14:44:41.348081', '2025-12-10 14:44:41.349083', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304', '934d82e29f5b4e06beb30be7aa9dc189'),
('cb365d50d3834663b4d83b781a4ea24e', 'vfvrr', '', 0, 0, 0, '2025-12-03 16:53:49.474896', '2025-12-03 16:53:49.480434', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304', 'd2de4041fef74ab49eb9669d09465706'),
('e4e603178b0d452090a129f7d7c8ccc6', 'Hola!', '', 0, 0, 0, '2025-12-13 06:16:49.600239', '2025-12-13 06:16:49.600239', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', '1c7a29d6688540e797c1bd3ad528ed23'),
('f902069847df44d0bf4e0b16dfd2c702', '@pedro_sanchez hgb', '', 0, 0, 0, '2025-12-22 13:03:28.835438', '2025-12-22 13:03:28.835438', 'b36c836a82c54cba9e8db3a633a279fe', 'bd22ec1c4dbe48f3a018e96b2cd61304', '13347ecb35b54ed89065643f926bea01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla comment_likes
--

CREATE TABLE comment_likes (
  id char(32) NOT NULL,
  created_at datetime(6) NOT NULL,
  comment_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla comment_likes
--

INSERT INTO comment_likes (id, created_at, comment_id, user_id) VALUES
('91c44a78f528491a8cd15682a16f72b9', '2025-12-22 12:51:32.898128', '833044e5ee074c1dbe06255a5f486e95', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('a600faf63ff24632954548c10375b00a', '2025-12-13 06:54:48.521363', '833044e5ee074c1dbe06255a5f486e95', '6f053d432986406289a54b930e90924f'),
('b97ae971da844f2ba148f488a853ec8d', '2025-12-13 16:06:48.109278', 'b36c836a82c54cba9e8db3a633a279fe', 'bd22ec1c4dbe48f3a018e96b2cd61304');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla communities_community
--

CREATE TABLE communities_community (
  id char(32) NOT NULL,
  name varchar(100) NOT NULL,
  slug varchar(120) NOT NULL,
  description longtext NOT NULL,
  category varchar(20) NOT NULL,
  type varchar(10) NOT NULL,
  profile_image varchar(100) DEFAULT NULL,
  cover_image varchar(100) DEFAULT NULL,
  is_active tinyint(1) NOT NULL,
  is_verified tinyint(1) NOT NULL,
  allow_posts tinyint(1) NOT NULL,
  require_approval tinyint(1) NOT NULL,
  location varchar(100) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  owner_id char(32) NOT NULL,
  parent_id char(32) DEFAULT NULL,
  category_obj_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla communities_community
--

INSERT INTO communities_community (id, name, slug, description, category, type, profile_image, cover_image, is_active, is_verified, allow_posts, require_approval, location, created_at, updated_at, owner_id, parent_id, category_obj_id) VALUES
('075f0d0cbbb54908a2d50a45cdbf9af3', 'Emprendimiento', 'negocios-emprendimiento', '🚀 Startups y nuevos negocios', 'negocios', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.440588', '2025-12-03 12:40:24.440588', '4912c5171c6d48d4bdbcfbd889a9143c', '39e85115085947c9b8718f98eb8f6a52', '18834c462739401688612ff3e8432aeb'),
('08cd0ae9e3fb4215b505d76fb2d2a446', 'Esports', 'gaming-esports', '🏆 Competencias profesionales', 'gaming', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.209534', '2025-12-03 12:40:24.209534', '4912c5171c6d48d4bdbcfbd889a9143c', '7bde30ec5669489fa963db43e6dbe700', '4c765e72242641afb04d7a8f20e83b1d'),
('0928892328504547965bf62f362d6ca6', 'Fortnite', 'gaming-fortnite', '🏝️ Battle Royale', 'gaming', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.160027', '2025-12-03 12:40:24.160027', '4912c5171c6d48d4bdbcfbd889a9143c', '7bde30ec5669489fa963db43e6dbe700', '4c765e72242641afb04d7a8f20e83b1d'),
('0de95d4d49a1438b9cb32101cc62e8c6', 'Voluntariado Habilidosos', 'voluntariado-habilidosos', '🤝 Acciones sociales, voluntariado y proyectos de impacto comunitario.', 'lifestyle', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.427242', '2025-12-05 17:54:11.427281', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('10b2389360f6496882e35205bcf4bed9', 'Valorant', 'gaming-valorant', '🎯 Shooter táctico', 'gaming', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.182954', '2025-12-03 12:40:24.182954', '4912c5171c6d48d4bdbcfbd889a9143c', '7bde30ec5669489fa963db43e6dbe700', '4c765e72242641afb04d7a8f20e83b1d'),
('13ad2e4436054eaa8a284d8bcabd453e', 'Data Science', 'tecnologia-data-science', '📊 Análisis de datos', 'tecnologia', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.114352', '2025-12-03 12:40:24.114352', '4912c5171c6d48d4bdbcfbd889a9143c', 'b79927d837c443b6bdc1b14107cadac3', '935251373b72419fadf65338e848ee44'),
('13dadd1e73e3459198ca68498540b57a', 'Hip Hop', 'musica-hip-hop', '🎧 Rap y cultura hip hop', 'musica', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.005337', '2025-12-03 12:40:24.005337', '4912c5171c6d48d4bdbcfbd889a9143c', 'de39bd77a9f94a32ba5668e3693ab686', '594e9e5d07e348ea9d631ced4d9c7d28'),
('18e8ca610a0d4d8cbc12a2fbbcf77529', 'Teatro Habilidosos', 'teatro-habilidosos', '🎭 Comunidad de artes escénicas. Actuación, improvisación y expresión dramática.', 'arte', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.333242', '2025-12-05 17:54:11.333265', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('19f95e504dda4248a7d6fad63e6036d8', 'Video y Cine', 'arte-video-y-cine', '🎬 Producción audiovisual', 'arte', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.344051', '2025-12-03 12:40:24.344051', '4912c5171c6d48d4bdbcfbd889a9143c', '84af1903c589467aa3a6b0ba0d6bc7ce', '8d50a093f4c94f0b998416cc666ceb2b'),
('1c075fcf090544eeacbf40334f360828', 'Ingeniería UNAL', 'ingenieria-unal', 'Facultad de Ingeniería - Todas las carreras de ingeniería', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Bogotá, Colombia', '2025-12-05 17:46:54.050961', '2025-12-05 17:46:54.051002', 'e3702132b6cb45d2a390e6b1b5f254ab', '99f3924f93e2422daf23562a67316cf5', '02151a6581a54e809d99ffafb990d11a'),
('1e54655aae544b86ab253a8fe701cb9a', 'Medicina UNAL', 'medicina-unal', 'Facultad de Medicina - Estudiantes y profesionales de la salud', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Bogotá, Colombia', '2025-12-05 17:46:54.077121', '2025-12-05 17:46:54.077145', 'e3702132b6cb45d2a390e6b1b5f254ab', '99f3924f93e2422daf23562a67316cf5', '02151a6581a54e809d99ffafb990d11a'),
('1e6f1a3deb8c4ab0854a8751483d7fa9', 'Comunidad Lifestyle', 'comunidad-lifestyle', 'Estilo de vida y bienestar', 'lifestyle', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.380572', '2025-12-03 12:40:24.380572', '4912c5171c6d48d4bdbcfbd889a9143c', NULL, '7be4307c899847309a8fd87ad7f5667c'),
('1f870eec59f4428580b117fe90447d83', 'Pop', 'musica-pop', '⭐ Música pop internacional', 'musica', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.029575', '2025-12-03 12:40:24.029575', '4912c5171c6d48d4bdbcfbd889a9143c', 'de39bd77a9f94a32ba5668e3693ab686', '594e9e5d07e348ea9d631ced4d9c7d28'),
('2066f778fdf647d78b7860cf17d62d70', 'Voleibol Habilidosos', 'voleibol-habilidosos', '🏐 Comunidad de voleibol. Técnicas, competencias y pasión por este deporte.', 'deportes', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.241832', '2025-12-05 17:54:11.241847', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('20671d3411e74a6d9efc6c434b60188e', 'Música Urbana', 'musica-urbana', 'Reggaeton, trap, hip-hop y más. Comparte tus artistas favoritos y descubre nueva música. 🎵', 'musica', 'public', '', '', 1, 1, 1, 0, 'Colombia', '2025-12-02 05:00:59.929289', '2025-12-02 05:00:59.929347', 'd355c06d9f2b4fefbd6e3a4dab17b284', NULL, NULL),
('23a59b877b084093ad1e250f72a660b3', 'Ciberseguridad', 'tecnologia-ciberseguridad', '🔒 Seguridad informática', 'tecnologia', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.078678', '2025-12-03 12:40:24.078678', '4912c5171c6d48d4bdbcfbd889a9143c', 'b79927d837c443b6bdc1b14107cadac3', '935251373b72419fadf65338e848ee44'),
('2b701ff7408b46fab41483288d2acd54', 'Cursos Online', 'educacion-cursos-online', '💻 Plataformas de aprendizaje', 'educacion', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.238552', '2025-12-03 12:40:24.238552', '4912c5171c6d48d4bdbcfbd889a9143c', '8ab1be799c2840cc8a9c83346b25b70b', 'bef9c1f68ae14abc9b59f6bf9eed113b'),
('2c25d8910b384254bad15031235f5f75', 'Atletismo', 'deportes-atletismo', '🏃 Carreras y competencias', 'deportes', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:23.943980', '2025-12-03 12:40:23.943980', '4912c5171c6d48d4bdbcfbd889a9143c', '5c0975ff3fab46aa8fbbff53325e47b7', '3eda6643ff604ce38c9d7a53d0d597c5'),
('32db97ad83a24a208df009bfd09d4149', 'Deportes San Bartolomé', 'deportes-san-bartolome', 'Equipos deportivos y actividades físicas del colegio', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Bogotá, Colombia', '2025-12-05 17:46:54.197612', '2025-12-05 17:46:54.197654', 'e3702132b6cb45d2a390e6b1b5f254ab', '3978ac36ae1244ddbce71032bbfa48cf', '3351c502ea1140c6bce5775a70696ba5'),
('33618838b45344c0aca3a530167a3959', 'Call of Duty', 'gaming-call-of-duty', '🔫 FPS competitivo', 'gaming', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.148269', '2025-12-03 12:40:24.148269', '4912c5171c6d48d4bdbcfbd889a9143c', '7bde30ec5669489fa963db43e6dbe700', '4c765e72242641afb04d7a8f20e83b1d'),
('341f5d86b2324830a7a9239cdd97c2d8', 'Familia Habilidosos', 'familia-habilidosos', '👨‍👩‍👧‍👦 Espacio para padres, familiares y apoyo en el proceso de los participantes.', 'lifestyle', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.457085', '2025-12-05 17:54:11.457099', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('36f8e54b3fbf44f7a372b58af65071ba', 'Fútbol Colombia', 'futbol-colombia', 'La comunidad más grande de fútbol colombiano. Comparte noticias, análisis y pasión por el deporte rey. 🇨🇴⚽', 'deportes', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-02 05:00:59.896435', '2025-12-02 05:00:59.896463', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL, NULL),
('37e18b50edb54de5ad309248c88c209a', 'Natación Habilidosos', 'natacion-habilidosos', '🏊 Comunidad de natación y deportes acuáticos.', 'deportes', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.270322', '2025-12-05 17:54:11.270336', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('3978ac36ae1244ddbce71032bbfa48cf', 'Colegio San Bartolomé La Merced', 'colegio-san-bartolome-la-merced', 'Comunidad del Colegio San Bartolomé La Merced. Estudiantes, padres y egresados.', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Bogotá, Colombia', '2025-12-05 17:46:54.142485', '2025-12-05 17:46:54.142500', 'e3702132b6cb45d2a390e6b1b5f254ab', NULL, '3351c502ea1140c6bce5775a70696ba5'),
('39e85115085947c9b8718f98eb8f6a52', 'Comunidad Negocios', 'comunidad-negocios', 'Emprendimiento y finanzas', 'negocios', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.431615', '2025-12-03 12:40:24.431615', '4912c5171c6d48d4bdbcfbd889a9143c', NULL, '18834c462739401688612ff3e8432aeb'),
('3cf623e42d494ea0825471469416da94', 'Fotografía Deportiva', 'fotografia-deportiva', 'Para los amantes de capturar momentos deportivos. Tips, equipos y las mejores fotos. 📸', 'arte', 'public', '', '', 1, 1, 1, 0, 'Internacional', '2025-12-02 05:00:59.941004', '2025-12-02 05:00:59.941073', '84c5e41a9e4348548886b797643f91f8', NULL, NULL),
('41be392baf494cc6ac0aa200e4371e3c', 'Marketing Digital', 'negocios-marketing-digital', '📈 Estrategias online', 'negocios', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.449735', '2025-12-03 12:40:24.449735', '4912c5171c6d48d4bdbcfbd889a9143c', '39e85115085947c9b8718f98eb8f6a52', '18834c462739401688612ff3e8432aeb'),
('43748d9bcaa9410b975db5cb906cf5be', 'Dancehall', 'musica-dancehall', '💃 Ritmos jamaiquinos', 'musica', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:23.995480', '2025-12-03 12:40:23.995480', '4912c5171c6d48d4bdbcfbd889a9143c', 'de39bd77a9f94a32ba5668e3693ab686', '594e9e5d07e348ea9d631ced4d9c7d28'),
('47d9e07bb8b644b48ea93436e991c643', 'Historia', 'educacion-historia', '📜 Conoce el pasado', 'educacion', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.274070', '2025-12-03 12:40:24.274070', '4912c5171c6d48d4bdbcfbd889a9143c', '8ab1be799c2840cc8a9c83346b25b70b', 'bef9c1f68ae14abc9b59f6bf9eed113b'),
('4901572c9760456b9cc6f4b5098e0704', 'Viajes', 'lifestyle-viajes', '✈️ Explora el mundo', 'lifestyle', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.408747', '2025-12-03 12:40:24.408747', '4912c5171c6d48d4bdbcfbd889a9143c', '1e6f1a3deb8c4ab0854a8751483d7fa9', '7be4307c899847309a8fd87ad7f5667c'),
('4a91dd9df362431a8211968e5476f8e4', 'League of Legends', 'gaming-league-of-legends', '⚔️ MOBA competitivo', 'gaming', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.171847', '2025-12-03 12:40:24.171847', '4912c5171c6d48d4bdbcfbd889a9143c', '7bde30ec5669489fa963db43e6dbe700', '4c765e72242641afb04d7a8f20e83b1d'),
('4b94242dbea54f289544f0b9eb1d6df8', 'Desarrollo Móvil', 'tecnologia-desarrollo-movil', '📱 iOS, Android y multiplataforma', 'tecnologia', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.067843', '2025-12-03 12:40:24.067843', '4912c5171c6d48d4bdbcfbd889a9143c', 'b79927d837c443b6bdc1b14107cadac3', '935251373b72419fadf65338e848ee44'),
('4d06f96266114a6989cdd7364174a2c7', 'Habilidosos Reality', 'habilidosos-reality', '🌟 Bienvenido a la comunidad oficial del Reality SOS-HABILIDOSO. Aquí encontrarás todo sobre el programa: participantes, competencias, eventos en vivo, y mucho más. ¡Un golazo a tus sueños!', 'deportes', 'public', '', '', 1, 1, 1, 0, 'Colombia', '2025-12-05 17:54:11.183004', '2025-12-05 17:54:11.183021', 'e3702132b6cb45d2a390e6b1b5f254ab', NULL, 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('4d37dbfd3bd741798c3c3708e6172019', 'Universidad de Antioquia', 'universidad-de-antioquia', 'Comunidad de la UdeA. Comparte información académica, eventos culturales y deportivos.', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Medellín, Colombia', '2025-12-05 17:46:54.011314', '2025-12-05 17:46:54.011348', 'e3702132b6cb45d2a390e6b1b5f254ab', NULL, '02151a6581a54e809d99ffafb990d11a'),
('516e8c2ec4254131b2f0969b258d9d0e', 'Politécnico Colombiano Jaime Isaza Cadavid', 'politecnico-colombiano-jaime-isaza-cadavid', 'Comunidad oficial del Politécnico Colombiano Jaime Isaza Cadavid. Espacio para estudiantes, egresados y docentes. Comparte experiencias académicas, eventos deportivos, culturales y oportunidades laborales. Web: https://www.politecnicojic.edu.co/', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Medellín, Colombia', '2025-12-09 15:41:03.874151', '2025-12-09 15:41:03.874193', 'e3702132b6cb45d2a390e6b1b5f254ab', NULL, '02151a6581a54e809d99ffafb990d11a'),
('519829d56c4541af8368604b10186471', 'Matemáticas', 'educacion-matematicas', '🔢 Números y lógica', 'educacion', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.257209', '2025-12-03 12:40:24.257209', '4912c5171c6d48d4bdbcfbd889a9143c', '8ab1be799c2840cc8a9c83346b25b70b', 'bef9c1f68ae14abc9b59f6bf9eed113b'),
('5232d2d39edd4f4aa6a63d704176550f', 'test', 'test', 'fffffrgs', 'tecnologia', 'public', 'communities/profiles/a89a2a104267b3d391cff56ea66debf9.jpg', 'communities/covers/488c61ff134bb1ee885a536c177b5735.jpg', 1, 0, 1, 0, '', '2025-12-09 17:51:53.823546', '2025-12-15 13:38:19.182859', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL, '935251373b72419fadf65338e848ee44'),
('54e10d76abdd41458e5ce4307cf0aa90', 'Deportes UNAL', 'deportes-unal', 'Grupos deportivos y actividades físicas de la universidad', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Bogotá, Colombia', '2025-12-05 17:46:54.125365', '2025-12-05 17:46:54.125400', 'e3702132b6cb45d2a390e6b1b5f254ab', '99f3924f93e2422daf23562a67316cf5', '02151a6581a54e809d99ffafb990d11a'),
('57db5bcfbbb64cc1becee7152bf4a019', 'Arte Visual Habilidosos', 'arte-visual-habilidosos', '🎨 Comunidad de artes visuales. Pintura, dibujo, escultura y diseño.', 'arte', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.347390', '2025-12-05 17:54:11.347416', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('59ff88c7442049a784d41e9b8fb2f1dc', 'Inclusión y Diversidad Habilidosos', 'inclusion-y-diversidad-habilidosos', '🌈 Comunidad inclusiva que celebra la diversidad y promueve el respeto.', 'lifestyle', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.473842', '2025-12-05 17:54:11.473857', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('5c0975ff3fab46aa8fbbff53325e47b7', 'Comunidad Deportes', 'comunidad-deportes', 'Comunidades dedicadas a todos los deportes', 'deportes', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:23.902405', '2025-12-03 12:40:23.902405', '4912c5171c6d48d4bdbcfbd889a9143c', NULL, '3eda6643ff604ce38c9d7a53d0d597c5'),
('60a62429423946d18678fdd670824059', 'Ciencias', 'educacion-ciencias', '🔬 Física, química y biología', 'educacion', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.265916', '2025-12-03 12:40:24.266616', '4912c5171c6d48d4bdbcfbd889a9143c', '8ab1be799c2840cc8a9c83346b25b70b', 'bef9c1f68ae14abc9b59f6bf9eed113b'),
('6ab31bbfc27a4333a370b2c0aad4cd09', 'Molo Corp', 'molo-corp', 'Desarollo Web Full stack', 'tecnologia', 'public', 'communities/profiles/avatar.png', 'communities/covers/aeed6687b1844fcda306151b4e305bc2.jpg', 1, 0, 1, 0, '', '2025-12-03 18:01:01.330508', '2025-12-03 18:01:01.331785', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL, '935251373b72419fadf65338e848ee44'),
('6c6ddd74c35244b684d31339a7ca0bf9', 'Finanzas Personales', 'educacion-finanzas-personales', '💰 Educación financiera', 'educacion', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.278521', '2025-12-03 12:40:24.278521', '4912c5171c6d48d4bdbcfbd889a9143c', '8ab1be799c2840cc8a9c83346b25b70b', 'bef9c1f68ae14abc9b59f6bf9eed113b'),
('6ca37437d744445a946d5b7a4e06e71e', 'Ingenieria de Software', 'ingenieria-ed-software', 'Programing lover', 'tecnologia', 'public', 'communities/profiles/6831e804d94dfc6dbe4bd10f4bff0991.jpg', 'communities/covers/4707d30c59593d31c049c277cf837137.jpg', 1, 0, 1, 0, '', '2025-12-13 06:21:03.465611', '2025-12-14 21:45:36.433406', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL, '935251373b72419fadf65338e848ee44'),
('70233f0bb8ce47068894064fcc10bcf8', 'DevOps', 'tecnologia-devops', '☁️ CI/CD y cloud computing', 'tecnologia', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.087340', '2025-12-03 12:40:24.087340', '4912c5171c6d48d4bdbcfbd889a9143c', 'b79927d837c443b6bdc1b14107cadac3', '935251373b72419fadf65338e848ee44'),
('72c008eb9ee24e9196f7a5028086d1ea', 'Inteligencia Artificial', 'tecnologia-inteligencia-artificial', '🤖 ML, Deep Learning y AI', 'tecnologia', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.073044', '2025-12-03 12:40:24.073044', '4912c5171c6d48d4bdbcfbd889a9143c', 'b79927d837c443b6bdc1b14107cadac3', '935251373b72419fadf65338e848ee44'),
('74db68326c424e3baeb2d87c8de4b399', 'E-commerce', 'negocios-e-commerce', '🛒 Ventas online', 'negocios', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.459488', '2025-12-03 12:40:24.459488', '4912c5171c6d48d4bdbcfbd889a9143c', '39e85115085947c9b8718f98eb8f6a52', '18834c462739401688612ff3e8432aeb'),
('791ca4d6c281438887721de3bed80553', 'Natación', 'deportes-natacion', '🏊 Deportes acuáticos', 'deportes', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:23.939368', '2025-12-03 12:40:23.939368', '4912c5171c6d48d4bdbcfbd889a9143c', '5c0975ff3fab46aa8fbbff53325e47b7', '3eda6643ff604ce38c9d7a53d0d597c5'),
('796771c3aa5443c2b0f82c51c020147e', 'Fotografía', 'arte-fotografia', '📷 Captura momentos', 'arte', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.326272', '2025-12-03 12:40:24.326272', '4912c5171c6d48d4bdbcfbd889a9143c', '84af1903c589467aa3a6b0ba0d6bc7ce', '8d50a093f4c94f0b998416cc666ceb2b'),
('79a8943fec514c8a9974399e97a43393', 'Fútbol Habilidosos', 'futbol-habilidosos', '⚽ Comunidad de fútbol del Reality. Técnicas, partidos, entrenamientos y todo sobre el deporte rey.', 'deportes', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.209087', '2025-12-05 17:54:11.209112', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('7bde30ec5669489fa963db43e6dbe700', 'Comunidad Gaming', 'comunidad-gaming', 'Videojuegos y esports', 'gaming', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.129461', '2025-12-03 12:40:24.129461', '4912c5171c6d48d4bdbcfbd889a9143c', NULL, '4c765e72242641afb04d7a8f20e83b1d'),
('7c8b27f295e341958a3b6ed836585b95', 'Salsa', 'musica-salsa', '💃 Ritmos latinos', 'musica', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.041317', '2025-12-03 12:40:24.041317', '4912c5171c6d48d4bdbcfbd889a9143c', 'de39bd77a9f94a32ba5668e3693ab686', '594e9e5d07e348ea9d631ced4d9c7d28'),
('7d29889893d04ea8961d7d78f88dbdf4', 'Gaming Dev', 'tecnologia-gaming-dev', '🎮 Desarrollo de videojuegos', 'tecnologia', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.108476', '2025-12-03 12:40:24.108476', '4912c5171c6d48d4bdbcfbd889a9143c', 'b79927d837c443b6bdc1b14107cadac3', '935251373b72419fadf65338e848ee44'),
('7f620e6ba8514fb7a33f29cdfaffb25d', 'Universidad de los Andes', 'universidad-de-los-andes', 'Espacio para la comunidad Uniandina. Conecta con estudiantes, profesores y egresados de todas las facultades.', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Bogotá, Colombia', '2025-12-05 17:46:53.986065', '2025-12-05 17:46:53.986148', 'e3702132b6cb45d2a390e6b1b5f254ab', NULL, '02151a6581a54e809d99ffafb990d11a'),
('82d9a68027fd447390861a6cb45ad72f', 'GTA', 'gaming-gta', '🚗 Grand Theft Auto', 'gaming', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.201581', '2025-12-03 12:40:24.201581', '4912c5171c6d48d4bdbcfbd889a9143c', '7bde30ec5669489fa963db43e6dbe700', '4c765e72242641afb04d7a8f20e83b1d'),
('84af1903c589467aa3a6b0ba0d6bc7ce', 'Comunidad Arte y Creatividad', 'comunidad-arte', 'Expresión artística y diseño', 'arte', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.307834', '2025-12-03 12:40:24.307834', '4912c5171c6d48d4bdbcfbd889a9143c', NULL, '8d50a093f4c94f0b998416cc666ceb2b'),
('85e466f7a2a7430390fb708a63099179', 'Música Habilidosos', 'musica-habilidosos', '🎵 Comunidad musical. Canto, instrumentos, composición y todo el talento musical.', 'arte', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.298609', '2025-12-05 17:54:11.298621', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('868afd1103db4621ba5e33afc62606f8', 'Atletismo Habilidosos', 'atletismo-habilidosos', '🏃 Comunidad de atletismo. Carreras, saltos, lanzamientos y más.', 'deportes', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.254090', '2025-12-05 17:54:11.254102', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('86d7fe2e39d14f6191bca58ff5994e27', 'Ilustración', 'arte-ilustracion', '✏️ Arte digital y tradicional', 'arte', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.338072', '2025-12-03 12:40:24.338072', '4912c5171c6d48d4bdbcfbd889a9143c', '84af1903c589467aa3a6b0ba0d6bc7ce', '8d50a093f4c94f0b998416cc666ceb2b'),
('87d033fab5344128af229112082dcd4d', 'Literatura Habilidosos', 'literatura-habilidosos', '📚 Comunidad literaria. Escritura, poesía, cuentos y expresión escrita.', 'arte', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.362941', '2025-12-05 17:54:11.363010', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('883eda99bf40489491b69df36ee2d389', 'Rock', 'musica-rock', '🎸 Rock clásico y alternativo', 'musica', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.012439', '2025-12-03 12:40:24.012439', '4912c5171c6d48d4bdbcfbd889a9143c', 'de39bd77a9f94a32ba5668e3693ab686', '594e9e5d07e348ea9d631ced4d9c7d28'),
('8ab1be799c2840cc8a9c83346b25b70b', 'Comunidad Educación', 'comunidad-educacion', 'Aprendizaje y cursos', 'educacion', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.228642', '2025-12-03 12:40:24.228642', '4912c5171c6d48d4bdbcfbd889a9143c', NULL, 'bef9c1f68ae14abc9b59f6bf9eed113b'),
('903e46ddea20403085e00b4635a2cbef', 'Deportes Extremos Habilidosos', 'deportes-extremos-habilidosos', '🛹 Skateboarding, BMX, parkour y deportes de adrenalina.', 'deportes', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.284567', '2025-12-05 17:54:11.284583', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('90884b6e5b3b49ee9d33ff417d6bc51c', 'Boxeo', 'deportes-boxeo', '🥊 El arte del pugilismo', 'deportes', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:23.948996', '2025-12-03 12:40:23.948996', '4912c5171c6d48d4bdbcfbd889a9143c', '5c0975ff3fab46aa8fbbff53325e47b7', '3eda6643ff604ce38c9d7a53d0d597c5'),
('910c26e3d913404686dde08150e8f44f', 'Preparación Exámenes', 'educacion-preparacion-examenes', '📝 SAT, TOEFL, etc.', 'educacion', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.288429', '2025-12-03 12:40:24.288429', '4912c5171c6d48d4bdbcfbd889a9143c', '8ab1be799c2840cc8a9c83346b25b70b', 'bef9c1f68ae14abc9b59f6bf9eed113b'),
('95483bb147154d7397cbcbac9562667b', 'Basketball', 'deportes-basketball', '🏀 NBA, FIBA y más', 'deportes', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:23.920247', '2025-12-03 12:40:23.920247', '4912c5171c6d48d4bdbcfbd889a9143c', '5c0975ff3fab46aa8fbbff53325e47b7', '3eda6643ff604ce38c9d7a53d0d597c5'),
('95efec44b49e4733a4968f1d8a3a7872', 'Gamers top', 'gamers', 'Test Comunity', 'gaming', 'public', 'communities/profiles/4e9d31195bccfad4ef0d44e232488f71.jpg', 'communities/covers/a7c905bf81dcd9609eaf7c5a095ab5af.jpg', 1, 0, 1, 0, '', '2025-12-13 06:39:21.038497', '2025-12-13 06:49:08.650748', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL, '4c765e72242641afb04d7a8f20e83b1d'),
('96116ef363df4b68a2cf7eb29e533ea0', 'Música Producción', 'arte-musica-produccion', '🎛️ Beats y producción', 'arte', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.360085', '2025-12-03 12:40:24.360085', '4912c5171c6d48d4bdbcfbd889a9143c', '84af1903c589467aa3a6b0ba0d6bc7ce', '8d50a093f4c94f0b998416cc666ceb2b'),
('974ea6b1a1034759853edf1e62d7e311', 'Colegio San José de La Salle', 'colegio-san-jose-de-la-salle', 'Comunidad Lasallista. Conecta con estudiantes actuales y egresados.', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Medellín, Colombia', '2025-12-05 17:46:54.176899', '2025-12-05 17:46:54.176914', 'e3702132b6cb45d2a390e6b1b5f254ab', NULL, '3351c502ea1140c6bce5775a70696ba5'),
('99f3924f93e2422daf23562a67316cf5', 'Universidad Nacional de Colombia', 'universidad-nacional-de-colombia', 'Comunidad oficial de estudiantes, egresados y profesores de la Universidad Nacional de Colombia. Comparte experiencias, eventos y oportunidades.', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Bogotá, Colombia', '2025-12-05 17:46:53.949158', '2025-12-05 17:46:53.949185', 'e3702132b6cb45d2a390e6b1b5f254ab', NULL, '02151a6581a54e809d99ffafb990d11a'),
('9d96c71c1296426a9edc4704f2e38bda', 'Colegio Gimnasio Moderno', 'colegio-gimnasio-moderno', 'Espacio para la comunidad del Gimnasio Moderno. Tradición y excelencia educativa.', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Bogotá, Colombia', '2025-12-05 17:46:54.160881', '2025-12-05 17:46:54.160902', 'e3702132b6cb45d2a390e6b1b5f254ab', NULL, '3351c502ea1140c6bce5775a70696ba5'),
('9f01940d05e14d40a503d7dc601ac9e1', 'Bienestar Emocional Habilidosos', 'bienestar-emocional-habilidosos', '💚 Espacio seguro para hablar sobre salud mental, emociones y bienestar psicológico.', 'lifestyle', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.388130', '2025-12-05 17:54:11.388143', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('a0855f188bcf46f3baacf88a41cb5b73', 'Idiomas', 'educacion-idiomas', '🌍 Aprende nuevos idiomas', 'educacion', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.246796', '2025-12-03 12:40:24.246796', '4912c5171c6d48d4bdbcfbd889a9143c', '8ab1be799c2840cc8a9c83346b25b70b', 'bef9c1f68ae14abc9b59f6bf9eed113b'),
('ab4a65a37394450196403f07531abc91', 'Danza Habilidosos', 'danza-habilidosos', '💃 Comunidad de danza. Baile urbano, folclórico, contemporáneo y más estilos.', 'arte', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.316970', '2025-12-05 17:54:11.316988', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('ad3586e0a7e742cf9d4092d3afd20c2f', 'Tenis', 'deportes-tenis', '🎾 ATP, WTA y Grand Slams', 'deportes', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:23.932243', '2025-12-03 12:40:23.932243', '4912c5171c6d48d4bdbcfbd889a9143c', '5c0975ff3fab46aa8fbbff53325e47b7', '3eda6643ff604ce38c9d7a53d0d597c5'),
('b103be08034340a7ba6572942592a013', 'Freelance', 'negocios-freelance', '💻 Trabajo independiente', 'negocios', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.462513', '2025-12-03 12:40:24.462513', '4912c5171c6d48d4bdbcfbd889a9143c', '39e85115085947c9b8718f98eb8f6a52', '18834c462739401688612ff3e8432aeb'),
('b272e1898822405c85eb20537cb9323c', 'Blockchain', 'tecnologia-blockchain', '⛓️ Crypto y Web3', 'tecnologia', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.092412', '2025-12-03 12:40:24.092412', '4912c5171c6d48d4bdbcfbd889a9143c', 'b79927d837c443b6bdc1b14107cadac3', '935251373b72419fadf65338e848ee44'),
('b30ae992e5ab4df384472218baf4c7b8', 'Ciencias UNAL', 'ciencias-unal', 'Facultad de Ciencias - Matemáticas, Física, Química, Biología', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Bogotá, Colombia', '2025-12-05 17:46:54.095631', '2025-12-05 17:46:54.095646', 'e3702132b6cb45d2a390e6b1b5f254ab', '99f3924f93e2422daf23562a67316cf5', '02151a6581a54e809d99ffafb990d11a'),
('b30fefdf72644d7bb1e4c13692bd7e4f', 'Egresados San Bartolomé', 'egresados-san-bartolome', 'Red de egresados del colegio', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Bogotá, Colombia', '2025-12-05 17:46:54.233009', '2025-12-05 17:46:54.233023', 'e3702132b6cb45d2a390e6b1b5f254ab', '3978ac36ae1244ddbce71032bbfa48cf', '3351c502ea1140c6bce5775a70696ba5'),
('b40abad3ca624e47a602568eb33753cd', 'Emprendimiento Habilidosos', 'emprendimiento-habilidosos', '💡 Comunidad de emprendedores. Ideas, proyectos y desarrollo de negocios.', 'lifestyle', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.415848', '2025-12-05 17:54:11.415866', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('b79927d837c443b6bdc1b14107cadac3', 'Comunidad Tecnología', 'comunidad-tecnologia', 'Innovación y desarrollo tecnológico', 'tecnologia', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.056100', '2025-12-03 12:40:24.056100', '4912c5171c6d48d4bdbcfbd889a9143c', NULL, '935251373b72419fadf65338e848ee44'),
('b7f780390ed14d009b9453b31f7e7ea9', 'Inversiones', 'negocios-inversiones', '📊 Bolsa y trading', 'negocios', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.455992', '2025-12-03 12:40:24.455992', '4912c5171c6d48d4bdbcfbd889a9143c', '39e85115085947c9b8718f98eb8f6a52', '18834c462739401688612ff3e8432aeb'),
('ba02a67b54594ba5bccdb299fd0ed392', 'Orientación Vocacional Habilidosos', 'orientacion-vocacional-habilidosos', '🎯 Guía para descubrir tu vocación, carreras y oportunidades de estudio.', 'lifestyle', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.441530', '2025-12-05 17:54:11.441562', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('bfaac4677b49402c8d4519d4cf5718f3', 'Animación', 'arte-animacion', '🎞️ 2D, 3D y motion graphics', 'arte', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.354079', '2025-12-03 12:40:24.354079', '4912c5171c6d48d4bdbcfbd889a9143c', '84af1903c589467aa3a6b0ba0d6bc7ce', '8d50a093f4c94f0b998416cc666ceb2b'),
('c015a7a70a864ca6977079dfb345d5f8', 'Universidad Católica Luis Amigó', 'universidad-catolica-luis-amigo', 'Comunidad de la Universidad Católica Luis Amigó (FUNLAM). Conecta con estudiantes, profesores y egresados. Comparte información académica, eventos y actividades de la comunidad Amigoniana. Web: https://www.funlam.edu.co/', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Medellín, Colombia', '2025-12-09 15:41:03.945793', '2025-12-09 15:41:03.945822', 'e3702132b6cb45d2a390e6b1b5f254ab', NULL, '02151a6581a54e809d99ffafb990d11a'),
('c4ae509c74d240229ef1eb2e3c4411f3', 'Fotografía y Video Habilidosos', 'fotografia-y-video-habilidosos', '📸 Comunidad audiovisual. Fotografía, videografía y producción de contenido.', 'arte', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.374370', '2025-12-05 17:54:11.374384', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('c77bbb7de47641ff9b8cd128ae5aaf86', 'Minecraft', 'gaming-minecraft', '⛏️ Construcción y supervivencia', 'gaming', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.192616', '2025-12-03 12:40:24.192616', '4912c5171c6d48d4bdbcfbd889a9143c', '7bde30ec5669489fa963db43e6dbe700', '4c765e72242641afb04d7a8f20e83b1d'),
('c87f38c5ac6442778737eee83414d7ec', 'Liderazgo Habilidosos', 'liderazgo-habilidosos', '👑 Desarrollo de habilidades de liderazgo, trabajo en equipo y comunicación.', 'lifestyle', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.401245', '2025-12-05 17:54:11.401259', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('cede5a3bedfd476bbf1ed4db206cb20b', 'Meditación', 'lifestyle-meditacion', '🧘 Mindfulness y paz', 'lifestyle', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.421449', '2025-12-03 12:40:24.421449', '4912c5171c6d48d4bdbcfbd889a9143c', '1e6f1a3deb8c4ab0854a8751483d7fa9', '7be4307c899847309a8fd87ad7f5667c'),
('cfbb7741fd0747629d5c8d613c86b9b5', 'Baloncesto Habilidosos', 'baloncesto-habilidosos', '🏀 Comunidad de baloncesto. Jugadas, torneos y el mejor contenido de basketball.', 'deportes', 'public', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-05 17:54:11.228882', '2025-12-05 17:54:11.228903', 'e3702132b6cb45d2a390e6b1b5f254ab', '4d06f96266114a6989cdd7364174a2c7', 'bce5f5f9a6bb429da4389afdb4e5f93a'),
('d112861d9a714185844a861090fd071b', 'Diseño Gráfico', 'arte-diseno-grafico', '🖼️ Creatividad visual', 'arte', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.315247', '2025-12-03 12:40:24.315247', '4912c5171c6d48d4bdbcfbd889a9143c', '84af1903c589467aa3a6b0ba0d6bc7ce', '8d50a093f4c94f0b998416cc666ceb2b'),
('d1aa5824dc064a919a69e5f8a1942aac', 'Reggae', 'musica-reggae', '🇯🇲 Roots, dub y dancehall', 'musica', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:23.988603', '2025-12-03 12:40:23.989593', '4912c5171c6d48d4bdbcfbd889a9143c', 'de39bd77a9f94a32ba5668e3693ab686', '594e9e5d07e348ea9d631ced4d9c7d28'),
('d1f7bff8e2d64c81aa348a48fc6f5af0', 'Nutrición', 'lifestyle-nutricion', '🥗 Alimentación saludable', 'lifestyle', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.394738', '2025-12-03 12:40:24.394738', '4912c5171c6d48d4bdbcfbd889a9143c', '1e6f1a3deb8c4ab0854a8751483d7fa9', '7be4307c899847309a8fd87ad7f5667c'),
('d5fa754cc9774990a0e8abe312cf539d', 'Desarrollo Web', 'tecnologia-desarrollo-web', '🌐 Frontend, backend y fullstack', 'tecnologia', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.062005', '2025-12-03 12:40:24.062005', '4912c5171c6d48d4bdbcfbd889a9143c', 'b79927d837c443b6bdc1b14107cadac3', '935251373b72419fadf65338e848ee44'),
('dbba8e868647440e9f77c8baa235680c', 'Networking', 'negocios-networking', '🤝 Conexiones profesionales', 'negocios', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.470930', '2025-12-03 12:40:24.470930', '4912c5171c6d48d4bdbcfbd889a9143c', '39e85115085947c9b8718f98eb8f6a52', '18834c462739401688612ff3e8432aeb'),
('dcd7e9abc9654ce59a44924ea392bc5b', 'FIFA / EA FC', 'gaming-fifa-ea-fc', '⚽ Fútbol virtual', 'gaming', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.140288', '2025-12-03 12:40:24.140288', '4912c5171c6d48d4bdbcfbd889a9143c', '7bde30ec5669489fa963db43e6dbe700', '4c765e72242641afb04d7a8f20e83b1d'),
('dd3809cb3d9a49a3b9516be2a238beaa', 'Cocina', 'lifestyle-cocina', '👨‍🍳 Recetas y gastronomía', 'lifestyle', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.414156', '2025-12-03 12:40:24.414156', '4912c5171c6d48d4bdbcfbd889a9143c', '1e6f1a3deb8c4ab0854a8751483d7fa9', '7be4307c899847309a8fd87ad7f5667c'),
('dd803645785645bea278e21190b76639', 'Arte y Cultura San Bartolomé', 'arte-y-cultura-san-bartolome', 'Grupos de teatro, música, danza y expresión artística', 'educacion', 'public', '', '', 1, 0, 1, 0, 'Bogotá, Colombia', '2025-12-05 17:46:54.215607', '2025-12-05 17:46:54.215623', 'e3702132b6cb45d2a390e6b1b5f254ab', '3978ac36ae1244ddbce71032bbfa48cf', '3351c502ea1140c6bce5775a70696ba5'),
('de39bd77a9f94a32ba5668e3693ab686', 'Comunidad Música', 'comunidad-musica', 'Géneros musicales y artistas', 'musica', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:23.965977', '2025-12-03 12:40:23.965977', '4912c5171c6d48d4bdbcfbd889a9143c', NULL, '594e9e5d07e348ea9d631ced4d9c7d28'),
('df0949807833416d8ac6823c13491e67', 'Fitness', 'lifestyle-fitness', '💪 Ejercicio y entrenamiento', 'lifestyle', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.389771', '2025-12-03 12:40:24.390729', '4912c5171c6d48d4bdbcfbd889a9143c', '1e6f1a3deb8c4ab0854a8751483d7fa9', '7be4307c899847309a8fd87ad7f5667c'),
('e076fac11ac6408599c08f4986b1c1df', 'Electrónica', 'musica-electronica', '🎹 EDM, house, techno', 'musica', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.022582', '2025-12-03 12:40:24.022582', '4912c5171c6d48d4bdbcfbd889a9143c', 'de39bd77a9f94a32ba5668e3693ab686', '594e9e5d07e348ea9d631ced4d9c7d28'),
('e7f2c20a42e24fc099afe87ce048a56b', 'Moda', 'lifestyle-moda', '👗 Tendencias y estilo', 'lifestyle', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:24.402701', '2025-12-03 12:40:24.402701', '4912c5171c6d48d4bdbcfbd889a9143c', '1e6f1a3deb8c4ab0854a8751483d7fa9', '7be4307c899847309a8fd87ad7f5667c'),
('e80662e4e87141a6a937d5f968cf9a9c', 'Voleibol', 'deportes-voleibol', '🏐 Voleibol de playa y sala', 'deportes', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:23.927247', '2025-12-03 12:40:23.927247', '4912c5171c6d48d4bdbcfbd889a9143c', '5c0975ff3fab46aa8fbbff53325e47b7', '3eda6643ff604ce38c9d7a53d0d597c5'),
('eba726c4c6e942b7b00c1df8cf889754', 'Emprendedores Deportivos', 'emprendedores-deportivos', 'Negocios relacionados con el deporte. Networking, ideas y oportunidades. 💼', 'negocios', 'private', '', '', 1, 0, 1, 0, 'Colombia', '2025-12-02 05:00:59.951228', '2025-12-02 05:00:59.951266', 'ec300baec9ef4c0696e10abca991ac64', NULL, NULL),
('f49c6fca47e54f7c9a19dfbd593f91c6', 'Gamers Unidos', 'gamers-unidos', 'Comunidad para gamers de todas las plataformas. FIFA, PES, y más. Torneos semanales y streams. 🎮', 'gaming', 'public', '', '', 1, 1, 1, 0, 'Latinoamérica', '2025-12-02 05:00:59.910064', '2025-12-02 05:00:59.910152', '98ca610eafbc4827b95e754c9c0a6b23', NULL, NULL),
('f636380419994035b410458b17853726', 'Reggaetón', 'musica-reggaeton', '🎤 El género urbano por excelencia', 'musica', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:23.978412', '2025-12-03 12:40:23.978412', '4912c5171c6d48d4bdbcfbd889a9143c', 'de39bd77a9f94a32ba5668e3693ab686', '594e9e5d07e348ea9d631ced4d9c7d28'),
('f8d7bdf319b34b31a9307e1e70e5a956', 'Fútbol', 'deportes-futbol', '⚽ La pasión del fútbol mundial', 'deportes', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:23.911410', '2025-12-03 12:40:23.911410', '4912c5171c6d48d4bdbcfbd889a9143c', '5c0975ff3fab46aa8fbbff53325e47b7', '3eda6643ff604ce38c9d7a53d0d597c5'),
('fc8baae7624e40d48f4e4c7342ab34eb', 'Ciclismo', 'deportes-ciclismo', '🚴 Rutas y competencias', 'deportes', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:23.956303', '2025-12-03 12:40:23.956303', '4912c5171c6d48d4bdbcfbd889a9143c', '5c0975ff3fab46aa8fbbff53325e47b7', '3eda6643ff604ce38c9d7a53d0d597c5'),
('fe81aa7e873c42e5bede3d4e48d787e2', 'Trap', 'musica-trap', '🔥 Trap latino y urbano', 'musica', 'public', '', '', 1, 0, 1, 0, '', '2025-12-03 12:40:23.973400', '2025-12-03 12:40:23.973400', '4912c5171c6d48d4bdbcfbd889a9143c', 'de39bd77a9f94a32ba5668e3693ab686', '594e9e5d07e348ea9d631ced4d9c7d28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla communities_communitycategory
--

CREATE TABLE communities_communitycategory (
  id char(32) NOT NULL,
  name varchar(100) NOT NULL,
  slug varchar(120) NOT NULL,
  description longtext NOT NULL,
  icon varchar(50) NOT NULL,
  color varchar(7) NOT NULL,
  image varchar(100) DEFAULT NULL,
  `order` int(11) NOT NULL,
  is_active tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla communities_communitycategory
--

INSERT INTO communities_communitycategory (id, name, slug, description, icon, color, image, `order`, is_active, created_at) VALUES
('02151a6581a54e809d99ffafb990d11a', 'Universidades', 'universidades', 'Comunidades de universidades, facultades y grupos estudiantiles universitarios', '🎓', '#3B82F6', '', 20, 1, '2025-12-05 17:46:53.892319'),
('18834c462739401688612ff3e8432aeb', 'Negocios', 'negocios', 'Emprendimiento y finanzas', '💼', '#3498db', '', 18, 1, '2025-12-03 12:40:24.425596'),
('3351c502ea1140c6bce5775a70696ba5', 'Colegios', 'colegios', 'Comunidades de colegios, escuelas y grupos estudiantiles de secundaria y primaria', '🏫', '#F59E0B', '', 21, 1, '2025-12-05 17:46:53.924492'),
('3eda6643ff604ce38c9d7a53d0d597c5', 'Deportes', 'deportes', 'Comunidades dedicadas a todos los deportes', '⚽', '#00ff88', '', 11, 1, '2025-12-03 12:40:23.891918'),
('4c765e72242641afb04d7a8f20e83b1d', 'Gaming', 'gaming', 'Videojuegos y esports', '🎮', '#9b59b6', '', 14, 1, '2025-12-03 12:40:24.123482'),
('594e9e5d07e348ea9d631ced4d9c7d28', 'Música', 'musica', 'Géneros musicales y artistas', '🎵', '#ff6b6b', '', 12, 1, '2025-12-03 12:40:23.961306'),
('7be4307c899847309a8fd87ad7f5667c', 'Lifestyle', 'lifestyle', 'Estilo de vida y bienestar', '✨', '#1abc9c', '', 17, 1, '2025-12-03 12:40:24.368240'),
('8d50a093f4c94f0b998416cc666ceb2b', 'Arte y Creatividad', 'arte', 'Expresión artística y diseño', '🎨', '#e74c3c', '', 16, 1, '2025-12-03 12:40:24.297567'),
('935251373b72419fadf65338e848ee44', 'Tecnología', 'tecnologia', 'Innovación y desarrollo tecnológico', '💻', '#4ecdc4', '', 13, 1, '2025-12-03 12:40:24.047321'),
('bce5f5f9a6bb429da4389afdb4e5f93a', 'Habilidosos', 'habilidosos', 'La comunidad oficial del Reality SOS-HABILIDOSO. Conecta con participantes, sigue las competencias y forma parte de esta gran familia de talentos.', '⭐', '#00ff88', '', 0, 1, '2025-12-05 17:54:11.153025'),
('bef9c1f68ae14abc9b59f6bf9eed113b', 'Educación', 'educacion', 'Aprendizaje y cursos', '📚', '#f39c12', '', 15, 1, '2025-12-03 12:40:24.220115');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla communities_communitymembership
--

CREATE TABLE communities_communitymembership (
  id bigint(20) NOT NULL,
  role varchar(10) NOT NULL,
  joined_at datetime(6) NOT NULL,
  is_active tinyint(1) NOT NULL,
  community_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla communities_communitymembership
--

INSERT INTO communities_communitymembership (id, role, joined_at, is_active, community_id, user_id) VALUES
(1, 'member', '2025-12-02 05:00:59.968347', 1, '36f8e54b3fbf44f7a372b58af65071ba', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(2, 'member', '2025-12-02 05:00:59.984139', 1, '36f8e54b3fbf44f7a372b58af65071ba', '84c5e41a9e4348548886b797643f91f8'),
(3, 'member', '2025-12-02 05:01:00.003777', 1, 'f49c6fca47e54f7c9a19dfbd593f91c6', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(4, 'member', '2025-12-02 05:01:00.013042', 1, 'f49c6fca47e54f7c9a19dfbd593f91c6', '84c5e41a9e4348548886b797643f91f8'),
(5, 'member', '2025-12-02 05:01:00.021119', 1, 'f49c6fca47e54f7c9a19dfbd593f91c6', 'ec300baec9ef4c0696e10abca991ac64'),
(6, 'member', '2025-12-02 05:01:00.035916', 1, 'f49c6fca47e54f7c9a19dfbd593f91c6', '294820a41aad4ff0abb05e9f5886555c'),
(7, 'member', '2025-12-02 05:01:00.049025', 1, '20671d3411e74a6d9efc6c434b60188e', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(8, 'member', '2025-12-02 05:01:00.063312', 1, '20671d3411e74a6d9efc6c434b60188e', 'ec300baec9ef4c0696e10abca991ac64'),
(9, 'member', '2025-12-02 05:01:00.069911', 1, '20671d3411e74a6d9efc6c434b60188e', '294820a41aad4ff0abb05e9f5886555c'),
(10, 'member', '2025-12-02 05:01:00.079605', 1, '3cf623e42d494ea0825471469416da94', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(11, 'member', '2025-12-02 05:01:00.084970', 1, '3cf623e42d494ea0825471469416da94', '98ca610eafbc4827b95e754c9c0a6b23'),
(12, 'member', '2025-12-02 05:01:00.094797', 1, '3cf623e42d494ea0825471469416da94', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(13, 'member', '2025-12-02 05:01:00.099370', 1, '3cf623e42d494ea0825471469416da94', 'ec300baec9ef4c0696e10abca991ac64'),
(14, 'member', '2025-12-02 05:01:00.106113', 1, '3cf623e42d494ea0825471469416da94', '294820a41aad4ff0abb05e9f5886555c'),
(15, 'member', '2025-12-02 05:01:00.118183', 1, 'eba726c4c6e942b7b00c1df8cf889754', '98ca610eafbc4827b95e754c9c0a6b23'),
(16, 'member', '2025-12-02 05:01:00.125980', 1, 'eba726c4c6e942b7b00c1df8cf889754', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(17, 'member', '2025-12-02 05:01:45.076579', 1, '36f8e54b3fbf44f7a372b58af65071ba', '294820a41aad4ff0abb05e9f5886555c'),
(18, 'member', '2025-12-02 05:01:45.095468', 1, '20671d3411e74a6d9efc6c434b60188e', '84c5e41a9e4348548886b797643f91f8'),
(19, 'member', '2025-12-02 05:01:45.116338', 1, 'eba726c4c6e942b7b00c1df8cf889754', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(20, 'member', '2025-12-02 05:01:45.130818', 1, 'eba726c4c6e942b7b00c1df8cf889754', '84c5e41a9e4348548886b797643f91f8'),
(21, 'member', '2025-12-03 13:53:12.485375', 1, '90884b6e5b3b49ee9d33ff417d6bc51c', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(22, 'member', '2025-12-03 14:06:12.839654', 1, '7d29889893d04ea8961d7d78f88dbdf4', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(23, 'member', '2025-12-03 14:06:17.702968', 0, 'b79927d837c443b6bdc1b14107cadac3', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(24, 'member', '2025-12-03 14:06:24.074484', 1, '13ad2e4436054eaa8a284d8bcabd453e', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(25, 'member', '2025-12-03 14:18:07.219682', 0, 'de39bd77a9f94a32ba5668e3693ab686', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(26, 'member', '2025-12-03 14:18:15.260528', 1, 'fe81aa7e873c42e5bede3d4e48d787e2', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(27, 'member', '2025-12-03 15:13:25.696033', 1, '39e85115085947c9b8718f98eb8f6a52', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(28, 'member', '2025-12-03 15:13:33.598945', 1, 'dbba8e868647440e9f77c8baa235680c', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(29, 'member', '2025-12-03 15:23:56.958185', 1, '7bde30ec5669489fa963db43e6dbe700', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(30, 'member', '2025-12-03 15:29:20.133759', 1, '08cd0ae9e3fb4215b505d76fb2d2a446', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(31, 'member', '2025-12-03 15:29:22.496805', 1, '10b2389360f6496882e35205bcf4bed9', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(32, 'admin', '2025-12-03 18:01:01.387900', 1, '6ab31bbfc27a4333a370b2c0aad4cd09', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(33, 'member', '2025-12-05 17:29:30.781593', 1, '910c26e3d913404686dde08150e8f44f', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(34, 'member', '2025-12-05 17:29:55.210698', 0, '8ab1be799c2840cc8a9c83346b25b70b', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(35, 'member', '2025-12-05 17:46:53.971125', 1, '99f3924f93e2422daf23562a67316cf5', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(36, 'member', '2025-12-05 17:46:53.996221', 1, '7f620e6ba8514fb7a33f29cdfaffb25d', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(37, 'member', '2025-12-05 17:46:54.026087', 1, '4d37dbfd3bd741798c3c3708e6172019', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(38, 'member', '2025-12-05 17:46:54.063836', 1, '1c075fcf090544eeacbf40334f360828', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(39, 'member', '2025-12-05 17:46:54.082966', 1, '1e54655aae544b86ab253a8fe701cb9a', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(40, 'member', '2025-12-05 17:46:54.111435', 1, 'b30ae992e5ab4df384472218baf4c7b8', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(41, 'member', '2025-12-05 17:46:54.131922', 1, '54e10d76abdd41458e5ce4307cf0aa90', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(42, 'member', '2025-12-05 17:46:54.149199', 1, '3978ac36ae1244ddbce71032bbfa48cf', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(43, 'member', '2025-12-05 17:46:54.166236', 1, '9d96c71c1296426a9edc4704f2e38bda', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(44, 'member', '2025-12-05 17:46:54.182451', 1, '974ea6b1a1034759853edf1e62d7e311', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(45, 'member', '2025-12-05 17:46:54.208295', 1, '32db97ad83a24a208df009bfd09d4149', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(46, 'member', '2025-12-05 17:46:54.225877', 1, 'dd803645785645bea278e21190b76639', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(47, 'member', '2025-12-05 17:46:54.247105', 1, 'b30fefdf72644d7bb1e4c13692bd7e4f', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(48, 'member', '2025-12-05 17:54:11.194787', 1, '4d06f96266114a6989cdd7364174a2c7', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(49, 'member', '2025-12-05 17:54:11.219462', 1, '79a8943fec514c8a9974399e97a43393', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(50, 'member', '2025-12-05 17:54:11.235446', 1, 'cfbb7741fd0747629d5c8d613c86b9b5', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(51, 'member', '2025-12-05 17:54:11.248318', 1, '2066f778fdf647d78b7860cf17d62d70', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(52, 'member', '2025-12-05 17:54:11.262070', 1, '868afd1103db4621ba5e33afc62606f8', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(53, 'member', '2025-12-05 17:54:11.276577', 1, '37e18b50edb54de5ad309248c88c209a', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(54, 'member', '2025-12-05 17:54:11.289696', 1, '903e46ddea20403085e00b4635a2cbef', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(55, 'member', '2025-12-05 17:54:11.306146', 1, '85e466f7a2a7430390fb708a63099179', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(56, 'member', '2025-12-05 17:54:11.324066', 1, 'ab4a65a37394450196403f07531abc91', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(57, 'member', '2025-12-05 17:54:11.339222', 1, '18e8ca610a0d4d8cbc12a2fbbcf77529', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(58, 'member', '2025-12-05 17:54:11.354429', 1, '57db5bcfbbb64cc1becee7152bf4a019', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(59, 'member', '2025-12-05 17:54:11.369124', 1, '87d033fab5344128af229112082dcd4d', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(60, 'member', '2025-12-05 17:54:11.382869', 1, 'c4ae509c74d240229ef1eb2e3c4411f3', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(61, 'member', '2025-12-05 17:54:11.392660', 1, '9f01940d05e14d40a503d7dc601ac9e1', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(62, 'member', '2025-12-05 17:54:11.407208', 1, 'c87f38c5ac6442778737eee83414d7ec', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(63, 'member', '2025-12-05 17:54:11.422754', 1, 'b40abad3ca624e47a602568eb33753cd', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(64, 'member', '2025-12-05 17:54:11.434937', 1, '0de95d4d49a1438b9cb32101cc62e8c6', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(65, 'member', '2025-12-05 17:54:11.450064', 1, 'ba02a67b54594ba5bccdb299fd0ed392', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(66, 'member', '2025-12-05 17:54:11.468440', 1, '341f5d86b2324830a7a9239cdd97c2d8', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(67, 'member', '2025-12-05 17:54:11.480486', 1, '59ff88c7442049a784d41e9b8fb2f1dc', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(68, 'member', '2025-12-05 17:56:05.011981', 1, '99f3924f93e2422daf23562a67316cf5', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(69, 'member', '2025-12-05 17:56:06.642965', 1, '4d37dbfd3bd741798c3c3708e6172019', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(70, 'member', '2025-12-05 17:56:07.684821', 1, '7f620e6ba8514fb7a33f29cdfaffb25d', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(71, 'member', '2025-12-05 17:56:35.568380', 1, '4d06f96266114a6989cdd7364174a2c7', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(72, 'member', '2025-12-09 15:41:03.923363', 1, '516e8c2ec4254131b2f0969b258d9d0e', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(73, 'member', '2025-12-09 15:41:03.958759', 1, 'c015a7a70a864ca6977079dfb345d5f8', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(74, 'member', '2025-12-09 15:43:20.016331', 1, 'c015a7a70a864ca6977079dfb345d5f8', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(75, 'member', '2025-12-09 15:43:27.270149', 1, '516e8c2ec4254131b2f0969b258d9d0e', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(76, 'admin', '2025-12-09 17:51:53.971816', 1, '5232d2d39edd4f4aa6a63d704176550f', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(77, 'member', '2025-12-10 15:26:34.118037', 1, '341f5d86b2324830a7a9239cdd97c2d8', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(78, 'member', '2025-12-10 16:47:08.380443', 1, '4d06f96266114a6989cdd7364174a2c7', '6f053d432986406289a54b930e90924f'),
(79, 'member', '2025-12-10 16:57:42.573095', 1, '90884b6e5b3b49ee9d33ff417d6bc51c', '6f053d432986406289a54b930e90924f'),
(80, 'member', '2025-12-10 16:57:44.071636', 1, 'ad3586e0a7e742cf9d4092d3afd20c2f', '6f053d432986406289a54b930e90924f'),
(81, 'member', '2025-12-10 16:57:47.294980', 1, '5c0975ff3fab46aa8fbbff53325e47b7', '6f053d432986406289a54b930e90924f'),
(82, 'member', '2025-12-10 16:57:49.790806', 1, 'fc8baae7624e40d48f4e4c7342ab34eb', '6f053d432986406289a54b930e90924f'),
(83, 'member', '2025-12-12 17:36:19.060393', 1, '5c0975ff3fab46aa8fbbff53325e47b7', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(84, 'member', '2025-12-12 17:36:24.274188', 1, 'fc8baae7624e40d48f4e4c7342ab34eb', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(85, 'member', '2025-12-13 00:53:40.585640', 1, '90884b6e5b3b49ee9d33ff417d6bc51c', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(86, 'admin', '2025-12-13 06:21:03.481389', 1, '6ca37437d744445a946d5b7a4e06e71e', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(87, 'admin', '2025-12-13 06:39:21.098870', 1, '95efec44b49e4733a4968f1d8a3a7872', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(88, 'member', '2025-12-13 06:43:50.947404', 1, '95efec44b49e4733a4968f1d8a3a7872', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(89, 'member', '2025-12-13 06:46:41.407821', 1, '903e46ddea20403085e00b4635a2cbef', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(90, 'member', '2025-12-13 16:24:40.855802', 1, '6ca37437d744445a946d5b7a4e06e71e', '6f053d432986406289a54b930e90924f'),
(91, 'member', '2025-12-15 16:01:27.075052', 1, '13ad2e4436054eaa8a284d8bcabd453e', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(92, 'member', '2025-12-16 16:08:09.511384', 1, 'fe81aa7e873c42e5bede3d4e48d787e2', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(93, 'member', '2025-12-21 02:16:16.781053', 1, '59ff88c7442049a784d41e9b8fb2f1dc', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(94, 'member', '2026-01-16 15:35:01.139307', 1, '18e8ca610a0d4d8cbc12a2fbbcf77529', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(95, 'member', '2026-01-20 10:10:37.575578', 1, '7c8b27f295e341958a3b6ed836585b95', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(96, 'member', '2026-01-20 10:10:38.780516', 1, '1f870eec59f4428580b117fe90447d83', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(97, 'member', '2026-01-20 10:10:40.099863', 1, 'e076fac11ac6408599c08f4986b1c1df', 'bd22ec1c4dbe48f3a018e96b2cd61304');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla communities_communitypost
--

CREATE TABLE communities_communitypost (
  id char(32) NOT NULL,
  content longtext NOT NULL,
  post_type varchar(10) NOT NULL,
  video_url varchar(200) DEFAULT NULL,
  podcast_url varchar(200) DEFAULT NULL,
  live_url varchar(200) DEFAULT NULL,
  is_pinned tinyint(1) NOT NULL,
  is_approved tinyint(1) NOT NULL,
  is_active tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  author_id char(32) NOT NULL,
  community_id char(32) NOT NULL,
  image varchar(100) DEFAULT NULL,
  podcast varchar(100) DEFAULT NULL,
  video varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla communities_communitypost
--

INSERT INTO communities_communitypost (id, content, post_type, video_url, podcast_url, live_url, is_pinned, is_approved, is_active, created_at, updated_at, author_id, community_id, image, podcast, video) VALUES
('0182c23a09604b2ebd32e2b7ca50f221', 'Torneo de FIFA este sábado! Quién se apunta? 🎮', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.391043', '2025-12-02 05:01:45.391062', 'd355c06d9f2b4fefbd6e3a4dab17b284', '3cf623e42d494ea0825471469416da94', '', '', ''),
('13038e93fae446798799b96594d1363e', 'Caso de éxito: cómo moneticé mi pasión por el deporte', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.444983', '2025-12-02 05:01:45.445068', 'd355c06d9f2b4fefbd6e3a4dab17b284', 'eba726c4c6e942b7b00c1df8cf889754', '', '', ''),
('140dde4bab3649ba872f8d35017b59cf', 'bfdbfd', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-03 15:18:41.415837', '2025-12-03 15:18:41.415837', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'dbba8e868647440e9f77c8baa235680c', '', '', ''),
('156bb213fcb9439ba0ab1634cfbc4560', 'rf-ljnjkd', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-10 15:21:40.163987', '2025-12-10 15:21:40.164980', 'bd22ec1c4dbe48f3a018e96b2cd61304', '516e8c2ec4254131b2f0969b258d9d0e', '', '', ''),
('162b7e65be714e449f4dfaa66c2d5f41', 'Stream en vivo a las 8pm, no se lo pierdan!', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.371610', '2025-12-02 05:01:45.371635', 'ec300baec9ef4c0696e10abca991ac64', '20671d3411e74a6d9efc6c434b60188e', '', '', ''),
('173db44d4e6d4791bf7e38e68afa59b6', 'test foto /imagen', 'image', NULL, NULL, NULL, 0, 1, 1, '2025-12-10 15:18:12.531911', '2025-12-10 15:18:12.675530', 'bd22ec1c4dbe48f3a018e96b2cd61304', '5232d2d39edd4f4aa6a63d704176550f', 'community_posts/images/logo_sos3x.png', '', ''),
('1975fcd2b3dd4518ac9e4255285e2ecb', 'Produciendo mi primer beat, consejos? 🎹', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.384124', '2025-12-02 05:01:00.384161', 'ec300baec9ef4c0696e10abca991ac64', '3cf623e42d494ea0825471469416da94', '', '', ''),
('1dbe5d919cfa47b5bbc49693c71d8456', 'Networking event este viernes, confirmen asistencia', 'video', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.343650', '2025-12-02 05:01:45.343677', '294820a41aad4ff0abb05e9f5886555c', '20671d3411e74a6d9efc6c434b60188e', '', '', ''),
('218ee105230b425092adec9c4580785a', 'test publicacion', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-10 15:17:43.946901', '2025-12-10 15:17:43.949096', 'bd22ec1c4dbe48f3a018e96b2cd61304', '5232d2d39edd4f4aa6a63d704176550f', '', '', ''),
('258b17dc750b489cab685751c243cf81', '¡Qué partidazo el de anoche! La selección lo dio todo 🔥⚽', 'image', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.267187', '2025-12-02 05:01:45.267239', '294820a41aad4ff0abb05e9f5886555c', 'f49c6fca47e54f7c9a19dfbd593f91c6', '', '', ''),
('28c1b044ed4c43a2b6f51599cc7c18de', 'Excelente!', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-13 06:22:00.194717', '2025-12-13 06:22:00.195715', 'bd22ec1c4dbe48f3a018e96b2cd61304', '6ca37437d744445a946d5b7a4e06e71e', '', '', ''),
('2a5105d82bb843eaa55f37d302e4f23b', 'Mi mejor captura del mes 🏆', 'image', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.359735', '2025-12-02 05:01:45.359768', '294820a41aad4ff0abb05e9f5886555c', '20671d3411e74a6d9efc6c434b60188e', '', '', ''),
('2a78ba9e095a4b4e8cccdd9f8a2e1107', 'Foto del partido de ayer, qué tal quedó? 📸', 'image', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.196218', '2025-12-02 05:01:00.196241', 'd355c06d9f2b4fefbd6e3a4dab17b284', '36f8e54b3fbf44f7a372b58af65071ba', '', '', ''),
('2c297f1c09a04f84a94c0c5e89c55a36', 'Mi setup gaming actualizado, qué les parece? 🖥️', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.259725', '2025-12-02 05:01:00.259765', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'f49c6fca47e54f7c9a19dfbd593f91c6', '', '', ''),
('411f2b48bd6f47fdaab7e8f97978eacf', 'Webinar sobre marketing deportivo mañana', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.302518', '2025-12-02 05:01:45.302556', '84c5e41a9e4348548886b797643f91f8', 'f49c6fca47e54f7c9a19dfbd593f91c6', '', '', ''),
('4e3cb5cfbe1641058d884c3449e8b22c', 'Buscando socios para proyecto de app deportiva', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.217231', '2025-12-02 05:01:00.217254', '4265f3cd6c7a493b9e35efbacd3b3a6b', '36f8e54b3fbf44f7a372b58af65071ba', '', '', ''),
('4ec0fb3003db462db39e738d59ec420b', 'Concierto el próximo mes, alguien va?', 'video', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.335681', '2025-12-02 05:01:00.335712', '4265f3cd6c7a493b9e35efbacd3b3a6b', '20671d3411e74a6d9efc6c434b60188e', '', '', ''),
('56c7e1af1920466ba61060f1bc00493f', 'Mi setup gaming actualizado, qué les parece? 🖥️', 'video', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.361835', '2025-12-02 05:01:00.361873', 'ec300baec9ef4c0696e10abca991ac64', '3cf623e42d494ea0825471469416da94', '', '', ''),
('604e8709812245ceb118d86a5b401012', 'Entrenamiento de hoy completado 💪 #NuncaParar', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.439941', '2025-12-02 05:01:00.440019', '98ca610eafbc4827b95e754c9c0a6b23', 'eba726c4c6e942b7b00c1df8cf889754', '', '', ''),
('625895bf249b4b5b9b314c51fab8acdd', 'Webinar sobre marketing deportivo mañana', 'video', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.425499', '2025-12-02 05:01:00.425595', '98ca610eafbc4827b95e754c9c0a6b23', 'eba726c4c6e942b7b00c1df8cf889754', '', '', ''),
('651c945db0c04d8495b6b8e9a66652a1', 'Networking event este viernes, confirmen asistencia', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.438490', '2025-12-02 05:01:45.438518', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'eba726c4c6e942b7b00c1df8cf889754', '', '', ''),
('6689306c24eb4df9af20787cf9e48d14', 'Webinar sobre marketing deportivo mañana', 'video', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.203970', '2025-12-02 05:01:45.204005', '294820a41aad4ff0abb05e9f5886555c', '36f8e54b3fbf44f7a372b58af65071ba', '', '', ''),
('67806d2ac38d461f97e6bd382c8b9c33', 'hhh', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-16 14:32:35.072357', '2025-12-16 14:32:35.072357', 'bd22ec1c4dbe48f3a018e96b2cd61304', '4d06f96266114a6989cdd7364174a2c7', '', '', ''),
('68afea6530224e35801d3b4fade71b41', 'Foto del partido de ayer, qué tal quedó? 📸', 'video', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.455218', '2025-12-02 05:01:45.455275', 'ec300baec9ef4c0696e10abca991ac64', 'eba726c4c6e942b7b00c1df8cf889754', '', '', ''),
('71d6cf8b40f845d4851f9614a44b0cfd', 'Tips para fotografía nocturna en estadios?', 'image', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.235436', '2025-12-02 05:01:00.235460', '4265f3cd6c7a493b9e35efbacd3b3a6b', '36f8e54b3fbf44f7a372b58af65071ba', '', '', ''),
('73911f79aaa34a3ab96458cd94e9e336', 'Nuevo fichaje confirmado! Qué opinan? 🤔', 'video', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.447175', '2025-12-02 05:01:00.447218', 'ec300baec9ef4c0696e10abca991ac64', 'eba726c4c6e942b7b00c1df8cf889754', '', '', ''),
('73cbfb5de11644418438ed72269b3b47', 'Tips para mejorar en los penales? Los necesito 😅', 'image', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.278601', '2025-12-02 05:01:00.278641', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'f49c6fca47e54f7c9a19dfbd593f91c6', '', '', ''),
('7b0c19fb3eb04e439c985fe4b955fb2d', 'Mi setup gaming actualizado, qué les parece? 🖥️', 'image', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.459334', '2025-12-02 05:01:00.459402', 'd355c06d9f2b4fefbd6e3a4dab17b284', 'eba726c4c6e942b7b00c1df8cf889754', '', '', ''),
('841ee95d533d49638afbf33ba1c0535a', '', 'video', NULL, NULL, NULL, 0, 1, 1, '2025-12-03 15:18:16.734312', '2025-12-03 15:18:17.170032', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'dbba8e868647440e9f77c8baa235680c', '', '', 'community_posts/videos/perfumes.mp4'),
('84995fd032554d9bb33575bf36c0fd54', 'Workshop de fotografía deportiva, interesados?', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.327602', '2025-12-02 05:01:00.327639', '294820a41aad4ff0abb05e9f5886555c', '20671d3411e74a6d9efc6c434b60188e', '', '', ''),
('8d228af906964b9fabe8c8a831709365', 'Playlist para entrenar, compartan las suyas! 🎵', 'video', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.405418', '2025-12-02 05:01:45.405459', '98ca610eafbc4827b95e754c9c0a6b23', '3cf623e42d494ea0825471469416da94', '', '', ''),
('99196c46e7db475cb0709b1baa94e0f3', 'b gngf', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-09 17:52:23.965751', '2025-12-09 17:52:23.966737', 'bd22ec1c4dbe48f3a018e96b2cd61304', '5232d2d39edd4f4aa6a63d704176550f', '', '', ''),
('a2ca6d38eebe4329b17dfee90783517e', 'Concierto el próximo mes, alguien va?', 'image', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.371471', '2025-12-02 05:01:00.371529', '84c5e41a9e4348548886b797643f91f8', '3cf623e42d494ea0825471469416da94', '', '', ''),
('a4e24b91c3c34bebb616bcb71b166ea5', '.jhb .mb .', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-03 14:31:31.492256', '2025-12-03 14:31:31.492256', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'fe81aa7e873c42e5bede3d4e48d787e2', '', '', ''),
('a82d0f2b75e1406291142006f5200e36', 'Tips para fotografía nocturna en estadios?', 'image', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.175559', '2025-12-02 05:01:00.175581', '4265f3cd6c7a493b9e35efbacd3b3a6b', '36f8e54b3fbf44f7a372b58af65071ba', '', '', ''),
('aa0c0928712d4046a70b7a1ac41dd7ff', 'Nuevo lente adquirido, a probarlo!', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.221811', '2025-12-02 05:01:45.221830', '294820a41aad4ff0abb05e9f5886555c', '36f8e54b3fbf44f7a372b58af65071ba', '', '', ''),
('aa9d24a4b073483e913f4fab99837fbd', 'test video', 'video', NULL, NULL, NULL, 0, 1, 1, '2025-12-10 15:19:01.267255', '2025-12-10 15:19:01.431141', 'bd22ec1c4dbe48f3a018e96b2cd61304', '5232d2d39edd4f4aa6a63d704176550f', '', '', 'community_posts/videos/habilidososenportugal.mp4'),
('abff3176e0be4a16b4742fd91472ffbe', 'rgrgr', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-03 15:13:38.737210', '2025-12-03 15:13:38.737210', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'dbba8e868647440e9f77c8baa235680c', '', '', ''),
('ae0f8c704e78444c8c824a5375dfd7cc', 'Concierto el próximo mes, alguien va?', 'video', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.229056', '2025-12-02 05:01:00.229087', '84c5e41a9e4348548886b797643f91f8', '36f8e54b3fbf44f7a372b58af65071ba', '', '', ''),
('bcd3d2c73fc64708ab496ddb028c0766', 'Webinar sobre marketing deportivo mañana', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.268680', '2025-12-02 05:01:00.268719', '98ca610eafbc4827b95e754c9c0a6b23', 'f49c6fca47e54f7c9a19dfbd593f91c6', '', '', ''),
('c1fe77873dc54a0eb621261e204661be', 'Buscando socios para proyecto de app deportiva', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.333272', '2025-12-02 05:01:45.333302', '294820a41aad4ff0abb05e9f5886555c', '20671d3411e74a6d9efc6c434b60188e', '', '', ''),
('c3c75aa1b9964c7cb5cf3d933812039f', 'Produciendo mi primer beat, consejos? 🎹', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.271759', '2025-12-02 05:01:45.271779', '294820a41aad4ff0abb05e9f5886555c', 'f49c6fca47e54f7c9a19dfbd593f91c6', '', '', ''),
('c4e0a21e6c774aadb2d61725b03aa33f', 'oij', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-15 16:01:36.915598', '2025-12-15 16:01:36.915598', 'bd22ec1c4dbe48f3a018e96b2cd61304', '13ad2e4436054eaa8a284d8bcabd453e', '', '', ''),
('c6a8683ff138415986d60c1d01174ad2', 'Produciendo mi primer beat, consejos? 🎹', 'video', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.241042', '2025-12-02 05:01:45.241063', '4265f3cd6c7a493b9e35efbacd3b3a6b', '36f8e54b3fbf44f7a372b58af65071ba', '', '', ''),
('c6a96c9fc27945929cdcb66a2ee996b6', '', 'image', NULL, NULL, NULL, 0, 1, 1, '2025-12-05 11:11:42.941604', '2025-12-05 11:11:43.005173', 'bd22ec1c4dbe48f3a018e96b2cd61304', '6ab31bbfc27a4333a370b2c0aad4cd09', 'community_posts/images/young-smiling-man-avatar-3d-600nw-2124054758.webp', '', ''),
('cd1807a430304184866a0964370a3de8', 'Web Socket', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-15 10:40:29.862960', '2025-12-15 10:40:29.862960', '6f053d432986406289a54b930e90924f', '6ca37437d744445a946d5b7a4e06e71e', '', '', ''),
('cfb548d866834d40bc6a64e0a73cacbb', 'Mi análisis del último partido: el mediocampo fue clave 📊', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.395442', '2025-12-02 05:01:00.395465', '84c5e41a9e4348548886b797643f91f8', '3cf623e42d494ea0825471469416da94', '', '', ''),
('d2450228368045b898eb76da079f5cea', 'Acabo de conseguir el logro más difícil del juego 🏆', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.230578', '2025-12-02 05:01:45.230647', 'd355c06d9f2b4fefbd6e3a4dab17b284', '36f8e54b3fbf44f7a372b58af65071ba', '', '', ''),
('db68fcec129a4216ac49fdc551d6cc2c', 'Produciendo mi primer beat, consejos? 🎹', 'video', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.205544', '2025-12-02 05:01:00.205617', '4265f3cd6c7a493b9e35efbacd3b3a6b', '36f8e54b3fbf44f7a372b58af65071ba', '', '', ''),
('ddbe701fc5a846dcbc68a78743f8482f', 'Playlist para entrenar, compartan las suyas! 🎵', 'video', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.291574', '2025-12-02 05:01:45.291600', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'f49c6fca47e54f7c9a19dfbd593f91c6', '', '', ''),
('e7e5be3c0f6f4bdf88aa8c1af858c183', 'Torneo de FIFA este sábado! Quién se apunta? 🎮', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.315933', '2025-12-02 05:01:00.315958', 'ec300baec9ef4c0696e10abca991ac64', '20671d3411e74a6d9efc6c434b60188e', '', '', ''),
('ec5a8a104cde4a0aa1e17be769ff1bff', 'Alguien sabe dónde puedo ver el partido de hoy?', 'image', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:00.288896', '2025-12-02 05:01:00.288940', '84c5e41a9e4348548886b797643f91f8', 'f49c6fca47e54f7c9a19dfbd593f91c6', '', '', ''),
('f5529b2906f746c3b3f9d53ba9a3a310', 'Mi setup gaming actualizado, qué les parece? 🖥️', 'image', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.281785', '2025-12-02 05:01:45.281834', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'f49c6fca47e54f7c9a19dfbd593f91c6', '', '', ''),
('f6e942a4eac3487597d39080ba9f694f', 'Acabo de conseguir el logro más difícil del juego 🏆', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-02 05:01:45.420132', '2025-12-02 05:01:45.420151', '98ca610eafbc4827b95e754c9c0a6b23', '3cf623e42d494ea0825471469416da94', '', '', ''),
('ff64477acb5c4b2480e26b137bdd9685', 'geniall', 'text', NULL, NULL, NULL, 0, 1, 1, '2025-12-16 16:08:34.250189', '2025-12-16 16:08:34.250189', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'fe81aa7e873c42e5bede3d4e48d787e2', '', '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla communities_communitypostcomment
--

CREATE TABLE communities_communitypostcomment (
  id char(32) NOT NULL,
  content longtext NOT NULL,
  is_active tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  author_id char(32) NOT NULL,
  parent_id char(32) DEFAULT NULL,
  post_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla communities_communitypostcomment
--

INSERT INTO communities_communitypostcomment (id, content, is_active, created_at, updated_at, author_id, parent_id, post_id) VALUES
('74f3049d631647f590e2dbea740d4c1c', 'Felcitaciones!!', 1, '2025-12-13 16:36:48.221752', '2025-12-13 16:36:48.223814', '6f053d432986406289a54b930e90924f', NULL, '28c1b044ed4c43a2b6f51599cc7c18de'),
('84c3e0df37cb4600af488cddf0ba32a1', 'gg', 1, '2025-12-19 11:10:06.063860', '2025-12-19 11:10:06.064947', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL, 'cd1807a430304184866a0964370a3de8'),
('a4372d9c067a4973a1c850166af775dc', 'kjkbk', 1, '2025-12-13 02:06:03.153320', '2025-12-13 02:06:03.153320', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL, 'aa9d24a4b073483e913f4fab99837fbd'),
('e5bc7f9b7b2444ff8a6cc7c28538b9e7', 'bgrgvdf', 1, '2025-12-16 16:09:19.380529', '2025-12-16 16:09:19.380529', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL, '28c1b044ed4c43a2b6f51599cc7c18de');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla communities_communitypostcomment_likes
--

CREATE TABLE communities_communitypostcomment_likes (
  id bigint(20) NOT NULL,
  communitypostcomment_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla communities_communitypost_likes
--

CREATE TABLE communities_communitypost_likes (
  id bigint(20) NOT NULL,
  communitypost_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla communities_communitypost_likes
--

INSERT INTO communities_communitypost_likes (id, communitypost_id, user_id) VALUES
(86, '0182c23a09604b2ebd32e2b7ca50f221', '294820a41aad4ff0abb05e9f5886555c'),
(87, '0182c23a09604b2ebd32e2b7ca50f221', '84c5e41a9e4348548886b797643f91f8'),
(85, '0182c23a09604b2ebd32e2b7ca50f221', '98ca610eafbc4827b95e754c9c0a6b23'),
(88, '0182c23a09604b2ebd32e2b7ca50f221', 'ec300baec9ef4c0696e10abca991ac64'),
(84, '162b7e65be714e449f4dfaa66c2d5f41', '294820a41aad4ff0abb05e9f5886555c'),
(83, '162b7e65be714e449f4dfaa66c2d5f41', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(82, '162b7e65be714e449f4dfaa66c2d5f41', 'ec300baec9ef4c0696e10abca991ac64'),
(39, '1975fcd2b3dd4518ac9e4255285e2ecb', '294820a41aad4ff0abb05e9f5886555c'),
(36, '1975fcd2b3dd4518ac9e4255285e2ecb', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(38, '1975fcd2b3dd4518ac9e4255285e2ecb', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(37, '1975fcd2b3dd4518ac9e4255285e2ecb', 'ec300baec9ef4c0696e10abca991ac64'),
(76, '1dbe5d919cfa47b5bbc49693c71d8456', '84c5e41a9e4348548886b797643f91f8'),
(77, '2a5105d82bb843eaa55f37d302e4f23b', '294820a41aad4ff0abb05e9f5886555c'),
(80, '2a5105d82bb843eaa55f37d302e4f23b', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(81, '2a5105d82bb843eaa55f37d302e4f23b', '84c5e41a9e4348548886b797643f91f8'),
(79, '2a5105d82bb843eaa55f37d302e4f23b', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(78, '2a5105d82bb843eaa55f37d302e4f23b', 'ec300baec9ef4c0696e10abca991ac64'),
(3, '2a78ba9e095a4b4e8cccdd9f8a2e1107', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(4, '2a78ba9e095a4b4e8cccdd9f8a2e1107', '84c5e41a9e4348548886b797643f91f8'),
(5, '2a78ba9e095a4b4e8cccdd9f8a2e1107', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(14, '2c297f1c09a04f84a94c0c5e89c55a36', '294820a41aad4ff0abb05e9f5886555c'),
(16, '2c297f1c09a04f84a94c0c5e89c55a36', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(17, '2c297f1c09a04f84a94c0c5e89c55a36', '84c5e41a9e4348548886b797643f91f8'),
(13, '2c297f1c09a04f84a94c0c5e89c55a36', '98ca610eafbc4827b95e754c9c0a6b23'),
(15, '2c297f1c09a04f84a94c0c5e89c55a36', 'ec300baec9ef4c0696e10abca991ac64'),
(73, '411f2b48bd6f47fdaab7e8f97978eacf', '84c5e41a9e4348548886b797643f91f8'),
(74, '411f2b48bd6f47fdaab7e8f97978eacf', '98ca610eafbc4827b95e754c9c0a6b23'),
(9, '4e3cb5cfbe1641058d884c3449e8b22c', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(10, '4e3cb5cfbe1641058d884c3449e8b22c', '84c5e41a9e4348548886b797643f91f8'),
(11, '4e3cb5cfbe1641058d884c3449e8b22c', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(30, '4ec0fb3003db462db39e738d59ec420b', '294820a41aad4ff0abb05e9f5886555c'),
(29, '4ec0fb3003db462db39e738d59ec420b', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(28, '4ec0fb3003db462db39e738d59ec420b', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(31, '4ec0fb3003db462db39e738d59ec420b', 'ec300baec9ef4c0696e10abca991ac64'),
(33, '56c7e1af1920466ba61060f1bc00493f', '294820a41aad4ff0abb05e9f5886555c'),
(32, '56c7e1af1920466ba61060f1bc00493f', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(34, '56c7e1af1920466ba61060f1bc00493f', '84c5e41a9e4348548886b797643f91f8'),
(45, '625895bf249b4b5b9b314c51fab8acdd', '98ca610eafbc4827b95e754c9c0a6b23'),
(46, '625895bf249b4b5b9b314c51fab8acdd', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(44, '625895bf249b4b5b9b314c51fab8acdd', 'ec300baec9ef4c0696e10abca991ac64'),
(52, '6689306c24eb4df9af20787cf9e48d14', '294820a41aad4ff0abb05e9f5886555c'),
(53, '6689306c24eb4df9af20787cf9e48d14', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(48, '73911f79aaa34a3ab96458cd94e9e336', '98ca610eafbc4827b95e754c9c0a6b23'),
(47, '73911f79aaa34a3ab96458cd94e9e336', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(21, '73cbfb5de11644418438ed72269b3b47', '294820a41aad4ff0abb05e9f5886555c'),
(20, '73cbfb5de11644418438ed72269b3b47', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(22, '73cbfb5de11644418438ed72269b3b47', '98ca610eafbc4827b95e754c9c0a6b23'),
(51, '7b0c19fb3eb04e439c985fe4b955fb2d', '98ca610eafbc4827b95e754c9c0a6b23'),
(49, '7b0c19fb3eb04e439c985fe4b955fb2d', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(50, '7b0c19fb3eb04e439c985fe4b955fb2d', 'ec300baec9ef4c0696e10abca991ac64'),
(27, '84995fd032554d9bb33575bf36c0fd54', '294820a41aad4ff0abb05e9f5886555c'),
(90, '8d228af906964b9fabe8c8a831709365', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(91, '8d228af906964b9fabe8c8a831709365', '84c5e41a9e4348548886b797643f91f8'),
(92, '8d228af906964b9fabe8c8a831709365', '98ca610eafbc4827b95e754c9c0a6b23'),
(89, '8d228af906964b9fabe8c8a831709365', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(35, 'a2ca6d38eebe4329b17dfee90783517e', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(1, 'a82d0f2b75e1406291142006f5200e36', '84c5e41a9e4348548886b797643f91f8'),
(2, 'a82d0f2b75e1406291142006f5200e36', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(54, 'aa0c0928712d4046a70b7a1ac41dd7ff', '294820a41aad4ff0abb05e9f5886555c'),
(55, 'aa0c0928712d4046a70b7a1ac41dd7ff', '84c5e41a9e4348548886b797643f91f8'),
(56, 'aa0c0928712d4046a70b7a1ac41dd7ff', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(12, 'ae0f8c704e78444c8c824a5375dfd7cc', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(18, 'bcd3d2c73fc64708ab496ddb028c0766', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(19, 'bcd3d2c73fc64708ab496ddb028c0766', '84c5e41a9e4348548886b797643f91f8'),
(75, 'c1fe77873dc54a0eb621261e204661be', '84c5e41a9e4348548886b797643f91f8'),
(65, 'c3c75aa1b9964c7cb5cf3d933812039f', '294820a41aad4ff0abb05e9f5886555c'),
(64, 'c3c75aa1b9964c7cb5cf3d933812039f', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(66, 'c3c75aa1b9964c7cb5cf3d933812039f', '84c5e41a9e4348548886b797643f91f8'),
(67, 'c3c75aa1b9964c7cb5cf3d933812039f', '98ca610eafbc4827b95e754c9c0a6b23'),
(61, 'c6a8683ff138415986d60c1d01174ad2', '294820a41aad4ff0abb05e9f5886555c'),
(60, 'c6a8683ff138415986d60c1d01174ad2', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(62, 'c6a8683ff138415986d60c1d01174ad2', '84c5e41a9e4348548886b797643f91f8'),
(63, 'c6a8683ff138415986d60c1d01174ad2', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(42, 'cfb548d866834d40bc6a64e0a73cacbb', '84c5e41a9e4348548886b797643f91f8'),
(40, 'cfb548d866834d40bc6a64e0a73cacbb', '98ca610eafbc4827b95e754c9c0a6b23'),
(43, 'cfb548d866834d40bc6a64e0a73cacbb', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(41, 'cfb548d866834d40bc6a64e0a73cacbb', 'ec300baec9ef4c0696e10abca991ac64'),
(58, 'd2450228368045b898eb76da079f5cea', '294820a41aad4ff0abb05e9f5886555c'),
(57, 'd2450228368045b898eb76da079f5cea', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(59, 'd2450228368045b898eb76da079f5cea', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(6, 'db68fcec129a4216ac49fdc551d6cc2c', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(7, 'db68fcec129a4216ac49fdc551d6cc2c', '84c5e41a9e4348548886b797643f91f8'),
(8, 'db68fcec129a4216ac49fdc551d6cc2c', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(70, 'ddbe701fc5a846dcbc68a78743f8482f', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(72, 'ddbe701fc5a846dcbc68a78743f8482f', '84c5e41a9e4348548886b797643f91f8'),
(71, 'ddbe701fc5a846dcbc68a78743f8482f', 'ec300baec9ef4c0696e10abca991ac64'),
(25, 'e7e5be3c0f6f4bdf88aa8c1af858c183', '294820a41aad4ff0abb05e9f5886555c'),
(24, 'e7e5be3c0f6f4bdf88aa8c1af858c183', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(26, 'e7e5be3c0f6f4bdf88aa8c1af858c183', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(23, 'ec5a8a104cde4a0aa1e17be769ff1bff', 'ec300baec9ef4c0696e10abca991ac64'),
(69, 'f5529b2906f746c3b3f9d53ba9a3a310', '294820a41aad4ff0abb05e9f5886555c'),
(68, 'f5529b2906f746c3b3f9d53ba9a3a310', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(93, 'f6e942a4eac3487597d39080ba9f694f', '294820a41aad4ff0abb05e9f5886555c'),
(96, 'f6e942a4eac3487597d39080ba9f694f', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
(97, 'f6e942a4eac3487597d39080ba9f694f', '84c5e41a9e4348548886b797643f91f8'),
(95, 'f6e942a4eac3487597d39080ba9f694f', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
(94, 'f6e942a4eac3487597d39080ba9f694f', 'ec300baec9ef4c0696e10abca991ac64');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla communities_communitysociallink
--

CREATE TABLE communities_communitysociallink (
  id bigint(20) NOT NULL,
  platform varchar(20) NOT NULL,
  url varchar(200) NOT NULL,
  username varchar(100) NOT NULL,
  is_active tinyint(1) NOT NULL,
  community_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla communities_community_moderators
--

CREATE TABLE communities_community_moderators (
  id bigint(20) NOT NULL,
  community_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla cultural_event_categories
--

CREATE TABLE cultural_event_categories (
  id int(11) NOT NULL,
  name varchar(100) NOT NULL,
  slug varchar(100) NOT NULL,
  icon varchar(50) NOT NULL DEFAULT 'CalendarDays',
  color_class varchar(100) NOT NULL DEFAULT 'bg-purple-500/20 text-purple-400 border-purple-400/30',
  description text DEFAULT NULL,
  is_active tinyint(1) DEFAULT 1,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla cultural_event_categories
--

INSERT INTO cultural_event_categories (id, name, slug, icon, color_class, description, is_active, created_at, updated_at) VALUES
(1, 'Música', 'musica', 'Music', 'bg-blue-500/20 text-blue-400 border-blue-400/30', 'Conciertos, festivales, recitales y eventos musicales', 1, '2026-01-20 19:11:30', '2026-01-20 19:11:30'),
(2, 'Arte', 'arte', 'Palette', 'bg-purple-500/20 text-purple-400 border-purple-400/30', 'Exposiciones, galerías, muestras artísticas', 1, '2026-01-20 19:11:30', '2026-01-20 19:11:30'),
(3, 'Teatro', 'teatro', 'Theater', 'bg-red-500/20 text-red-400 border-red-400/30', 'Obras teatrales, performances, monólogos', 1, '2026-01-20 19:11:30', '2026-01-20 19:11:30'),
(4, 'Educación', 'educacion', 'Camera', 'bg-green-500/20 text-green-400 border-green-400/30', 'Talleres, cursos, conferencias educativas', 1, '2026-01-20 19:11:30', '2026-01-20 19:11:30'),
(5, 'Danza', 'danza', 'Users', 'bg-pink-500/20 text-pink-400 border-pink-400/30', 'Espectáculos de danza, clases, competencias', 1, '2026-01-20 19:11:30', '2026-01-20 19:11:30'),
(6, 'Literatura', 'literatura', 'CalendarDays', 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30', 'Presentaciones de libros, lecturas, clubes literarios', 1, '2026-01-20 19:11:30', '2026-01-20 19:11:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla cultural_event_tags
--

CREATE TABLE cultural_event_tags (
  id int(11) NOT NULL,
  name varchar(100) NOT NULL,
  slug varchar(100) NOT NULL,
  usage_count int(11) DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla cultural_event_tags
--

INSERT INTO cultural_event_tags (id, name, slug, usage_count, created_at) VALUES
(1, 'festival', 'festival', 0, '2026-01-20 19:11:30'),
(2, 'música en vivo', 'musica-en-vivo', 0, '2026-01-20 19:11:30'),
(3, 'arte contemporáneo', 'arte-contemporaneo', 0, '2026-01-20 19:11:30'),
(4, 'teatro', 'teatro', 0, '2026-01-20 19:11:30'),
(5, 'taller', 'taller', 0, '2026-01-20 19:11:30'),
(6, 'educativo', 'educativo', 0, '2026-01-20 19:11:30'),
(7, 'familia', 'familia', 0, '2026-01-20 19:11:30'),
(8, 'gratis', 'gratis', 0, '2026-01-20 19:11:30'),
(9, 'internacional', 'internacional', 0, '2026-01-20 19:11:30'),
(10, 'local', 'local', 0, '2026-01-20 19:11:30'),
(11, 'profesional', 'profesional', 0, '2026-01-20 19:11:30'),
(12, 'principiantes', 'principiantes', 0, '2026-01-20 19:11:30'),
(13, 'certificado', 'certificado', 0, '2026-01-20 19:11:30'),
(14, 'masterclass', 'masterclass', 0, '2026-01-20 19:11:30'),
(15, 'competencia', 'competencia', 0, '2026-01-20 19:11:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla django_admin_log
--

CREATE TABLE django_admin_log (
  id int(11) NOT NULL,
  action_time datetime(6) NOT NULL,
  object_id longtext DEFAULT NULL,
  object_repr varchar(200) NOT NULL,
  action_flag smallint(5) UNSIGNED NOT NULL CHECK (action_flag >= 0),
  change_message longtext NOT NULL,
  content_type_id int(11) DEFAULT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla django_admin_log
--

INSERT INTO django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) VALUES
(1, '2025-12-15 17:06:03.066568', '8a926e24-9537-42e1-8f4d-2d7515e90972', 'Fundacion Habilidosos (Activo)', 2, '[{\"changed\": {\"fields\": [\"T\\u00edtulo del Anuncio\", \"Nombre del Anunciante\", \"Email del Anunciante\", \"Logo del Anunciante\", \"Tipo de Anuncio\", \"Imagen\", \"Video\", \"URL de Destino\"]}}]', 33, '294820a41aad4ff0abb05e9f5886555c'),
(2, '2025-12-15 17:09:36.499746', '8a926e24-9537-42e1-8f4d-2d7515e90972', 'Fundacion Habilidosos (Activo)', 2, '[{\"changed\": {\"fields\": [\"Tipo de Anuncio\"]}}]', 33, '294820a41aad4ff0abb05e9f5886555c'),
(3, '2025-12-15 17:12:16.228407', '8a926e24-9537-42e1-8f4d-2d7515e90972', 'Fundacion Habilidosos (Activo)', 2, '[{\"changed\": {\"fields\": [\"Logo del Anunciante\"]}}]', 33, '294820a41aad4ff0abb05e9f5886555c'),
(4, '2025-12-16 14:49:25.441392', 'f3964c78-9773-4cd5-844f-6a586803ba97', 'Comunidad Educativa (Borrador)', 1, '[{\"added\": {}}]', 33, '294820a41aad4ff0abb05e9f5886555c'),
(5, '2025-12-20 18:42:50.750713', 'bbbfda5d-3356-4b72-951e-a136d2ee1fa1', 'Camilo Gomez - Otro', 2, '[{\"changed\": {\"fields\": [\"Usuario\", \"Nombre completo\", \"Edad\", \"Deporte\", \"Posici\\u00f3n/Especialidad\", \"Equipo/Club\", \"Descripci\\u00f3n/Historia\", \"\\u00bfPara qu\\u00e9 necesitas el apoyo?\"]}}, {\"added\": {\"name\": \"Medio del Deportista\", \"object\": \"Camilo Gomez - image\"}}]', 65, '294820a41aad4ff0abb05e9f5886555c'),
(6, '2026-01-16 13:04:30.202246', '1', 'Configuraciones del Sitio', 2, '[{\"changed\": {\"fields\": [\"Mostrar bot\\u00f3n \'Registrarte\'\", \"Formulario Reality Habilidosos Activado\"]}}]', 77, '294820a41aad4ff0abb05e9f5886555c'),
(7, '2026-01-16 14:33:29.489645', '1', 'Configuraciones del Sitio', 2, '[{\"changed\": {\"fields\": [\"Mostrar bot\\u00f3n \'Registrarte\'\", \"Formulario Reality Habilidosos Activado\"]}}]', 77, '294820a41aad4ff0abb05e9f5886555c'),
(8, '2026-01-16 14:49:37.357040', '1', 'Configuraciones del Sitio', 2, '[]', 77, '294820a41aad4ff0abb05e9f5886555c'),
(9, '2026-01-16 15:00:37.836410', '1', 'Configuraciones del Sitio', 2, '[]', 77, '294820a41aad4ff0abb05e9f5886555c'),
(10, '2026-01-16 15:02:29.541491', '1', 'Configuraciones del Sitio', 2, '[]', 77, '294820a41aad4ff0abb05e9f5886555c'),
(11, '2026-01-16 15:10:14.048231', '1', 'Configuraciones del Sitio', 2, '[]', 77, '294820a41aad4ff0abb05e9f5886555c'),
(12, '2026-01-16 15:11:24.815724', '1', 'Configuraciones del Sitio', 2, '[]', 77, '294820a41aad4ff0abb05e9f5886555c'),
(13, '2026-01-16 15:14:54.918549', '1', 'Configuraciones del Sitio', 2, '[]', 77, '294820a41aad4ff0abb05e9f5886555c');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla django_content_type
--

CREATE TABLE django_content_type (
  id int(11) NOT NULL,
  app_label varchar(100) NOT NULL,
  model varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla django_content_type
--

INSERT INTO django_content_type (id, app_label, model) VALUES
(1, 'admin', 'logentry'),
(34, 'advertising', 'adclick'),
(41, 'advertising', 'adimpression'),
(33, 'advertising', 'advertisement'),
(42, 'advertising', 'advideoview'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(49, 'classifieds', 'classifiedcontact'),
(44, 'classifieds', 'classifiedlike'),
(46, 'classifieds', 'classifiedreport'),
(48, 'classifieds', 'classifiedview'),
(47, 'classifieds', 'freelancerclassified'),
(51, 'classifieds', 'productclassified'),
(50, 'classifieds', 'serviceclassified'),
(45, 'classifieds', 'servicereview'),
(24, 'communities', 'community'),
(43, 'communities', 'communitycategory'),
(28, 'communities', 'communitymembership'),
(25, 'communities', 'communitypost'),
(26, 'communities', 'communitypostcomment'),
(27, 'communities', 'communitysociallink'),
(4, 'contenttypes', 'contenttype'),
(66, 'donations', 'athletemedia'),
(65, 'donations', 'athleteprofile'),
(67, 'donations', 'donation'),
(64, 'donations', 'sportcategory'),
(68, 'enterprises', 'enterprise'),
(69, 'enterprises', 'enterprisefollow'),
(38, 'finance', 'platformrevenue'),
(37, 'finance', 'subscription'),
(36, 'finance', 'transaction'),
(35, 'finance', 'userwallet'),
(58, 'learning', 'logro'),
(57, 'learning', 'progresousuario'),
(53, 'learning', 'seccion'),
(54, 'learning', 'tema'),
(56, 'learning', 'temacontenido'),
(55, 'learning', 'temapuntoclave'),
(52, 'learning', 'usuariologro'),
(32, 'media_storage', 'mediaalbum'),
(31, 'media_storage', 'mediafile'),
(20, 'messaging', 'chatinvitation'),
(18, 'messaging', 'chatparticipant'),
(19, 'messaging', 'chatroom'),
(21, 'messaging', 'message'),
(22, 'messaging', 'messagereaction'),
(23, 'messaging', 'messageread'),
(39, 'notifications', 'notification'),
(76, 'payments', 'advertisingpayment'),
(75, 'payments', 'donationtransaction'),
(74, 'payments', 'enterpriseclassifiedpayment'),
(70, 'payments', 'paymentaccount'),
(71, 'payments', 'platformsettings'),
(72, 'payments', 'pricingplan'),
(73, 'payments', 'transaction'),
(11, 'posts', 'comment'),
(17, 'posts', 'commentlike'),
(10, 'posts', 'post'),
(12, 'posts', 'postbookmark'),
(13, 'posts', 'postreaction'),
(14, 'posts', 'postreport'),
(15, 'posts', 'postshare'),
(16, 'posts', 'postview'),
(40, 'reality', 'participante'),
(59, 'reality', 'participante2026'),
(29, 'reels', 'reel'),
(30, 'reels', 'reelcomment'),
(5, 'sessions', 'session'),
(77, 'site_settings', 'sitesettings'),
(60, 'stories', 'story'),
(63, 'stories', 'storyreaction'),
(62, 'stories', 'storyreply'),
(61, 'stories', 'storyview'),
(7, 'users', 'follow'),
(8, 'users', 'friendrequest'),
(9, 'users', 'friendship'),
(6, 'users', 'user');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla django_migrations
--

CREATE TABLE django_migrations (
  id bigint(20) NOT NULL,
  app varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  applied datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla django_migrations
--

INSERT INTO django_migrations (id, app, name, applied) VALUES
(1, 'contenttypes', '0001_initial', '2025-12-02 04:52:58.864157'),
(2, 'contenttypes', '0002_remove_content_type_name', '2025-12-02 04:52:58.942342'),
(3, 'auth', '0001_initial', '2025-12-02 04:52:59.240468'),
(4, 'auth', '0002_alter_permission_name_max_length', '2025-12-02 04:52:59.311963'),
(5, 'auth', '0003_alter_user_email_max_length', '2025-12-02 04:52:59.318366'),
(6, 'auth', '0004_alter_user_username_opts', '2025-12-02 04:52:59.327388'),
(7, 'auth', '0005_alter_user_last_login_null', '2025-12-02 04:52:59.333293'),
(8, 'auth', '0006_require_contenttypes_0002', '2025-12-02 04:52:59.337179'),
(9, 'auth', '0007_alter_validators_add_error_messages', '2025-12-02 04:52:59.345619'),
(10, 'auth', '0008_alter_user_username_max_length', '2025-12-02 04:52:59.351850'),
(11, 'auth', '0009_alter_user_last_name_max_length', '2025-12-02 04:52:59.358483'),
(12, 'auth', '0010_alter_group_name_max_length', '2025-12-02 04:52:59.376431'),
(13, 'auth', '0011_update_proxy_permissions', '2025-12-02 04:52:59.391896'),
(14, 'auth', '0012_alter_user_first_name_max_length', '2025-12-02 04:52:59.397717'),
(15, 'users', '0001_initial', '2025-12-02 04:53:00.412964'),
(16, 'admin', '0001_initial', '2025-12-02 04:53:00.571685'),
(17, 'admin', '0002_logentry_remove_auto_add', '2025-12-02 04:53:00.582807'),
(18, 'admin', '0003_logentry_add_action_flag_choices', '2025-12-02 04:53:00.595600'),
(19, 'advertising', '0001_initial', '2025-12-02 04:53:00.798737'),
(20, 'communities', '0001_initial', '2025-12-02 04:53:01.906860'),
(21, 'communities', '0002_communitypost_image_communitypost_podcast_and_more', '2025-12-02 04:53:02.092776'),
(22, 'finance', '0001_initial', '2025-12-02 04:53:02.695537'),
(23, 'messaging', '0001_initial', '2025-12-02 04:53:04.213162'),
(24, 'notifications', '0001_initial', '2025-12-02 04:53:04.407696'),
(25, 'notifications', '0002_notification_friend_request_id', '2025-12-02 04:53:04.463538'),
(26, 'posts', '0001_initial', '2025-12-02 04:53:06.695603'),
(27, 'posts', '0003_add_short_id', '2025-12-02 04:53:06.905484'),
(28, 'posts', '0004_alter_post_content_alter_post_short_id', '2025-12-02 04:53:06.959614'),
(29, 'reels', '0001_initial', '2025-12-02 04:53:07.530735'),
(30, 'sessions', '0001_initial', '2025-12-02 04:53:07.596038'),
(31, 'advertising', '0002_adimpression_advideoview_alter_advertisement_options_and_more', '2025-12-02 20:48:56.083074'),
(32, 'communities', '0003_add_categories_subcommunities', '2025-12-03 12:39:30.602334'),
(33, 'communities', '0004_allow_blank_content', '2025-12-03 15:16:28.615430'),
(34, 'classifieds', '0001_initial', '2025-12-03 18:53:23.337744'),
(35, 'learning', '0001_initial', '2025-12-13 03:57:36.856488'),
(36, 'learning', '0002_tema_imagen_tema_video_alter_tema_imagen_url_and_more', '2025-12-13 04:03:16.122487'),
(37, 'media_storage', '0001_initial', '2025-12-13 05:51:41.309787'),
(38, 'stories', '0001_initial', '2025-12-17 19:31:15.328386'),
(39, 'donations', '0001_initial', '2025-12-20 14:39:10.404609'),
(40, 'users', '0002_user_account_type_user_company_name_user_industry_and_more', '2025-12-20 20:54:23.734225'),
(41, 'enterprises', '0001_initial', '2025-12-20 21:11:33.886440'),
(42, 'payments', '0001_initial', '2025-12-21 00:07:36.198255'),
(43, 'site_settings', '0001_initial', '2026-01-16 12:40:28.893529'),
(44, 'site_settings', '0002_add_reality_form_enabled', '2026-01-16 12:40:28.946331'),
(45, 'reels', '0002_reelcomment_likes', '2026-01-19 10:45:46.462658');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla django_session
--

CREATE TABLE django_session (
  session_key varchar(40) NOT NULL,
  session_data longtext NOT NULL,
  expire_date datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla django_session
--

INSERT INTO django_session (session_key, session_data, expire_date) VALUES
('4m74mfq105ovrdevlocs572ij9gpdr3p', '.eJxVjTsOwjAQBe_iGltevI5tSnrOEK29XhJAiZRPhbg7iZQC6jcz761aWpeuXec6tT2rizonjGdLqIGINYpYTTlb7WsSH2PjvS_q9KtlKs867C4_aLiPpozDMvXZ7Ig51tncRq6v68H-BTqau80O4gNDEGhiDYRiAXB7FgAn4pyFJjAWdt5GdEUIEBKWrV-STZxEfb7jKUEK:1vgmsp:v1ZDFD2Jxxcn1vwn5gnnIa_K6V47W6a0kviDjetEAps', '2026-01-30 11:41:11.155442'),
('uxnoa0zsdwowc1ccnsuu41hpqlsl1ose', '.eJxVjEsOwiAQQO_CWghThgJduvcMzcAwtmrapJ-V8e6mSRe6fp-36mnfhn5f69KPrDrVJIyNJdRAxBpFrKacrfY1iY-x9d4XdfnNMpVnnY6WHzTdZ1PmaVvGbA7FnHQ1t5nr63q6f4OB1kF1KogPDEGgjTUQigXAnK0AOBHnLLSBsbDzNqIrQoCQsGQqJdnESdTnC-MpQQo:1vQXYo:pDDyDwzIj3wMOOHDtxD7haWmxM2rhJO9Nv6i64e0uUw', '2025-12-16 21:05:22.911216'),
('zsgzj8zicohzukm6gz7nljwd7fujzvpd', '.eJxVjTsOwjAQBe_iGltevI5tSnrOEK29XhJAiZRPhbg7iZQC6jcz761aWpeuXec6tT2rizonjGdLqIGINYpYTTlb7WsSH2PjvS_q9KtlKs867C4_aLiPpozDMvXZ7Ig51tncRq6v68H-BTqau80O4gNDEGhiDYRiAXB7FgAn4pyFJjAWdt5GdEUIEBKWrV-STZxEfb7jKUEK:1vVcGM:D9V65JUXl1N37flTVgUQKodCvR2Cqgiz-mVqZ058yEA', '2025-12-30 16:07:18.264047');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla donations
--

CREATE TABLE donations (
  id char(32) NOT NULL,
  donor_name varchar(200) NOT NULL,
  donor_email varchar(254) NOT NULL,
  is_anonymous tinyint(1) NOT NULL,
  amount decimal(12,2) NOT NULL,
  payment_method varchar(20) NOT NULL,
  transaction_id varchar(200) NOT NULL,
  status varchar(20) NOT NULL,
  message longtext NOT NULL,
  created_at datetime(6) NOT NULL,
  completed_at datetime(6) DEFAULT NULL,
  athlete_id char(32) NOT NULL,
  donor_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla donation_athlete_media
--

CREATE TABLE donation_athlete_media (
  id char(32) NOT NULL,
  media_type varchar(10) NOT NULL,
  file varchar(100) NOT NULL,
  thumbnail varchar(100) DEFAULT NULL,
  title varchar(200) NOT NULL,
  description longtext NOT NULL,
  `order` int(10) UNSIGNED NOT NULL CHECK (`order` >= 0),
  is_cover tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  athlete_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla donation_athlete_media
--

INSERT INTO donation_athlete_media (id, media_type, file, thumbnail, title, description, `order`, is_cover, created_at, athlete_id) VALUES
('f210828245304ef795007c881ec45749', 'image', 'donations/athletes/2025/12/aeed6687b1844fcda306151b4e305bc2.jpg', 'donations/thumbnails/2025/12/4e9d31195bccfad4ef0d44e232488f71.jpg', 'Financiamiento estartap de tecnologica', 'Startup de Ingenieria de software.\r\n\r\nDesarollo de aplicaciones Web, Android, Ios\r\nProducccion y escalabilidad\r\nPentesting', 0, 0, '2025-12-20 18:42:50.728238', 'bbbfda5d33564b72951ea136d2ee1fa1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla donation_athlete_profiles
--

CREATE TABLE donation_athlete_profiles (
  id char(32) NOT NULL,
  full_name varchar(200) NOT NULL,
  age int(10) UNSIGNED NOT NULL CHECK (age >= 0),
  height varchar(20) NOT NULL,
  weight varchar(20) NOT NULL,
  city varchar(100) NOT NULL,
  country varchar(100) NOT NULL,
  position varchar(100) NOT NULL,
  team varchar(200) NOT NULL,
  experience_years int(10) UNSIGNED NOT NULL CHECK (experience_years >= 0),
  achievements longtext NOT NULL,
  description longtext NOT NULL,
  goal_description longtext NOT NULL,
  goal_amount decimal(12,2) NOT NULL,
  raised_amount decimal(12,2) NOT NULL,
  donors_count int(10) UNSIGNED NOT NULL CHECK (donors_count >= 0),
  status varchar(20) NOT NULL,
  is_verified tinyint(1) NOT NULL,
  is_featured tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  approved_at datetime(6) DEFAULT NULL,
  sport_id char(32) DEFAULT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla donation_athlete_profiles
--

INSERT INTO donation_athlete_profiles (id, full_name, age, height, weight, city, country, position, team, experience_years, achievements, description, goal_description, goal_amount, raised_amount, donors_count, status, is_verified, is_featured, created_at, updated_at, approved_at, sport_id, user_id) VALUES
('205c50a7a92f454fa66f752c5a21dfc3', 'Valentina Rodríguez', 16, '1.60m', '48kg', 'Barranquilla', 'Colombia', 'Gimnasia Artística', 'Selección Atlántico', 10, 'Medalla de oro Juegos Nacionales, Campeona regional 3 años consecutivos', 'Gimnasta con múltiples medallas regionales. Mi meta es representar a Colombia en competencias sudamericanas.', 'Necesito apoyo para entrenamientos en el exterior y participar en competencias internacionales.', 6000000.00, 0.00, 0, 'approved', 1, 1, '2025-12-20 14:39:43.337103', '2025-12-20 14:39:43.337154', '2025-12-20 19:14:44.204386', '47c304df66ae4f88bdb7b30c35c08ce4', 'd5a3635abc5b476992e7a598c8b1ed30'),
('69753bf400754be1a2a5bb1a284c3c60', 'María Fernanda López', 15, '1.65m', '55kg', 'Medellín', 'Colombia', 'Estilo Libre', 'Club Natación Antioquia', 6, 'Campeona departamental 100m libre, Récord regional juvenil', 'Campeona departamental de natación. Busco apoyo para participar en competencias nacionales e internacionales.', 'Necesito financiar mi participación en el campeonato nacional y adquirir equipamiento de competencia.', 3000000.00, 0.00, 0, 'approved', 1, 0, '2025-12-20 14:39:43.298422', '2025-12-20 14:39:43.298503', '2025-12-20 19:14:44.204386', 'c83112e23133420e962c85a9006fdad5', '0bdd7932207842359e61b5ec951dcbb7'),
('8874b097a7d54197bd5d43708bf748cf', 'Andrés Felipe Gómez', 19, '1.85m', '80kg', 'Cali', 'Colombia', 'Alero', 'Piratas de Bogotá Sub-21', 7, 'MVP torneo universitario 2023, Selección Valle del Cauca', 'Jugador de baloncesto con proyección internacional. Necesito recursos para entrenamientos especializados y nutrición deportiva.', 'Busco financiar mi preparación para las pruebas de la liga profesional y mejorar mi rendimiento físico.', 4500000.00, 0.00, 0, 'approved', 0, 0, '2025-12-20 14:39:43.316776', '2025-12-20 14:39:43.316838', '2025-12-20 19:14:44.204386', '130ac8ce820447f993eec9a2b729152f', '798b2c1a516a46439ceb0a3e2598cc2b'),
('bbbfda5d33564b72951ea136d2ee1fa1', 'Camilo Gomez', 24, '1.78m', '72kg', 'Bogotá', 'Colombia', 'Desarollo de Software', 'Molo Corp', 8, 'Campeón torneo juvenil 2023, Goleador del año 2022', 'Lanzamiento de startup  tecnologica especializada en desarollo de software a la medida', 'Necesito recursos para establecer una oficina y espacio de produccion un ambiente controlado para  un  enfoque y creacion de productos', 5000000.00, 0.00, 0, 'approved', 1, 1, '2025-12-20 14:39:43.282709', '2025-12-20 18:42:50.608932', '2025-12-20 19:14:44.204386', 'b5b9ab6fbc13477fadc42400700315ca', 'bd22ec1c4dbe48f3a018e96b2cd61304');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla donation_sport_categories
--

CREATE TABLE donation_sport_categories (
  id char(32) NOT NULL,
  name varchar(100) NOT NULL,
  slug varchar(100) NOT NULL,
  icon varchar(50) NOT NULL,
  description longtext NOT NULL,
  is_active tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla donation_sport_categories
--

INSERT INTO donation_sport_categories (id, name, slug, icon, description, is_active, created_at) VALUES
('130ac8ce820447f993eec9a2b729152f', 'Baloncesto', 'baloncesto', '🏀', 'Basketball', 1, '2025-12-20 14:39:40.446863'),
('189e83f5b85e4c60a4255d581a2f505c', 'Patinaje', 'patinaje', '⛸️', 'Patinaje artístico y velocidad', 1, '2025-12-20 14:39:40.513424'),
('3d1a864cca4b401382e98ab6622adaa3', 'Escalada', 'escalada', '🧗', 'Escalada deportiva', 1, '2025-12-20 14:39:40.566605'),
('47c304df66ae4f88bdb7b30c35c08ce4', 'Gimnasia', 'gimnasia', '🤸', 'Gimnasia artística y rítmica', 1, '2025-12-20 14:39:40.467393'),
('5670505cf60745eb8f270a19f2399a50', 'Skateboarding', 'skateboarding', '🛹', 'Skateboarding', 1, '2025-12-20 14:39:40.559141'),
('57e5f3e63a3f4f5898edf7e734aea725', 'Voleibol', 'voleibol', '🏐', 'Voleibol de cancha y playa', 1, '2025-12-20 14:39:40.479450'),
('67864781dadb4acd9696828cb253c38f', 'Surf', 'surf', '🏄', 'Surf y deportes de tabla', 1, '2025-12-20 14:39:40.551323'),
('67ebf2f788fa4725a64b661978e33b69', 'Levantamiento de Pesas', 'levantamiento-de-pesas', '🏋️', 'Halterofilia', 1, '2025-12-20 14:39:40.523784'),
('8494aa1ac80041bf99741a75fb83f2ff', 'Golf', 'golf', '⛳', 'Golf', 1, '2025-12-20 14:39:40.544495'),
('8c949dc771544e6e840287dcb8b2e9fa', 'Fútbol', 'futbol', '⚽', 'El deporte rey', 1, '2025-12-20 14:39:40.436016'),
('97678ff10c4749efaac289f88929e2ef', 'Esgrima', 'esgrima', '🤺', 'Esgrima deportiva', 1, '2025-12-20 14:39:40.530288'),
('b35425d2ae17433495aecfba1af8d271', 'Atletismo', 'atletismo', '🏃', 'Carreras y saltos', 1, '2025-12-20 14:39:40.460955'),
('b5b9ab6fbc13477fadc42400700315ca', 'Otro', 'otro', '🏅', 'Otros deportes', 1, '2025-12-20 14:39:40.579916'),
('bae100a7f61e47c3b47a770b3718a6ac', 'Artes Marciales', 'artes-marciales', '🥋', 'Taekwondo, Judo, Karate', 1, '2025-12-20 14:39:40.505834'),
('c2ec1d488f6141368c195a0610e9e34a', 'Boxeo', 'boxeo', '🥊', 'Deportes de combate', 1, '2025-12-20 14:39:40.494740'),
('c83112e23133420e962c85a9006fdad5', 'Natación', 'natacion', '🏊', 'Deportes acuáticos', 1, '2025-12-20 14:39:40.454873'),
('cdb92f96db634895bf21857937ac7d8f', 'Ciclismo', 'ciclismo', '🚴', 'Ciclismo de ruta y montaña', 1, '2025-12-20 14:39:40.486700'),
('d5911e480c994fd188677288c1d14832', 'Tenis', 'tenis', '🎾', 'Tenis de campo', 1, '2025-12-20 14:39:40.473765'),
('e07d281062fc4bb9bcd8660ec23dca67', 'Béisbol', 'beisbol', '⚾', 'Béisbol y softbol', 1, '2025-12-20 14:39:40.538467');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla donation_transactions
--

CREATE TABLE donation_transactions (
  id char(32) NOT NULL,
  donor_name varchar(200) NOT NULL,
  donor_email varchar(254) NOT NULL,
  is_anonymous tinyint(1) NOT NULL,
  campaign_id varchar(50) NOT NULL,
  amount decimal(12,2) NOT NULL,
  currency varchar(3) NOT NULL,
  message longtext NOT NULL,
  status varchar(25) NOT NULL,
  platform_fee decimal(12,2) NOT NULL,
  athlete_receives decimal(12,2) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  athlete_id char(32) NOT NULL,
  donor_id char(32) DEFAULT NULL,
  transaction_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla enterprises
--

CREATE TABLE enterprises (
  id char(32) NOT NULL,
  name varchar(200) NOT NULL,
  username varchar(50) NOT NULL,
  tagline varchar(200) NOT NULL,
  description longtext NOT NULL,
  logo varchar(100) DEFAULT NULL,
  cover_image varchar(100) DEFAULT NULL,
  category varchar(50) NOT NULL,
  industry varchar(100) NOT NULL,
  location varchar(200) NOT NULL,
  website varchar(200) NOT NULL,
  email varchar(254) NOT NULL,
  phone varchar(20) NOT NULL,
  founded_year int(10) UNSIGNED DEFAULT NULL CHECK (founded_year >= 0),
  employees_count varchar(50) NOT NULL,
  social_links longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(social_links)),
  followers_count int(10) UNSIGNED NOT NULL CHECK (followers_count >= 0),
  posts_count int(10) UNSIGNED NOT NULL CHECK (posts_count >= 0),
  is_verified tinyint(1) NOT NULL,
  is_featured tinyint(1) NOT NULL,
  is_active tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  owner_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla enterprises
--

INSERT INTO enterprises (id, name, username, tagline, description, logo, cover_image, category, industry, location, website, email, phone, founded_year, employees_count, social_links, followers_count, posts_count, is_verified, is_featured, is_active, created_at, updated_at, owner_id) VALUES
('409242f1245e48388954e6dcaf3c9ad2', 'softmolo', 'softmolo', 'Si lo puedes imaginar se puede programar', 'ijsoijsis', '', '', 'tecnologia', 'Ingenieria de software', 'medellin', 'http://www.moloworld.com', 'camilogomezdeveloper@gmail.com', '3102678293', NULL, '1-10', '[]', 0, 0, 0, 0, 1, '2025-12-20 21:21:47.672578', '2025-12-20 21:21:47.674578', 'bd22ec1c4dbe48f3a018e96b2cd61304');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla enterprise_classified_payments
--

CREATE TABLE enterprise_classified_payments (
  id char(32) NOT NULL,
  classified_id varchar(50) NOT NULL,
  classified_type varchar(30) NOT NULL,
  status varchar(25) NOT NULL,
  starts_at datetime(6) DEFAULT NULL,
  expires_at datetime(6) DEFAULT NULL,
  classified_data longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(classified_data)),
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  enterprise_id char(32) NOT NULL,
  pricing_plan_id char(32) NOT NULL,
  transaction_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla enterprise_follows
--

CREATE TABLE enterprise_follows (
  id char(32) NOT NULL,
  created_at datetime(6) NOT NULL,
  enterprise_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla finance_platformrevenue
--

CREATE TABLE finance_platformrevenue (
  id char(32) NOT NULL,
  source varchar(50) NOT NULL,
  amount decimal(12,2) NOT NULL,
  description longtext NOT NULL,
  date date NOT NULL,
  created_at datetime(6) NOT NULL,
  related_transaction_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla finance_subscription
--

CREATE TABLE finance_subscription (
  id char(32) NOT NULL,
  plan_type varchar(20) NOT NULL,
  price decimal(10,2) NOT NULL,
  currency varchar(3) NOT NULL,
  status varchar(20) NOT NULL,
  is_recurring tinyint(1) NOT NULL,
  start_date datetime(6) NOT NULL,
  end_date datetime(6) NOT NULL,
  next_billing_date datetime(6) DEFAULT NULL,
  cancelled_at datetime(6) DEFAULT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla finance_transaction
--

CREATE TABLE finance_transaction (
  id char(32) NOT NULL,
  transaction_type varchar(30) NOT NULL,
  amount decimal(12,2) NOT NULL,
  currency varchar(3) NOT NULL,
  platform_fee decimal(12,2) NOT NULL,
  net_amount decimal(12,2) NOT NULL,
  status varchar(20) NOT NULL,
  description longtext NOT NULL,
  reference_id varchar(200) NOT NULL,
  payment_method varchar(50) NOT NULL,
  payment_gateway varchar(50) NOT NULL,
  created_at datetime(6) NOT NULL,
  completed_at datetime(6) DEFAULT NULL,
  recipient_id char(32) DEFAULT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla finance_userwallet
--

CREATE TABLE finance_userwallet (
  id char(32) NOT NULL,
  balance decimal(12,2) NOT NULL,
  pending_balance decimal(12,2) NOT NULL,
  total_earned decimal(12,2) NOT NULL,
  total_withdrawn decimal(12,2) NOT NULL,
  bank_name varchar(100) NOT NULL,
  account_number varchar(50) NOT NULL,
  account_type varchar(20) NOT NULL,
  account_holder_name varchar(200) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla friendships
--

CREATE TABLE friendships (
  id char(32) NOT NULL,
  created_at datetime(6) NOT NULL,
  user1_id char(32) NOT NULL,
  user2_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla friendships
--

INSERT INTO friendships (id, created_at, user1_id, user2_id) VALUES
('0a53ac55372942119fb9a23d677c5d3e', '2025-12-13 06:19:01.998472', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'e3702132b6cb45d2a390e6b1b5f254ab'),
('0fcbafa245d54997b11300b2a985c64e', '2025-12-20 21:19:26.782260', '4cccc11a7e634423bf92808272ad4b52', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('10670dd20ca642789b64e50aa6b599ef', '2025-12-02 05:00:59.809478', '98ca610eafbc4827b95e754c9c0a6b23', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
('26eb2c16a3704f7ea41c649dc92fb0dd', '2025-12-02 05:00:59.859108', '294820a41aad4ff0abb05e9f5886555c', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
('377f6549972442c1a7d0c6f81ed7168c', '2025-12-02 05:00:59.800313', '294820a41aad4ff0abb05e9f5886555c', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('3a39cbeea29a4737ba0c854837fd6e8a', '2025-12-02 05:01:45.004615', '4265f3cd6c7a493b9e35efbacd3b3a6b', '84c5e41a9e4348548886b797643f91f8'),
('3e59bd8c59194746ac63d85fea6fe020', '2025-12-02 05:00:59.874975', '294820a41aad4ff0abb05e9f5886555c', '84c5e41a9e4348548886b797643f91f8'),
('4343c4a073344db8b0e388cbbd15cfa8', '2025-12-13 05:14:37.758624', '4265f3cd6c7a493b9e35efbacd3b3a6b', '6f053d432986406289a54b930e90924f'),
('51f65645daf747dcb3f3c78775d6527d', '2025-12-02 05:00:59.849665', 'd355c06d9f2b4fefbd6e3a4dab17b284', 'ec300baec9ef4c0696e10abca991ac64'),
('537be098e7fe48f9b469ebe14f972244', '2025-12-02 05:01:45.022064', '294820a41aad4ff0abb05e9f5886555c', '98ca610eafbc4827b95e754c9c0a6b23'),
('5dd2d38675fb497fa27b7921c21465ac', '2025-12-02 05:01:45.026753', '294820a41aad4ff0abb05e9f5886555c', 'ec300baec9ef4c0696e10abca991ac64'),
('64f841c54a4e4715bfbebe47f5ffa18b', '2025-12-02 05:00:59.792147', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
('8999cb690d54427a8db43842629cb627', '2025-12-13 05:26:21.481097', '6f053d432986406289a54b930e90924f', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('8dff5dbce4384c8c8af2d4663bdc64f5', '2025-12-02 05:00:59.824402', '84c5e41a9e4348548886b797643f91f8', '98ca610eafbc4827b95e754c9c0a6b23'),
('987994d2cdb1427f833fdd3456054230', '2025-12-02 05:00:59.866644', '84c5e41a9e4348548886b797643f91f8', 'ec300baec9ef4c0696e10abca991ac64'),
('bcf563db923041a9992026b0f4010f09', '2025-12-02 05:01:44.976991', '4265f3cd6c7a493b9e35efbacd3b3a6b', '98ca610eafbc4827b95e754c9c0a6b23'),
('c27ee719029842e1abac2dbdc7e139bd', '2025-12-02 05:00:59.833886', '98ca610eafbc4827b95e754c9c0a6b23', 'ec300baec9ef4c0696e10abca991ac64'),
('c950a516db204a85865615a6f040e18b', '2025-12-02 05:00:59.843858', '84c5e41a9e4348548886b797643f91f8', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
('d2544584259e49d793d376bd8aad61cb', '2025-12-02 18:59:15.166966', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('d9af0903c23b4d1eb9e552ef922ca607', '2025-12-02 05:01:45.012408', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'ec300baec9ef4c0696e10abca991ac64'),
('eed845f09fae4852982c0040eb86f02e', '2025-12-15 10:41:50.474339', '6f053d432986406289a54b930e90924f', 'e3702132b6cb45d2a390e6b1b5f254ab');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla friend_requests
--

CREATE TABLE friend_requests (
  id char(32) NOT NULL,
  status varchar(10) NOT NULL,
  message longtext NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  receiver_id char(32) NOT NULL,
  sender_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla friend_requests
--

INSERT INTO friend_requests (id, status, message, created_at, updated_at, receiver_id, sender_id) VALUES
('0d4ee118b68e4703ba62498dc32e7941', 'pending', '', '2025-12-02 18:54:48.759815', '2025-12-02 18:54:48.759815', 'ec300baec9ef4c0696e10abca991ac64', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('135cfe6cc5d146e5ba2d0d628d0f4424', 'pending', '', '2025-12-16 17:41:51.298328', '2025-12-16 17:41:51.298328', 'd355c06d9f2b4fefbd6e3a4dab17b284', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('223357a6b6994299b42122f11fe6807d', 'accepted', '', '2025-12-02 21:37:40.505658', '2025-12-13 05:14:37.776661', '6f053d432986406289a54b930e90924f', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('3576ad1bf04d483cb6536c45b0e7975e', 'accepted', '', '2025-12-13 06:18:32.979545', '2025-12-15 10:41:50.490723', '6f053d432986406289a54b930e90924f', 'e3702132b6cb45d2a390e6b1b5f254ab'),
('3c02523c096d4fb09866f148e135112a', 'pending', '', '2025-12-15 10:41:43.190659', '2025-12-15 10:41:43.190659', '84c5e41a9e4348548886b797643f91f8', '6f053d432986406289a54b930e90924f'),
('4bd9fc9690f445258705091d4b100601', 'pending', '', '2025-12-02 18:54:06.419866', '2025-12-02 18:54:06.419866', '1225e5006c6942fbb872836ab222e4e1', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('5ff824127e09432db5697415365bcfcb', 'pending', '', '2025-12-02 18:54:44.296611', '2025-12-02 18:54:44.296611', '98ca610eafbc4827b95e754c9c0a6b23', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('8031d4f4ef0d4c72b4cd8abb7071b01e', 'pending', '', '2025-12-02 18:54:37.196926', '2025-12-02 18:54:37.196926', '294820a41aad4ff0abb05e9f5886555c', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('8639a1d829624e8c88630f7b8526a971', 'accepted', '', '2025-12-02 18:54:54.787015', '2025-12-02 18:59:15.185073', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('97bdbfd753884817b6728c049c5e6c3d', 'accepted', '', '2025-12-20 21:05:33.112821', '2025-12-20 21:19:26.794027', 'bd22ec1c4dbe48f3a018e96b2cd61304', '4cccc11a7e634423bf92808272ad4b52'),
('a978f4711d4c43398b781fe3bd859369', 'accepted', '', '2025-12-13 06:18:34.243224', '2025-12-13 06:19:02.005470', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'e3702132b6cb45d2a390e6b1b5f254ab'),
('aeca2712b8ca4849b2c825da709a0655', 'pending', '', '2025-12-13 06:14:48.921736', '2025-12-13 06:14:48.921736', '4912c5171c6d48d4bdbcfbd889a9143c', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('f59193753a074de9a8b11a9144d71aed', 'accepted', '', '2025-12-02 18:54:03.218238', '2025-12-13 05:26:21.488966', '6f053d432986406289a54b930e90924f', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('f7d8f97dae454f1084a804998be4ce13', 'pending', '', '2025-12-13 06:14:50.624426', '2025-12-13 06:14:50.624426', '6113e8aa7db5436cb894bcb84c4491e0', '4265f3cd6c7a493b9e35efbacd3b3a6b');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_evaluacion
--

CREATE TABLE learning_evaluacion (
  id char(36) NOT NULL DEFAULT uuid(),
  tema_id char(36) NOT NULL,
  pregunta text NOT NULL,
  opciones longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(opciones)),
  respuesta_correcta varchar(10) NOT NULL,
  puntos int(11) DEFAULT 10,
  orden int(11) DEFAULT 0,
  is_active tinyint(1) DEFAULT 1,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_logro
--

CREATE TABLE learning_logro (
  id char(36) NOT NULL DEFAULT uuid(),
  nombre varchar(100) NOT NULL,
  descripcion text DEFAULT NULL,
  icono varchar(50) DEFAULT 'Trophy',
  condicion varchar(100) NOT NULL,
  valor_requerido int(11) NOT NULL,
  is_active tinyint(1) DEFAULT 1,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_logros
--

CREATE TABLE learning_logros (
  id char(32) NOT NULL,
  slug varchar(100) NOT NULL,
  nombre varchar(100) NOT NULL,
  descripcion longtext NOT NULL,
  icono varchar(50) NOT NULL,
  color varchar(20) NOT NULL,
  puntos int(10) UNSIGNED NOT NULL CHECK (puntos >= 0),
  temas_requeridos int(10) UNSIGNED NOT NULL CHECK (temas_requeridos >= 0),
  is_active tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  seccion_requerida_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla learning_logros
--

INSERT INTO learning_logros (id, slug, nombre, descripcion, icono, color, puntos, temas_requeridos, is_active, created_at, seccion_requerida_id) VALUES
('480aa8ab5b204589ade95d6f6db8393d', 'primer-paso', 'Primer Paso', 'Completa tu primer tema de aprendizaje', '', '#00ff88', 10, 1, 1, '2025-12-13 03:57:58.508131', NULL),
('5814c621bc6c4db4a44cfbd1b251338c', 'experto', 'Experto', 'Completa 20 temas de aprendizaje', '', '#f59e0b', 100, 20, 1, '2025-12-13 03:57:58.522866', NULL),
('89e040eb02e140df81299cb76641ecc9', 'maestro-futbol', 'Maestro del Futbol', 'Completaste todas las secciones', 'Trophy', '#FFD700', 200, 0, 1, '2025-12-14 19:30:05.390681', NULL),
('ce9a03a82e2f470f8992bdd2ab58a577', 'maestro', 'Maestro del Fútbol', 'Completa todos los temas disponibles', '', '#FFD700', 500, 43, 1, '2025-12-13 03:57:58.527040', NULL),
('e5c10513deae4631a213e91eaee69eb7', 'primer-tema', 'Primer Paso', 'Completaste tu primer tema', 'Target', '#00ff88', 10, 1, 1, '2025-12-14 19:30:05.386244', NULL),
('eccfdd6ed8d941b18bdc8bfffa29afc7', 'aprendiz', 'Aprendiz', 'Completa 5 temas de aprendizaje', '', '#3b82f6', 25, 5, 1, '2025-12-13 03:57:58.513649', NULL),
('fcf1f33b89af4326a472825ac6b68971', 'estudiante', 'Estudiante Dedicado', 'Completa 10 temas de aprendizaje', '', '#8b5cf6', 50, 10, 1, '2025-12-13 03:57:58.518475', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_progresousuario
--

CREATE TABLE learning_progresousuario (
  id char(36) NOT NULL DEFAULT uuid(),
  usuario_id char(36) NOT NULL,
  tema_id char(36) NOT NULL,
  completado tinyint(1) DEFAULT 0,
  fecha_completado timestamp NULL DEFAULT NULL,
  tiempo_dedicado int(11) DEFAULT 0,
  tiempo_inicio_sesion timestamp NULL DEFAULT NULL,
  tiempo_fin_sesion timestamp NULL DEFAULT NULL,
  intentos_evaluacion int(11) DEFAULT 0,
  puntuacion_evaluacion decimal(5,2) DEFAULT 0.00,
  tiempo_total_tema int(11) DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Disparadores learning_progresousuario
--
DELIMITER $$
CREATE TRIGGER `update_learning_stats_insert` AFTER INSERT ON `learning_progresousuario` FOR EACH ROW BEGIN
    -- Actualizar tiempo total si se completa un tema
    IF NEW.completado = TRUE AND NEW.fecha_completado IS NOT NULL THEN
        UPDATE learning_progresousuario 
        SET tiempo_total_tema = COALESCE(tiempo_total_tema, 0) + COALESCE(tiempo_dedicado, 0)
        WHERE id = NEW.id;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_learning_stats_update` AFTER UPDATE ON `learning_progresousuario` FOR EACH ROW BEGIN
    -- Si se marca como completado, actualizar fecha
    IF NEW.completado = TRUE AND OLD.completado = FALSE THEN
        UPDATE learning_progresousuario 
        SET fecha_completado = CURRENT_TIMESTAMP
        WHERE id = NEW.id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_progreso_usuario
--

CREATE TABLE learning_progreso_usuario (
  id char(32) NOT NULL,
  estado varchar(20) NOT NULL,
  fecha_inicio datetime(6) DEFAULT NULL,
  fecha_completado datetime(6) DEFAULT NULL,
  tiempo_dedicado_minutos int(10) UNSIGNED NOT NULL CHECK (tiempo_dedicado_minutos >= 0),
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  tema_id char(32) NOT NULL,
  usuario_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla learning_progreso_usuario
--

INSERT INTO learning_progreso_usuario (id, estado, fecha_inicio, fecha_completado, tiempo_dedicado_minutos, created_at, updated_at, tema_id, usuario_id) VALUES
('1ef495cf3a6b4a3b8c4eab7989cb3472', 'completado', '2026-01-19 22:27:08.154604', '2026-01-19 22:27:08.154604', 0, '2026-01-19 22:27:08.164717', '2026-01-19 22:27:08.164717', '1f141ab0457c4ca19b338509d6707872', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('4cab235230374734827186d9af4a1041', 'completado', '2026-01-20 10:11:33.649416', '2026-01-20 10:11:33.649416', 0, '2026-01-20 10:11:33.649416', '2026-01-20 10:11:33.649416', '8259abfc1baa4637af6c2366a4a56cd5', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('539133e9424145899f64134dd8311e51', 'completado', '2026-01-19 22:23:48.664323', '2026-01-19 22:23:48.664323', 0, '2026-01-19 22:23:48.694742', '2026-01-19 22:23:48.694742', 'cb809e67717945e9938a96b96f64ec9c', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('875d304acac04d84acf4c45a43a4cef9', 'completado', '2026-01-19 22:26:58.013057', '2026-01-19 22:26:58.013057', 0, '2026-01-19 22:26:58.016112', '2026-01-19 22:26:58.016112', '76c63a5dbf6e4174a9ee82661ed30cd2', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('8b4ef6772bc14064beaab7c3b3b40d47', 'completado', '2026-01-19 22:37:48.385348', '2026-01-19 22:37:48.385348', 0, '2026-01-19 22:37:48.394421', '2026-01-19 22:37:48.394421', '65b5281d09974414a9e79d14627dde34', '4cccc11a7e634423bf92808272ad4b52'),
('a014ff6d543d4235af2741da92170b3e', 'completado', '2026-01-19 22:27:20.331093', '2026-01-19 22:27:20.331093', 0, '2026-01-19 22:27:20.337081', '2026-01-19 22:27:20.337081', '463b971df0274a6298f0b5813a4d6568', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('ade726e7e9564d0dbe7dde9b9cbec9d7', 'completado', '2026-01-20 10:11:26.831087', '2026-01-20 10:11:26.831087', 0, '2026-01-20 10:11:26.831087', '2026-01-20 10:11:26.831087', 'e46a02088a3e4ca9b499658392629fe2', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('c12d66172c064eb49a111ee9b8e0af24', 'completado', '2026-01-19 22:27:04.002577', '2026-01-19 22:27:04.002577', 0, '2026-01-19 22:27:04.014006', '2026-01-19 22:27:04.014006', '29b830e7c40540da83f6012578df75f2', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('dd3c60c40c8442f8a2b04bf165bb97d6', 'completado', '2026-01-19 22:26:49.944443', '2026-01-19 22:26:49.944443', 0, '2026-01-19 22:26:49.962230', '2026-01-19 22:26:49.962230', '65b5281d09974414a9e79d14627dde34', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('e023b945b1904c5482cfb992e2bb5820', 'completado', '2026-01-19 22:35:20.013010', '2026-01-19 22:35:20.023879', 0, '2026-01-19 22:35:20.053436', '2026-01-19 22:35:20.053489', 'ae4667efc86646898fde4987df7b6466', '4cccc11a7e634423bf92808272ad4b52'),
('e2d558f61c7a476792183a690d9e898b', 'completado', '2026-01-19 22:20:06.574222', '2026-01-19 22:20:06.574222', 0, '2026-01-19 22:20:06.598383', '2026-01-19 22:20:06.598383', '5150cd1f81cc44ab928e650e7ffa0579', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('fcbabee03ab74c3eb9f97ff7980c786c', 'completado', '2026-01-19 22:01:27.542489', '2026-01-19 22:01:27.542489', 0, '2026-01-19 22:01:27.578354', '2026-01-19 22:01:27.578354', '21b0ab3b65f84b5fa8076c7109815af1', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('fd357474c0594f0dbd0f441359414e0a', 'completado', '2026-01-19 22:27:13.997804', '2026-01-19 22:27:13.997804', 0, '2026-01-19 22:27:14.006557', '2026-01-19 22:27:14.006557', '4e94f11adfc14061bfbd3f0ed8ccc392', 'bd22ec1c4dbe48f3a018e96b2cd61304');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_seccion
--

CREATE TABLE learning_seccion (
  id char(36) NOT NULL DEFAULT uuid(),
  nombre varchar(200) NOT NULL,
  slug varchar(200) NOT NULL,
  descripcion text DEFAULT NULL,
  icono varchar(50) DEFAULT 'BookOpen',
  color varchar(7) DEFAULT '#00ff88',
  orden int(11) DEFAULT 0,
  is_active tinyint(1) DEFAULT 1,
  imagen varchar(500) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_secciones
--

CREATE TABLE learning_secciones (
  id char(32) NOT NULL,
  slug varchar(100) NOT NULL,
  nombre varchar(200) NOT NULL,
  descripcion longtext NOT NULL,
  icono varchar(50) NOT NULL,
  color varchar(20) NOT NULL,
  orden int(10) UNSIGNED NOT NULL CHECK (orden >= 0),
  imagen varchar(100) DEFAULT NULL,
  is_active tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla learning_secciones
--

INSERT INTO learning_secciones (id, slug, nombre, descripcion, icono, color, orden, imagen, is_active, created_at, updated_at) VALUES
('05c8a1cd764846838f952a2eddd74187', 'tecnicas-practicas', 'Tecnicas y Practicas', 'Aprende las tecnicas fundamentales del futbol.', 'Target', '#00ff88', 1, '', 1, '2025-12-13 03:57:58.466115', '2025-12-14 19:30:04.924688'),
('0d9a99624b844031ad04aebc13a03db8', 'educacion-idiomas', 'Educación de Idiomas', 'Programa de enseñanza de lenguas para futbolistas internacionales', 'Globe', '#f97316', 8, '', 1, '2025-12-13 03:57:58.497366', '2025-12-13 03:57:58.497377'),
('4625f5343f3b4ec692da623f261675ac', 'escuelas-formacion', 'Escuelas de Formación', 'Centros especializados para jóvenes futbolistas con entrenamiento estructurado', 'GraduationCap', '#3b82f6', 2, '', 1, '2025-12-13 03:57:58.472073', '2025-12-13 03:57:58.472086'),
('78f44b13ab5741ff975d7c73652afbcb', 'estructura-sede', 'Estructura de Sede Deportiva', 'Infraestructura física necesaria para operar un centro de formación', 'Building2', '#8b5cf6', 5, '', 1, '2025-12-13 03:57:58.484198', '2025-12-13 03:57:58.484207'),
('859832f1fb7a4f0994432e6d77898071', 'preparacion-fisica', 'Preparacion Fisica', 'Ejercicios para mejorar tu condicion fisica.', 'Dumbbell', '#ef4444', 4, '', 1, '2025-12-14 19:30:04.958592', '2025-12-14 19:30:04.958606'),
('91a0ee6a2fb8424bbaf61ffdd11acfa5', 'reglamentos-arbitros', 'Reglamentos de Árbitros', 'Normativas específicas que rigen la labor del cuerpo arbitral', 'UserCheck', '#ef4444', 4, '', 1, '2025-12-13 03:57:58.480615', '2025-12-13 03:57:58.480623'),
('97381afe2ac04b978254f25fba27eedb', 'conferencias-coaches', 'Conferencias para Coaches', 'Sesiones formativas para entrenadores y staff técnico', 'Mic', '#ec4899', 6, '', 1, '2025-12-13 03:57:58.488937', '2025-12-13 03:57:58.488952'),
('c0d98d24d0ae4f45baaf984ab8b64940', 'tactica-estrategia', 'Tactica y Estrategia', 'Sistemas de juego y estrategias.', 'Lightbulb', '#f59e0b', 3, '', 1, '2025-12-14 19:30:04.948691', '2025-12-14 19:30:04.948718'),
('dc3908f2c72547ada8be5ba1620fe93e', 'representacion-jugadores', 'Representación de Jugadores', 'Gestión de contratos, imagen y carrera de deportistas', 'Users', '#14b8a6', 7, '', 1, '2025-12-13 03:57:58.492775', '2025-12-13 03:57:58.492786'),
('e21c02235c324577929484a937e031dd', 'reglamentos-fifa', 'Reglamentos FIFA', 'Conoce las reglas oficiales del futbol.', 'BookOpen', '#3b82f6', 2, '', 1, '2025-12-13 03:57:58.476908', '2025-12-14 19:30:04.939843');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_tema
--

CREATE TABLE learning_tema (
  id char(36) NOT NULL DEFAULT uuid(),
  seccion_id char(36) NOT NULL,
  titulo varchar(200) NOT NULL,
  slug varchar(200) NOT NULL,
  descripcion text DEFAULT NULL,
  nivel enum('principiante','intermedio','avanzado') DEFAULT 'principiante',
  duracion_minutos int(11) DEFAULT 30,
  orden int(11) DEFAULT 0,
  is_active tinyint(1) DEFAULT 1,
  imagen varchar(500) DEFAULT NULL,
  video varchar(500) DEFAULT NULL,
  imagen_url varchar(500) DEFAULT NULL,
  video_url varchar(500) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_temacontenido
--

CREATE TABLE learning_temacontenido (
  id char(36) NOT NULL DEFAULT uuid(),
  tema_id char(36) NOT NULL,
  subtitulo varchar(200) NOT NULL,
  contenido text NOT NULL,
  orden int(11) DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_temapuntoclave
--

CREATE TABLE learning_temapuntoclave (
  id char(36) NOT NULL DEFAULT uuid(),
  tema_id char(36) NOT NULL,
  texto varchar(300) NOT NULL,
  orden int(11) DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_temas
--

CREATE TABLE learning_temas (
  id char(32) NOT NULL,
  slug varchar(100) NOT NULL,
  titulo varchar(200) NOT NULL,
  descripcion longtext NOT NULL,
  nivel varchar(20) NOT NULL,
  duracion_minutos int(10) UNSIGNED NOT NULL CHECK (duracion_minutos >= 0),
  imagen_url varchar(200) NOT NULL,
  video_url varchar(200) NOT NULL,
  orden int(10) UNSIGNED NOT NULL CHECK (orden >= 0),
  is_active tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  seccion_id char(32) NOT NULL,
  imagen varchar(100) DEFAULT NULL,
  video varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla learning_temas
--

INSERT INTO learning_temas (id, slug, titulo, descripcion, nivel, duracion_minutos, imagen_url, video_url, orden, is_active, created_at, updated_at, seccion_id, imagen, video) VALUES
('0b3fdc971afc4fc79b030187e7fbb0e2', 'resistencia-velocidad', 'Resistencia y Velocidad', 'Mejora tu capacidad aerobica y explosividad.', 'intermedio', 40, '', '', 2, 1, '2025-12-14 19:30:05.356771', '2025-12-14 19:30:05.356786', '859832f1fb7a4f0994432e6d77898071', '', ''),
('11850c9a59714aa2a668985174454af2', 'metodologia-ensenanza-infantil', 'Metodología de Enseñanza Infantil', 'Técnicas especializadas para enseñar fútbol a niños de 6-12 años', 'basico', 45, '', '', 3, 1, '2026-01-19 21:25:35.799674', '2026-01-19 21:25:35.799862', '4625f5343f3b4ec692da623f261675ac', '', ''),
('149d85df30384d25909dbde2d5a66522', 'pase-precision', 'El Pase y la Precision', 'Aprende a distribuir el balon con precision.', 'basico', 40, '', '', 3, 1, '2025-12-14 19:30:05.084424', '2025-12-14 19:30:05.084444', '05c8a1cd764846838f952a2eddd74187', '', ''),
('1f141ab0457c4ca19b338509d6707872', 'fuera-juego', 'Fuera de Juego (Offside)', 'Posición adelantada y excepciones', 'intermedio', 40, '', '', 4, 1, '2025-12-13 03:58:22.056241', '2025-12-13 03:58:22.056258', 'e21c02235c324577929484a937e031dd', NULL, NULL),
('21b0ab3b65f84b5fa8076c7109815af1', 'fundamentos-representacion', 'Fundamentos de la Representación Deportiva', 'Principios básicos del trabajo como agente de jugadores', 'intermedio', 50, '', '', 2, 1, '2026-01-19 21:25:36.163094', '2026-01-19 21:25:36.163112', 'dc3908f2c72547ada8be5ba1620fe93e', '', ''),
('29b830e7c40540da83f6012578df75f2', 'infracciones', 'Infracciones y Sanciones', 'Faltas, tarjetas y tiros libres', 'intermedio', 35, '', '', 3, 1, '2025-12-13 03:58:22.044381', '2025-12-13 03:58:22.044394', 'e21c02235c324577929484a937e031dd', NULL, NULL),
('2a2aa35266e04dacb736e5683c28ee1c', 'tiro-porteria', 'Tiro a Porteria', 'Tecnicas para finalizar y marcar goles.', 'intermedio', 55, '', '', 4, 1, '2025-12-14 19:30:05.123594', '2025-12-14 19:30:05.123608', '05c8a1cd764846838f952a2eddd74187', '', ''),
('3e7dbd8256a24bacadc8f8a1af8c1927', 'senales-comunicacion', 'Señales y Comunicación', 'Sistema de señales oficiales y comunicación efectiva en el arbitraje', 'intermedio', 35, '', '', 2, 1, '2026-01-19 21:25:35.964283', '2026-01-19 21:25:35.964305', '91a0ee6a2fb8424bbaf61ffdd11acfa5', '', ''),
('463b971df0274a6298f0b5813a4d6568', 'var', 'VAR y Tecnología', 'Video Assistant Referee', 'avanzado', 25, '', '', 6, 1, '2025-12-13 03:58:22.080217', '2025-12-13 03:58:22.080236', 'e21c02235c324577929484a937e031dd', NULL, NULL),
('47da741673044f75a615bbf7b86d4e9d', 'faltas-tarjetas', 'Faltas y Tarjetas', 'Conoce las infracciones y sus sanciones.', 'basico', 40, '', '', 3, 1, '2025-12-14 19:30:05.228843', '2025-12-14 19:30:05.228861', 'e21c02235c324577929484a937e031dd', '', ''),
('4e94f11adfc14061bfbd3f0ed8ccc392', 'reanudaciones', 'Reanudaciones del Juego', 'Saques, córners y penales', 'basico', 30, '', '', 5, 1, '2025-12-13 03:58:22.068109', '2025-12-13 03:58:22.068124', 'e21c02235c324577929484a937e031dd', NULL, NULL),
('5150cd1f81cc44ab928e650e7ffa0579', 'negociacion-contratos', 'Negociación de Contratos', 'Técnicas y estrategias para negociar contratos exitosos', 'avanzado', 65, '', '', 2, 1, '2026-01-19 21:25:36.182345', '2026-01-19 21:25:36.182363', 'dc3908f2c72547ada8be5ba1620fe93e', '', ''),
('54366c01b7c04b269dd2ab6ccabd01d9', 'desarrollo-academias-juveniles', 'Desarrollo de Academias Juveniles', 'Cómo estructurar y gestionar una academia de fútbol juvenil exitosa', 'intermedio', 60, '', '', 3, 1, '2026-01-19 21:25:35.871973', '2026-01-19 21:25:35.871994', '4625f5343f3b4ec692da623f261675ac', '', ''),
('5d187997d8074be1a52bedbd7c17a827', 'ingles-futbolistas', 'Inglés para Futbolistas', 'Vocabulario y comunicación en inglés específico para el fútbol', 'basico', 40, '', '', 3, 1, '2026-01-19 21:25:36.203177', '2026-01-19 21:25:36.203193', '0d9a99624b844031ad04aebc13a03db8', '', ''),
('638b72479a8d49d598756336ff8288ea', 'innovacion-tactica', 'Innovación Táctica Contemporánea', 'Tendencias actuales en táctica y estrategia futbolística', 'avanzado', 70, '', '', 2, 1, '2026-01-19 21:25:36.132205', '2026-01-19 21:25:36.132253', '97381afe2ac04b978254f25fba27eedb', '', ''),
('65b5281d09974414a9e79d14627dde34', 'reglas-basicas', 'Reglas Fundamentales', 'Las reglas basicas que todo jugador debe conocer.', 'basico', 30, '', '', 1, 1, '2025-12-13 03:58:22.020996', '2025-12-14 19:30:05.161780', 'e21c02235c324577929484a937e031dd', '', ''),
('6e0912bc7c8449a08f167c0d138a96ac', 'gestion-mantenimiento', 'Gestión y Mantenimiento', 'Administración eficiente de instalaciones deportivas', 'avanzado', 45, '', '', 2, 1, '2026-01-19 21:25:36.039421', '2026-01-19 21:25:36.039487', '78f44b13ab5741ff975d7c73652afbcb', '', ''),
('76c63a5dbf6e4174a9ee82661ed30cd2', 'terreno-juego', 'El Terreno de Juego', 'Dimensiones, marcas y equipamiento', 'basico', 25, '', '', 2, 1, '2025-12-13 03:58:22.032304', '2025-12-13 03:58:22.032317', 'e21c02235c324577929484a937e031dd', NULL, NULL),
('8259abfc1baa4637af6c2366a4a56cd5', 'pressing-presion', 'Pressing y Presion Alta', 'Aprende a recuperar el balon mediante presion.', 'avanzado', 50, '', '', 2, 1, '2025-12-14 19:30:05.295012', '2025-12-14 19:30:05.295030', 'c0d98d24d0ae4f45baaf984ab8b64940', '', ''),
('85fbb404f9d244f98b61ab318f2e3129', 'fuera-de-juego', 'La Regla del Fuera de Juego', 'Entiende una de las reglas mas complejas.', 'intermedio', 35, '', '', 2, 1, '2025-12-14 19:30:05.197014', '2025-12-14 19:30:05.197035', 'e21c02235c324577929484a937e031dd', '', ''),
('870e107dbfd541ab8f312ad80f826d9d', 'liderazgo-futbol-moderno', 'Liderazgo en el Fútbol Moderno', 'Desarrollo de habilidades de liderazgo para entrenadores contemporáneos', 'avanzado', 60, '', '', 2, 1, '2026-01-19 21:25:36.089533', '2026-01-19 21:25:36.089566', '97381afe2ac04b978254f25fba27eedb', '', ''),
('884582b84e5847e69558a67a90dac6c0', 'cabeceo', 'Técnica de Cabeceo', 'Cabeceo ofensivo y defensivo', 'intermedio', 30, '', '', 5, 1, '2025-12-13 03:58:21.962286', '2025-12-13 03:58:21.962308', '05c8a1cd764846838f952a2eddd74187', NULL, NULL),
('8fd29dc77e6e41f79eec055c8f06ccc4', 'diseno-instalaciones', 'Diseño de Instalaciones Deportivas', 'Planificación y diseño de complejos deportivos modernos', 'intermedio', 55, '', '', 2, 1, '2026-01-19 21:25:35.999667', '2026-01-19 21:25:35.999685', '78f44b13ab5741ff975d7c73652afbcb', '', ''),
('a9b111ec48a6482db7bf5a90a9018e7f', 'espanol-futbolistas', 'Español para Futbolistas Internacionales', 'Comunicación efectiva en español para jugadores extranjeros', 'basico', 40, '', '', 3, 1, '2026-01-19 21:25:36.229289', '2026-01-19 21:25:36.229350', '0d9a99624b844031ad04aebc13a03db8', '', ''),
('aaf84e0b88644292845b27602a9d44e9', 'tiro-remate', 'Tiro y Remate', 'Potencia, colocación y volea', 'intermedio', 50, '', '', 4, 1, '2025-12-13 03:58:21.943028', '2025-12-13 03:58:21.943047', '05c8a1cd764846838f952a2eddd74187', NULL, NULL),
('ae4667efc86646898fde4987df7b6466', 'control-balon', 'Control y Dominio del Balon', 'Aprende a recibir y controlar el balon.', 'basico', 45, '', '/manejobalon.mp4', 1, 1, '2025-12-13 03:58:21.885550', '2025-12-14 19:30:04.977608', '05c8a1cd764846838f952a2eddd74187', '', ''),
('bcf8104ff38b4fac9f5d3ed0a9521aa7', 'portugues-ligas-sudamericanas', 'Portugués para Ligas Sudamericanas', 'Preparación lingüística para jugar en Brasil y Portugal', 'intermedio', 45, '', '', 3, 1, '2026-01-19 21:25:36.255516', '2026-01-19 21:25:36.255533', '0d9a99624b844031ad04aebc13a03db8', '', ''),
('be5078b3b6644491915ecfae5f27e7c3', 'pase', 'Técnicas de Pase', 'Pase corto, largo, con efecto y al espacio', 'intermedio', 35, '', '', 3, 1, '2025-12-13 03:58:21.924063', '2025-12-13 03:58:21.924080', '05c8a1cd764846838f952a2eddd74187', NULL, NULL),
('c1738a3925834cf1bad76ca2d8bde477', 'calentamiento', 'Calentamiento y Prevencion', 'Rutinas de calentamiento para preparar tu cuerpo.', 'basico', 25, '', '', 1, 1, '2025-12-14 19:30:05.328493', '2025-12-14 19:30:05.328506', '859832f1fb7a4f0994432e6d77898071', '', ''),
('cb809e67717945e9938a96b96f64ec9c', 'fundamentos-arbitraje', 'Fundamentos del Arbitraje', 'Principios básicos y responsabilidades del árbitro de fútbol', 'basico', 40, '', '', 2, 1, '2026-01-19 21:25:35.938084', '2026-01-19 21:25:35.938109', '91a0ee6a2fb8424bbaf61ffdd11acfa5', '', ''),
('d8d389177f8a4893ad674c1d58ccddd8', 'psicologia-deportiva-formacion', 'Psicología Deportiva en Formación', 'Aspectos psicológicos clave en el desarrollo de jóvenes futbolistas', 'avanzado', 50, '', '', 3, 1, '2026-01-19 21:25:35.904457', '2026-01-19 21:25:35.904478', '4625f5343f3b4ec692da623f261675ac', '', ''),
('e4681a46ec3f41d0a229d25749151f03', 'conduccion-regate', 'Conduccion y Regate', 'Domina el arte de llevar el balon y superar rivales.', 'basico', 50, '', '', 2, 1, '2025-12-13 03:58:21.906211', '2025-12-14 19:30:05.032105', '05c8a1cd764846838f952a2eddd74187', '', ''),
('e46a02088a3e4ca9b499658392629fe2', 'formaciones-basicas', 'Formaciones y Sistemas', 'Conoce las formaciones mas utilizadas.', 'intermedio', 45, '', '', 1, 1, '2025-12-14 19:30:05.261682', '2025-12-14 19:30:05.261696', 'c0d98d24d0ae4f45baaf984ab8b64940', '', ''),
('ee7ab1f39bae4da686413f7865a5b9a0', 'tecnica-portero', 'Técnica del Portero', 'Posición, blocaje y despejes', 'avanzado', 55, '', '', 7, 1, '2025-12-13 03:58:21.999512', '2025-12-13 03:58:21.999527', '05c8a1cd764846838f952a2eddd74187', NULL, NULL),
('f62036d76474402098c166c0301e234b', 'tecnica-defensiva', 'Técnica Defensiva', 'Entrada, marcaje y anticipación', 'avanzado', 45, '', '', 6, 1, '2025-12-13 03:58:21.981344', '2025-12-13 03:58:21.981366', '05c8a1cd764846838f952a2eddd74187', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_tema_contenido
--

CREATE TABLE learning_tema_contenido (
  id char(32) NOT NULL,
  subtitulo varchar(200) NOT NULL,
  contenido longtext NOT NULL,
  orden int(10) UNSIGNED NOT NULL CHECK (orden >= 0),
  created_at datetime(6) NOT NULL,
  tema_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla learning_tema_contenido
--

INSERT INTO learning_tema_contenido (id, subtitulo, contenido, orden, created_at, tema_id) VALUES
('00a3f77528044dc09eb2aa177a3cec5b', 'Regates Basicos', 'La bicicleta, el recorte, la croqueta, el tunel (cano).', 4, '2025-12-14 19:30:05.057906', 'e4681a46ec3f41d0a229d25749151f03'),
('034712920d5f446dae40360599a01b85', 'Rol y Responsabilidades del Árbitro', 'El árbitro es la máxima autoridad en el campo. Sus decisiones son finales y debe aplicar las reglas de manera justa e imparcial.', 1, '2026-01-19 21:25:35.941957', 'cb809e67717945e9938a96b96f64ec9c'),
('03d61fd740d64a22bed43e42fbb97fda', 'Estructura de una Sesión de Entrenamiento', 'Una sesión típica debe incluir: calentamiento lúdico (10 min), ejercicios técnicos básicos (15 min), juegos aplicados (15 min) y vuelta a la calma (5 min).', 2, '2026-01-19 21:25:35.842739', '11850c9a59714aa2a668985174454af2'),
('08b4f24c50d54d89a277f1df7fe036af', 'Comunicación Inspiradora', 'La comunicación debe motivar y educar. Usar ejemplos concretos, mantener mensajes claros y adaptar el lenguaje a cada jugador.', 2, '2026-01-19 21:25:36.108217', '870e107dbfd541ab8f312ad80f826d9d'),
('0b5428d61e7d448893ba80089e45759f', 'Composicion del Equipo', '11 jugadores por equipo incluyendo portero. Minimo 7 para jugar.', 1, '2025-12-14 19:30:05.174099', '65b5281d09974414a9e79d14627dde34'),
('0c793d738fa445f9996ff37e1491735d', 'El Gol', 'Se marca cuando el balon cruza completamente la linea de meta.', 3, '2025-12-14 19:30:05.179845', '65b5281d09974414a9e79d14627dde34'),
('1150d8403fe641fe955ae0e4421061d0', 'Ejercicios', 'Lanza el balon al aire y controlalo. Practica contra una pared.', 4, '2025-12-14 19:30:05.011849', 'ae4667efc86646898fde4987df7b6466'),
('1263324938fc44bca4a39a4717a3169a', 'Tipos de Faltas', 'Directas: patear, zancadillear, empujar, mano. Indirectas: juego peligroso, obstruccion.', 1, '2025-12-14 19:30:05.238420', '47da741673044f75a615bbf7b86d4e9d'),
('13dad5e2b1a840d8874143a2da2faff9', 'Técnica básica', 'Fundamentos de Técnicas de Pase', 2, '2025-12-13 03:58:21.931052', 'be5078b3b6644491915ecfae5f27e7c3'),
('14a8e5fae463437296aa577087f0dc9c', 'Importancia', 'El pase es el fundamento del juego colectivo. Conecta jugadores y crea espacios.', 1, '2025-12-14 19:30:05.094246', '149d85df30384d25909dbde2d5a66522'),
('1838b40751454f96995e146e3113951c', 'Técnica básica', 'Fundamentos de Tiro y Remate', 2, '2025-12-13 03:58:21.950700', 'aaf84e0b88644292845b27602a9d44e9'),
('1bf2746a3db343e3b726b8e58fc39a97', 'Introducción', 'Introducción al tema de Técnica Defensiva', 1, '2025-12-13 03:58:21.985110', 'f62036d76474402098c166c0301e234b'),
('1cea6cdb92204b4a9ca9cf3f8723e1f9', 'Consideraciones de Seguridad', 'La seguridad es prioritaria: salidas de emergencia, iluminación adecuada, sistemas contra incendios y control de acceso.', 2, '2026-01-19 21:25:36.005675', '8fd29dc77e6e41f79eec055c8f06ccc4'),
('1d7bb60372754a889efa50df12368d0f', 'Introducción', 'Introducción al tema de Técnica de Cabeceo', 1, '2025-12-13 03:58:21.966182', '884582b84e5847e69558a67a90dac6c0'),
('1e680a295fc7423486d84a05ce1843a1', 'Donde Apuntar', 'Esquinas inferiores, palo largo, segundo palo en centros.', 3, '2025-12-14 19:30:05.140069', '2a2aa35266e04dacb736e5683c28ee1c'),
('20b662322f4b47ed98e1043f2ecbc700', 'Introducción', 'Introducción a Fuera de Juego (Offside)', 1, '2025-12-13 03:58:22.060475', '1f141ab0457c4ca19b338509d6707872'),
('216e7f04ec4944dfa74e6e23b1ec58b9', 'Importancia', 'Prepara tu cuerpo, aumenta temperatura muscular, reduce riesgo de lesiones.', 1, '2025-12-14 19:30:05.336094', 'c1738a3925834cf1bad76ca2d8bde477'),
('21822b94279c4e369f33bd4491f7c329', 'Motivación y Autoestima', 'El desarrollo de la autoestima es fundamental. Los jóvenes necesitan sentirse valorados por su esfuerzo, no solo por sus resultados.', 1, '2026-01-19 21:25:35.908176', 'd8d389177f8a4893ad674c1d58ccddd8'),
('22d47e651dc34ba5b95081bd8fa2eedc', 'Posicionamiento en el Campo', 'El árbitro debe mantener una posición que le permita ver claramente las jugadas, generalmente en diagonal y siguiendo el balón.', 2, '2026-01-19 21:25:35.947013', 'cb809e67717945e9938a96b96f64ec9c'),
('26a771a07abe49948786f6e514404b14', 'Velocidad', 'Reaccion, aceleracion, maxima, con balon. Sprints cortos 10-30m.', 3, '2025-12-14 19:30:05.366913', '0b3fdc971afc4fc79b030187e7fbb0e2'),
('2df206c5b6fe4bf2a974cf6a6acda062', 'Tarjeta Roja', 'Falta grave, conducta violenta, impedir gol con mano, lenguaje ofensivo.', 3, '2025-12-14 19:30:05.244089', '47da741673044f75a615bbf7b86d4e9d'),
('2e38483b3beb44ce8e5d49e86ab0fa85', 'Tecnica', 'Pie de apoyo junto al balon apuntando al objetivo. Golpea con la superficie adecuada.', 3, '2025-12-14 19:30:05.102040', '149d85df30384d25909dbde2d5a66522'),
('3488758bc29d49eea54bd42bb0eb2585', 'Instrucciones del Entrenador', 'Comprender órdenes: \"¡Presiona!\", \"¡Marca!\", \"¡Corre!\", \"¡Pasa!\", \"¡Dispara!\", \"¡Defiende!\".', 2, '2026-01-19 21:25:36.238930', 'a9b111ec48a6482db7bf5a90a9018e7f'),
('4720d809882841b4af236663063c7f24', 'El VAR', 'Revisa las jugadas con lineas virtuales para precision milimetrica.', 3, '2025-12-14 19:30:05.210059', '85fbb404f9d244f98b61ab318f2e3129'),
('4869903e62f2405691882d51810f4e9f', 'Análisis de Video y Datos', 'El uso de tecnología para análisis táctico: software de video, métricas de rendimiento, mapas de calor y análisis de oponentes.', 2, '2026-01-19 21:25:36.141711', '638b72479a8d49d598756336ff8288ea'),
('4b610a5b02614f109dcca18fba5e02a6', 'Señales Básicas del Árbitro', 'Cada decisión debe acompañarse de la señal correspondiente: brazo extendido para faltas, tarjetas mostradas claramente, señalización de córners y saques.', 1, '2026-01-19 21:25:35.969746', '3e7dbd8256a24bacadc8f8a1af8c1927'),
('4cfc4a70da1f4ebf92af5abbc31b80a7', 'Introducción', 'Introducción a Reanudaciones del Juego', 1, '2025-12-13 03:58:22.072156', '4e94f11adfc14061bfbd3f0ed8ccc392'),
('51c79566a49e4cbcb2c56b1a6fde1d29', 'Introducción', 'Introducción a VAR y Tecnología', 1, '2025-12-13 03:58:22.084494', '463b971df0274a6298f0b5813a4d6568'),
('5404cd602d2e48c484dcddfcb00a5f2d', 'Principios Básicos de la Enseñanza Infantil', 'La enseñanza del fútbol a niños requiere un enfoque especial que combine diversión, aprendizaje y desarrollo motor. Los niños aprenden mejor a través del juego y la repetición positiva.', 1, '2026-01-19 21:25:35.834692', '11850c9a59714aa2a668985174454af2'),
('59ba91aef01d4412a2ffa2034663208f', 'El Arte del Regate', 'Superar al rival en el uno contra uno. Combina fintas con cambios de ritmo.', 3, '2025-12-14 19:30:05.054488', 'e4681a46ec3f41d0a229d25749151f03'),
('5b68fe64b6b6403bb93d6e221a6611f6', 'Duracion del Partido', 'Dos tiempos de 45 minutos con 15 de descanso. El arbitro anade tiempo adicional.', 2, '2025-12-14 19:30:05.176754', '65b5281d09974414a9e79d14627dde34'),
('5b8cc3f1a6a54a239a189c8136e20f79', 'Introducción', 'Introducción al tema de Tiro y Remate', 1, '2025-12-13 03:58:21.947218', 'aaf84e0b88644292845b27602a9d44e9'),
('5c2b2fbbbee64fdaad7b209397ce963e', 'Introducción', 'Introducción al tema de Técnicas de Pase', 1, '2025-12-13 03:58:21.927968', 'be5078b3b6644491915ecfae5f27e7c3'),
('5f099e72332b4488ad74d2822beb6a8a', 'Tecnica de Amortiguacion', 'Retira la superficie de contacto en el momento del impacto para reducir la velocidad.', 3, '2025-12-14 19:30:05.008779', 'ae4667efc86646898fde4987df7b6466'),
('686dd8cf1b0842fa8e546b78973bf709', 'Desarrollo de Carrera del Jugador', 'Un buen agente planifica la carrera a largo plazo: desarrollo técnico, oportunidades de crecimiento, estabilidad financiera.', 2, '2026-01-19 21:25:36.168135', '21b0ab3b65f84b5fa8076c7109815af1'),
('6c053f6d6daf44e89fe4f3313ceb7e43', 'Cuando se Sanciona', 'Cuando participas activamente: jugando el balon o interfiriendo.', 2, '2025-12-14 19:30:05.207261', '85fbb404f9d244f98b61ab318f2e3129'),
('7194e30a46954a23ba73a6d0cb7e035a', 'Estructura de Contratos Profesionales', 'Los contratos incluyen: salario base, bonos por rendimiento, cláusulas de rescisión, derechos de imagen y beneficios adicionales.', 1, '2026-01-19 21:25:36.184833', '5150cd1f81cc44ab928e650e7ffa0579'),
('748882d33b49489cb706dd94bcd512a1', 'Tipos de Conduccion', 'Con interior (control), exterior (velocidad), empeine (sprints), planta (cambios).', 2, '2025-12-14 19:30:05.051069', 'e4681a46ec3f41d0a229d25749151f03'),
('759cc136e0e74e8683bbc9ac682ea855', 'Estilos de Liderazgo Efectivos', 'Los entrenadores modernos deben adaptar su estilo: democrático para decisiones grupales, autocrático para situaciones críticas.', 1, '2026-01-19 21:25:36.094683', '870e107dbfd541ab8f312ad80f826d9d'),
('7ad1b46e590d42349fe92bd76fa6a86b', 'Gestión de Recursos', 'Optimizar el uso de instalaciones mediante horarios eficientes, tarifas competitivas y servicios adicionales.', 2, '2026-01-19 21:25:36.056021', '6e0912bc7c8449a08f167c0d138a96ac'),
('80051b00052240bd96d06970070b5ec5', 'Diferencias entre Portugués Brasileño y Europeo', 'Aunque similares, hay diferencias en pronunciación y vocabulario futbolístico entre Brasil y Portugal.', 1, '2026-01-19 21:25:36.258853', 'bcf8104ff38b4fac9f5d3ed0a9521aa7'),
('87d6539092f24b0f8947f936a9790aa4', 'Estrategias de Negociación', 'Preparación exhaustiva, conocimiento del mercado, flexibilidad en términos no esenciales y firmeza en puntos clave.', 2, '2026-01-19 21:25:36.187227', '5150cd1f81cc44ab928e650e7ffa0579'),
('87e935ae99bd446cb6d892ee9a78b4e3', 'Errores Comunes', 'No calentar suficiente, estiramientos estaticos antes del ejercicio.', 3, '2025-12-14 19:30:05.341212', 'c1738a3925834cf1bad76ca2d8bde477'),
('88159a5fbb844565a4a2b2337b14db27', 'Claves del Pressing', 'Triggers para iniciar, coberturas de companeros, intensidad coordinada.', 3, '2025-12-14 19:30:05.310799', '8259abfc1baa4637af6c2366a4a56cd5'),
('884929c0b3b0425b9bc1bca4d976699f', 'Evolución de los Sistemas de Juego', 'El fútbol moderno ha evolucionado hacia sistemas más fluidos: 4-3-3 falso 9, 3-5-2 con carrileros, pressing alto coordinado.', 1, '2026-01-19 21:25:36.137482', '638b72479a8d49d598756336ff8288ea'),
('8c9f558f965f48d6ade37094c2a868da', 'Tipos de Tiro', 'Con empeine (potencia), colocado con interior, con exterior, volea, cabeza.', 2, '2025-12-14 19:30:05.137126', '2a2aa35266e04dacb736e5683c28ee1c'),
('8fc8a5eb33f44df9addaa8afae5e6a24', 'Introduccion', 'El control del balon es la habilidad fundamental. Consiste en recibir, amortiguar y mantener el balon bajo control.', 1, '2025-12-14 19:30:05.001412', 'ae4667efc86646898fde4987df7b6466'),
('8ff29d6841ef4965acb7117e562887d3', 'Planificación Curricular por Edades', 'Cada categoría requiere objetivos específicos: Sub-8 (coordinación básica), Sub-10 (técnica individual), Sub-12 (técnica grupal), Sub-14 (táctica básica).', 1, '2026-01-19 21:25:35.877305', '54366c01b7c04b269dd2ab6ccabd01d9'),
('91417eb08ec24d3d9c618728bfd44bfa', 'Vocabulario Técnico Básico', 'Términos esenciales: pass (pase), shoot (disparar), tackle (entrada), offside (fuera de juego), corner kick (córner).', 1, '2026-01-19 21:25:36.205403', '5d187997d8074be1a52bedbd7c17a827'),
('919fa2bc930b48a3a2eaebfe28f29bc2', 'Formaciones Populares', '4-4-2 clasica, 4-3-3 ofensiva, 4-2-3-1 control, 3-5-2 dominio centro, 5-3-2 defensiva.', 2, '2025-12-14 19:30:05.273719', 'e46a02088a3e4ca9b499658392629fe2'),
('91bcbfeb37ae4c859393558696f783bb', 'Vocabulario Futbolístico en Español', 'Términos clave: pelota, gol, pase, tiro, falta, córner, fuera de juego, tarjeta amarilla, tarjeta roja.', 1, '2026-01-19 21:25:36.234699', 'a9b111ec48a6482db7bf5a90a9018e7f'),
('933efe9e7ac0489f8cc63f641854885f', 'Superficies de Contacto', 'Interior del pie, exterior, empeine, planta, pecho, muslo y cabeza.', 2, '2025-12-14 19:30:05.004919', 'ae4667efc86646898fde4987df7b6466'),
('9401b31c1f69446b86e463fb155edcb4', 'Comunicación en el Campo', 'Frases útiles durante el juego: \"Man on!\" (¡tienes marca!), \"Time!\" (¡tienes tiempo!), \"Switch play!\" (¡cambia el juego!).', 2, '2026-01-19 21:25:36.208447', '5d187997d8074be1a52bedbd7c17a827'),
('94f9565cf57448eaae02f112735b85f2', 'Marco Legal y Regulatorio', 'Los agentes deben estar licenciados por FIFA, conocer regulaciones locales y mantener ética profesional en todas las negociaciones.', 1, '2026-01-19 21:25:36.165853', '21b0ab3b65f84b5fa8076c7109815af1'),
('985fa4908b2949468153e8c7eddf0b61', 'Elegir la Correcta', 'Adaptar a tus jugadores, al rival, al resultado que necesitas.', 3, '2025-12-14 19:30:05.276444', 'e46a02088a3e4ca9b499658392629fe2'),
('9fbd257d76fa4eaf8745d91067645fa2', 'Mantenimiento Preventivo', 'El mantenimiento regular previene problemas mayores: revisión de césped, sistemas eléctricos, plomería y estructuras.', 1, '2026-01-19 21:25:36.050613', '6e0912bc7c8449a08f167c0d138a96ac'),
('a61909ff0442400c83268adb27956396', 'Requisitos Básicos de una Sede', 'Una sede deportiva debe incluir: campos reglamentarios, vestuarios, área médica, estacionamiento, cafetería y oficinas administrativas.', 1, '2026-01-19 21:25:36.002763', '8fd29dc77e6e41f79eec055c8f06ccc4'),
('b3a540466a71418f97519e1d6968ddbd', 'Cultura Futbolística Lusófona', 'Entender la pasión por el fútbol en países de habla portuguesa y las tradiciones locales.', 2, '2026-01-19 21:25:36.263254', 'bcf8104ff38b4fac9f5d3ed0a9521aa7'),
('b4721c3efffd483bb345d0d93d3ac28e', 'Tipos de Pressing', 'Alto (campo rival), medio (centro), bajo (cerca del area propia).', 2, '2025-12-14 19:30:05.308351', '8259abfc1baa4637af6c2366a4a56cd5'),
('b8ca151b46604282a1125b3633510b80', 'Técnica básica', 'Fundamentos de Técnica Defensiva', 2, '2025-12-13 03:58:21.988206', 'f62036d76474402098c166c0301e234b'),
('ba903f47777348fbbfa3cbaaad99de38', 'Manejo de la Presión Competitiva', 'Enseñar a los jóvenes a manejar la presión de la competencia, enfocándose en el proceso de aprendizaje más que en ganar o perder.', 2, '2026-01-19 21:25:35.913617', 'd8d389177f8a4893ad674c1d58ccddd8'),
('c94421c2ba04470797c5bef2dea25079', 'Comunicación con Asistentes', 'La coordinación con los árbitros asistentes es crucial. Deben establecer contacto visual y usar señales acordadas previamente.', 2, '2026-01-19 21:25:35.973633', '3e7dbd8256a24bacadc8f8a1af8c1927'),
('cb7cbcb5f39a4e3ca1061752308d1744', 'Resistencia', 'Un futbolista recorre 10-13 km por partido. Necesitas aerobica y anaerobica.', 1, '2025-12-14 19:30:05.361443', '0b3fdc971afc4fc79b030187e7fbb0e2'),
('cd4cdb0d5dc44dd898f75fe56240bf45', 'Fundamentos', 'La conduccion es desplazarse con el balon controlado. Usa toques suaves y frecuentes.', 1, '2025-12-14 19:30:05.047281', 'e4681a46ec3f41d0a229d25749151f03'),
('dc11768419a24a1fa9d12193b4f51c26', 'Introducción', 'Introducción a El Terreno de Juego', 1, '2025-12-13 03:58:22.035662', '76c63a5dbf6e4174a9ee82661ed30cd2'),
('dc6762aa1f2d4c01b13b2506e96876bb', 'Que es una Formacion', 'Disposicion tactica de jugadores. Se representa con numeros: defensas-centrocampistas-delanteros.', 1, '2025-12-14 19:30:05.270730', 'e46a02088a3e4ca9b499658392629fe2'),
('dd58b44edda147d8b1f8cb583b22fdb8', 'Tipos de Pase', 'Corto con interior, largo con empeine, con exterior, de tacon, picado.', 2, '2025-12-14 19:30:05.098195', '149d85df30384d25909dbde2d5a66522'),
('dd8538904aa640e9af3201f8044bab09', 'El Arte de Marcar', 'El tiro es el momento culminante. Combina tecnica, potencia y precision.', 1, '2025-12-14 19:30:05.133938', '2a2aa35266e04dacb736e5683c28ee1c'),
('dfbea0578a17413690f1df1dbb8bdcd6', 'Introducción', 'Introducción al tema de Técnica del Portero', 1, '2025-12-13 03:58:22.004080', 'ee7ab1f39bae4da686413f7865a5b9a0'),
('e52dfd56bb214073a8258233ca82c26e', 'Introducción', 'Introducción a Infracciones y Sanciones', 1, '2025-12-13 03:58:22.048372', '29b830e7c40540da83f6012578df75f2'),
('e6434d7940bb484ebccc7b6ede432d03', 'Entrenamiento', 'Carrera continua 20-40 min, intervalos, fartlek, circuitos.', 2, '2025-12-14 19:30:05.363573', '0b3fdc971afc4fc79b030187e7fbb0e2'),
('e85ad91bc8054263975773d2161a2742', 'Tarjeta Amarilla', 'Conducta antideportiva, discutir, no respetar distancia. Dos amarillas = expulsion.', 2, '2025-12-14 19:30:05.241321', '47da741673044f75a615bbf7b86d4e9d'),
('f3de3b8c013d4855b335687d9cb39b27', 'Que es', 'Estar mas cerca de la linea de meta que el penultimo adversario cuando se juega el balon.', 1, '2025-12-14 19:30:05.204562', '85fbb404f9d244f98b61ab318f2e3129'),
('f7383d8da5d649e6bb055c62d7cba09e', 'Técnica básica', 'Fundamentos de Técnica del Portero', 2, '2025-12-13 03:58:22.007202', 'ee7ab1f39bae4da686413f7865a5b9a0'),
('f80217200f734b4cbb0cd2c19c165f60', 'Gestión de Recursos y Personal', 'Una academia exitosa necesita: entrenadores certificados, instalaciones adecuadas, material deportivo de calidad y un programa de seguimiento individual.', 2, '2026-01-19 21:25:35.881760', '54366c01b7c04b269dd2ab6ccabd01d9'),
('fd2cea807ff54b0da65f34e2578b0ad0', 'Fases', '1. Activacion cardiovascular (5-10 min). 2. Movilidad articular (5 min). 3. Estiramientos dinamicos (5 min). 4. Ejercicios especificos (5 min).', 2, '2025-12-14 19:30:05.338603', 'c1738a3925834cf1bad76ca2d8bde477'),
('fd6f5783c34641999593e3691fae6113', 'Que es el Pressing', 'Estrategia defensiva para recuperar el balon cerca de la porteria rival.', 1, '2025-12-14 19:30:05.305457', '8259abfc1baa4637af6c2366a4a56cd5'),
('ff37b618a544451aacdd6d81869505a1', 'Técnica básica', 'Fundamentos de Técnica de Cabeceo', 2, '2025-12-13 03:58:21.969411', '884582b84e5847e69558a67a90dac6c0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_tema_puntos_clave
--

CREATE TABLE learning_tema_puntos_clave (
  id char(32) NOT NULL,
  texto varchar(500) NOT NULL,
  orden int(10) UNSIGNED NOT NULL CHECK (orden >= 0),
  tema_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla learning_tema_puntos_clave
--

INSERT INTO learning_tema_puntos_clave (id, texto, orden, tema_id) VALUES
('003c2b5bcb3c41dabb178832b06ab306', 'El arbitro es la maxima autoridad', 4, '65b5281d09974414a9e79d14627dde34'),
('03a177d726424f2badad859d4648bdaa', 'Explicar decisiones cuando sea necesario', 3, '3e7dbd8256a24bacadc8f8a1af8c1927'),
('03c77a1def414b66bc55034e1e13d9c2', 'No existe formacion perfecta', 1, 'e46a02088a3e4ca9b499658392629fe2'),
('0514b9a61a0d42d884991cf469bee17a', 'Practica constantemente', 1, 'ee7ab1f39bae4da686413f7865a5b9a0'),
('051577e06d4b49369a001d9da7ed3596', 'Roja = expulsion inmediata', 3, '47da741673044f75a615bbf7b86d4e9d'),
('05d1f66fc3224675a6ff1378fee328b6', 'Conoce las reglas oficiales', 1, '4e94f11adfc14061bfbd3f0ed8ccc392'),
('06beb32fae1f4e02895d8c6160d128f4', 'Comunicarse con aficionados locales', 4, 'a9b111ec48a6482db7bf5a90a9018e7f'),
('07ad366f8efa4195862c42e3d3f179f6', 'Solo el portero usa las manos en su area', 3, '65b5281d09974414a9e79d14627dde34'),
('0c5951a6ae804cd0bd0c1ab230d8ce8f', 'Distinguir acentos brasileño y portugués', 1, 'bcf8104ff38b4fac9f5d3ed0a9521aa7'),
('0c6e8aa9bef64bf8b7d93296f3c3b1a1', 'Incluye agilidad', 4, '0b3fdc971afc4fc79b030187e7fbb0e2'),
('0d76335ee05a4a63a4cfd1172a3910f9', 'Practica con ambos pies', 4, 'ae4667efc86646898fde4987df7b6466'),
('10b41d6c498f4d25bd25dcdc7c95f60d', 'Practica con ambos pies', 5, 'e4681a46ec3f41d0a229d25749151f03'),
('13ad0f50b00e4e2ca0a0c267b9924a67', 'Combina aerobico y anaerobico', 1, '0b3fdc971afc4fc79b030187e7fbb0e2'),
('175178747ce64fcfb585d5635fd2ca6b', 'Practica con ambos pies', 4, '2a2aa35266e04dacb736e5683c28ee1c'),
('1d1fb7bcbcb44ccdb7fdbe79435646aa', 'Cumplir normativas locales de construcción', 1, '8fd29dc77e6e41f79eec055c8f06ccc4'),
('1ec667469c88417f977a1661846245f7', 'Levanta la cabeza', 2, 'e4681a46ec3f41d0a229d25749151f03'),
('1fce9c249fb2419e9f8e78274ddcd79c', 'Practicar pronunciación de términos técnicos', 1, '5d187997d8074be1a52bedbd7c17a827'),
('2351996ab9074667bd8201a6caa373d6', 'Posiciona tu cuerpo para proteger', 3, 'ae4667efc86646898fde4987df7b6466'),
('281fc78abd93401ab77ce312a2eff098', 'Poder cambiar durante el partido', 3, 'e46a02088a3e4ca9b499658392629fe2'),
('2afc7d54565e4b438a3cd2112ffdeb22', 'Mantenerse actualizado con tendencias globales', 1, '638b72479a8d49d598756336ff8288ea'),
('2c4b70d1c8894854b6b083807a0fe2c1', 'Definir objetivos claros por categoría', 1, '54366c01b7c04b269dd2ab6ccabd01d9'),
('2c75b040e16b47569545807d6ccdd6cb', 'Adaptar a los jugadores', 2, 'e46a02088a3e4ca9b499658392629fe2'),
('32b8ee9a540b4a1d905c19ba31f29991', 'Incluir áreas de esparcimiento familiar', 3, '8fd29dc77e6e41f79eec055c8f06ccc4'),
('32c240af4f1343a891ac7118cdc420a9', 'Dos tiempos de 45 min', 2, '65b5281d09974414a9e79d14627dde34'),
('336d95c13e8e4cb7af5f347de095765d', 'Conoce las reglas oficiales', 1, '29b830e7c40540da83f6012578df75f2'),
('35e683a022914013bcad5974d78125ac', 'Mantener comunicación constante con padres', 3, '54366c01b7c04b269dd2ab6ccabd01d9'),
('37f3cc82cb424c4ba3eb17406818711c', 'No hay fuera de juego en tu campo', 2, '85fbb404f9d244f98b61ab318f2e3129'),
('3801cc6400d7416e81d89b0b81d2ecea', 'Desgasta fisicamente', 4, '8259abfc1baa4637af6c2366a4a56cd5'),
('38f8d9bc7d4542cfa4c1055c7c6fd66d', 'Priorizar la diversión sobre la competencia', 1, '11850c9a59714aa2a668985174454af2'),
('3df3e16d7fb94eada22d7af4b857c148', 'Detras del penultimo defensor', 1, '85fbb404f9d244f98b61ab318f2e3129'),
('3e4912a5156442c69019ec1c9b6acdf8', 'Obtener licencia oficial de agente FIFA', 1, '21b0ab3b65f84b5fa8076c7109815af1'),
('3e551a69f19745f8a0a49b1f6d10e6f4', 'Repliega si falla', 5, '8259abfc1baa4637af6c2366a4a56cd5'),
('3f4aae1fb5b44cfbb50038b2114ee435', 'Usa ambos pies', 2, 'f62036d76474402098c166c0301e234b'),
('43f3ce64d5384a2d9572e60a46d64325', 'Manten la calma', 5, '2a2aa35266e04dacb736e5683c28ee1c'),
('49523ba40f6b476c9049479231a3e830', 'Estaticos despues del partido', 3, 'c1738a3925834cf1bad76ca2d8bde477'),
('4a71541055384e18aad83705f61af563', 'Diseñar pensando en la accesibilidad', 2, '8fd29dc77e6e41f79eec055c8f06ccc4'),
('4aa065cba7d54877b74a85ab90ea6b23', 'Crear un ambiente de apoyo mutuo', 4, 'd8d389177f8a4893ad674c1d58ccddd8'),
('4b14120b83a54d6bb55b88fb805975d2', 'Capacitar al personal en procedimientos', 2, '6e0912bc7c8449a08f167c0d138a96ac'),
('4ecf3e6ddf194357a38d06ce0619a54d', 'Conoce las reglas oficiales', 1, '463b971df0274a6298f0b5813a4d6568'),
('50f0ae35006849afb15c67cb64de9d0c', 'No descuides recuperacion', 5, '0b3fdc971afc4fc79b030187e7fbb0e2'),
('50f25037506c4200a944b4c5ae4dc8bd', 'Crear calendarios de mantenimiento', 1, '6e0912bc7c8449a08f167c0d138a96ac'),
('55651eda3afb4c1496ec965fc41bb66e', 'Practicar con compañeros de equipo', 4, '5d187997d8074be1a52bedbd7c17a827'),
('571b776413b94ecaa6206d7b4cce38e3', 'Mantener inventario de repuestos', 3, '6e0912bc7c8449a08f167c0d138a96ac'),
('5745849e76ec49198e2dc4e2d01633f0', 'Planificar el crecimiento futuro', 4, '8fd29dc77e6e41f79eec055c8f06ccc4'),
('57986a31536d44fbbc836594b1a898e9', 'Practica constantemente', 1, 'f62036d76474402098c166c0301e234b'),
('5835b97cf114487aa1aabcc45ff65ac3', 'Mantener comunicación constante con asistentes', 2, '3e7dbd8256a24bacadc8f8a1af8c1927'),
('58caa912a4d7402bbf12afefc650ca31', 'Estudiar reglamento en inglés', 3, '5d187997d8074be1a52bedbd7c17a827'),
('59e6427245094092bd0cd7da95ef83cc', 'Mantener autoridad sin ser autoritario', 1, 'cb809e67717945e9938a96b96f64ec9c'),
('5a5d02bf454b4bacb476fc3daddd6749', 'Adaptar tácticas al personal disponible', 3, '638b72479a8d49d598756336ff8288ea'),
('5f8ad9e1fa5d43f9aae2b1e2ce4bacff', 'Usa ambos pies', 2, 'ee7ab1f39bae4da686413f7865a5b9a0'),
('61d5eb20b98841568e1123d0d2783a89', 'Usa fintas corporales', 3, 'e4681a46ec3f41d0a229d25749151f03'),
('62eae9056b7f4221b412bfc937087e4b', 'Conoce las reglas oficiales', 1, '1f141ab0457c4ca19b338509d6707872'),
('676ff2cafd124da5afd333fec04dcab8', 'Manten el balon cerca', 1, 'e4681a46ec3f41d0a229d25749151f03'),
('701ef7f7f1714bac946e565f4062ed2b', 'Fomentar la comunicación abierta', 3, 'd8d389177f8a4893ad674c1d58ccddd8'),
('70c3191dc75e43e98b5e90b4808cc84d', 'Descansos completos para velocidad', 3, '0b3fdc971afc4fc79b030187e7fbb0e2'),
('72f091d1f2b5439c9e434a4f7c176436', '15-20 minutos minimo', 1, 'c1738a3925834cf1bad76ca2d8bde477'),
('76d0c950d40c434dbe6097262aa70008', 'Aprender frases de comunicación rápida', 2, '5d187997d8074be1a52bedbd7c17a827'),
('77aea125854e461fa819ee6ddf1cbcb2', 'Intervalos muy efectivos', 2, '0b3fdc971afc4fc79b030187e7fbb0e2'),
('7c44f84e53ce4fe7beee89541a7e0345', 'Cierra lineas de pase', 3, '8259abfc1baa4637af6c2366a4a56cd5'),
('7f0cd9c96b084c819f8d85ef12e7acdd', 'Enseñar técnicas de relajación básicas', 2, 'd8d389177f8a4893ad674c1d58ccddd8'),
('7f1bcac734ea40ba81ccca6e0d11398e', 'Usa ambos pies', 2, '884582b84e5847e69558a67a90dac6c0'),
('82c71eefeaf8461592422109a81a99b0', 'Fomentar la responsabilidad individual', 3, '870e107dbfd541ab8f312ad80f826d9d'),
('84c07a66af4b46669bdca84f816ac8c0', 'Tomar decisiones con confianza', 4, 'cb809e67717945e9938a96b96f64ec9c'),
('852aed33b5974de0bdec81d9c642c439', 'Cabeza sobre el balon', 1, '2a2aa35266e04dacb736e5683c28ee1c'),
('86337547e3364766bcee6ee2b309bfcb', 'Practica constantemente', 1, 'aaf84e0b88644292845b27602a9d44e9'),
('865c0192527246eb964d9409693b2de0', 'Reforzar el esfuerzo sobre el resultado', 1, 'd8d389177f8a4893ad674c1d58ccddd8'),
('8b508aa0e1b743269fe698d882597a9a', 'Adaptar al clima', 4, 'c1738a3925834cf1bad76ca2d8bde477'),
('8d51321245414fd5bbfb14619123bda9', 'Practicar con hablantes nativos', 4, 'bcf8104ff38b4fac9f5d3ed0a9521aa7'),
('8db67ec6b5d3458a8577d1f004aee076', 'Apunta a las esquinas', 2, '2a2aa35266e04dacb736e5683c28ee1c'),
('8fee5f8b6aab4a65af052f93d0750e2f', 'Equilibrar innovación con fundamentos', 4, '638b72479a8d49d598756336ff8288ea'),
('90bf19954d6346929a65579b433d314b', 'Preparar alternativas antes de negociar', 2, '5150cd1f81cc44ab928e650e7ffa0579'),
('92db07ef9d084c039cf0880f2bb9d681', 'Reforzar positivamente todos los intentos', 4, '11850c9a59714aa2a668985174454af2'),
('97b25b55f98e4a3da9ce0ca455d08e93', 'Relaja la superficie de contacto', 2, 'ae4667efc86646898fde4987df7b6466'),
('9acd179180194a319cbcc8ed4e504b99', 'Documentar todos los acuerdos', 4, '5150cd1f81cc44ab928e650e7ffa0579'),
('9c3b6c47dd8c43cab8adf3dabc46b599', 'El VAR puede revisar', 4, '47da741673044f75a615bbf7b86d4e9d'),
('9fcf6ab94d5840aaa12a6c566606d629', 'Mantener red de contactos profesional', 3, '21b0ab3b65f84b5fa8076c7109815af1'),
('a172f84514464be78e34d1e05ef19455', 'Conocer mercados internacionales', 4, '21b0ab3b65f84b5fa8076c7109815af1'),
('a1efef8e5bf248ddae382b6d69b469a5', 'Faltas en el area = penalti', 1, '47da741673044f75a615bbf7b86d4e9d'),
('a229df63aa4b4682aa4646339a6ce66f', 'Crear una cultura de equipo sólida', 4, '870e107dbfd541ab8f312ad80f826d9d'),
('a2763f8112ec42c6ab0c244f3ca216cb', 'Todo el equipo debe participar', 1, '8259abfc1baa4637af6c2366a4a56cd5'),
('a4462132ed524d3b98d013666ee6e82d', 'Comprender cultura de cada país', 3, 'bcf8104ff38b4fac9f5d3ed0a9521aa7'),
('a6f31d1f0cae4d818d544e44004c4c6a', 'Mantener relaciones cordiales con clubes', 3, '5150cd1f81cc44ab928e650e7ffa0579'),
('abae4cfa19f349d3a158a1fd6ac7ed65', 'Inspirar confianza en momentos difíciles', 2, '870e107dbfd541ab8f312ad80f826d9d'),
('ac3b5e848d954b7f845778b49293f181', 'Ser consistente en las señalizaciones', 4, '3e7dbd8256a24bacadc8f8a1af8c1927'),
('ac3ff33c48c64407881bcef10233d15b', 'Documentar todas las actividades', 4, '6e0912bc7c8449a08f167c0d138a96ac'),
('ad8f4b05504f43c39e8d5bf317ffb761', 'Usar señales claras y visibles', 1, '3e7dbd8256a24bacadc8f8a1af8c1927'),
('b0cc9fc20f7646ffbac04583e4dec6ae', 'Usar tecnología para mejorar análisis', 2, '638b72479a8d49d598756336ff8288ea'),
('b1f0d9a930f24d78a18b2f9849530e7f', 'Memorizar vocabulario básico del fútbol', 1, 'a9b111ec48a6482db7bf5a90a9018e7f'),
('b247c755a4c24eefbcd32fcb0954e441', '11 jugadores (minimo 7)', 1, '65b5281d09974414a9e79d14627dde34'),
('b40835108bde467f9de6a26df1faeb59', 'Practica constantemente', 1, '884582b84e5847e69558a67a90dac6c0'),
('b444ddfdb4e040d59b1c7f52a25d4f03', 'Conoce las reglas oficiales', 1, '76c63a5dbf6e4174a9ee82661ed30cd2'),
('b4d74a77621c4769a43a8aaafa3840f6', 'Identifica los triggers', 2, '8259abfc1baa4637af6c2366a4a56cd5'),
('b90100b25c7a484db42188927daef579', 'Golpea el centro del balon', 2, '149d85df30384d25909dbde2d5a66522'),
('ba6c87ff443349fcbde02a735c2f18fc', 'Usa ambos pies', 2, 'aaf84e0b88644292845b27602a9d44e9'),
('bbb332e8a52543358865b9d309c0b285', 'Acompana el movimiento', 3, '149d85df30384d25909dbde2d5a66522'),
('bda6f3778710494c92e2bddd9d6dcba2', 'El pie de apoyo apunta al objetivo', 1, '149d85df30384d25909dbde2d5a66522'),
('bdee8bd14fd04cfba6d5e36030a777bd', 'Aprender números y tiempo en español', 3, 'a9b111ec48a6482db7bf5a90a9018e7f'),
('ca3f59717eb345a1b4d84089457cfea7', 'Comunicate con tu companero', 4, '149d85df30384d25909dbde2d5a66522'),
('cb01dbb633c44816b94db1f2061ce056', 'Usar ejercicios con balón desde el primer minuto', 2, '11850c9a59714aa2a668985174454af2'),
('cd3791f5121e44979ca02d38bfba1c39', 'Posicionarse correctamente en cada jugada', 3, 'cb809e67717945e9938a96b96f64ec9c'),
('cdbacb7d9baa4d79a8414f39bf79e5e5', 'Dar instrucciones simples y claras', 3, '11850c9a59714aa2a668985174454af2'),
('cf6fc52979784a2fafe2e9c1ccb10559', 'Practica constantemente', 1, 'be5078b3b6644491915ecfae5f27e7c3'),
('d29591719fe34487ae41f663180d5b7c', 'El VAR puede corregir', 4, '85fbb404f9d244f98b61ab318f2e3129'),
('d5ccd49aac13415bb1046c6325b902a4', 'No en saques de banda/esquina/meta', 3, '85fbb404f9d244f98b61ab318f2e3129'),
('d755a97f343c45d3bfb767cda26ba49f', 'Practicar escucha de instrucciones', 2, 'a9b111ec48a6482db7bf5a90a9018e7f'),
('d991bbc0e9844d399d262ce0ad4c92d5', 'Priorizar intereses del jugador siempre', 2, '21b0ab3b65f84b5fa8076c7109815af1'),
('d9f76a7607f4465d99547db6efdc3f54', 'Dos amarillas = roja', 2, '47da741673044f75a615bbf7b86d4e9d'),
('dc9371fe7661464091eceae75accbb5a', 'Cardiovascular + movilidad + especificos', 2, 'c1738a3925834cf1bad76ca2d8bde477'),
('dd09a9920ded486ab88a593948265266', 'Comunicarse claramente con jugadores', 2, 'cb809e67717945e9938a96b96f64ec9c'),
('e0806c42c8304f41ae4e606d430470cd', 'Cambia de ritmo', 4, 'e4681a46ec3f41d0a229d25749151f03'),
('e22262044fb2459793cd6d6d2d3ad806', 'Investigar valor de mercado del jugador', 1, '5150cd1f81cc44ab928e650e7ffa0579'),
('e52807ddab9e425ebaa6d8b7a6219f58', 'Evaluar progreso individual regularmente', 4, '54366c01b7c04b269dd2ab6ccabd01d9'),
('e6d2d76172b642629e7b74e496a32658', 'Adaptar el liderazgo a cada situación', 1, '870e107dbfd541ab8f312ad80f826d9d'),
('e8cc1853d4604f0d9f4a8e9db185b255', 'Usa ambos pies', 2, 'be5078b3b6644491915ecfae5f27e7c3'),
('eed36ebc7f564400b1c95dd5cbc10ff3', 'Aprender jerga futbolística local', 2, 'bcf8104ff38b4fac9f5d3ed0a9521aa7'),
('f16fd17a006942739a5c366d4c9c18b1', 'Contratar entrenadores especializados en formación', 2, '54366c01b7c04b269dd2ab6ccabd01d9'),
('f23434ab7ef04721af7c8964fc42f61a', '4-3-3 y 4-4-2 son equilibradas', 4, 'e46a02088a3e4ca9b499658392629fe2'),
('f3ec34ff095b4d22bbd42ea9eb969b41', 'Manten la vista en el balon', 1, 'ae4667efc86646898fde4987df7b6466'),
('f613c855695b4f38a6890edf6c1d1a6e', 'No siempre necesitas potencia', 3, '2a2aa35266e04dacb736e5683c28ee1c');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista learning_tema_stats
-- (Véase abajo para la vista actual)
--
CREATE TABLE `learning_tema_stats` (
`tema_id` char(36)
,`titulo` varchar(200)
,`slug` varchar(200)
,`seccion_nombre` varchar(200)
,`usuarios_completaron` bigint(21)
,`tiempo_promedio_minutos` decimal(14,4)
,`puntuacion_promedio` decimal(9,6)
,`total_evaluaciones` bigint(21)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista learning_user_stats
-- (Véase abajo para la vista actual)
--
CREATE TABLE `learning_user_stats` (
`usuario_id` char(32)
,`username` varchar(30)
,`display_name` varchar(100)
,`temas_completados` bigint(21)
,`secciones_iniciadas` bigint(21)
,`tiempo_total_minutos` decimal(32,0)
,`puntuacion_promedio` decimal(9,6)
,`logros_obtenidos` bigint(21)
,`ultima_actividad` timestamp
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_usuariologro
--

CREATE TABLE learning_usuariologro (
  id char(36) NOT NULL DEFAULT uuid(),
  usuario_id char(36) NOT NULL,
  logro_id char(36) NOT NULL,
  fecha_obtenido timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla learning_usuario_logros
--

CREATE TABLE learning_usuario_logros (
  id char(32) NOT NULL,
  fecha_obtenido datetime(6) NOT NULL,
  logro_id char(32) NOT NULL,
  usuario_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla learning_usuario_logros
--

INSERT INTO learning_usuario_logros (id, fecha_obtenido, logro_id, usuario_id) VALUES
('1a6ca2c9900c4eca8d20a1811336ea9d', '2026-01-19 22:26:58.062477', 'eccfdd6ed8d941b18bdc8bfffa29afc7', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('1a983c43fdd0445caa7e6cadfd8d630c', '2026-01-19 22:37:48.461537', 'e5c10513deae4631a213e91eaee69eb7', '4cccc11a7e634423bf92808272ad4b52'),
('5a15426fb97e4829aa0307e2def40125', '2026-01-20 10:11:26.880364', 'fcf1f33b89af4326a472825ac6b68971', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('65cba6f10b5c4854b97013d868319c0f', '2026-01-19 22:01:27.737338', 'e5c10513deae4631a213e91eaee69eb7', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('e5d7c2482cb54512b8f594133530bf6f', '2026-01-19 22:37:48.448674', '480aa8ab5b204589ade95d6f6db8393d', '4cccc11a7e634423bf92808272ad4b52'),
('e8341e0d1da249278b581ad3a8931b54', '2026-01-19 22:01:27.725610', '480aa8ab5b204589ade95d6f6db8393d', 'bd22ec1c4dbe48f3a018e96b2cd61304');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla media_storage_mediaalbum
--

CREATE TABLE media_storage_mediaalbum (
  id char(32) NOT NULL,
  name varchar(100) NOT NULL,
  description longtext NOT NULL,
  is_public tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  owner_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla media_storage_mediaalbum
--

INSERT INTO media_storage_mediaalbum (id, name, description, is_public, created_at, updated_at, owner_id) VALUES
('1ecccbdcc4394f0992894a43decc05a9', 'Fotos de Perfil', 'Historial de fotos de perfil', 1, '2025-12-13 06:04:10.776509', '2025-12-13 06:04:10.777669', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('27f915a216ee4ade9d9cb3ccf2311021', 'Fotos de Portada', 'Historial de fotos de portada', 1, '2025-12-13 06:14:16.932530', '2025-12-13 06:14:16.932530', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('913b9c39075146de8775d0996b73928d', 'Fotos de Portada', 'Historial de fotos de portada', 1, '2025-12-20 21:04:03.195968', '2025-12-20 21:04:03.195968', '4cccc11a7e634423bf92808272ad4b52'),
('bfb5ae9aa05e4b008a56b60b36320720', 'Fotos de Perfil', 'Historial de fotos de perfil', 1, '2025-12-20 21:03:40.517477', '2025-12-20 21:03:40.517477', '4cccc11a7e634423bf92808272ad4b52'),
('c042835ad2b540ec87824c63171a2e77', 'Fotos de Portada', 'Historial de fotos de portada', 1, '2025-12-13 06:03:58.344170', '2025-12-13 06:03:58.344170', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('c50bca5f39634e508ac11c91dba64458', 'Fotos de Perfil', 'Historial de fotos de perfil', 1, '2025-12-13 06:14:03.043264', '2025-12-13 06:14:03.043264', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('faa99a5874ac433ebd50eee177ee94df', 'Fotos de Portada', 'Historial de fotos de portada', 1, '2025-12-13 06:17:56.033911', '2025-12-13 06:17:56.033911', 'e3702132b6cb45d2a390e6b1b5f254ab'),
('fd390a014d784e3aa1d0065654a0f6ff', 'Fotos de Perfil', 'Historial de fotos de perfil', 1, '2025-12-13 06:17:45.633354', '2025-12-13 06:17:45.633354', 'e3702132b6cb45d2a390e6b1b5f254ab');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla media_storage_mediaalbum_files
--

CREATE TABLE media_storage_mediaalbum_files (
  id bigint(20) NOT NULL,
  mediaalbum_id char(32) NOT NULL,
  mediafile_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla media_storage_mediaalbum_files
--

INSERT INTO media_storage_mediaalbum_files (id, mediaalbum_id, mediafile_id) VALUES
(2, '1ecccbdcc4394f0992894a43decc05a9', '10301d399ef74c4e8f3879e950d0b3d9'),
(8, '1ecccbdcc4394f0992894a43decc05a9', 'be333f687952463698a01b2c2e9cbd64'),
(4, '27f915a216ee4ade9d9cb3ccf2311021', 'b4c5743babba4454a8709b7e720f8def'),
(10, '913b9c39075146de8775d0996b73928d', '766ff501df614dfdb9c73a03ff783e5e'),
(11, '913b9c39075146de8775d0996b73928d', '7c8d8e997a3f4e77b1bf91d46616c513'),
(9, 'bfb5ae9aa05e4b008a56b60b36320720', '07d4e124ffdb405e957c9bbce887fec1'),
(12, 'bfb5ae9aa05e4b008a56b60b36320720', '6c0e2743f12444498d6b6b602bf895df'),
(13, 'c042835ad2b540ec87824c63171a2e77', '0679f80ecc7e474bbfff821068d44377'),
(1, 'c042835ad2b540ec87824c63171a2e77', '8f1ad44c3a5d4c73a66446e4bbdd09bb'),
(3, 'c50bca5f39634e508ac11c91dba64458', '4b98d348524a4bb38eeb347063354297'),
(7, 'c50bca5f39634e508ac11c91dba64458', '78dea025c9634e2288e9ad7ef47a6ba9'),
(6, 'faa99a5874ac433ebd50eee177ee94df', 'de4cdaf61f9f42d3a5f37a754acfa9ce'),
(5, 'fd390a014d784e3aa1d0065654a0f6ff', 'f9693629276f42a388f4038149b8e63b');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla media_storage_mediafile
--

CREATE TABLE media_storage_mediafile (
  id char(32) NOT NULL,
  file varchar(100) NOT NULL,
  file_type varchar(10) NOT NULL,
  original_name varchar(255) NOT NULL,
  file_size int(10) UNSIGNED NOT NULL CHECK (file_size >= 0),
  mime_type varchar(100) NOT NULL,
  width int(10) UNSIGNED DEFAULT NULL CHECK (width >= 0),
  height int(10) UNSIGNED DEFAULT NULL CHECK (height >= 0),
  duration bigint(20) DEFAULT NULL,
  is_public tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  uploaded_by_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla media_storage_mediafile
--

INSERT INTO media_storage_mediafile (id, file, file_type, original_name, file_size, mime_type, width, height, duration, is_public, created_at, updated_at, uploaded_by_id) VALUES
('0679f80ecc7e474bbfff821068d44377', 'covers/6b67e37bfe7d7c2190b9cd69ba9e9e6b.jpg', 'image', '6b67e37bfe7d7c2190b9cd69ba9e9e6b.jpg', 114428, 'image/jpeg', NULL, NULL, NULL, 1, '2025-12-21 02:28:44.394372', '2025-12-21 02:28:44.394372', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('07d4e124ffdb405e957c9bbce887fec1', 'avatars/4e9d31195bccfad4ef0d44e232488f71_aQfQ3Ed.jpg', 'image', '4e9d31195bccfad4ef0d44e232488f71.jpg', 39373, 'image/jpeg', NULL, NULL, NULL, 1, '2025-12-20 21:03:40.529316', '2025-12-20 21:03:40.529316', '4cccc11a7e634423bf92808272ad4b52'),
('10301d399ef74c4e8f3879e950d0b3d9', 'avatars/2b5ee027788c547d30f8484713c526eb.jpg', 'image', '2b5ee027788c547d30f8484713c526eb.jpg', 59569, 'image/jpeg', NULL, NULL, NULL, 1, '2025-12-13 06:04:10.789683', '2025-12-13 06:04:10.789683', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('4b98d348524a4bb38eeb347063354297', 'avatars/a89a2a104267b3d391cff56ea66debf9_2NcHC2X.jpg', 'image', 'a89a2a104267b3d391cff56ea66debf9.jpg', 53335, 'image/jpeg', NULL, NULL, NULL, 1, '2025-12-13 06:14:03.061646', '2025-12-13 06:14:03.061646', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('6c0e2743f12444498d6b6b602bf895df', 'avatars/afb30955a4f8909572ed5e60291d1763.jpg', 'image', 'afb30955a4f8909572ed5e60291d1763.jpg', 138788, 'image/jpeg', NULL, NULL, NULL, 1, '2025-12-20 21:04:33.825997', '2025-12-20 21:04:33.825997', '4cccc11a7e634423bf92808272ad4b52'),
('766ff501df614dfdb9c73a03ff783e5e', 'covers/4707d30c59593d31c049c277cf837137_7b1EWzk.jpg', 'image', '4707d30c59593d31c049c277cf837137.jpg', 783644, 'image/jpeg', NULL, NULL, NULL, 1, '2025-12-20 21:04:03.200991', '2025-12-20 21:04:03.200991', '4cccc11a7e634423bf92808272ad4b52'),
('78dea025c9634e2288e9ad7ef47a6ba9', 'avatars/103af20008e2b0b1cecdadff56ff5fcb.jpg', 'image', '103af20008e2b0b1cecdadff56ff5fcb.jpg', 120617, 'image/jpeg', NULL, NULL, NULL, 1, '2025-12-13 06:41:05.973784', '2025-12-13 06:41:05.973784', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('7c8d8e997a3f4e77b1bf91d46616c513', 'covers/488c61ff134bb1ee885a536c177b5735_3RB6wwt.jpg', 'image', '488c61ff134bb1ee885a536c177b5735.jpg', 197759, 'image/jpeg', NULL, NULL, NULL, 1, '2025-12-20 21:04:19.779230', '2025-12-20 21:04:19.779230', '4cccc11a7e634423bf92808272ad4b52'),
('8f1ad44c3a5d4c73a66446e4bbdd09bb', 'covers/4707d30c59593d31c049c277cf837137_E6M6v62.jpg', 'image', '4707d30c59593d31c049c277cf837137.jpg', 783644, 'image/jpeg', NULL, NULL, NULL, 1, '2025-12-13 06:03:58.358172', '2025-12-13 06:03:58.358172', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('b4c5743babba4454a8709b7e720f8def', 'covers/488c61ff134bb1ee885a536c177b5735.jpg', 'image', '488c61ff134bb1ee885a536c177b5735.jpg', 197759, 'image/jpeg', NULL, NULL, NULL, 1, '2025-12-13 06:14:16.936627', '2025-12-13 06:14:16.936627', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('be333f687952463698a01b2c2e9cbd64', 'avatars/4e9d31195bccfad4ef0d44e232488f71.jpg', 'image', '4e9d31195bccfad4ef0d44e232488f71.jpg', 39373, 'image/jpeg', NULL, NULL, NULL, 1, '2025-12-16 17:46:46.086704', '2025-12-16 17:46:46.086704', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('de4cdaf61f9f42d3a5f37a754acfa9ce', 'covers/Captura_de_pantalla_2025-12-13_005008.png', 'image', 'Captura de pantalla 2025-12-13 005008.png', 583067, 'image/png', NULL, NULL, NULL, 1, '2025-12-13 06:17:56.048801', '2025-12-13 06:17:56.048801', 'e3702132b6cb45d2a390e6b1b5f254ab'),
('f9693629276f42a388f4038149b8e63b', 'avatars/Logo_Habilidosos_MR_blanco4x.png', 'image', 'Logo Habilidosos MR (blanco)@4x.png', 469617, 'image/png', NULL, NULL, NULL, 1, '2025-12-13 06:17:45.646926', '2025-12-13 06:17:45.646926', 'e3702132b6cb45d2a390e6b1b5f254ab');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla messages
--

CREATE TABLE messages (
  id char(32) NOT NULL,
  content longtext NOT NULL,
  message_type varchar(10) NOT NULL,
  image varchar(100) DEFAULT NULL,
  video varchar(100) DEFAULT NULL,
  audio varchar(100) DEFAULT NULL,
  file_url varchar(200) NOT NULL,
  file_name varchar(255) NOT NULL,
  file_size int(10) UNSIGNED DEFAULT NULL CHECK (file_size >= 0),
  is_edited tinyint(1) NOT NULL,
  is_deleted tinyint(1) NOT NULL,
  deleted_at datetime(6) DEFAULT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  chat_room_id char(32) NOT NULL,
  reply_to_id char(32) DEFAULT NULL,
  sender_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla messages
--

INSERT INTO messages (id, content, message_type, image, video, audio, file_url, file_name, file_size, is_edited, is_deleted, deleted_at, created_at, updated_at, chat_room_id, reply_to_id, sender_id) VALUES
('031da85231ef4be996fd8df4c59e0022', 'oe', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 01:12:27.537020', '2025-12-21 01:12:27.537020', 'eaf6777252484757b628ede0bc918c68', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('04874d20997047f18af4cc244304c1db', 'test de mensage', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 01:12:58.471257', '2025-12-21 01:12:58.471257', 'eaf6777252484757b628ede0bc918c68', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('0b83f9b87ca1475db6de603fba306a55', '¡Hola! 👋', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 18:05:19.175657', '2025-12-21 18:05:19.175657', '8321f9f9db4a47e28398ccaf8f782732', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('137017b6c60842c68f6b1ab581726ba6', '👍', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 18:08:48.970407', '2025-12-21 18:08:48.970407', 'eaf6777252484757b628ede0bc918c68', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('1580091035dd43b1a0d579dd9ff9cb82', 'g', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:12:31.178752', '2025-12-21 02:12:31.178752', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('1ad06bcb991b4021961be2ab75da4e2f', 'ytfgyh', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-22 13:39:52.902748', '2025-12-22 13:39:52.902748', 'eaf6777252484757b628ede0bc918c68', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('1dd71c818efe4461972a89f3b36188f1', 'juj', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:12:44.780246', '2025-12-21 02:12:44.780246', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('1e55ba95055d4ddcb0a42efb42eb7fad', 'g', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:08:07.353410', '2025-12-21 02:08:07.353410', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('2175e6822f234de9893aefaca8f220d1', '¡Hola! 👋', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 01:51:29.808160', '2025-12-21 01:51:29.808160', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('24777f50f71e437da4d9abec9ac2482a', 'como vas', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 01:13:53.643436', '2025-12-21 01:13:53.643436', 'eaf6777252484757b628ede0bc918c68', NULL, '6f053d432986406289a54b930e90924f'),
('2dd68ffc68f44f5fbf487c1078a86398', 'g', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:08:11.936455', '2025-12-21 02:08:11.936455', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('30ea0b9ba76748ceb5add28dbb22a81f', 'bcbg', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-22 01:26:32.857479', '2025-12-22 01:26:32.857479', 'eaf6777252484757b628ede0bc918c68', NULL, '6f053d432986406289a54b930e90924f'),
('37c5a004a00e4e47a4b8ef30ba971508', 'g', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:08:01.451276', '2025-12-21 02:08:01.451276', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('4c862284c842475599b7ecc924adce00', 'g', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:08:05.807005', '2025-12-21 02:08:05.807005', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('5f5612afbb7b41dd840635d579a3f7e7', 'g', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:08:09.227049', '2025-12-21 02:08:09.227049', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('6f786d72e0324dc2a4c7c9787cff5001', 'kjnmn mn', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 18:05:08.223263', '2025-12-21 18:05:08.223263', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('7363b87e50a649cd898a4c171c9a2125', 'g', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:07:58.498451', '2025-12-21 02:07:58.498451', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('79f0eec4395b49f5827a6db62b7939e6', 'fgbfdfr', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-22 12:34:09.454198', '2025-12-22 12:34:09.454198', 'eaf6777252484757b628ede0bc918c68', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('7aaf2b83203a43fe90f4b426def51174', 'g', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:07:59.840390', '2025-12-21 02:07:59.840390', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('7ac00221f40c4d23b2c5d8c76c0ae6ef', '¡Hola! 👋', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:51:31.084684', '2025-12-21 02:51:31.084684', '36fc76299c6b4793bfc8c89461facd4e', NULL, '6f053d432986406289a54b930e90924f'),
('82cd964680e8463cbdc8bb7b4d2376f8', 'jhfg', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 01:59:49.030369', '2025-12-21 01:59:49.030369', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('839f531fc7c949f688666059a25859c0', 'h', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:07:52.879015', '2025-12-21 02:07:52.879969', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('83e6d58973a94fd0ae055a6c49e32511', '🦝', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2026-01-19 17:17:06.053597', '2026-01-19 17:17:06.053597', 'eaf6777252484757b628ede0bc918c68', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('87583742b8994cbe82663e2e6c0f598e', 'tttt', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 01:59:44.536199', '2025-12-21 01:59:44.536199', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('956c2d069aba4b5290fcb39a147f08d8', 'yyy', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:12:28.951929', '2025-12-21 02:12:28.951929', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('9a312702fde649989a1fdb30208b4347', 'gygyh', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-22 13:23:26.530927', '2025-12-22 13:23:26.530927', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('9be8d9849def4f248cd3cda5d60dbcbc', 'mmnhb vnvgb', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 18:06:51.046345', '2025-12-21 18:06:51.046345', 'eaf6777252484757b628ede0bc918c68', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('9d90322f416945a6b61dfc4572f1ac4b', 'gvhbjnmkl,', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2026-01-15 18:05:52.438679', '2026-01-15 18:05:52.438679', 'eaf6777252484757b628ede0bc918c68', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('a2523dadffff4f8d9e9c36804568005b', 'g', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:08:04.142321', '2025-12-21 02:08:04.142321', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('a3e19d89ab59423aa9a512a883159233', 'nnfg', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:51:23.456217', '2025-12-21 02:51:23.456217', 'eaf6777252484757b628ede0bc918c68', NULL, '6f053d432986406289a54b930e90924f'),
('ab07ee17a31049268607e928839bb9ea', 'n vngh', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:51:33.240326', '2025-12-21 02:51:33.240326', '36fc76299c6b4793bfc8c89461facd4e', NULL, '6f053d432986406289a54b930e90924f'),
('b77e8b0ef2144de08996179e927029fd', 'g', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:07:56.716867', '2025-12-21 02:07:56.716867', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('ba185edf22ac425daef3e8f94b89157f', 'drftgyhujikoiuhg', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-22 13:39:58.556260', '2025-12-22 13:39:58.556260', 'eaf6777252484757b628ede0bc918c68', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('c0851ae372d844ea84573ad7fd487739', 'lkjnlj', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 01:38:52.621784', '2025-12-21 01:38:52.621784', 'eaf6777252484757b628ede0bc918c68', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('c9970e7599104ff5a6df88521b1924e0', 'ljmkjn', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 18:04:57.247501', '2025-12-21 18:04:57.247501', 'eaf6777252484757b628ede0bc918c68', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('ddf1dcf31b734a939f67d2dd3dfd0336', '🙏', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2026-01-19 11:30:46.102853', '2026-01-19 11:30:46.102944', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('eacfec0bcec543759e13cf592125a5c0', '🦝', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2026-01-19 17:16:52.520651', '2026-01-19 17:16:52.520651', 'eaf6777252484757b628ede0bc918c68', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('ee35291a1b764843bd92ee1e7026fddd', 'fgff', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 02:12:17.935127', '2025-12-21 02:12:17.942313', 'cadbdb195c194d9ca23407060754e886', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('f1784eae2c7b44a19050494d78eec894', 'holaaa', 'text', '', '', '', '', '', NULL, 0, 0, NULL, '2025-12-21 01:13:46.741893', '2025-12-21 01:13:46.741893', 'eaf6777252484757b628ede0bc918c68', NULL, '6f053d432986406289a54b930e90924f');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla message_reactions
--

CREATE TABLE message_reactions (
  id char(32) NOT NULL,
  reaction_type varchar(10) NOT NULL,
  created_at datetime(6) NOT NULL,
  message_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla message_reads
--

CREATE TABLE message_reads (
  id char(32) NOT NULL,
  read_at datetime(6) NOT NULL,
  message_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla message_reads
--

INSERT INTO message_reads (id, read_at, message_id, user_id) VALUES
('2c094ed28d1a489bbfcdb629740daa89', '2025-12-21 18:04:52.752755', 'a3e19d89ab59423aa9a512a883159233', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('3c4323189e5f4b96849a07f09308c32b', '2025-12-22 12:32:22.685583', '30ea0b9ba76748ceb5add28dbb22a81f', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('47e16dbbd03c456cb93502fe3fae0147', '2025-12-21 01:14:27.781959', '24777f50f71e437da4d9abec9ac2482a', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('6a88982e06564ef5940e633067b1b834', '2025-12-22 01:26:24.808987', 'c9970e7599104ff5a6df88521b1924e0', '6f053d432986406289a54b930e90924f'),
('6d9b3bf5a6e744b9a21cee16bcb1f2ae', '2025-12-22 01:26:24.808987', '9be8d9849def4f248cd3cda5d60dbcbc', '6f053d432986406289a54b930e90924f'),
('98373f122cb24b8b99e54e6d8c6cef8f', '2025-12-21 02:51:19.246035', 'c0851ae372d844ea84573ad7fd487739', '6f053d432986406289a54b930e90924f'),
('aa4fb730b1394f8bad570b9921003069', '2025-12-21 01:14:27.781959', 'f1784eae2c7b44a19050494d78eec894', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('c3c7ea9c76db480abda83266d4705d4d', '2025-12-22 01:26:24.808987', '137017b6c60842c68f6b1ab581726ba6', '6f053d432986406289a54b930e90924f'),
('daec474ef39f4a7d984f3a57a8b12c3a', '2025-12-21 01:13:42.444751', '04874d20997047f18af4cc244304c1db', '6f053d432986406289a54b930e90924f'),
('fddaf551b3134a488a58828957149a42', '2025-12-21 01:13:42.444751', '031da85231ef4be996fd8df4c59e0022', '6f053d432986406289a54b930e90924f');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla notifications
--

CREATE TABLE notifications (
  id char(32) NOT NULL,
  notification_type varchar(20) NOT NULL,
  post_id char(32) DEFAULT NULL,
  comment_id char(32) DEFAULT NULL,
  message longtext NOT NULL,
  is_read tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  read_at datetime(6) DEFAULT NULL,
  recipient_id char(32) NOT NULL,
  sender_id char(32) NOT NULL,
  friend_request_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla notifications
--

INSERT INTO notifications (id, notification_type, post_id, comment_id, message, is_read, created_at, read_at, recipient_id, sender_id, friend_request_id) VALUES
('05702159f46e43eeab6e1eca55553f61', 'follow', NULL, NULL, 'yasmin pinzon comenzó a seguirte', 1, '2025-12-13 05:20:02.535761', '2025-12-13 06:04:38.806045', 'bd22ec1c4dbe48f3a018e96b2cd61304', '6f053d432986406289a54b930e90924f', NULL),
('07429f6689274823890502dbfe203351', 'like', '1be604c14fe44f0baca2aa1b86cc79b1', NULL, 'Pedro Sánchez le dio me gusta a tu publicación', 0, '2025-12-02 05:01:45.907128', NULL, '98ca610eafbc4827b95e754c9c0a6b23', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('0d4b651a1ec141028099f6c9d4f943a4', 'celebration', '9a564e5c32f04343a53e575753bafa06', NULL, ' celebró tu publicación', 0, '2025-12-02 05:01:45.805843', NULL, '98ca610eafbc4827b95e754c9c0a6b23', '294820a41aad4ff0abb05e9f5886555c', NULL),
('0ea8d4cda1e54b2b99a01ab8069c5c60', 'like', '934d82e29f5b4e06beb30be7aa9dc189', NULL, 'Pedro Sánchez le dio me gusta a tu publicación', 0, '2025-12-13 06:15:36.681586', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('1124e8b8e9f44b0ba3a71bfaae428ad3', 'golazo', 'b0599d83ab3c47eca60961cd35b15378', NULL, 'Ana Martínez dijo ¡Golazo! a tu publicación', 0, '2025-12-02 05:01:45.552267', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', '98ca610eafbc4827b95e754c9c0a6b23', NULL),
('11e686b0fdfe4d3084064ff7e8cc8ae9', 'like', '9a564e5c32f04343a53e575753bafa06', NULL, 'Pedro Sánchez le dio me gusta a tu publicación', 0, '2025-12-02 05:01:45.772536', NULL, '98ca610eafbc4827b95e754c9c0a6b23', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('156f6e0149054122b580807a160c75fb', 'celebration', '82ebc62813ce46e79770252e7853b72b', NULL, 'Pedro Sánchez celebró tu publicación', 0, '2025-12-13 06:16:31.811230', NULL, '6f053d432986406289a54b930e90924f', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('17f69d73e9684648ac72be28786ce2ad', 'golazo', '961abca22fc44984b5c67b73e2a27889', NULL, 'María García dijo ¡Golazo! a tu publicación', 0, '2025-12-02 05:01:47.293278', NULL, '294820a41aad4ff0abb05e9f5886555c', '84c5e41a9e4348548886b797643f91f8', NULL),
('1a47d48c53564fe696af64d4f4808d1e', 'celebration', 'd37b729e6a024648aeced808750951d7', NULL, 'Camilo Gomez celebró tu publicación', 0, '2026-01-15 20:57:41.061351', NULL, 'e3702132b6cb45d2a390e6b1b5f254ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('1aa51a42fad4415ba194ca698bc8d8d1', 'follow', NULL, NULL, 'Camilo Gomez comenzó a seguirte', 0, '2025-12-03 17:47:14.180599', NULL, '4912c5171c6d48d4bdbcfbd889a9143c', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('1d387de8df524f408f01c7ac775e35bd', 'friend_accept', NULL, NULL, 'Pedro Sánchez aceptó tu solicitud de amistad', 1, '2025-12-02 18:59:15.193102', '2025-12-03 16:23:56.985063', 'bd22ec1c4dbe48f3a018e96b2cd61304', '4265f3cd6c7a493b9e35efbacd3b3a6b', '8639a1d829624e8c88630f7b8526a971'),
('2108eb7375bd4706a9c30f376b7be67e', 'friend_request', NULL, NULL, 'Camilo Gomez te envió una solicitud de amistad', 0, '2025-12-02 18:54:44.302191', NULL, '98ca610eafbc4827b95e754c9c0a6b23', 'bd22ec1c4dbe48f3a018e96b2cd61304', '5ff824127e09432db5697415365bcfcb'),
('21a02b08bb0c4fad8ef6968d74eef889', 'golazo', '1be604c14fe44f0baca2aa1b86cc79b1', NULL, 'María García dijo ¡Golazo! a tu publicación', 0, '2025-12-02 05:01:45.863044', NULL, '98ca610eafbc4827b95e754c9c0a6b23', '84c5e41a9e4348548886b797643f91f8', NULL),
('23e8984d0e1a4c3da4922b7167a29082', 'golazo', '77af2960e23f418796375fe79b1ee562', NULL, 'Carlos López dijo ¡Golazo! a tu publicación', 0, '2025-12-02 05:01:45.955185', NULL, '98ca610eafbc4827b95e754c9c0a6b23', 'd355c06d9f2b4fefbd6e3a4dab17b284', NULL),
('2619b5c1c429402ab8ed50a33e3569ed', 'celebration', '89400893ce23405b93de645282cb549f', NULL, ' celebró tu publicación', 0, '2025-12-02 05:01:45.605795', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', 'ec300baec9ef4c0696e10abca991ac64', NULL),
('275dc79c11094d188993d42a74838f01', 'like', '13347ecb35b54ed89065643f926bea01', NULL, 'Pedro Sánchez le dio me gusta a tu publicación', 1, '2025-12-13 06:56:23.548039', '2025-12-13 07:08:30.184605', 'bd22ec1c4dbe48f3a018e96b2cd61304', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('2e4d885507684aabab7bf7129d262399', 'golazo', '23d9b313495248d2b5f547d79cc84924', NULL, ' dijo ¡Golazo! a tu publicación', 0, '2025-12-02 05:01:46.457692', NULL, '84c5e41a9e4348548886b797643f91f8', 'ec300baec9ef4c0696e10abca991ac64', NULL),
('30168eb23e0b4493b0945fefd31cff91', 'like', '940984dfa25a44bbaffc912e0879c290', NULL, 'yasmin pinzon le dio me gusta a tu publicación', 0, '2025-12-16 16:32:22.670190', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', '6f053d432986406289a54b930e90924f', NULL),
('31657992849e4ffca889a4f5be7972f6', 'friend_request', NULL, NULL, 'Pedro Sánchez te envió una solicitud de amistad', 0, '2025-12-13 06:14:50.628429', NULL, '6113e8aa7db5436cb894bcb84c4491e0', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'f7d8f97dae454f1084a804998be4ce13'),
('33d42faeff4f40c09b9c9eb006fd0094', 'celebration', 'c4a160da5ebf4969bdc6514bd3519945', NULL, 'Ana Martínez celebró tu publicación', 0, '2025-12-02 05:01:47.115805', NULL, '294820a41aad4ff0abb05e9f5886555c', '98ca610eafbc4827b95e754c9c0a6b23', NULL),
('3c28688fc972405d8d22ef4c1168b2e4', 'friend_request', NULL, NULL, 'Camilo Gomez te envió una solicitud de amistad', 0, '2025-12-16 17:41:51.330335', NULL, 'd355c06d9f2b4fefbd6e3a4dab17b284', 'bd22ec1c4dbe48f3a018e96b2cd61304', '135cfe6cc5d146e5ba2d0d628d0f4424'),
('3d816fd409a24c6cbeb28f2fd11a37d4', 'like', '77af2960e23f418796375fe79b1ee562', NULL, 'María García le dio me gusta a tu publicación', 0, '2025-12-02 05:01:46.006820', NULL, '98ca610eafbc4827b95e754c9c0a6b23', '84c5e41a9e4348548886b797643f91f8', NULL),
('3e917f71c1084948bcda712f8b631659', 'friend_accept', NULL, NULL, 'yasmin pinzon aceptó tu solicitud de amistad', 1, '2025-12-13 05:26:21.492980', '2025-12-13 06:04:36.023788', 'bd22ec1c4dbe48f3a018e96b2cd61304', '6f053d432986406289a54b930e90924f', 'f59193753a074de9a8b11a9144d71aed'),
('43d7bc1a05994b89931cc164f242e97e', 'follow', NULL, NULL, 'M0L0W0R1D comenzó a seguirte', 0, '2025-12-20 21:18:51.865351', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304', '4cccc11a7e634423bf92808272ad4b52', NULL),
('486cb3a56abf4da387cdbf5d4474dcf9', 'friend_accept', NULL, NULL, 'yasmin pinzon aceptó tu solicitud de amistad', 0, '2025-12-15 10:41:50.514019', NULL, 'e3702132b6cb45d2a390e6b1b5f254ab', '6f053d432986406289a54b930e90924f', '3576ad1bf04d483cb6536c45b0e7975e'),
('5161be1c70ac4eeab9d7038f5071ae6c', 'like', 'c4a160da5ebf4969bdc6514bd3519945', NULL, 'Pedro Sánchez le dio me gusta a tu publicación', 0, '2025-12-02 05:01:47.068066', NULL, '294820a41aad4ff0abb05e9f5886555c', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('55cfd25ab41347698e8ba4dcc570b95d', 'friend_accept', NULL, NULL, 'Camilo Gomez aceptó tu solicitud de amistad', 0, '2025-12-13 06:19:02.005470', NULL, 'e3702132b6cb45d2a390e6b1b5f254ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'a978f4711d4c43398b781fe3bd859369'),
('5cba5d25842746deb537f61162ded413', 'friend_request', NULL, NULL, 'yasmin pinzon te envió una solicitud de amistad', 0, '2025-12-15 10:41:43.201148', NULL, '84c5e41a9e4348548886b797643f91f8', '6f053d432986406289a54b930e90924f', '3c02523c096d4fb09866f148e135112a'),
('5cf8c0c0baea449d811e5066ef5acb3c', 'golazo', '2254d51ec7634f6791d4a69df811774f', NULL, ' dijo ¡Golazo! a tu publicación', 0, '2025-12-02 05:01:46.124324', NULL, 'd355c06d9f2b4fefbd6e3a4dab17b284', 'ec300baec9ef4c0696e10abca991ac64', NULL),
('5e861daeb1a5435cb66c5def1acf8032', 'golazo', '1f11ae95085a4162b1c93684151fe12f', NULL, 'María García dijo ¡Golazo! a tu publicación', 0, '2025-12-02 05:01:46.251803', NULL, 'd355c06d9f2b4fefbd6e3a4dab17b284', '84c5e41a9e4348548886b797643f91f8', NULL),
('5f8d3b1081314fdfb9ab4fa2727da519', 'celebration', 'ba60f72242ca4bb6b80fb0e8b8caec75', NULL, ' celebró tu publicación', 0, '2025-12-02 05:01:47.198945', NULL, '294820a41aad4ff0abb05e9f5886555c', 'ec300baec9ef4c0696e10abca991ac64', NULL),
('600c1d20d4034f8d8d598c263c0b435d', 'comment', '13347ecb35b54ed89065643f926bea01', 'b36c836a82c54cba9e8db3a633a279fe', 'Pedro Sánchez comentó tu publicación', 1, '2025-12-13 06:55:27.400805', '2025-12-15 15:58:01.138526', 'bd22ec1c4dbe48f3a018e96b2cd61304', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('62a4517b719b4b1995468c3d5707dc23', 'comment', 'd72fbee5c076487c94d0f4170f15723b', '17484e941672448f8dbc128d994e5807', 'Camilo Gomez comentó tu publicación', 0, '2026-01-15 18:07:15.264024', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('62e79ba2011d481ab2fd8e09baea946f', 'celebration', '82ebc62813ce46e79770252e7853b72b', NULL, 'Camilo Gomez celebró tu publicación', 0, '2026-01-16 15:41:18.367389', NULL, '6f053d432986406289a54b930e90924f', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('66feeabd69b2441280979e14139295da', 'golazo', '6b853daa6cbe4926848dd849341af84e', NULL, 'Pedro Sánchez dijo ¡Golazo! a tu publicación', 0, '2025-12-02 05:01:46.542007', NULL, 'ec300baec9ef4c0696e10abca991ac64', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('67d1eb4db139463792de41ee62d7c861', 'like', 'd37b729e6a024648aeced808750951d7', NULL, 'Camilo Gomez le dio me gusta a tu publicación', 0, '2025-12-16 17:45:36.482044', NULL, 'e3702132b6cb45d2a390e6b1b5f254ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('6fd7506e253d45fb92ffd72fc21720ac', 'like', '82ebc62813ce46e79770252e7853b72b', NULL, 'Camilo Gomez le dio me gusta a tu publicación', 0, '2025-12-16 17:45:40.593897', NULL, '6f053d432986406289a54b930e90924f', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('724989d8e12340cbb02e8984b376aa81', 'friend_request', NULL, NULL, 'Camilo Gomez te envió una solicitud de amistad', 0, '2025-12-02 18:54:03.232377', NULL, '6f053d432986406289a54b930e90924f', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'f59193753a074de9a8b11a9144d71aed'),
('72af947d337a4aeaa9dbd3c974187318', 'celebration', '13347ecb35b54ed89065643f926bea01', NULL, 'yasmin pinzon celebró tu publicación', 1, '2025-12-13 06:54:38.291955', '2025-12-16 14:27:40.328964', 'bd22ec1c4dbe48f3a018e96b2cd61304', '6f053d432986406289a54b930e90924f', NULL),
('744a1a0ae2b140b085904e1944ff816e', 'celebration', '343ab1c08b9545e9a5992ebd45dd0e07', NULL, 'Pedro Sánchez celebró tu publicación', 0, '2025-12-02 05:01:46.058292', NULL, 'd355c06d9f2b4fefbd6e3a4dab17b284', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('75283d112c3e4118aebbfa6e7e51d000', 'celebration', 'f1a0e61feba94b22a94e828af7b04958', NULL, 'Carlos López celebró tu publicación', 0, '2025-12-02 05:01:46.736222', NULL, 'ec300baec9ef4c0696e10abca991ac64', 'd355c06d9f2b4fefbd6e3a4dab17b284', NULL),
('755825db0f544e45914f20202d806d62', 'friend_request', NULL, NULL, 'Camilo Gomez te envió una solicitud de amistad', 0, '2025-12-02 18:54:48.769260', NULL, 'ec300baec9ef4c0696e10abca991ac64', 'bd22ec1c4dbe48f3a018e96b2cd61304', '0d4ee118b68e4703ba62498dc32e7941'),
('81934594dac8456c866b852d3a5151a3', 'friend_accept', NULL, NULL, 'yasmin pinzon aceptó tu solicitud de amistad', 0, '2025-12-13 05:14:37.789346', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', '6f053d432986406289a54b930e90924f', '223357a6b6994299b42122f11fe6807d'),
('83adc0dd02b2488fb2ed2b9b406b848e', 'like', 'c4a160da5ebf4969bdc6514bd3519945', NULL, ' le dio me gusta a tu publicación', 0, '2025-12-02 05:01:47.087496', NULL, '294820a41aad4ff0abb05e9f5886555c', 'ec300baec9ef4c0696e10abca991ac64', NULL),
('83c6905804e84306aecc5f5829608f42', 'like', '82ebc62813ce46e79770252e7853b72b', NULL, 'Pedro Sánchez le dio me gusta a tu publicación', 0, '2025-12-13 06:16:30.590134', NULL, '6f053d432986406289a54b930e90924f', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('84014e295a7c4fc4b4c889cd28b8cebe', 'follow', NULL, NULL, 'Camilo Gomez comenzó a seguirte', 0, '2025-12-03 17:47:17.902772', NULL, 'e3702132b6cb45d2a390e6b1b5f254ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('841464a827ac4df89a70c14a0cafb176', 'follow', NULL, NULL, 'Sos Habilidosos comenzó a seguirte', 0, '2025-12-13 06:18:35.942286', NULL, '6f053d432986406289a54b930e90924f', 'e3702132b6cb45d2a390e6b1b5f254ab', NULL),
('876a11a8da8d41568891a1ad712a53ec', 'golazo', 'd37b729e6a024648aeced808750951d7', NULL, 'Camilo Gomez dijo ¡Golazo! a tu publicación', 0, '2026-01-15 20:57:44.639893', NULL, 'e3702132b6cb45d2a390e6b1b5f254ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('88cce89dea024d47bb19c6b1a15e6f60', 'like', '6b853daa6cbe4926848dd849341af84e', NULL, 'Ana Martínez le dio me gusta a tu publicación', 0, '2025-12-02 05:01:46.585810', NULL, 'ec300baec9ef4c0696e10abca991ac64', '98ca610eafbc4827b95e754c9c0a6b23', NULL),
('8974c4e0fe55462fb84072518eb1d553', 'celebration', '1f11ae95085a4162b1c93684151fe12f', NULL, 'Pedro Sánchez celebró tu publicación', 0, '2025-12-02 05:01:46.266481', NULL, 'd355c06d9f2b4fefbd6e3a4dab17b284', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('898d57fcab89406e99dff33f8bcd7a4a', 'celebration', 'f1a0e61feba94b22a94e828af7b04958', NULL, 'Pedro Sánchez celebró tu publicación', 0, '2025-12-02 05:01:46.707704', NULL, 'ec300baec9ef4c0696e10abca991ac64', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('8affedd31f274544ab5f40299967913c', 'friend_request', NULL, NULL, 'Camilo Gomez te envió una solicitud de amistad', 1, '2025-12-02 18:54:54.792924', '2025-12-02 19:11:32.398095', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'bd22ec1c4dbe48f3a018e96b2cd61304', '8639a1d829624e8c88630f7b8526a971'),
('8df234bb3c18438291105946476448f0', 'celebration', 'd37b729e6a024648aeced808750951d7', NULL, 'Camilo Gomez celebró tu publicación', 0, '2026-01-15 20:57:43.472542', NULL, 'e3702132b6cb45d2a390e6b1b5f254ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('8e716ae72ab14c42be29d6b1fbf7cbcb', 'celebration', '23d9b313495248d2b5f547d79cc84924', NULL, 'Pedro Sánchez celebró tu publicación', 0, '2025-12-02 05:01:46.434991', NULL, '84c5e41a9e4348548886b797643f91f8', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('8eeaf4e6c3d948c89900efa217322d03', 'celebration', 'd72fbee5c076487c94d0f4170f15723b', NULL, 'Camilo Gomez celebró tu publicación', 0, '2026-01-15 18:07:03.924563', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('93d45681cab74f68b87a19bba8c6aad1', 'friend_request', NULL, NULL, 'Camilo Gomez te envió una solicitud de amistad', 0, '2025-12-02 18:54:37.201961', NULL, '294820a41aad4ff0abb05e9f5886555c', 'bd22ec1c4dbe48f3a018e96b2cd61304', '8031d4f4ef0d4c72b4cd8abb7071b01e'),
('948ed05ea7794dfbac7a67715a85e24d', 'like', '1f11ae95085a4162b1c93684151fe12f', NULL, ' le dio me gusta a tu publicación', 0, '2025-12-02 05:01:46.208503', NULL, 'd355c06d9f2b4fefbd6e3a4dab17b284', '294820a41aad4ff0abb05e9f5886555c', NULL),
('96f19d8411d741a9b719ba0219d4e8f0', 'celebration', 'ba60f72242ca4bb6b80fb0e8b8caec75', NULL, 'María García celebró tu publicación', 0, '2025-12-02 05:01:47.214530', NULL, '294820a41aad4ff0abb05e9f5886555c', '84c5e41a9e4348548886b797643f91f8', NULL),
('99a1f643e04b48ffaec55ad6afcabbb7', 'golazo', '2dd1763d352947b69b5b230d03f87de3', NULL, 'Ana Martínez dijo ¡Golazo! a tu publicación', 0, '2025-12-02 05:01:47.377634', NULL, '294820a41aad4ff0abb05e9f5886555c', '98ca610eafbc4827b95e754c9c0a6b23', NULL),
('9a05e1c67c134daf80627bf3188635b2', 'celebration', '9a564e5c32f04343a53e575753bafa06', NULL, 'María García celebró tu publicación', 0, '2025-12-02 05:01:45.787305', NULL, '98ca610eafbc4827b95e754c9c0a6b23', '84c5e41a9e4348548886b797643f91f8', NULL),
('9a2d7b63419c4039aaf7e87382817874', 'friend_request', NULL, NULL, 'Camilo Gomez te envió una solicitud de amistad', 0, '2025-12-02 18:54:06.424867', NULL, '1225e5006c6942fbb872836ab222e4e1', 'bd22ec1c4dbe48f3a018e96b2cd61304', '4bd9fc9690f445258705091d4b100601'),
('9b0bf58343f146e1a078530d3c2bfbc9', 'celebration', '2254d51ec7634f6791d4a69df811774f', NULL, ' celebró tu publicación', 0, '2025-12-02 05:01:46.104917', NULL, 'd355c06d9f2b4fefbd6e3a4dab17b284', '294820a41aad4ff0abb05e9f5886555c', NULL),
('9ba483136bfc4f848453d6e606b76694', 'friend_request', NULL, NULL, 'M0L0W0R1D te envió una solicitud de amistad', 1, '2025-12-20 21:05:33.127697', '2025-12-21 02:34:35.505645', 'bd22ec1c4dbe48f3a018e96b2cd61304', '4cccc11a7e634423bf92808272ad4b52', '97bdbfd753884817b6728c049c5e6c3d'),
('9edec010472640849449253319e265aa', 'golazo', '1f11ae95085a4162b1c93684151fe12f', NULL, 'Ana Martínez dijo ¡Golazo! a tu publicación', 0, '2025-12-02 05:01:46.234663', NULL, 'd355c06d9f2b4fefbd6e3a4dab17b284', '98ca610eafbc4827b95e754c9c0a6b23', NULL),
('a1a688ea0f3748bf82f1e32363ee1b83', 'celebration', '1be604c14fe44f0baca2aa1b86cc79b1', NULL, ' celebró tu publicación', 0, '2025-12-02 05:01:45.883240', NULL, '98ca610eafbc4827b95e754c9c0a6b23', 'ec300baec9ef4c0696e10abca991ac64', NULL),
('a26bb687a7d543caab53d40172863376', 'follow', NULL, NULL, 'Camilo Gomez comenzó a seguirte', 0, '2025-12-03 17:47:13.126491', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('a3b0218c9b8441859acc77fff8b26f1d', 'like', 'd37b729e6a024648aeced808750951d7', NULL, 'Camilo Gomez le dio me gusta a tu publicación', 0, '2026-01-20 16:15:21.435263', NULL, 'e3702132b6cb45d2a390e6b1b5f254ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('a8dbd3748dc84d3b970b8e3b80e2cf89', 'celebration', '89400893ce23405b93de645282cb549f', NULL, 'Ana Martínez celebró tu publicación', 0, '2025-12-02 05:01:45.658403', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', '98ca610eafbc4827b95e754c9c0a6b23', NULL),
('aaca87c5bc7141f9b40d1ffe77ca221c', 'celebration', '6b853daa6cbe4926848dd849341af84e', NULL, ' celebró tu publicación', 0, '2025-12-02 05:01:46.565887', NULL, 'ec300baec9ef4c0696e10abca991ac64', '294820a41aad4ff0abb05e9f5886555c', NULL),
('ac30d21acb0949d2ae09613afdd5c32e', 'follow', NULL, NULL, 'Camilo Gomez comenzó a seguirte', 1, '2025-12-03 17:47:10.193328', '2025-12-13 05:19:54.904800', '6f053d432986406289a54b930e90924f', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('ae658ad997e143ec8a44f692c6d505d4', 'friend_accept', NULL, NULL, 'Camilo Gomez aceptó tu solicitud de amistad', 0, '2025-12-20 21:19:26.808324', NULL, '4cccc11a7e634423bf92808272ad4b52', 'bd22ec1c4dbe48f3a018e96b2cd61304', '97bdbfd753884817b6728c049c5e6c3d'),
('af9682194f2447fd822d4cc43f1b60bc', 'comment', '1c7a29d6688540e797c1bd3ad528ed23', 'e4e603178b0d452090a129f7d7c8ccc6', 'Pedro Sánchez comentó tu publicación', 0, '2025-12-13 06:16:49.655911', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('afba4fd39a514fa9b1fee64505200390', 'golazo', '23d9b313495248d2b5f547d79cc84924', NULL, ' dijo ¡Golazo! a tu publicación', 0, '2025-12-02 05:01:46.389016', NULL, '84c5e41a9e4348548886b797643f91f8', '294820a41aad4ff0abb05e9f5886555c', NULL),
('b25cbee2947945caa7d3ea4f86fe9126', 'celebration', '04cc8cb89e8c4477bb5905cb40bff276', NULL, 'Camilo Gomez celebró tu publicación', 0, '2025-12-10 14:52:54.759726', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('b9dd1161f10849039ed6ec035780e9a6', 'follow', NULL, NULL, 'Pedro Sánchez comenzó a seguirte', 0, '2025-12-13 06:14:46.385838', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('ba7bebeeb4384adf9151ee45b0f5654d', 'golazo', '89400893ce23405b93de645282cb549f', NULL, 'María García dijo ¡Golazo! a tu publicación', 1, '2025-12-02 05:01:45.618578', '2025-12-02 19:20:57.599644', '4265f3cd6c7a493b9e35efbacd3b3a6b', '84c5e41a9e4348548886b797643f91f8', NULL),
('be7c2f96f2404aca87b3da0829eb7170', 'celebration', 'd37b729e6a024648aeced808750951d7', NULL, 'Camilo Gomez celebró tu publicación', 0, '2026-01-16 15:11:03.408246', NULL, 'e3702132b6cb45d2a390e6b1b5f254ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('c22e986f347b45d3a670a8ed64cd2dff', 'follow', NULL, NULL, 'Pedro Sánchez comenzó a seguirte', 0, '2025-12-02 21:37:39.247091', NULL, '6f053d432986406289a54b930e90924f', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('c6a5ca4991f54955b681bab6d22962f0', 'celebration', '13347ecb35b54ed89065643f926bea01', NULL, 'yasmin pinzon celebró tu publicación', 0, '2025-12-27 20:27:13.393043', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304', '6f053d432986406289a54b930e90924f', NULL),
('c808c97177ba42ff94d3344635c90775', 'like', '13347ecb35b54ed89065643f926bea01', NULL, 'yasmin pinzon le dio me gusta a tu publicación', 0, '2025-12-16 16:39:45.430021', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304', '6f053d432986406289a54b930e90924f', NULL),
('cdfa8426597f4877bd09a713949593d9', 'celebration', 'f1a0e61feba94b22a94e828af7b04958', NULL, ' celebró tu publicación', 0, '2025-12-02 05:01:46.767849', NULL, 'ec300baec9ef4c0696e10abca991ac64', '294820a41aad4ff0abb05e9f5886555c', NULL),
('cf9e2cc5f74149d3bef6391a53035a66', 'like', '77af2960e23f418796375fe79b1ee562', NULL, 'Pedro Sánchez le dio me gusta a tu publicación', 0, '2025-12-02 05:01:45.983922', NULL, '98ca610eafbc4827b95e754c9c0a6b23', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('cfc9a380fcc94fbbb55cc199ad34cf61', 'like', 'f1a0e61feba94b22a94e828af7b04958', NULL, 'Ana Martínez le dio me gusta a tu publicación', 0, '2025-12-02 05:01:46.688318', NULL, 'ec300baec9ef4c0696e10abca991ac64', '98ca610eafbc4827b95e754c9c0a6b23', NULL),
('d0964586be6e4d82b92e878d26cb4074', 'like', '89400893ce23405b93de645282cb549f', NULL, 'Carlos López le dio me gusta a tu publicación', 0, '2025-12-02 05:01:45.634074', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', 'd355c06d9f2b4fefbd6e3a4dab17b284', NULL),
('d39dcc1adc0b4b6b93fcf743ba523a5d', 'like', '77af2960e23f418796375fe79b1ee562', NULL, ' le dio me gusta a tu publicación', 0, '2025-12-02 05:01:45.967639', NULL, '98ca610eafbc4827b95e754c9c0a6b23', '294820a41aad4ff0abb05e9f5886555c', NULL),
('d4046ae3ca45495eac73bcce435bdfa0', 'friend_request', NULL, NULL, 'Pedro Sánchez te envió una solicitud de amistad', 0, '2025-12-13 06:14:48.937826', NULL, '4912c5171c6d48d4bdbcfbd889a9143c', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'aeca2712b8ca4849b2c825da709a0655'),
('d625fc71eac64b39a38f6fd9f00a17b8', 'comment', '13347ecb35b54ed89065643f926bea01', '833044e5ee074c1dbe06255a5f486e95', 'yasmin pinzon comentó tu publicación', 1, '2025-12-13 06:54:45.165909', '2025-12-16 14:27:17.714779', 'bd22ec1c4dbe48f3a018e96b2cd61304', '6f053d432986406289a54b930e90924f', NULL),
('d93b6177714044fbbc72dc7ac20071c4', 'golazo', 'd72fbee5c076487c94d0f4170f15723b', NULL, 'Camilo Gomez dijo ¡Golazo! a tu publicación', 0, '2026-01-15 18:07:04.759119', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('daefccac0e124217aa797d89a1968fa5', 'friend_request', NULL, NULL, 'Sos Habilidosos te envió una solicitud de amistad', 0, '2025-12-13 06:18:32.991252', NULL, '6f053d432986406289a54b930e90924f', 'e3702132b6cb45d2a390e6b1b5f254ab', '3576ad1bf04d483cb6536c45b0e7975e'),
('db39a4861ec248a59d024c8961194792', 'like', '2dd1763d352947b69b5b230d03f87de3', NULL, 'Pedro Sánchez le dio me gusta a tu publicación', 0, '2025-12-02 23:38:12.656528', NULL, '294820a41aad4ff0abb05e9f5886555c', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('dd49e1e558e74cc2939cdc013c01bd15', 'celebration', '746fb170e55749aaab839e0e9efada4b', NULL, 'Carlos López celebró tu publicación', 1, '2025-12-02 05:01:45.715588', '2025-12-02 19:21:01.909916', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'd355c06d9f2b4fefbd6e3a4dab17b284', NULL),
('e02d09ee2ef344c6ba34e071a70bc984', 'celebration', 'd37b729e6a024648aeced808750951d7', NULL, 'Camilo Gomez celebró tu publicación', 0, '2026-01-20 16:15:22.053432', NULL, 'e3702132b6cb45d2a390e6b1b5f254ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('e0f96b13941342d0b75736d620af6130', 'like', 'd37b729e6a024648aeced808750951d7', NULL, 'Camilo Gomez le dio me gusta a tu publicación', 0, '2026-01-15 20:57:42.469180', NULL, 'e3702132b6cb45d2a390e6b1b5f254ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('e48cc38357ad4a20a8e7e38c0b1ac207', 'follow', NULL, NULL, 'Camilo Gomez comenzó a seguirte', 0, '2025-12-16 17:41:52.963488', NULL, 'd355c06d9f2b4fefbd6e3a4dab17b284', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('e540e6cdfc5c40fba024a5bc709af387', 'friend_request', NULL, NULL, 'Sos Habilidosos te envió una solicitud de amistad', 0, '2025-12-13 06:18:34.247488', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304', 'e3702132b6cb45d2a390e6b1b5f254ab', 'a978f4711d4c43398b781fe3bd859369'),
('e6f85e4d29764c57a4e2ebc0b81dab68', 'follow', NULL, NULL, 'Camilo Gomez comenzó a seguirte', 0, '2025-12-03 17:47:11.644844', NULL, '294820a41aad4ff0abb05e9f5886555c', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('e97839a564e8459992da0328cb0101b5', 'like', 'd72fbee5c076487c94d0f4170f15723b', NULL, 'Camilo Gomez le dio me gusta a tu publicación', 0, '2026-01-15 18:07:03.188105', NULL, '4265f3cd6c7a493b9e35efbacd3b3a6b', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('ea9c692e31874ac3a152a9dbfeebde94', 'comment', '2dd1763d352947b69b5b230d03f87de3', '2b234ad8d5fb4fee82664be86447a529', 'Pedro Sánchez comentó tu publicación', 0, '2025-12-02 23:38:15.535757', NULL, '294820a41aad4ff0abb05e9f5886555c', '4265f3cd6c7a493b9e35efbacd3b3a6b', NULL),
('ecde0c6723184bac9dff68ba056a5a9a', 'like', '23d9b313495248d2b5f547d79cc84924', NULL, 'Ana Martínez le dio me gusta a tu publicación', 0, '2025-12-02 05:01:46.408585', NULL, '84c5e41a9e4348548886b797643f91f8', '98ca610eafbc4827b95e754c9c0a6b23', NULL),
('ecfb508b8969433e813ca91dd5de5291', 'follow', NULL, NULL, 'Sos Habilidosos comenzó a seguirte', 0, '2025-12-13 06:18:35.480200', NULL, 'bd22ec1c4dbe48f3a018e96b2cd61304', 'e3702132b6cb45d2a390e6b1b5f254ab', NULL),
('f81286cb8fd34c3bbf0da908be1a7e64', 'friend_request', NULL, NULL, 'Pedro Sánchez te envió una solicitud de amistad', 1, '2025-12-02 21:37:40.510738', '2025-12-13 05:19:52.474083', '6f053d432986406289a54b930e90924f', '4265f3cd6c7a493b9e35efbacd3b3a6b', '223357a6b6994299b42122f11fe6807d'),
('fb75f7363195493ea6d66953f5b6f77b', 'golazo', 'd37b729e6a024648aeced808750951d7', NULL, 'Camilo Gomez dijo ¡Golazo! a tu publicación', 0, '2026-01-20 16:15:20.856340', NULL, 'e3702132b6cb45d2a390e6b1b5f254ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL),
('fea71d21d7e14ce3865dfc28a7dddac2', 'like', '61ddafc3ba624a6cb30eab2abf2974d5', NULL, ' le dio me gusta a tu publicación', 0, '2025-12-02 05:01:46.325681', NULL, '84c5e41a9e4348548886b797643f91f8', '294820a41aad4ff0abb05e9f5886555c', NULL),
('feaef60aee5e49b885db55162a7dc5a8', 'follow', NULL, NULL, 'Camilo Gomez comenzó a seguirte', 0, '2025-12-03 17:47:11.157963', NULL, '1225e5006c6942fbb872836ab222e4e1', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla payment_accounts
--

CREATE TABLE payment_accounts (
  id char(32) NOT NULL,
  name varchar(100) NOT NULL,
  account_type varchar(20) NOT NULL,
  account_number varchar(100) NOT NULL,
  account_holder varchar(200) NOT NULL,
  bank_name varchar(100) NOT NULL,
  currency varchar(3) NOT NULL,
  is_active tinyint(1) NOT NULL,
  is_primary tinyint(1) NOT NULL,
  for_classifieds tinyint(1) NOT NULL,
  for_advertising tinyint(1) NOT NULL,
  for_donations tinyint(1) NOT NULL,
  notes longtext NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla platform_settings
--

CREATE TABLE platform_settings (
  id char(32) NOT NULL,
  donation_fee_percentage decimal(5,2) NOT NULL,
  default_currency varchar(3) NOT NULL,
  auto_approve_under decimal(12,2) NOT NULL,
  notify_admin_on_payment tinyint(1) NOT NULL,
  admin_notification_email varchar(254) NOT NULL,
  payment_instructions longtext NOT NULL,
  terms_and_conditions longtext NOT NULL,
  updated_at datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla posts
--

CREATE TABLE posts (
  id char(32) NOT NULL,
  content longtext NOT NULL,
  images longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(images)),
  video varchar(100) DEFAULT NULL,
  thumbnail varchar(100) DEFAULT NULL,
  podcast_url varchar(200) NOT NULL,
  streaming_url varchar(200) NOT NULL,
  post_type varchar(20) NOT NULL,
  category varchar(20) NOT NULL,
  likes_count int(10) UNSIGNED NOT NULL CHECK (likes_count >= 0),
  celebrations_count int(10) UNSIGNED NOT NULL CHECK (celebrations_count >= 0),
  golazos_count int(10) UNSIGNED NOT NULL CHECK (golazos_count >= 0),
  comments_count int(10) UNSIGNED NOT NULL CHECK (comments_count >= 0),
  shares_count int(10) UNSIGNED NOT NULL CHECK (shares_count >= 0),
  views_count int(10) UNSIGNED NOT NULL CHECK (views_count >= 0),
  is_pinned tinyint(1) NOT NULL,
  is_archived tinyint(1) NOT NULL,
  allow_comments tinyint(1) NOT NULL,
  is_public tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  user_id char(32) NOT NULL,
  short_id varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla posts
--

INSERT INTO posts (id, content, images, video, thumbnail, podcast_url, streaming_url, post_type, category, likes_count, celebrations_count, golazos_count, comments_count, shares_count, views_count, is_pinned, is_archived, allow_comments, is_public, created_at, updated_at, user_id, short_id) VALUES
('04cc8cb89e8c4477bb5905cb40bff276', 'dggnbdgbhdfz', '[]', '', '', '', '', 'text', 'football', 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-03 14:50:29.828273', '2025-12-03 14:50:29.829275', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'MULIM5AO'),
('0cddc12ac98e4efabf4d25c442fd4f29', 'Hoy fue un gran día! 🌟', '[]', '', '', '', '', 'image', 'general_sport', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:46.776512', '2025-12-02 05:01:46.776587', 'ec300baec9ef4c0696e10abca991ac64', 'RV95TXRM'),
('13347ecb35b54ed89065643f926bea01', 'Que tal mi mascota?', '[\"http://127.0.0.1:8000/media/posts/13347ecb-35b5-4ed8-9065-643f926bea01_20251213065338.jpg\"]', '', '', '', '', 'image', 'football', 2, 1, 0, 7, 0, 0, 0, 0, 0, 1, '2025-12-13 06:53:38.494029', '2025-12-13 06:53:38.755122', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'YOK6H78R'),
('1be604c14fe44f0baca2aa1b86cc79b1', 'Celebrando pequeñas victorias 🏆', '[]', '', '', '', '', 'text', 'football', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:45.815924', '2025-12-02 05:01:45.816025', '98ca610eafbc4827b95e754c9c0a6b23', 'I4IRMMVV'),
('1c7a29d6688540e797c1bd3ad528ed23', 'Hola hermi', '[]', '', '', '', '', 'text', 'football', 1, 0, 0, 2, 0, 0, 0, 0, 1, 1, '2025-12-03 19:47:35.444357', '2025-12-03 19:47:35.444357', 'bd22ec1c4dbe48f3a018e96b2cd61304', '6RC9Z0HL'),
('1f11ae95085a4162b1c93684151fe12f', 'Nuevo proyecto en camino, pronto les cuento! 👀', '[]', '', '', '', '', 'image', 'culture', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:46.163035', '2025-12-02 05:01:46.163098', 'd355c06d9f2b4fefbd6e3a4dab17b284', '0K144XFE'),
('2254d51ec7634f6791d4a69df811774f', 'Disfrutando del momento 🙏', '[]', '', '', '', '', 'text', 'general_sport', 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, '2025-12-02 05:01:46.070313', '2025-12-02 05:01:46.070367', 'd355c06d9f2b4fefbd6e3a4dab17b284', 'FPL3UXDK'),
('23d9b313495248d2b5f547d79cc84924', 'Preparándome para lo que viene 🔥', '[]', '', '', '', '', 'text', 'football', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:46.334495', '2025-12-02 05:01:46.334532', '84c5e41a9e4348548886b797643f91f8', 'YZZRZYPW'),
('2dd1763d352947b69b5b230d03f87de3', 'Preparándome para lo que viene 🔥', '[]', '', '', '', '', 'text', 'football', 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:47.303886', '2025-12-02 05:01:47.303948', '294820a41aad4ff0abb05e9f5886555c', 'GQLC7G8R'),
('343ab1c08b9545e9a5992ebd45dd0e07', 'Momento de reflexión... a veces hay que parar y agradecer', '[]', '', '', '', '', 'text', 'football', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:46.019398', '2025-12-02 05:01:46.019427', 'd355c06d9f2b4fefbd6e3a4dab17b284', 'GE9BO9MD'),
('61ddafc3ba624a6cb30eab2abf2974d5', 'Gracias por el apoyo siempre 🙌', '[]', '', '', '', '', 'text', 'general_sport', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:46.274215', '2025-12-02 05:01:46.274249', '84c5e41a9e4348548886b797643f91f8', '10CP6JXG'),
('6b853daa6cbe4926848dd849341af84e', 'Celebrando pequeñas victorias 🏆', '[]', '', '', '', '', 'text', 'culture', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:46.472077', '2025-12-02 05:01:46.472157', 'ec300baec9ef4c0696e10abca991ac64', 'FH8EDOVC'),
('746fb170e55749aaab839e0e9efada4b', 'Preparándome para lo que viene 🔥', '[]', '', '', '', '', 'image', 'general_sport', 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:45.668526', '2025-12-02 05:01:45.668603', '4265f3cd6c7a493b9e35efbacd3b3a6b', '1YRWI3D9'),
('77af2960e23f418796375fe79b1ee562', 'Gracias por el apoyo siempre 🙌', '[]', '', '', '', '', 'text', 'music', 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, '2025-12-02 05:01:45.915555', '2025-12-02 05:01:45.915603', '98ca610eafbc4827b95e754c9c0a6b23', 'LBL0ZL8L'),
('82ebc62813ce46e79770252e7853b72b', '', '[\"http://127.0.0.1:8000/media/posts/82ebc628-13ce-46e7-9770-252e7853b72b_20251213052514.jpg\"]', '', '', '', '', 'image', 'football', 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, '2025-12-13 05:25:14.546335', '2025-12-13 05:25:14.661599', '6f053d432986406289a54b930e90924f', 'IR4DB5VT'),
('86caa7e6c3b840819f7d9f18c6f3c7bd', 'Avatar', '[\"http://127.0.0.1:8000/media/posts/86caa7e6-c3b8-4081-9f7d-9f18c6f3c7bd_20251203165220.png\"]', '', '', '', '', 'image', 'football', 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-12-03 16:52:20.212281', '2025-12-03 16:52:20.390588', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'GHZOXTO9'),
('89400893ce23405b93de645282cb549f', 'La constancia es la clave del éxito 💯', '[]', '', '', '', '', 'text', 'general_sport', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:45.558919', '2025-12-02 05:01:45.558948', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'DKYRD83N'),
('90a409a0ce9d42398b85b54f5d4bb105', '', '[]', 'videos/FT_7182_Pantalla_SAB_2304_x_384px.mp4', '', '', '', 'video', 'football', 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-12-03 14:51:12.734895', '2025-12-03 14:51:12.734895', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'MOVN8574'),
('934d82e29f5b4e06beb30be7aa9dc189', 'test imagen', '[\"http://127.0.0.1:8000/media/posts/934d82e2-9f5b-4e06-beb3-0be7aa9dc189_20251203190108.jpg\"]', '', '', '', '', 'image', 'football', 2, 0, 0, 1, 0, 0, 0, 0, 0, 1, '2025-12-03 19:01:08.083112', '2025-12-03 19:01:08.265793', 'bd22ec1c4dbe48f3a018e96b2cd61304', '39VSV7M1'),
('940984dfa25a44bbaffc912e0879c290', 'hfjxfymjy', '[]', '', '', '', '', 'text', 'football', 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-03 14:56:20.974274', '2025-12-03 14:56:20.975360', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'JEZHU81G'),
('961abca22fc44984b5c67b73e2a27889', 'La constancia es la clave del éxito 💯', '[]', '', '', '', '', 'text', 'music', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:47.223136', '2025-12-02 05:01:47.223165', '294820a41aad4ff0abb05e9f5886555c', 'OWMCX28G'),
('98a85020b5f2409ca78a9c37b92cc9c3', 'test5', '[\"http://127.0.0.1:8000/media/posts/98a85020-b5f2-409c-a78a-9c37b92cc9c3_20251210164329.png\"]', '', '', '', '', 'image', 'football', 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, '2025-12-10 16:43:29.420242', '2025-12-10 16:43:29.667139', '6f053d432986406289a54b930e90924f', '5PEVEMEP'),
('98bb83222c4544fcb834e07a13948a90', 'Gracias por el apoyo siempre 🙌', '[]', '', '', '', '', 'image', 'football', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:46.594520', '2025-12-02 05:01:46.594591', 'ec300baec9ef4c0696e10abca991ac64', 'AXIFY5TI'),
('9a564e5c32f04343a53e575753bafa06', 'Celebrando pequeñas victorias 🏆', '[]', '', '', '', '', 'text', 'culture', 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, '2025-12-02 05:01:45.724345', '2025-12-02 05:01:45.724403', '98ca610eafbc4827b95e754c9c0a6b23', 'AKST648T'),
('a2e529508a774cab9476cc4092572963', 'fvgrgr', '[]', '', '', '', '', 'text', 'football', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-03 14:52:21.409245', '2025-12-03 14:52:21.412805', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'S2SV73LE'),
('b0599d83ab3c47eca60961cd35b15378', 'Nueva meta cumplida ✅ #Motivación', '[]', '', '', '', '', 'text', 'culture', 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:45.478736', '2025-12-02 05:01:45.478831', '4265f3cd6c7a493b9e35efbacd3b3a6b', '879NYYSK'),
('b6e0c0fd97fa4285a5f840be4759ca0c', 'Celebrando pequeñas victorias 🏆', '[]', '', '', '', '', 'text', 'general_sport', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:46.132994', '2025-12-02 05:01:46.133041', 'd355c06d9f2b4fefbd6e3a4dab17b284', '3HFP66EQ'),
('ba60f72242ca4bb6b80fb0e8b8caec75', 'Nueva meta cumplida ✅ #Motivación', '[]', '', '', '', '', 'image', 'music', 0, 3, 0, 1, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:47.156875', '2025-12-02 05:01:47.156928', '294820a41aad4ff0abb05e9f5886555c', 'NLAI4NL7'),
('c4a160da5ebf4969bdc6514bd3519945', 'Vamos por más! 2025 será nuestro año 🎯', '[]', '', '', '', '', 'image', 'football', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:46.872633', '2025-12-02 05:01:46.872697', '294820a41aad4ff0abb05e9f5886555c', '4AKPGYJU'),
('d2de4041fef74ab49eb9669d09465706', 'Desarollo full stack, next.js y Django consumo de api bases de datos en Mysql', '[]', '', '', '', '', 'text', 'football', 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, '2025-12-03 16:51:54.628229', '2025-12-03 16:51:54.635434', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'JYTIUCXX'),
('d37b729e6a024648aeced808750951d7', '', '[\"http://127.0.0.1:8000/media/posts/d37b729e-6a02-4648-aece-d808750951d7_20251213061816.png\"]', '', '', '', '', 'image', 'football', 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, '2025-12-13 06:18:16.391915', '2025-12-13 06:18:16.528027', 'e3702132b6cb45d2a390e6b1b5f254ab', 'TW1DJL1T'),
('d72fbee5c076487c94d0f4170f15723b', 'rgrr', '[]', '', '', '', '', 'text', 'football', 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, '2025-12-03 15:01:40.726904', '2025-12-03 15:01:40.726904', '4265f3cd6c7a493b9e35efbacd3b3a6b', '3F9MW39J'),
('f1a0e61feba94b22a94e828af7b04958', 'Agradecido por esta comunidad increíble ❤️', '[]', '', '', '', '', 'text', 'football', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:46.638574', '2025-12-02 05:01:46.638631', 'ec300baec9ef4c0696e10abca991ac64', 'X352Q0QF'),
('f5dab787d1264d939295e6fd7fb853be', 'Hoy fue un gran día! 🌟', '[]', '', '', '', '', 'image', 'culture', 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, '2025-12-02 05:01:47.120499', '2025-12-02 05:01:47.120535', '294820a41aad4ff0abb05e9f5886555c', 'WWQ68YKU'),
('f96c2b7e4a714752ab82ebb26ba839b9', 'Partido increíble hoy, dejamos todo en la cancha', '[]', '', '', '', '', 'text', 'music', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-02 05:01:46.832247', '2025-12-02 05:01:46.832291', 'ec300baec9ef4c0696e10abca991ac64', '0CBCNT94'),
('fe839c6673934f43ad392c5c777adc0f', 'fbfdbdf', '[]', '', '', '', '', 'text', 'football', 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, '2025-12-05 13:11:37.203730', '2025-12-05 13:11:37.212032', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'VCC8N9D2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla post_bookmarks
--

CREATE TABLE post_bookmarks (
  id char(32) NOT NULL,
  created_at datetime(6) NOT NULL,
  post_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla post_reactions
--

CREATE TABLE post_reactions (
  id char(32) NOT NULL,
  reaction_type varchar(15) NOT NULL,
  created_at datetime(6) NOT NULL,
  post_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla post_reactions
--

INSERT INTO post_reactions (id, reaction_type, created_at, post_id, user_id) VALUES
('0656336b3bf14d7e9026f9909feb4d27', 'like', '2025-12-02 05:01:45.991722', '77af2960e23f418796375fe79b1ee562', '84c5e41a9e4348548886b797643f91f8'),
('0748be33d2e04c6f9b6b4665b24aa478', 'celebration', '2025-12-02 05:01:45.650122', '89400893ce23405b93de645282cb549f', '98ca610eafbc4827b95e754c9c0a6b23'),
('0a7642191afe42ac879fb94c772be8ad', 'celebration', '2025-12-02 05:01:45.697538', '746fb170e55749aaab839e0e9efada4b', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
('1286651c8e58421cbb7edc593add7106', 'like', '2025-12-16 16:32:22.638904', '940984dfa25a44bbaffc912e0879c290', '6f053d432986406289a54b930e90924f'),
('1505f25e230541079ce8c31ccc741b98', 'celebration', '2025-12-02 05:01:46.257146', '1f11ae95085a4162b1c93684151fe12f', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('1b22852911b74ff384ff197c8456ce5a', 'like', '2025-12-13 06:15:36.652649', '934d82e29f5b4e06beb30be7aa9dc189', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('1caf71dde3c44178b112e5abc8030f33', 'golazo', '2025-12-02 05:01:47.258129', '961abca22fc44984b5c67b73e2a27889', '84c5e41a9e4348548886b797643f91f8'),
('23b40f4daba5472894c44a04d1e997fa', 'celebration', '2025-12-02 05:01:46.420099', '23d9b313495248d2b5f547d79cc84924', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('25fa0f3ed6fb48b3a46dc1aaeb9bfb62', 'like', '2025-12-22 12:37:06.595919', '1c7a29d6688540e797c1bd3ad528ed23', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('2a7b353064d741509d5a9f99a9a993e9', 'golazo', '2025-12-02 05:01:45.545790', 'b0599d83ab3c47eca60961cd35b15378', '98ca610eafbc4827b95e754c9c0a6b23'),
('2f88bf7f28d04cd38d4facad6115e096', 'golazo', '2025-12-02 05:01:46.218675', '1f11ae95085a4162b1c93684151fe12f', '98ca610eafbc4827b95e754c9c0a6b23'),
('2fe03ac9f9504e28aa22b877e3b36dda', 'like', '2025-12-02 05:01:47.074424', 'c4a160da5ebf4969bdc6514bd3519945', 'ec300baec9ef4c0696e10abca991ac64'),
('3153499264fb46fab37894c659fbe95a', 'like', '2025-12-02 05:01:46.201864', '1f11ae95085a4162b1c93684151fe12f', '294820a41aad4ff0abb05e9f5886555c'),
('3a7edad3c27146949acee9c03ad06ecd', 'celebration', '2025-12-02 05:01:46.722188', 'f1a0e61feba94b22a94e828af7b04958', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
('3c2d58682fe64a17a5d1e56238fb695b', 'celebration', '2026-01-20 16:15:21.951312', 'd37b729e6a024648aeced808750951d7', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('407d8905e5c24ca1847647a3f538393e', 'celebration', '2025-12-02 05:02:27.029034', 'ba60f72242ca4bb6b80fb0e8b8caec75', '294820a41aad4ff0abb05e9f5886555c'),
('44497d6296cd4ad39c5a66e56d855295', 'celebration', '2025-12-02 05:01:47.106446', 'c4a160da5ebf4969bdc6514bd3519945', '98ca610eafbc4827b95e754c9c0a6b23'),
('4459e1ecb1c54e1f9eb07acec1fa8ccc', 'golazo', '2025-12-02 05:01:45.857544', '1be604c14fe44f0baca2aa1b86cc79b1', '84c5e41a9e4348548886b797643f91f8'),
('4bcf341cab80426e94ca7c3d627d2075', 'celebration', '2025-12-10 14:52:54.697147', '04cc8cb89e8c4477bb5905cb40bff276', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('5180e9dd949e4d68b84ab773c5cc70e5', 'golazo', '2026-01-15 18:07:04.713325', 'd72fbee5c076487c94d0f4170f15723b', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('52052de646d848ce9e3036e2764c8c09', 'like', '2025-12-02 05:01:46.672259', 'f1a0e61feba94b22a94e828af7b04958', '98ca610eafbc4827b95e754c9c0a6b23'),
('55545e8ed2d14a16b6568195e4de4711', 'like', '2025-12-02 05:01:45.757902', '9a564e5c32f04343a53e575753bafa06', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('5cbe4200eb2f4fc9a558fa39fb378222', 'like', '2025-12-10 16:43:34.034955', '98a85020b5f2409ca78a9c37b92cc9c3', '6f053d432986406289a54b930e90924f'),
('606e58c073004f2ab18128ab2049aef2', 'like', '2026-01-19 10:36:05.921634', '13347ecb35b54ed89065643f926bea01', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('676df986790d4902ae7a806508b7a680', 'like', '2025-12-02 23:38:12.621627', '2dd1763d352947b69b5b230d03f87de3', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('696e902ad16a4adea7a1f9c64dac792e', 'celebration', '2025-12-02 05:01:45.872048', '1be604c14fe44f0baca2aa1b86cc79b1', 'ec300baec9ef4c0696e10abca991ac64'),
('6d6ef66d190344bf904455156908e5be', 'celebration', '2026-01-16 15:41:18.217333', '82ebc62813ce46e79770252e7853b72b', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('6de85f9f2741467091c2c914b9846c17', 'celebration', '2025-12-02 05:01:45.601660', '89400893ce23405b93de645282cb549f', 'ec300baec9ef4c0696e10abca991ac64'),
('6eb86257ba7f4a3e8c6f924a7e826d52', 'celebration', '2025-12-02 05:01:47.205791', 'ba60f72242ca4bb6b80fb0e8b8caec75', '84c5e41a9e4348548886b797643f91f8'),
('73e61444550c4ea7a8fb2aca8b699a25', 'celebration', '2025-12-27 20:27:13.255500', '13347ecb35b54ed89065643f926bea01', '6f053d432986406289a54b930e90924f'),
('799caa36410e4309b58ac27dcb97dfb2', 'celebration', '2025-12-02 05:01:46.048210', '343ab1c08b9545e9a5992ebd45dd0e07', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('7da6438e8c004659880e925c1d3417aa', 'golazo', '2025-12-02 05:01:46.118065', '2254d51ec7634f6791d4a69df811774f', 'ec300baec9ef4c0696e10abca991ac64'),
('7ed0b33d2324432f9690c3c7398181d6', 'celebration', '2025-12-02 05:01:46.553394', '6b853daa6cbe4926848dd849341af84e', '294820a41aad4ff0abb05e9f5886555c'),
('8171b161664a4ece89e9a4d78ffa9682', 'celebration', '2025-12-13 06:16:31.788368', '82ebc62813ce46e79770252e7853b72b', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('82e5b2ab255946959e05d960dc8e4eaf', 'like', '2025-12-02 05:01:47.059125', 'c4a160da5ebf4969bdc6514bd3519945', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('842eaf34616f4aebacc7f97e1fd139cc', 'like', '2025-12-02 05:01:45.959286', '77af2960e23f418796375fe79b1ee562', '294820a41aad4ff0abb05e9f5886555c'),
('857d79dc6cca4ad6b9fb9b16e55446e7', 'golazo', '2025-12-02 05:01:45.941628', '77af2960e23f418796375fe79b1ee562', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
('878cf3e305f04e86873abdc7c15f5f6f', 'like', '2025-12-02 05:01:45.892148', '1be604c14fe44f0baca2aa1b86cc79b1', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('8da97e352d1148bbaa722400b5949039', 'like', '2025-12-13 06:56:23.535799', '13347ecb35b54ed89065643f926bea01', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('98ed5b55d63545d29f8ae4d717ca0f02', 'golazo', '2025-12-02 05:01:46.241767', '1f11ae95085a4162b1c93684151fe12f', '84c5e41a9e4348548886b797643f91f8'),
('9a4bfded234d4319ad7399e58c514573', 'like', '2025-12-02 05:01:45.624890', '89400893ce23405b93de645282cb549f', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
('9b45bdda9ca0475b84b3f4a712cbb898', 'golazo', '2025-12-02 05:01:46.383708', '23d9b313495248d2b5f547d79cc84924', '294820a41aad4ff0abb05e9f5886555c'),
('9b4ee25eb9d24cd8ad391d318a381ce4', 'celebration', '2025-12-02 05:01:47.190022', 'ba60f72242ca4bb6b80fb0e8b8caec75', 'ec300baec9ef4c0696e10abca991ac64'),
('9c5ca44babcd407ca0714bc11040287a', 'like', '2025-12-02 05:01:45.972967', '77af2960e23f418796375fe79b1ee562', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('a11afb38afd749a6bb1231ff40788c78', 'like', '2025-12-02 05:01:46.321591', '61ddafc3ba624a6cb30eab2abf2974d5', '294820a41aad4ff0abb05e9f5886555c'),
('b0c024cb447f4e05b861068396645154', 'celebration', '2025-12-02 05:01:46.696928', 'f1a0e61feba94b22a94e828af7b04958', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('b31673c839434086b3158de1111b9487', 'like', '2025-12-02 05:01:46.402074', '23d9b313495248d2b5f547d79cc84924', '98ca610eafbc4827b95e754c9c0a6b23'),
('bfa79196554a4e83bbb1922b2e1db8e5', 'like', '2025-12-02 23:37:39.501506', '746fb170e55749aaab839e0e9efada4b', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('c187595d42d345adad288eb7a6095405', 'celebration', '2025-12-02 05:01:45.794254', '9a564e5c32f04343a53e575753bafa06', '294820a41aad4ff0abb05e9f5886555c'),
('c54f4c4b96284e00964c9c8529dc9387', 'like', '2025-12-02 19:13:30.971798', 'b0599d83ab3c47eca60961cd35b15378', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('cbbf6a6d1ce14da0af5eb70673c619e5', 'celebration', '2025-12-02 05:01:46.753010', 'f1a0e61feba94b22a94e828af7b04958', '294820a41aad4ff0abb05e9f5886555c'),
('d78eed452e0d45788445912adb1387f7', 'celebration', '2025-12-02 05:01:46.091616', '2254d51ec7634f6791d4a69df811774f', '294820a41aad4ff0abb05e9f5886555c'),
('d82b5569d59d400db2f9143618246a09', 'golazo', '2025-12-02 05:01:46.524032', '6b853daa6cbe4926848dd849341af84e', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('d89e051950954ded857fad3008a6b9dd', 'like', '2025-12-03 17:06:36.363498', '86caa7e6c3b840819f7d9f18c6f3c7bd', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('e05cf99533884a34a15cea802bb9105e', 'like', '2025-12-02 05:01:46.574175', '6b853daa6cbe4926848dd849341af84e', '98ca610eafbc4827b95e754c9c0a6b23'),
('e30e1a270ead4015a850d62b3ac44d9c', 'celebration', '2025-12-02 05:01:45.779423', '9a564e5c32f04343a53e575753bafa06', '84c5e41a9e4348548886b797643f91f8'),
('e7e1b1b7d1b54ba89ac30b7591af891e', 'like', '2025-12-22 12:37:41.533173', '934d82e29f5b4e06beb30be7aa9dc189', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('eb45f9bfd46441a682524752c55d14f5', 'like', '2025-12-10 14:39:16.894158', 'fe839c6673934f43ad392c5c777adc0f', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('eefd8dbb6bcc4eaea42e781b00c9308c', 'golazo', '2025-12-02 05:01:45.609447', '89400893ce23405b93de645282cb549f', '84c5e41a9e4348548886b797643f91f8'),
('f39fd96f625542018152e04ed4b6a78f', 'golazo', '2025-12-02 05:01:46.442667', '23d9b313495248d2b5f547d79cc84924', 'ec300baec9ef4c0696e10abca991ac64'),
('f3a9841f50d74234920f33a3c589e5d0', 'like', '2025-12-05 11:12:15.441752', 'd2de4041fef74ab49eb9669d09465706', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('fe20a3d035894e88a9fdfcafd87d7bb3', 'golazo', '2025-12-02 05:01:47.357385', '2dd1763d352947b69b5b230d03f87de3', '98ca610eafbc4827b95e754c9c0a6b23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla post_reports
--

CREATE TABLE post_reports (
  id char(32) NOT NULL,
  reason varchar(30) NOT NULL,
  description longtext NOT NULL,
  status varchar(15) NOT NULL,
  reviewed_at datetime(6) DEFAULT NULL,
  moderator_notes longtext NOT NULL,
  created_at datetime(6) NOT NULL,
  post_id char(32) NOT NULL,
  reporter_id char(32) NOT NULL,
  reviewed_by_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla post_shares
--

CREATE TABLE post_shares (
  id char(32) NOT NULL,
  message longtext NOT NULL,
  created_at datetime(6) NOT NULL,
  post_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla post_views
--

CREATE TABLE post_views (
  id char(32) NOT NULL,
  ip_address char(39) NOT NULL,
  user_agent longtext NOT NULL,
  created_at datetime(6) NOT NULL,
  post_id char(32) NOT NULL,
  user_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla pricing_plans
--

CREATE TABLE pricing_plans (
  id char(32) NOT NULL,
  name varchar(100) NOT NULL,
  service_type varchar(30) NOT NULL,
  description longtext NOT NULL,
  price decimal(12,2) NOT NULL,
  currency varchar(3) NOT NULL,
  duration_value int(10) UNSIGNED NOT NULL CHECK (duration_value >= 0),
  duration_unit varchar(10) NOT NULL,
  features longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(features)),
  is_active tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla reels_reel
--

CREATE TABLE reels_reel (
  id char(32) NOT NULL,
  video varchar(100) NOT NULL,
  thumbnail varchar(100) DEFAULT NULL,
  caption longtext NOT NULL,
  hashtags varchar(500) NOT NULL,
  views_count int(11) NOT NULL,
  duration int(11) NOT NULL,
  is_active tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  author_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla reels_reel
--

INSERT INTO reels_reel (id, video, thumbnail, caption, hashtags, views_count, duration, is_active, created_at, updated_at, author_id) VALUES
('0ac0ce9bf9054f95805b71af272d99ce', 'reels/videos/futbolgame1baja.mp4', '', 'Animacion Habilidosos', '#3D #Habilidosos', 65, 0, 1, '2025-12-02 21:27:40.120453', '2026-01-20 10:07:28.715868', 'e3702132b6cb45d2a390e6b1b5f254ab'),
('2e4e7c5092144e758af36441a550fcc6', 'reels/videos/video1_AT9Ld0H.mp4', '', 'gvbhjn', '', 27, 0, 1, '2025-12-02 19:23:44.114261', '2026-01-20 10:06:16.516415', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('d4d09771357940279ed3384dfa812676', 'reels/videos/habilidososenportugal_8qat6iw.mp4', '', 'Habilidosos en portugal', '#Habilidosos', 13, 0, 1, '2025-12-02 05:05:33.281474', '2026-01-20 10:06:20.574644', '4265f3cd6c7a493b9e35efbacd3b3a6b'),
('fc2e3408b83d426ba057bc93be96d450', 'reels/videos/perfumes_TP9cTVC.mp4', '', '', '', 22, 0, 1, '2025-12-02 19:02:23.948284', '2026-01-20 10:06:18.977914', '4265f3cd6c7a493b9e35efbacd3b3a6b');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla reels_reelcomment
--

CREATE TABLE reels_reelcomment (
  id char(32) NOT NULL,
  content longtext NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  author_id char(32) NOT NULL,
  parent_id char(32) DEFAULT NULL,
  reel_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla reels_reelcomment
--

INSERT INTO reels_reelcomment (id, content, created_at, updated_at, author_id, parent_id, reel_id) VALUES
('6dc46fcdd36742b7a46e7efeddc6a3a8', 'ghhhh', '2026-01-19 10:53:13.571225', '2026-01-19 10:53:13.571288', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL, '0ac0ce9bf9054f95805b71af272d99ce'),
('99e06ff4169a4962b9c7e338269a5ed6', 'lkmglkmg', '2026-01-19 10:53:07.687999', '2026-01-19 10:53:07.688075', 'bd22ec1c4dbe48f3a018e96b2cd61304', NULL, '0ac0ce9bf9054f95805b71af272d99ce');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla reels_reelcomment_likes
--

CREATE TABLE reels_reelcomment_likes (
  id bigint(20) NOT NULL,
  reelcomment_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla reels_reel_likes
--

CREATE TABLE reels_reel_likes (
  id bigint(20) NOT NULL,
  reel_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla reels_reel_likes
--

INSERT INTO reels_reel_likes (id, reel_id, user_id) VALUES
(2, '0ac0ce9bf9054f95805b71af272d99ce', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(1, '0ac0ce9bf9054f95805b71af272d99ce', 'e3702132b6cb45d2a390e6b1b5f254ab'),
(3, '2e4e7c5092144e758af36441a550fcc6', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
(4, 'd4d09771357940279ed3384dfa812676', 'bd22ec1c4dbe48f3a018e96b2cd61304');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla site_settings
--

CREATE TABLE site_settings (
  id bigint(20) NOT NULL,
  show_register_habilidosos_button tinyint(1) NOT NULL,
  updated_at datetime(6) NOT NULL,
  reality_form_enabled tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla site_settings
--

INSERT INTO site_settings (id, show_register_habilidosos_button, updated_at, reality_form_enabled) VALUES
(1, 0, '2026-01-16 15:14:54.912287', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla stories
--

CREATE TABLE stories (
  id char(32) NOT NULL,
  media varchar(100) NOT NULL,
  media_type varchar(10) NOT NULL,
  thumbnail varchar(100) DEFAULT NULL,
  views_count int(10) UNSIGNED NOT NULL CHECK (views_count >= 0),
  created_at datetime(6) NOT NULL,
  expires_at datetime(6) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla stories
--

INSERT INTO stories (id, media, media_type, thumbnail, views_count, created_at, expires_at, user_id) VALUES
('02d01ba3783e4bdc87ff8b948696593c', 'stories/2025/12/17/2b5ee027788c547d30f8484713c526eb_WZ7no1o.jpg', 'image', '', 1, '2025-12-17 19:33:12.970932', '2025-12-18 19:33:12.963783', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('305f914767434248bce49d8eac686959', 'stories/2025/12/17/2b5ee027788c547d30f8484713c526eb.jpg', 'image', '', 1, '2025-12-17 19:33:10.424827', '2025-12-18 19:33:10.397129', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('3424771dba4244b087c913481d273642', 'stories/2025/12/17/a89a2a104267b3d391cff56ea66debf9.jpg', 'image', '', 0, '2025-12-17 21:08:17.310141', '2025-12-18 21:08:17.291139', '6f053d432986406289a54b930e90924f'),
('4167778f0f614a45a2ce7b783977cf22', 'stories/2025/12/17/f142303adb2d2f76dba9fe2c5e0be5fe.jpg', 'image', '', 0, '2025-12-17 21:07:07.023538', '2025-12-18 21:07:06.955608', '6f053d432986406289a54b930e90924f'),
('49823cce7bb54f9fa2cbdb86c4f9b93f', 'stories/2025/12/21/6b67e37bfe7d7c2190b9cd69ba9e9e6b.jpg', 'image', '', 1, '2025-12-21 02:50:44.651779', '2025-12-22 02:50:44.611469', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('5c5ac00a7ba04e2f91116ad7fab666eb', 'stories/2025/12/19/bc985b4aeef679b2e30ebf772c5a16db.jpg', 'image', '', 1, '2025-12-19 11:13:53.958697', '2025-12-20 11:13:53.901034', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('6d06cf7ef5284038824c3d82a1897d83', 'stories/2025/12/17/2b5ee027788c547d30f8484713c526eb_mkg7Xlu.jpg', 'image', '', 1, '2025-12-17 19:33:14.782210', '2025-12-18 19:33:14.777153', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('942b7a0dbbcc4672a28b332481425cd3', 'stories/2025/12/17/f142303adb2d2f76dba9fe2c5e0be5fe_6UJ92uI.jpg', 'image', '', 0, '2025-12-17 21:07:26.870399', '2025-12-18 21:07:26.861400', '6f053d432986406289a54b930e90924f'),
('ae90736931984eaebba0970f08f93594', 'stories/2026/01/19/6b67e37bfe7d7c2190b9cd69ba9e9e6b.jpg', 'image', '', 0, '2026-01-19 16:32:23.715968', '2026-01-20 16:32:23.652540', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('d5d14818081a47688735dbffe07365af', 'stories/2025/12/17/f142303adb2d2f76dba9fe2c5e0be5fe_rRSpNI1.jpg', 'image', '', 0, '2025-12-17 21:08:00.192831', '2025-12-18 21:08:00.180828', '6f053d432986406289a54b930e90924f');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla story_reactions
--

CREATE TABLE story_reactions (
  id char(32) NOT NULL,
  reaction_type varchar(15) NOT NULL,
  created_at datetime(6) NOT NULL,
  story_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla story_replies
--

CREATE TABLE story_replies (
  id char(32) NOT NULL,
  message longtext NOT NULL,
  is_read tinyint(1) NOT NULL,
  created_at datetime(6) NOT NULL,
  story_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla story_views
--

CREATE TABLE story_views (
  id char(32) NOT NULL,
  viewed_at datetime(6) NOT NULL,
  story_id char(32) NOT NULL,
  user_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla story_views
--

INSERT INTO story_views (id, viewed_at, story_id, user_id) VALUES
('09112eaecc494ae9b7aa5b4f4f5d97a1', '2025-12-21 02:56:41.032533', '49823cce7bb54f9fa2cbdb86c4f9b93f', '6f053d432986406289a54b930e90924f'),
('4029949636cf42e68a3d39d7b431ef84', '2025-12-19 11:40:47.690185', '5c5ac00a7ba04e2f91116ad7fab666eb', '6f053d432986406289a54b930e90924f'),
('a6a5d6a5e2fe472ea9c6f97f13e99ce8', '2025-12-17 19:35:45.646233', '6d06cf7ef5284038824c3d82a1897d83', '6f053d432986406289a54b930e90924f'),
('be1939f2744e4c89bebc56ad19fa2164', '2025-12-17 21:03:03.210461', '02d01ba3783e4bdc87ff8b948696593c', '6f053d432986406289a54b930e90924f'),
('db4758c77ff64d499e79767121557fd6', '2025-12-17 21:03:03.569519', '305f914767434248bce49d8eac686959', '6f053d432986406289a54b930e90924f');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla transactions
--

CREATE TABLE transactions (
  id char(32) NOT NULL,
  reference_code varchar(50) NOT NULL,
  transaction_type varchar(30) NOT NULL,
  status varchar(25) NOT NULL,
  amount decimal(12,2) NOT NULL,
  currency varchar(3) NOT NULL,
  payment_method varchar(20) NOT NULL,
  content_type varchar(50) NOT NULL,
  object_id varchar(50) NOT NULL,
  payment_proof varchar(100) DEFAULT NULL,
  payment_proof_url varchar(200) NOT NULL,
  verified_at datetime(6) DEFAULT NULL,
  verification_notes longtext NOT NULL,
  metadata longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(metadata)),
  ip_address char(39) DEFAULT NULL,
  user_agent longtext NOT NULL,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  completed_at datetime(6) DEFAULT NULL,
  enterprise_id char(32) DEFAULT NULL,
  payment_account_id char(32) DEFAULT NULL,
  pricing_plan_id char(32) DEFAULT NULL,
  user_id char(32) NOT NULL,
  verified_by_id char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla users
--

CREATE TABLE users (
  password varchar(128) NOT NULL,
  last_login datetime(6) DEFAULT NULL,
  is_superuser tinyint(1) NOT NULL,
  first_name varchar(150) NOT NULL,
  last_name varchar(150) NOT NULL,
  is_staff tinyint(1) NOT NULL,
  is_active tinyint(1) NOT NULL,
  date_joined datetime(6) NOT NULL,
  id char(32) NOT NULL,
  email varchar(254) NOT NULL,
  username varchar(30) NOT NULL,
  display_name varchar(100) NOT NULL,
  avatar varchar(100) DEFAULT NULL,
  cover_photo varchar(100) DEFAULT NULL,
  bio longtext NOT NULL,
  position varchar(100) NOT NULL,
  team varchar(100) NOT NULL,
  contact_number varchar(20) NOT NULL,
  interests longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(interests)),
  social_links longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(social_links)),
  is_private tinyint(1) NOT NULL,
  show_email tinyint(1) NOT NULL,
  show_phone tinyint(1) NOT NULL,
  followers_count int(10) UNSIGNED NOT NULL CHECK (followers_count >= 0),
  following_count int(10) UNSIGNED NOT NULL CHECK (following_count >= 0),
  posts_count int(10) UNSIGNED NOT NULL CHECK (posts_count >= 0),
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  last_active datetime(6) NOT NULL,
  is_verified tinyint(1) NOT NULL,
  email_verified tinyint(1) NOT NULL,
  account_type varchar(20) NOT NULL,
  company_name varchar(200) NOT NULL,
  industry varchar(100) NOT NULL,
  website varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla users
--

INSERT INTO users (password, last_login, is_superuser, first_name, last_name, is_staff, is_active, date_joined, id, email, username, display_name, avatar, cover_photo, bio, position, team, contact_number, interests, social_links, is_private, show_email, show_phone, followers_count, following_count, posts_count, created_at, updated_at, last_active, is_verified, email_verified, account_type, company_name, industry, website) VALUES
('pbkdf2_sha256$600000$1nCmo8MEnmSIeFHk0vcU0e$RnpWyrp/uDM1KjPmYEiuF5kIs5h0HWbHpJ3jDdKpA74=', NULL, 0, '', '', 0, 1, '2025-12-20 14:39:41.261517', '0bdd7932207842359e61b5ec951dcbb7', 'maria.swimmer@example.com', 'maria_swimmer', 'María Fernanda López', '', '', '', '', '', '', '[]', '[]', 0, 0, 0, 0, 0, 0, '2025-12-20 14:39:41.261980', '2025-12-20 14:39:42.045968', '2025-12-20 14:39:42.045974', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$ZqPtURNHvtMql6TfjpQSUf$X5e2wjiRwaSfOqP3pdLoiKTcoSK+V8suzycUA4yc9uo=', NULL, 1, '', '', 1, 1, '2025-12-02 20:37:10.753127', '1225e5006c6942fbb872836ab222e4e1', 'admin2@habilidosos.com', 'admin2', 'Admin 2', '', '', '', '', '', '', '[]', '[]', 0, 0, 0, 1, 0, 0, '2025-12-02 20:37:10.753338', '2025-12-02 20:37:11.011226', '2025-12-02 20:37:11.011232', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$YWonTspVArUyuo92H0TnwX$RCYpgppXlc8gbIOcp6ytPUv6UXg1ZO3fdwTU8y5atDM=', '2026-01-16 11:41:11.127909', 1, 'Admin', 'Sistema', 1, 1, '2025-12-02 04:53:09.099980', '294820a41aad4ff0abb05e9f5886555c', 'admin@habilidosos.com', 'admin', '', 'avatars/avatar.png', 'covers/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-h_rlyl25V.png', '', '', '', '', '[]', '[]', 0, 0, 0, 1, 0, 0, '2025-12-02 04:53:09.316028', '2025-12-02 20:37:11.445196', '2025-12-02 20:37:11.445201', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$cqTpjX0VH8buZ7PTVUnCvW$PGeWaKuoLpD2z3srSXFQ07cdT1HGmwRZs81FKQ4y8UE=', NULL, 0, '', '', 0, 1, '2025-12-20 14:39:40.596868', '381eed9b4cff47aca7eb31a11c274866', 'juan.athlete@example.com', 'juanperez_athlete', 'Juan Carlos Pérez', '', '', '', '', '', '', '[]', '[]', 0, 0, 0, 0, 0, 0, '2025-12-20 14:39:40.597446', '2025-12-20 14:39:41.178612', '2025-12-20 14:39:41.178616', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$Y3JARD9ifHgzA1sGzBd92r$f1rDd0JhAmI4MzWcByozkWVGOy0VJvUj+WH4x+H0bCk=', NULL, 0, 'Pedro', 'Sánchez', 0, 1, '2025-12-02 05:00:59.374806', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'pedro@test.com', 'pedro_sanchez', 'Pedro Sánchez', 'avatars/103af20008e2b0b1cecdadff56ff5fcb.jpg', 'covers/488c61ff134bb1ee885a536c177b5735.jpg', 'Gamer y streamer | FIFA enthusiast 🎮 | Barranquilla', 'Portero', 'Junior FC', '', '[]', '[]', 0, 0, 0, 0, 2, 0, '2025-12-02 05:00:59.375191', '2025-12-13 06:41:05.903519', '2025-12-13 06:41:05.903519', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$Gb7bwsIG8tLmQMzZhusko3$wPaRwAo6rXD1Jrc7vK6RbJGt2Ey9D29I5vRbSB11rF4=', NULL, 1, '', '', 1, 1, '2025-12-02 20:37:11.025525', '4912c5171c6d48d4bdbcfbd889a9143c', 'admin3@habilidosos.com', 'admin3', 'Admin 3', '', '', '', '', '', '', '[]', '[]', 0, 0, 0, 1, 0, 0, '2025-12-02 20:37:11.025899', '2025-12-02 20:37:11.233185', '2025-12-02 20:37:11.233189', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$v0ncDUAZMwkYg1rmdWvuvw$+pU95hYEsYFppJuWD+leXuHCHv/hfO3n/8c2UDE9DtU=', NULL, 0, '', '', 0, 1, '2025-12-20 20:58:00.805774', '4cccc11a7e634423bf92808272ad4b52', 'camilogomezroman@protonmaill.com', 'molo', 'M0L0W0R1D', 'avatars/afb30955a4f8909572ed5e60291d1763.jpg', 'covers/488c61ff134bb1ee885a536c177b5735_3RB6wwt.jpg', 'lkmlkmlk', '', '', '', '[]', '[]', 0, 0, 0, 0, 1, 0, '2025-12-20 20:58:01.558992', '2025-12-21 01:09:01.313831', '2025-12-21 01:09:01.313831', 0, 0, 'enterprise', 'M0L0W0R1D', 'Ingenieria de software', 'http://www.moloworld.com'),
('pbkdf2_sha256$600000$IO1zAbs7gNOdaN8EO9mixm$b0txXIVVBiqKrQ6evsMRPT9xn+gGZu/YD4+4Sdzw4rU=', NULL, 1, '', '', 1, 1, '2025-12-02 20:37:10.477896', '6113e8aa7db5436cb894bcb84c4491e0', 'superadmin@habilidosos.com', 'superadmin', 'Super Admin', '', '', '', '', '', '', '[]', '[]', 0, 0, 0, 0, 0, 0, '2025-12-02 20:37:10.479618', '2025-12-02 20:37:10.730625', '2025-12-02 20:37:10.730629', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$7G7WTHMYMWxz1kw7stOFJj$XgRLKKcDRInkXPiao+On+TCFKj37KMACk5wMt2IIxDA=', NULL, 0, '', '', 0, 1, '2025-12-02 20:32:00.211354', '6f053d432986406289a54b930e90924f', 'jazmin@pinzon.com', 'jazmin', 'yasmin pinzon', 'avatars/bc985b4aeef679b2e30ebf772c5a16db.jpg', 'covers/4707d30c59593d31c049c277cf837137.jpg', 'kgvkhg', 'Actor / Actriz', 'Habilidosos', '3006516516', '[\"Estudiar\"]', '[]', 0, 0, 0, 3, 1, 0, '2025-12-02 20:32:00.811345', '2025-12-22 01:40:41.174731', '2025-12-22 01:40:41.174731', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$OQBfKrVw8XtqIDBw5ta6wd$4967X9LiFrg0ksKe5YRnKxdi6REmWwtWSwXaYZPwDpI=', NULL, 0, '', '', 0, 1, '2025-12-20 14:39:42.059606', '798b2c1a516a46439ceb0a3e2598cc2b', 'andres.basket@example.com', 'andres_basket', 'Andrés Felipe Gómez', '', '', '', '', '', '', '[]', '[]', 0, 0, 0, 0, 0, 0, '2025-12-20 14:39:42.060570', '2025-12-20 14:39:42.650533', '2025-12-20 14:39:42.650541', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$AX0JrtM3ck23VkKyxaxZVD$0qaSXts4gFHvl6qEIXr0cK+//ooCLrKz4t6DI1ndjAY=', NULL, 0, 'María', 'García', 0, 1, '2025-12-02 05:00:58.202966', '84c5e41a9e4348548886b797643f91f8', 'maria@test.com', 'maria_garcia', 'María García', '', '', 'Amante del fútbol y la música 🎵⚽ | Bogotá, Colombia', 'Mediocampista', 'Millonarios FC', '', '[]', '[]', 0, 0, 0, 0, 0, 0, '2025-12-02 05:00:58.203926', '2025-12-02 05:00:58.566392', '2025-12-02 05:00:58.566397', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$AzLnVqyt2ufMBnQivNKiTV$JF5Fv2ka/t3alQUwowTxaa3KdDZTWEwmBHiZRHVVxos=', NULL, 0, 'Ana', 'Martínez', 0, 1, '2025-12-02 05:00:59.011339', '98ca610eafbc4827b95e754c9c0a6b23', 'ana@test.com', 'ana_martinez', 'Ana Martínez', '', '', 'Fotógrafa deportiva 📸 | Viajera | Cali', '', '', '', '[]', '[]', 0, 0, 0, 0, 0, 0, '2025-12-02 05:00:59.011627', '2025-12-02 05:00:59.365135', '2025-12-02 05:00:59.365143', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$rq5wiQ2CSfNzjNx2H3Ww9M$UbEEGk5OY+lPM8D9CFGyqAG+zupC6lSE7uJggbq0U6M=', NULL, 0, '', '', 0, 1, '2025-12-20 20:42:15.949950', 'baff81428a5f431386f480e8988f25c8', 'camilogomezroman@protonmail.com', 'moloworld', 'M0L0W0RLD', '', '', 'Desarrollo de  software a la medida', '', '', '', '[]', '[]', 0, 0, 0, 0, 0, 0, '2025-12-20 20:42:16.691699', '2025-12-20 20:42:16.691699', '2025-12-20 20:42:16.691699', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$9trN2HlimTg4gsMW871aNf$MRoejImFCQkJiRR7SdqHVfm4Brs/kangNF/s7J+bsKo=', NULL, 0, '', '', 0, 1, '2025-12-02 18:51:50.485957', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'camilogomezdeveloper@gmail.com', 'molocorp', 'Camilo Gomez', 'avatars/4e9d31195bccfad4ef0d44e232488f71.jpg', 'covers/6b67e37bfe7d7c2190b9cd69ba9e9e6b.jpg', 'negocios, testear. pentest, QA', 'Programar', 'SOS Team', '', '[]', '[]', 0, 0, 0, 4, 6, 0, '2025-12-02 18:51:51.294950', '2025-12-21 02:28:44.323750', '2025-12-21 02:28:44.323750', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$OSwc0lcAchcPvCzwQBAWwb$+IPMf23Zda+LgWd327MgbrDzC/7lvyk/BWs0ljm8uzg=', NULL, 0, 'Carlos', 'López', 0, 1, '2025-12-02 05:00:58.622982', 'd355c06d9f2b4fefbd6e3a4dab17b284', 'carlos@test.com', 'carlos_lopez', 'Carlos López', '', '', 'Jugador de fútbol amateur | Entrenador juvenil | Medellín', 'Delantero', 'Atlético Nacional', '', '[]', '[]', 0, 0, 0, 1, 0, 0, '2025-12-02 05:00:58.623842', '2025-12-02 05:00:58.995147', '2025-12-02 05:00:58.995157', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$1DPGDwy0F3Y8pn9Fyyi7v5$302yEr5CnS9znxOetIvvguLP/tgLUQKzRirbfYpTrkU=', NULL, 0, '', '', 0, 1, '2025-12-20 14:39:42.657845', 'd5a3635abc5b476992e7a598c8b1ed30', 'valentina.gym@example.com', 'valentina_gym', 'Valentina Rodríguez', '', '', '', '', '', '', '[]', '[]', 0, 0, 0, 0, 0, 0, '2025-12-20 14:39:42.658237', '2025-12-20 14:39:43.262638', '2025-12-20 14:39:43.262649', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$0bdO3gULm18b5SvRMyJMeu$2prMpZ9rKy4LKcieGTJNo+evqJ7sFAxtDh/ApKYLzm4=', NULL, 0, '', '', 0, 1, '2025-12-02 21:25:33.003875', 'e3702132b6cb45d2a390e6b1b5f254ab', 'redes.habilidosos@gmail.com', 'habilidosos', 'Sos Habilidosos', 'avatars/Logo_Habilidosos_MR_blanco4x.png', 'covers/Captura_de_pantalla_2025-12-13_005008.png', 'Fundacion Habilidosos', 'empresario', 'Habilidosos', '', '[]', '[]', 0, 0, 0, 1, 2, 0, '2025-12-02 21:25:33.611173', '2025-12-13 06:17:56.026291', '2025-12-13 06:17:56.026291', 0, 0, 'user', '', '', ''),
('pbkdf2_sha256$600000$KdsNO7lUUtR1qaJ0SlQWLc$XofsHpJRR0LjPSrSkTdxT+rXk0E0FLGn2ip8jF8eUCQ=', NULL, 0, 'Usuario', 'Prueba', 0, 1, '2025-12-02 04:53:09.323012', 'ec300baec9ef4c0696e10abca991ac64', 'usuario1@test.com', 'usuario1', '', '', '', '', '', '', '', '[]', '[]', 0, 0, 0, 0, 0, 0, '2025-12-02 04:53:09.539965', '2025-12-02 04:53:09.539973', '2025-12-02 04:53:09.539977', 0, 0, 'user', '', '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla users_groups
--

CREATE TABLE users_groups (
  id bigint(20) NOT NULL,
  user_id char(32) NOT NULL,
  group_id int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla users_user_permissions
--

CREATE TABLE users_user_permissions (
  id bigint(20) NOT NULL,
  user_id char(32) NOT NULL,
  permission_id int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla user_follows
--

CREATE TABLE user_follows (
  id char(32) NOT NULL,
  created_at datetime(6) NOT NULL,
  follower_id char(32) NOT NULL,
  following_id char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla user_follows
--

INSERT INTO user_follows (id, created_at, follower_id, following_id) VALUES
('065f4e75c0d94c4785160874afa472e8', '2025-12-20 21:18:51.823208', '4cccc11a7e634423bf92808272ad4b52', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('14958e56bcba45c595a037953163bf8d', '2025-12-13 05:20:02.528289', '6f053d432986406289a54b930e90924f', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('1ecc0430b5294d548c82abd12cf058fa', '2025-12-03 17:47:11.644844', 'bd22ec1c4dbe48f3a018e96b2cd61304', '294820a41aad4ff0abb05e9f5886555c'),
('2cc654da018d45d3846203ee3e25a9c0', '2025-12-03 17:47:10.176171', 'bd22ec1c4dbe48f3a018e96b2cd61304', '6f053d432986406289a54b930e90924f'),
('3e0cfcde8cc443229c74f4733df2de54', '2025-12-02 21:37:39.224591', '4265f3cd6c7a493b9e35efbacd3b3a6b', '6f053d432986406289a54b930e90924f'),
('6baa616adba345d9ae52c8a50b3af912', '2025-12-03 17:47:14.176270', 'bd22ec1c4dbe48f3a018e96b2cd61304', '4912c5171c6d48d4bdbcfbd889a9143c'),
('6c79041348bf4dfc8c09cc0bcbf9c3fc', '2025-12-03 17:47:17.896770', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'e3702132b6cb45d2a390e6b1b5f254ab'),
('709bd5340f0b435d8d55a9f3ea74340d', '2025-12-13 06:18:35.942286', 'e3702132b6cb45d2a390e6b1b5f254ab', '6f053d432986406289a54b930e90924f'),
('79e2b8a4386a43ed9e2395ff104cfdcd', '2025-12-13 06:14:46.379873', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'bd22ec1c4dbe48f3a018e96b2cd61304'),
('7fc6c3747f394ddaab9a85b9da143150', '2025-12-03 17:47:11.150685', 'bd22ec1c4dbe48f3a018e96b2cd61304', '1225e5006c6942fbb872836ab222e4e1'),
('8292f4098da24283a027a8e279528c60', '2025-12-16 17:41:52.960401', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'd355c06d9f2b4fefbd6e3a4dab17b284'),
('e2d86fe3305a45efb3385e500587deb3', '2025-12-13 06:18:35.476184', 'e3702132b6cb45d2a390e6b1b5f254ab', 'bd22ec1c4dbe48f3a018e96b2cd61304');

-- --------------------------------------------------------

--
-- Estructura para la vista learning_tema_stats
--
DROP TABLE IF EXISTS `learning_tema_stats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`` SQL SECURITY DEFINER VIEW learning_tema_stats  AS SELECT t.`id` AS `tema_id`, t.titulo AS `titulo`, t.slug AS `slug`, s.nombre AS `seccion_nombre`, count(distinct p.usuario_id) AS `usuarios_completaron`, avg(p.tiempo_dedicado) AS `tiempo_promedio_minutos`, avg(p.puntuacion_evaluacion) AS `puntuacion_promedio`, count(distinct e.`id`) AS `total_evaluaciones` FROM (((learning_tema t join learning_seccion s on(t.seccion_id = s.`id`)) left join learning_progresousuario p on(t.`id` = p.tema_id and p.completado = 1)) left join learning_evaluacion e on(t.`id` = e.tema_id)) WHERE t.is_active = 1 GROUP BY t.`id`, t.titulo, t.slug, s.nombre ;

-- --------------------------------------------------------

--
-- Estructura para la vista learning_user_stats
--
DROP TABLE IF EXISTS `learning_user_stats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`` SQL SECURITY DEFINER VIEW learning_user_stats  AS SELECT u.`id` AS `usuario_id`, u.username AS `username`, u.display_name AS `display_name`, count(distinct p.tema_id) AS `temas_completados`, count(distinct t.seccion_id) AS `secciones_iniciadas`, sum(p.tiempo_dedicado) AS `tiempo_total_minutos`, avg(p.puntuacion_evaluacion) AS `puntuacion_promedio`, count(distinct ul.logro_id) AS `logros_obtenidos`, max(p.fecha_completado) AS `ultima_actividad` FROM (((users u left join learning_progresousuario p on(u.`id` = p.usuario_id and p.completado = 1)) left join learning_tema t on(p.tema_id = t.`id`)) left join learning_usuariologro ul on(u.`id` = ul.usuario_id)) GROUP BY u.`id`, u.username, u.display_name ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla advertising_adclick
--
ALTER TABLE advertising_adclick
  ADD PRIMARY KEY (id),
  ADD KEY advertising_adclick_user_id_ba08d6b9_fk_users_id (user_id),
  ADD KEY advertising_ad_id_39e20c_idx (ad_id,clicked_at),
  ADD KEY advertising_adclick_impression_id_e738ebf8_fk_advertisi (impression_id);

--
-- Indices de la tabla advertising_adimpression
--
ALTER TABLE advertising_adimpression
  ADD PRIMARY KEY (id),
  ADD KEY advertising_ad_id_9d2a7f_idx (ad_id,user_id,viewed_at),
  ADD KEY advertising_user_id_87c4a5_idx (user_id,viewed_at);

--
-- Indices de la tabla advertising_advertisement
--
ALTER TABLE advertising_advertisement
  ADD PRIMARY KEY (id),
  ADD KEY advertising_advertisement_approved_by_id_568034d8_fk_users_id (approved_by_id),
  ADD KEY advertising_advertisement_created_by_id_c95ad0ae_fk_users_id (created_by_id),
  ADD KEY advertising_status_3ec1ee_idx (status,is_active,start_date,end_date),
  ADD KEY advertising_positio_b79dbc_idx (position,status),
  ADD KEY advertising_priorit_3a5101_idx (priority,created_at);

--
-- Indices de la tabla advertising_advideoview
--
ALTER TABLE advertising_advideoview
  ADD PRIMARY KEY (id),
  ADD KEY advertising_advideov_ad_id_ec4b2e48_fk_advertisi (ad_id),
  ADD KEY advertising_advideoview_user_id_c76264f4_fk_users_id (user_id);

--
-- Indices de la tabla advertising_payments
--
ALTER TABLE advertising_payments
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY transaction_id (transaction_id),
  ADD KEY advertising_payments_enterprise_id_cf8ae612_fk_enterprises_id (enterprise_id),
  ADD KEY advertising_payments_pricing_plan_id_c6289389_fk_pricing_p (pricing_plan_id),
  ADD KEY advertising_payments_user_id_85d0759a_fk_users_id (user_id);

--
-- Indices de la tabla analytics_useractivity
--
ALTER TABLE analytics_useractivity
  ADD PRIMARY KEY (id),
  ADD KEY idx_activity_usuario (usuario_id),
  ADD KEY idx_activity_accion (accion),
  ADD KEY idx_activity_pagina (pagina),
  ADD KEY idx_activity_timestamp (timestamp);

--
-- Indices de la tabla analytics_userinteraction
--
ALTER TABLE analytics_userinteraction
  ADD PRIMARY KEY (id),
  ADD KEY idx_interaction_usuario (usuario_id),
  ADD KEY idx_interaction_tipo (tipo_interaccion),
  ADD KEY idx_interaction_objeto (objeto_tipo,objeto_id),
  ADD KEY idx_interaction_timestamp (timestamp);

--
-- Indices de la tabla analytics_userlocation
--
ALTER TABLE analytics_userlocation
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY unique_usuario_location (usuario_id),
  ADD KEY idx_location_pais (pais),
  ADD KEY idx_location_ciudad (ciudad);

--
-- Indices de la tabla analytics_userpreferences
--
ALTER TABLE analytics_userpreferences
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY unique_usuario_categoria (usuario_id,categoria_interes),
  ADD KEY idx_preferences_usuario (usuario_id),
  ADD KEY idx_preferences_categoria (categoria_interes);

--
-- Indices de la tabla analytics_usersearchhistory
--
ALTER TABLE analytics_usersearchhistory
  ADD PRIMARY KEY (id),
  ADD KEY idx_search_usuario (usuario_id),
  ADD KEY idx_search_termino (termino_busqueda),
  ADD KEY idx_search_timestamp (timestamp);

--
-- Indices de la tabla analytics_usersession
--
ALTER TABLE analytics_usersession
  ADD PRIMARY KEY (id),
  ADD KEY idx_session_usuario (usuario_id),
  ADD KEY idx_session_fecha (fecha_inicio),
  ADD KEY idx_session_dispositivo (dispositivo);

--
-- Indices de la tabla analytics_usersocialconnections
--
ALTER TABLE analytics_usersocialconnections
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY unique_user_connection (usuario_id,amigo_id),
  ADD KEY idx_connections_usuario (usuario_id),
  ADD KEY idx_connections_amigo (amigo_id),
  ADD KEY idx_connections_tipo (tipo_conexion);

--
-- Indices de la tabla auth_group
--
ALTER TABLE auth_group
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY name (name);

--
-- Indices de la tabla auth_group_permissions
--
ALTER TABLE auth_group_permissions
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY auth_group_permissions_group_id_permission_id_0cd325b0_uniq (group_id,permission_id),
  ADD KEY auth_group_permissio_permission_id_84c5c92e_fk_auth_perm (permission_id);

--
-- Indices de la tabla auth_permission
--
ALTER TABLE auth_permission
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY auth_permission_content_type_id_codename_01ab375a_uniq (content_type_id,codename);

--
-- Indices de la tabla chat_invitations
--
ALTER TABLE chat_invitations
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY chat_invitations_chat_room_id_invitee_id_6081b2f0_uniq (chat_room_id,invitee_id),
  ADD KEY chat_invita_invitee_cf6a66_idx (invitee_id,status,created_at),
  ADD KEY chat_invita_chat_ro_306842_idx (chat_room_id,status),
  ADD KEY chat_invitations_inviter_id_63979a0a_fk_users_id (inviter_id);

--
-- Indices de la tabla chat_participants
--
ALTER TABLE chat_participants
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY chat_participants_chat_room_id_user_id_bef19a83_uniq (chat_room_id,user_id),
  ADD KEY chat_partic_user_id_902601_idx (user_id,joined_at),
  ADD KEY chat_partic_chat_ro_329d69_idx (chat_room_id,user_id);

--
-- Indices de la tabla chat_rooms
--
ALTER TABLE chat_rooms
  ADD PRIMARY KEY (id),
  ADD KEY chat_rooms_chat_ty_cd4e3a_idx (chat_type,last_activity),
  ADD KEY chat_rooms_created_b6023e_idx (created_by_id,created_at);

--
-- Indices de la tabla classifieds_contacts
--
ALTER TABLE classifieds_contacts
  ADD PRIMARY KEY (id),
  ADD KEY classifieds_contacts_sender_id_968c887a_fk_users_id (sender_id),
  ADD KEY classifieds_receive_c4cfca_idx (receiver_id,is_read,created_at),
  ADD KEY classifieds_classif_325205_idx (classified_type,classified_id);

--
-- Indices de la tabla classifieds_freelancer
--
ALTER TABLE classifieds_freelancer
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY short_id (short_id),
  ADD KEY classifieds_user_id_937f5b_idx (user_id,created_at),
  ADD KEY classifieds_categor_4fcc6b_idx (category,created_at),
  ADD KEY classifieds_status_755c89_idx (status,created_at),
  ADD KEY classifieds_rating_57ca43_idx (rating,created_at);

--
-- Indices de la tabla classifieds_likes
--
ALTER TABLE classifieds_likes
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY classifieds_likes_user_id_classified_type__15b61f68_uniq (user_id,classified_type,classified_id),
  ADD KEY classifieds_classif_85c5a1_idx (classified_type,classified_id),
  ADD KEY classifieds_user_id_54f9e4_idx (user_id,created_at);

--
-- Indices de la tabla classifieds_products
--
ALTER TABLE classifieds_products
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY short_id (short_id),
  ADD KEY classifieds_user_id_7246b4_idx (user_id,created_at),
  ADD KEY classifieds_categor_f70c25_idx (category,created_at),
  ADD KEY classifieds_status_7077e4_idx (status,created_at),
  ADD KEY classifieds_conditi_efbf94_idx (`condition`,created_at);

--
-- Indices de la tabla classifieds_reports
--
ALTER TABLE classifieds_reports
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY classifieds_reports_reporter_id_classified_t_52fdb8da_uniq (reporter_id,classified_type,classified_id),
  ADD KEY classifieds_reports_reviewed_by_id_cebe03d9_fk_users_id (reviewed_by_id),
  ADD KEY classifieds_status_c4d49e_idx (status,created_at);

--
-- Indices de la tabla classifieds_reviews
--
ALTER TABLE classifieds_reviews
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY classifieds_reviews_reviewer_id_classified_t_da757510_uniq (reviewer_id,classified_type,classified_id),
  ADD KEY classifieds_provide_1f97c8_idx (provider_id,created_at),
  ADD KEY classifieds_classif_34c84d_idx (classified_type,classified_id);

--
-- Indices de la tabla classifieds_services
--
ALTER TABLE classifieds_services
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY short_id (short_id),
  ADD KEY classifieds_user_id_c7338d_idx (user_id,created_at),
  ADD KEY classifieds_categor_4f7cbe_idx (category,created_at),
  ADD KEY classifieds_status_e9b6f6_idx (status,created_at),
  ADD KEY classifieds_rating_1995a9_idx (rating,created_at);

--
-- Indices de la tabla classifieds_views
--
ALTER TABLE classifieds_views
  ADD PRIMARY KEY (id),
  ADD KEY classifieds_classif_2b3c41_idx (classified_type,classified_id,created_at),
  ADD KEY classifieds_user_id_3b9cf2_idx (user_id,created_at);

--
-- Indices de la tabla comments
--
ALTER TABLE comments
  ADD PRIMARY KEY (id),
  ADD KEY comments_post_id_015fcc_idx (post_id,created_at),
  ADD KEY comments_parent__149355_idx (parent_id,created_at),
  ADD KEY comments_user_id_a80af7_idx (user_id,created_at);

--
-- Indices de la tabla comment_likes
--
ALTER TABLE comment_likes
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY comment_likes_user_id_comment_id_6298ff55_uniq (user_id,comment_id),
  ADD KEY comment_lik_comment_9e1199_idx (comment_id,created_at),
  ADD KEY comment_lik_user_id_219cf2_idx (user_id,created_at);

--
-- Indices de la tabla communities_community
--
ALTER TABLE communities_community
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY slug (slug),
  ADD KEY communities_community_owner_id_15a7d936_fk_users_id (owner_id),
  ADD KEY communities_communit_parent_id_0da540e9_fk_communiti (parent_id),
  ADD KEY communities_communit_category_obj_id_d7bcda0b_fk_communiti (category_obj_id);

--
-- Indices de la tabla communities_communitycategory
--
ALTER TABLE communities_communitycategory
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY name (name),
  ADD UNIQUE KEY slug (slug);

--
-- Indices de la tabla communities_communitymembership
--
ALTER TABLE communities_communitymembership
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY communities_communitymem_community_id_user_id_c57544e9_uniq (community_id,user_id),
  ADD KEY communities_communitymembership_user_id_599c8d2c_fk_users_id (user_id);

--
-- Indices de la tabla communities_communitypost
--
ALTER TABLE communities_communitypost
  ADD PRIMARY KEY (id),
  ADD KEY communities_communitypost_author_id_90a88205_fk_users_id (author_id),
  ADD KEY communities_communit_community_id_aa34cf86_fk_communiti (community_id);

--
-- Indices de la tabla communities_communitypostcomment
--
ALTER TABLE communities_communitypostcomment
  ADD PRIMARY KEY (id),
  ADD KEY communities_communitypostcomment_author_id_7c5ca429_fk_users_id (author_id),
  ADD KEY communities_communit_parent_id_4f0c63dc_fk_communiti (parent_id),
  ADD KEY communities_communit_post_id_f73d25be_fk_communiti (post_id);

--
-- Indices de la tabla communities_communitypostcomment_likes
--
ALTER TABLE communities_communitypostcomment_likes
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY communities_communitypos_communitypostcomment_id__8e6223f2_uniq (communitypostcomment_id,user_id),
  ADD KEY communities_community_user_id_45294005_fk_users_id (user_id);

--
-- Indices de la tabla communities_communitypost_likes
--
ALTER TABLE communities_communitypost_likes
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY communities_communitypos_communitypost_id_user_id_419df2a7_uniq (communitypost_id,user_id),
  ADD KEY communities_communitypost_likes_user_id_ba15a75a_fk_users_id (user_id);

--
-- Indices de la tabla communities_communitysociallink
--
ALTER TABLE communities_communitysociallink
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY communities_communitysoc_community_id_platform_133a29a6_uniq (community_id,platform);

--
-- Indices de la tabla communities_community_moderators
--
ALTER TABLE communities_community_moderators
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY communities_community_mo_community_id_user_id_11f6d76a_uniq (community_id,user_id),
  ADD KEY communities_community_moderators_user_id_3de1e625_fk_users_id (user_id);

--
-- Indices de la tabla cultural_event_categories
--
ALTER TABLE cultural_event_categories
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY name (name),
  ADD UNIQUE KEY slug (slug);

--
-- Indices de la tabla cultural_event_tags
--
ALTER TABLE cultural_event_tags
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY name (name),
  ADD UNIQUE KEY slug (slug);

--
-- Indices de la tabla django_admin_log
--
ALTER TABLE django_admin_log
  ADD PRIMARY KEY (id),
  ADD KEY django_admin_log_content_type_id_c4bce8eb_fk_django_co (content_type_id),
  ADD KEY django_admin_log_user_id_c564eba6_fk_users_id (user_id);

--
-- Indices de la tabla django_content_type
--
ALTER TABLE django_content_type
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY django_content_type_app_label_model_76bd3d3b_uniq (app_label,model);

--
-- Indices de la tabla django_migrations
--
ALTER TABLE django_migrations
  ADD PRIMARY KEY (id);

--
-- Indices de la tabla django_session
--
ALTER TABLE django_session
  ADD PRIMARY KEY (session_key),
  ADD KEY django_session_expire_date_a5c62663 (expire_date);

--
-- Indices de la tabla donations
--
ALTER TABLE donations
  ADD PRIMARY KEY (id),
  ADD KEY donations_athlete_cd5ec8_idx (athlete_id,status,created_at),
  ADD KEY donations_donor_i_1842e7_idx (donor_id,created_at),
  ADD KEY donations_status_80555b_idx (status,created_at);

--
-- Indices de la tabla donation_athlete_media
--
ALTER TABLE donation_athlete_media
  ADD PRIMARY KEY (id),
  ADD KEY donation_athlete_med_athlete_id_b73df9ab_fk_donation_ (athlete_id);

--
-- Indices de la tabla donation_athlete_profiles
--
ALTER TABLE donation_athlete_profiles
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY user_id (user_id),
  ADD KEY donation_at_status_b2273d_idx (status,created_at),
  ADD KEY donation_at_sport_i_5199b0_idx (sport_id,status),
  ADD KEY donation_at_is_feat_ed7825_idx (is_featured,created_at);

--
-- Indices de la tabla donation_sport_categories
--
ALTER TABLE donation_sport_categories
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY name (name),
  ADD UNIQUE KEY slug (slug);

--
-- Indices de la tabla donation_transactions
--
ALTER TABLE donation_transactions
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY transaction_id (transaction_id),
  ADD KEY donation_transactions_athlete_id_04e27f72_fk_users_id (athlete_id),
  ADD KEY donation_transactions_donor_id_94c39e40_fk_users_id (donor_id);

--
-- Indices de la tabla enterprises
--
ALTER TABLE enterprises
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY username (username),
  ADD KEY enterprises_owner_i_0d65ef_idx (owner_id),
  ADD KEY enterprises_usernam_d73cfd_idx (username),
  ADD KEY enterprises_categor_77db61_idx (category),
  ADD KEY enterprises_is_acti_d929f2_idx (is_active,created_at);

--
-- Indices de la tabla enterprise_classified_payments
--
ALTER TABLE enterprise_classified_payments
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY transaction_id (transaction_id),
  ADD KEY enterprise_classifie_enterprise_id_e88a1d86_fk_enterpris (enterprise_id),
  ADD KEY enterprise_classifie_pricing_plan_id_31e0f6c3_fk_pricing_p (pricing_plan_id);

--
-- Indices de la tabla enterprise_follows
--
ALTER TABLE enterprise_follows
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY enterprise_follows_user_id_enterprise_id_e47fe7d4_uniq (user_id,enterprise_id),
  ADD KEY enterprise_follows_enterprise_id_6fd343a3_fk_enterprises_id (enterprise_id);

--
-- Indices de la tabla finance_platformrevenue
--
ALTER TABLE finance_platformrevenue
  ADD PRIMARY KEY (id),
  ADD KEY finance_platformreve_related_transaction__4813f738_fk_finance_t (related_transaction_id);

--
-- Indices de la tabla finance_subscription
--
ALTER TABLE finance_subscription
  ADD PRIMARY KEY (id),
  ADD KEY finance_subscription_user_id_7cc6a5c0_fk_users_id (user_id);

--
-- Indices de la tabla finance_transaction
--
ALTER TABLE finance_transaction
  ADD PRIMARY KEY (id),
  ADD KEY finance_tra_created_945fa1_idx (created_at),
  ADD KEY finance_tra_user_id_9a80f9_idx (user_id,created_at),
  ADD KEY finance_tra_status_0941b9_idx (status),
  ADD KEY finance_transaction_recipient_id_6419c599_fk_users_id (recipient_id);

--
-- Indices de la tabla finance_userwallet
--
ALTER TABLE finance_userwallet
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY user_id (user_id);

--
-- Indices de la tabla friendships
--
ALTER TABLE friendships
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY friendships_user1_id_user2_id_a90e8fc0_uniq (user1_id,user2_id),
  ADD KEY friendships_user1_i_2aef82_idx (user1_id,created_at),
  ADD KEY friendships_user2_i_ec10a5_idx (user2_id,created_at);

--
-- Indices de la tabla friend_requests
--
ALTER TABLE friend_requests
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY friend_requests_sender_id_receiver_id_171b4336_uniq (sender_id,receiver_id),
  ADD KEY friend_requ_receive_2b4486_idx (receiver_id,status,created_at),
  ADD KEY friend_requ_sender__984dff_idx (sender_id,created_at);

--
-- Indices de la tabla learning_evaluacion
--
ALTER TABLE learning_evaluacion
  ADD PRIMARY KEY (id),
  ADD KEY idx_evaluacion_tema (tema_id),
  ADD KEY idx_evaluacion_active (is_active);

--
-- Indices de la tabla learning_logro
--
ALTER TABLE learning_logro
  ADD PRIMARY KEY (id),
  ADD KEY idx_logro_active (is_active);

--
-- Indices de la tabla learning_logros
--
ALTER TABLE learning_logros
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY slug (slug),
  ADD KEY learning_logros_seccion_requerida_id_c895434c_fk_learning_ (seccion_requerida_id);

--
-- Indices de la tabla learning_progresousuario
--
ALTER TABLE learning_progresousuario
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY unique_usuario_tema (usuario_id,tema_id),
  ADD KEY idx_progreso_usuario (usuario_id),
  ADD KEY idx_progreso_tema (tema_id),
  ADD KEY idx_progreso_completado (completado);

--
-- Indices de la tabla learning_progreso_usuario
--
ALTER TABLE learning_progreso_usuario
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY learning_progreso_usuario_usuario_id_tema_id_ad54edd2_uniq (usuario_id,tema_id),
  ADD KEY learning_progreso_usuario_tema_id_3a303025_fk_learning_temas_id (tema_id);

--
-- Indices de la tabla learning_seccion
--
ALTER TABLE learning_seccion
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY slug (slug),
  ADD KEY idx_seccion_active (is_active),
  ADD KEY idx_seccion_orden (orden);

--
-- Indices de la tabla learning_secciones
--
ALTER TABLE learning_secciones
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY slug (slug);

--
-- Indices de la tabla learning_tema
--
ALTER TABLE learning_tema
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY unique_seccion_slug (seccion_id,slug),
  ADD KEY idx_tema_seccion (seccion_id),
  ADD KEY idx_tema_active (is_active),
  ADD KEY idx_tema_orden (orden);

--
-- Indices de la tabla learning_temacontenido
--
ALTER TABLE learning_temacontenido
  ADD PRIMARY KEY (id),
  ADD KEY idx_contenido_tema (tema_id),
  ADD KEY idx_contenido_orden (orden);

--
-- Indices de la tabla learning_temapuntoclave
--
ALTER TABLE learning_temapuntoclave
  ADD PRIMARY KEY (id),
  ADD KEY idx_punto_tema (tema_id),
  ADD KEY idx_punto_orden (orden);

--
-- Indices de la tabla learning_temas
--
ALTER TABLE learning_temas
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY learning_temas_seccion_id_slug_d80bddc7_uniq (seccion_id,slug),
  ADD KEY learning_temas_slug_b697b4d3 (slug);

--
-- Indices de la tabla learning_tema_contenido
--
ALTER TABLE learning_tema_contenido
  ADD PRIMARY KEY (id),
  ADD KEY learning_tema_contenido_tema_id_ee7f1211_fk_learning_temas_id (tema_id);

--
-- Indices de la tabla learning_tema_puntos_clave
--
ALTER TABLE learning_tema_puntos_clave
  ADD PRIMARY KEY (id),
  ADD KEY learning_tema_puntos_clave_tema_id_c3622af5_fk_learning_temas_id (tema_id);

--
-- Indices de la tabla learning_usuariologro
--
ALTER TABLE learning_usuariologro
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY unique_usuario_logro (usuario_id,logro_id),
  ADD KEY idx_usuario_logros (usuario_id),
  ADD KEY idx_logro_usuarios (logro_id);

--
-- Indices de la tabla learning_usuario_logros
--
ALTER TABLE learning_usuario_logros
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY learning_usuario_logros_usuario_id_logro_id_9902c500_uniq (usuario_id,logro_id),
  ADD KEY learning_usuario_logros_logro_id_5e49ea8f_fk_learning_logros_id (logro_id);

--
-- Indices de la tabla media_storage_mediaalbum
--
ALTER TABLE media_storage_mediaalbum
  ADD PRIMARY KEY (id),
  ADD KEY media_storage_mediaalbum_owner_id_72fc69a7_fk_users_id (owner_id);

--
-- Indices de la tabla media_storage_mediaalbum_files
--
ALTER TABLE media_storage_mediaalbum_files
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY media_storage_mediaalbum_mediaalbum_id_mediafile__74f2a935_uniq (mediaalbum_id,mediafile_id),
  ADD KEY media_storage_mediaa_mediafile_id_4721ea14_fk_media_sto (mediafile_id);

--
-- Indices de la tabla media_storage_mediafile
--
ALTER TABLE media_storage_mediafile
  ADD PRIMARY KEY (id),
  ADD KEY media_stora_uploade_37f33e_idx (uploaded_by_id,created_at),
  ADD KEY media_stora_file_ty_a1d710_idx (file_type,created_at);

--
-- Indices de la tabla messages
--
ALTER TABLE messages
  ADD PRIMARY KEY (id),
  ADD KEY messages_chat_ro_6c0442_idx (chat_room_id,created_at),
  ADD KEY messages_sender__7375e3_idx (sender_id,created_at),
  ADD KEY messages_chat_ro_134f80_idx (chat_room_id,is_deleted,created_at),
  ADD KEY messages_reply_to_id_59eac9e3_fk_messages_id (reply_to_id);

--
-- Indices de la tabla message_reactions
--
ALTER TABLE message_reactions
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY message_reactions_message_id_user_id_reaction_type_2ead89b1_uniq (message_id,user_id,reaction_type),
  ADD KEY message_rea_message_57565e_idx (message_id,reaction_type),
  ADD KEY message_rea_user_id_97e8d1_idx (user_id,created_at);

--
-- Indices de la tabla message_reads
--
ALTER TABLE message_reads
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY message_reads_message_id_user_id_e74b1465_uniq (message_id,user_id),
  ADD KEY message_rea_user_id_59f535_idx (user_id,read_at),
  ADD KEY message_rea_message_19da3c_idx (message_id,user_id);

--
-- Indices de la tabla notifications
--
ALTER TABLE notifications
  ADD PRIMARY KEY (id),
  ADD KEY notificatio_recipie_2d3764_idx (recipient_id,created_at),
  ADD KEY notificatio_recipie_583549_idx (recipient_id,is_read),
  ADD KEY notificatio_sender__6aaec3_idx (sender_id,created_at);

--
-- Indices de la tabla payment_accounts
--
ALTER TABLE payment_accounts
  ADD PRIMARY KEY (id);

--
-- Indices de la tabla platform_settings
--
ALTER TABLE platform_settings
  ADD PRIMARY KEY (id);

--
-- Indices de la tabla posts
--
ALTER TABLE posts
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY short_id (short_id),
  ADD KEY posts_user_id_dfa368_idx (user_id,created_at),
  ADD KEY posts_categor_b285e2_idx (category,created_at),
  ADD KEY posts_post_ty_2afc3b_idx (post_type,created_at),
  ADD KEY posts_is_publ_6eff95_idx (is_public,created_at);

--
-- Indices de la tabla post_bookmarks
--
ALTER TABLE post_bookmarks
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY post_bookmarks_user_id_post_id_d70271ad_uniq (user_id,post_id),
  ADD KEY post_bookma_user_id_d11841_idx (user_id,created_at),
  ADD KEY post_bookmarks_post_id_ebbc9298_fk_posts_id (post_id);

--
-- Indices de la tabla post_reactions
--
ALTER TABLE post_reactions
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY post_reactions_user_id_post_id_reaction_type_24723eac_uniq (user_id,post_id,reaction_type),
  ADD KEY post_reacti_post_id_6674a6_idx (post_id,reaction_type),
  ADD KEY post_reacti_user_id_d13d8c_idx (user_id,created_at);

--
-- Indices de la tabla post_reports
--
ALTER TABLE post_reports
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY post_reports_reporter_id_post_id_56a5c373_uniq (reporter_id,post_id),
  ADD KEY post_report_status_5f2307_idx (status,created_at),
  ADD KEY post_report_post_id_93f6a6_idx (post_id,created_at),
  ADD KEY post_reports_reviewed_by_id_6dfbb48a_fk_users_id (reviewed_by_id);

--
-- Indices de la tabla post_shares
--
ALTER TABLE post_shares
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY post_shares_user_id_post_id_a060fa21_uniq (user_id,post_id),
  ADD KEY post_shares_user_id_c3c822_idx (user_id,created_at),
  ADD KEY post_shares_post_id_219864_idx (post_id,created_at);

--
-- Indices de la tabla post_views
--
ALTER TABLE post_views
  ADD PRIMARY KEY (id),
  ADD KEY post_views_post_id_cc8b0b_idx (post_id,created_at),
  ADD KEY post_views_user_id_87e878_idx (user_id,created_at),
  ADD KEY post_views_ip_addr_9baea9_idx (ip_address,created_at);

--
-- Indices de la tabla pricing_plans
--
ALTER TABLE pricing_plans
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY service_type (service_type);

--
-- Indices de la tabla reels_reel
--
ALTER TABLE reels_reel
  ADD PRIMARY KEY (id),
  ADD KEY reels_reel_author_id_6fd60eb5_fk_users_id (author_id);

--
-- Indices de la tabla reels_reelcomment
--
ALTER TABLE reels_reelcomment
  ADD PRIMARY KEY (id),
  ADD KEY reels_reelcomment_author_id_7970e133_fk_users_id (author_id),
  ADD KEY reels_reelcomment_parent_id_b23a54b6_fk_reels_reelcomment_id (parent_id),
  ADD KEY reels_reelcomment_reel_id_5c2ee5ca_fk_reels_reel_id (reel_id);

--
-- Indices de la tabla reels_reelcomment_likes
--
ALTER TABLE reels_reelcomment_likes
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY reels_reelcomment_likes_reelcomment_id_user_id_8ddc5621_uniq (reelcomment_id,user_id),
  ADD KEY reels_reelcomment_likes_user_id_d6a85d7e_fk_users_id (user_id);

--
-- Indices de la tabla reels_reel_likes
--
ALTER TABLE reels_reel_likes
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY reels_reel_likes_reel_id_user_id_32a4c5cc_uniq (reel_id,user_id),
  ADD KEY reels_reel_likes_user_id_5a6adcad_fk_users_id (user_id);

--
-- Indices de la tabla site_settings
--
ALTER TABLE site_settings
  ADD PRIMARY KEY (id);

--
-- Indices de la tabla stories
--
ALTER TABLE stories
  ADD PRIMARY KEY (id),
  ADD KEY stories_user_id_b336dc_idx (user_id,created_at),
  ADD KEY stories_expires_a4b2b7_idx (expires_at);

--
-- Indices de la tabla story_reactions
--
ALTER TABLE story_reactions
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY story_reactions_user_id_story_id_83122838_uniq (user_id,story_id),
  ADD KEY story_react_story_i_ea66a3_idx (story_id,reaction_type),
  ADD KEY story_react_user_id_15f3bc_idx (user_id,created_at);

--
-- Indices de la tabla story_replies
--
ALTER TABLE story_replies
  ADD PRIMARY KEY (id),
  ADD KEY story_repli_story_i_46664c_idx (story_id,created_at),
  ADD KEY story_repli_user_id_4ddf9b_idx (user_id,created_at);

--
-- Indices de la tabla story_views
--
ALTER TABLE story_views
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY story_views_user_id_story_id_d32ee294_uniq (user_id,story_id),
  ADD KEY story_views_story_i_ced952_idx (story_id,viewed_at),
  ADD KEY story_views_user_id_028f51_idx (user_id,viewed_at);

--
-- Indices de la tabla transactions
--
ALTER TABLE transactions
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY reference_code (reference_code),
  ADD KEY transaction_user_id_ced08a_idx (user_id,created_at),
  ADD KEY transaction_status_b84006_idx (status,created_at),
  ADD KEY transaction_transac_a32e0c_idx (transaction_type,created_at),
  ADD KEY transaction_referen_0764c1_idx (reference_code),
  ADD KEY transactions_enterprise_id_456d86a6_fk_enterprises_id (enterprise_id),
  ADD KEY transactions_payment_account_id_294a3399_fk_payment_accounts_id (payment_account_id),
  ADD KEY transactions_pricing_plan_id_937776da_fk_pricing_plans_id (pricing_plan_id),
  ADD KEY transactions_verified_by_id_2c2b302a_fk_users_id (verified_by_id);

--
-- Indices de la tabla users
--
ALTER TABLE users
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY email (email),
  ADD UNIQUE KEY username (username),
  ADD KEY users_email_4b85f2_idx (email),
  ADD KEY users_usernam_baeb4b_idx (username),
  ADD KEY users_is_acti_af9e1a_idx (is_active,created_at);

--
-- Indices de la tabla users_groups
--
ALTER TABLE users_groups
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY users_groups_user_id_group_id_fc7788e8_uniq (user_id,group_id),
  ADD KEY users_groups_group_id_2f3517aa_fk_auth_group_id (group_id);

--
-- Indices de la tabla users_user_permissions
--
ALTER TABLE users_user_permissions
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY users_user_permissions_user_id_permission_id_3b86cbdf_uniq (user_id,permission_id),
  ADD KEY users_user_permissio_permission_id_6d08dcd2_fk_auth_perm (permission_id);

--
-- Indices de la tabla user_follows
--
ALTER TABLE user_follows
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY user_follows_follower_id_following_id_352db369_uniq (follower_id,following_id),
  ADD KEY user_follow_followe_5ed1bd_idx (follower_id,created_at),
  ADD KEY user_follow_followi_7c1ee1_idx (following_id,created_at);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla auth_group
--
ALTER TABLE auth_group
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla auth_group_permissions
--
ALTER TABLE auth_group_permissions
  MODIFY id bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla auth_permission
--
ALTER TABLE auth_permission
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=309;

--
-- AUTO_INCREMENT de la tabla communities_communitymembership
--
ALTER TABLE communities_communitymembership
  MODIFY id bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT de la tabla communities_communitypostcomment_likes
--
ALTER TABLE communities_communitypostcomment_likes
  MODIFY id bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla communities_communitypost_likes
--
ALTER TABLE communities_communitypost_likes
  MODIFY id bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT de la tabla communities_communitysociallink
--
ALTER TABLE communities_communitysociallink
  MODIFY id bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla communities_community_moderators
--
ALTER TABLE communities_community_moderators
  MODIFY id bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla cultural_event_categories
--
ALTER TABLE cultural_event_categories
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla cultural_event_tags
--
ALTER TABLE cultural_event_tags
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla django_admin_log
--
ALTER TABLE django_admin_log
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla django_content_type
--
ALTER TABLE django_content_type
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT de la tabla django_migrations
--
ALTER TABLE django_migrations
  MODIFY id bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de la tabla media_storage_mediaalbum_files
--
ALTER TABLE media_storage_mediaalbum_files
  MODIFY id bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla reels_reelcomment_likes
--
ALTER TABLE reels_reelcomment_likes
  MODIFY id bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla reels_reel_likes
--
ALTER TABLE reels_reel_likes
  MODIFY id bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla site_settings
--
ALTER TABLE site_settings
  MODIFY id bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla users_groups
--
ALTER TABLE users_groups
  MODIFY id bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla users_user_permissions
--
ALTER TABLE users_user_permissions
  MODIFY id bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla advertising_adclick
--
ALTER TABLE advertising_adclick
  ADD CONSTRAINT advertising_adclick_ad_id_c95bc9c8_fk_advertisi FOREIGN KEY (ad_id) REFERENCES advertising_advertisement (id),
  ADD CONSTRAINT advertising_adclick_impression_id_e738ebf8_fk_advertisi FOREIGN KEY (impression_id) REFERENCES advertising_adimpression (id),
  ADD CONSTRAINT advertising_adclick_user_id_ba08d6b9_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla advertising_adimpression
--
ALTER TABLE advertising_adimpression
  ADD CONSTRAINT advertising_adimpres_ad_id_53091356_fk_advertisi FOREIGN KEY (ad_id) REFERENCES advertising_advertisement (id),
  ADD CONSTRAINT advertising_adimpression_user_id_51a2becb_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla advertising_advertisement
--
ALTER TABLE advertising_advertisement
  ADD CONSTRAINT advertising_advertisement_approved_by_id_568034d8_fk_users_id FOREIGN KEY (approved_by_id) REFERENCES `users` (id),
  ADD CONSTRAINT advertising_advertisement_created_by_id_c95ad0ae_fk_users_id FOREIGN KEY (created_by_id) REFERENCES `users` (id);

--
-- Filtros para la tabla advertising_advideoview
--
ALTER TABLE advertising_advideoview
  ADD CONSTRAINT advertising_advideov_ad_id_ec4b2e48_fk_advertisi FOREIGN KEY (ad_id) REFERENCES advertising_advertisement (id),
  ADD CONSTRAINT advertising_advideoview_user_id_c76264f4_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla advertising_payments
--
ALTER TABLE advertising_payments
  ADD CONSTRAINT advertising_payments_enterprise_id_cf8ae612_fk_enterprises_id FOREIGN KEY (enterprise_id) REFERENCES enterprises (id),
  ADD CONSTRAINT advertising_payments_pricing_plan_id_c6289389_fk_pricing_p FOREIGN KEY (pricing_plan_id) REFERENCES pricing_plans (id),
  ADD CONSTRAINT advertising_payments_transaction_id_8a66c33f_fk_transactions_id FOREIGN KEY (transaction_id) REFERENCES `transactions` (id),
  ADD CONSTRAINT advertising_payments_user_id_85d0759a_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla analytics_useractivity
--
ALTER TABLE analytics_useractivity
  ADD CONSTRAINT analytics_useractivity_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES `users` (id) ON DELETE CASCADE;

--
-- Filtros para la tabla analytics_userinteraction
--
ALTER TABLE analytics_userinteraction
  ADD CONSTRAINT analytics_userinteraction_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES `users` (id) ON DELETE CASCADE;

--
-- Filtros para la tabla analytics_userlocation
--
ALTER TABLE analytics_userlocation
  ADD CONSTRAINT analytics_userlocation_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES `users` (id) ON DELETE CASCADE;

--
-- Filtros para la tabla analytics_userpreferences
--
ALTER TABLE analytics_userpreferences
  ADD CONSTRAINT analytics_userpreferences_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES `users` (id) ON DELETE CASCADE;

--
-- Filtros para la tabla analytics_usersearchhistory
--
ALTER TABLE analytics_usersearchhistory
  ADD CONSTRAINT analytics_usersearchhistory_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES `users` (id) ON DELETE CASCADE;

--
-- Filtros para la tabla analytics_usersession
--
ALTER TABLE analytics_usersession
  ADD CONSTRAINT analytics_usersession_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES `users` (id) ON DELETE CASCADE;

--
-- Filtros para la tabla analytics_usersocialconnections
--
ALTER TABLE analytics_usersocialconnections
  ADD CONSTRAINT analytics_usersocialconnections_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES `users` (id) ON DELETE CASCADE,
  ADD CONSTRAINT analytics_usersocialconnections_ibfk_2 FOREIGN KEY (amigo_id) REFERENCES `users` (id) ON DELETE CASCADE;

--
-- Filtros para la tabla auth_group_permissions
--
ALTER TABLE auth_group_permissions
  ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES auth_permission (id),
  ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES auth_group (id);

--
-- Filtros para la tabla auth_permission
--
ALTER TABLE auth_permission
  ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES django_content_type (id);

--
-- Filtros para la tabla chat_invitations
--
ALTER TABLE chat_invitations
  ADD CONSTRAINT chat_invitations_chat_room_id_a92485e3_fk_chat_rooms_id FOREIGN KEY (chat_room_id) REFERENCES chat_rooms (id),
  ADD CONSTRAINT chat_invitations_invitee_id_40a21210_fk_users_id FOREIGN KEY (invitee_id) REFERENCES `users` (id),
  ADD CONSTRAINT chat_invitations_inviter_id_63979a0a_fk_users_id FOREIGN KEY (inviter_id) REFERENCES `users` (id);

--
-- Filtros para la tabla chat_participants
--
ALTER TABLE chat_participants
  ADD CONSTRAINT chat_participants_chat_room_id_1099369a_fk_chat_rooms_id FOREIGN KEY (chat_room_id) REFERENCES chat_rooms (id),
  ADD CONSTRAINT chat_participants_user_id_283c72d9_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla chat_rooms
--
ALTER TABLE chat_rooms
  ADD CONSTRAINT chat_rooms_created_by_id_b5269f8f_fk_users_id FOREIGN KEY (created_by_id) REFERENCES `users` (id);

--
-- Filtros para la tabla classifieds_contacts
--
ALTER TABLE classifieds_contacts
  ADD CONSTRAINT classifieds_contacts_receiver_id_eb30e0e0_fk_users_id FOREIGN KEY (receiver_id) REFERENCES `users` (id),
  ADD CONSTRAINT classifieds_contacts_sender_id_968c887a_fk_users_id FOREIGN KEY (sender_id) REFERENCES `users` (id);

--
-- Filtros para la tabla classifieds_freelancer
--
ALTER TABLE classifieds_freelancer
  ADD CONSTRAINT classifieds_freelancer_user_id_28ee8d83_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla classifieds_likes
--
ALTER TABLE classifieds_likes
  ADD CONSTRAINT classifieds_likes_user_id_d827d78c_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla classifieds_products
--
ALTER TABLE classifieds_products
  ADD CONSTRAINT classifieds_products_user_id_540e436e_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla classifieds_reports
--
ALTER TABLE classifieds_reports
  ADD CONSTRAINT classifieds_reports_reporter_id_407cda7a_fk_users_id FOREIGN KEY (reporter_id) REFERENCES `users` (id),
  ADD CONSTRAINT classifieds_reports_reviewed_by_id_cebe03d9_fk_users_id FOREIGN KEY (reviewed_by_id) REFERENCES `users` (id);

--
-- Filtros para la tabla classifieds_reviews
--
ALTER TABLE classifieds_reviews
  ADD CONSTRAINT classifieds_reviews_provider_id_6c833eb7_fk_users_id FOREIGN KEY (provider_id) REFERENCES `users` (id),
  ADD CONSTRAINT classifieds_reviews_reviewer_id_4ec57920_fk_users_id FOREIGN KEY (reviewer_id) REFERENCES `users` (id);

--
-- Filtros para la tabla classifieds_services
--
ALTER TABLE classifieds_services
  ADD CONSTRAINT classifieds_services_user_id_77339ae4_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla classifieds_views
--
ALTER TABLE classifieds_views
  ADD CONSTRAINT classifieds_views_user_id_b813b396_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla comments
--
ALTER TABLE comments
  ADD CONSTRAINT comments_parent_id_d317363b_fk_comments_id FOREIGN KEY (parent_id) REFERENCES `comments` (id),
  ADD CONSTRAINT comments_post_id_67cfce36_fk_posts_id FOREIGN KEY (post_id) REFERENCES posts (id),
  ADD CONSTRAINT comments_user_id_b8fd0b64_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla comment_likes
--
ALTER TABLE comment_likes
  ADD CONSTRAINT comment_likes_comment_id_46bef86d_fk_comments_id FOREIGN KEY (comment_id) REFERENCES `comments` (id),
  ADD CONSTRAINT comment_likes_user_id_c5a9587c_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla communities_community
--
ALTER TABLE communities_community
  ADD CONSTRAINT communities_communit_category_obj_id_d7bcda0b_fk_communiti FOREIGN KEY (category_obj_id) REFERENCES communities_communitycategory (id),
  ADD CONSTRAINT communities_communit_parent_id_0da540e9_fk_communiti FOREIGN KEY (parent_id) REFERENCES communities_community (id),
  ADD CONSTRAINT communities_community_owner_id_15a7d936_fk_users_id FOREIGN KEY (owner_id) REFERENCES `users` (id);

--
-- Filtros para la tabla communities_communitymembership
--
ALTER TABLE communities_communitymembership
  ADD CONSTRAINT communities_communit_community_id_1fa1c06d_fk_communiti FOREIGN KEY (community_id) REFERENCES communities_community (id),
  ADD CONSTRAINT communities_communitymembership_user_id_599c8d2c_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla communities_communitypost
--
ALTER TABLE communities_communitypost
  ADD CONSTRAINT communities_communit_community_id_aa34cf86_fk_communiti FOREIGN KEY (community_id) REFERENCES communities_community (id),
  ADD CONSTRAINT communities_communitypost_author_id_90a88205_fk_users_id FOREIGN KEY (author_id) REFERENCES `users` (id);

--
-- Filtros para la tabla communities_communitypostcomment
--
ALTER TABLE communities_communitypostcomment
  ADD CONSTRAINT communities_communit_parent_id_4f0c63dc_fk_communiti FOREIGN KEY (parent_id) REFERENCES communities_communitypostcomment (id),
  ADD CONSTRAINT communities_communit_post_id_f73d25be_fk_communiti FOREIGN KEY (post_id) REFERENCES communities_communitypost (id),
  ADD CONSTRAINT communities_communitypostcomment_author_id_7c5ca429_fk_users_id FOREIGN KEY (author_id) REFERENCES `users` (id);

--
-- Filtros para la tabla communities_communitypostcomment_likes
--
ALTER TABLE communities_communitypostcomment_likes
  ADD CONSTRAINT communities_communit_communitypostcomment_3909de23_fk_communiti FOREIGN KEY (communitypostcomment_id) REFERENCES communities_communitypostcomment (id),
  ADD CONSTRAINT communities_community_user_id_45294005_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla communities_communitypost_likes
--
ALTER TABLE communities_communitypost_likes
  ADD CONSTRAINT communities_communit_communitypost_id_1ac7d910_fk_communiti FOREIGN KEY (communitypost_id) REFERENCES communities_communitypost (id),
  ADD CONSTRAINT communities_communitypost_likes_user_id_ba15a75a_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla communities_communitysociallink
--
ALTER TABLE communities_communitysociallink
  ADD CONSTRAINT communities_communit_community_id_b8e32d89_fk_communiti FOREIGN KEY (community_id) REFERENCES communities_community (id);

--
-- Filtros para la tabla communities_community_moderators
--
ALTER TABLE communities_community_moderators
  ADD CONSTRAINT communities_communit_community_id_f83766ec_fk_communiti FOREIGN KEY (community_id) REFERENCES communities_community (id),
  ADD CONSTRAINT communities_community_moderators_user_id_3de1e625_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla django_admin_log
--
ALTER TABLE django_admin_log
  ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES django_content_type (id),
  ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla donations
--
ALTER TABLE donations
  ADD CONSTRAINT donations_athlete_id_0d95b11f_fk_donation_athlete_profiles_id FOREIGN KEY (athlete_id) REFERENCES donation_athlete_profiles (id),
  ADD CONSTRAINT donations_donor_id_6304a7de_fk_users_id FOREIGN KEY (donor_id) REFERENCES `users` (id);

--
-- Filtros para la tabla donation_athlete_media
--
ALTER TABLE donation_athlete_media
  ADD CONSTRAINT donation_athlete_med_athlete_id_b73df9ab_fk_donation_ FOREIGN KEY (athlete_id) REFERENCES donation_athlete_profiles (id);

--
-- Filtros para la tabla donation_athlete_profiles
--
ALTER TABLE donation_athlete_profiles
  ADD CONSTRAINT donation_athlete_pro_sport_id_3d1665c2_fk_donation_ FOREIGN KEY (sport_id) REFERENCES donation_sport_categories (id),
  ADD CONSTRAINT donation_athlete_profiles_user_id_033b1f41_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla donation_transactions
--
ALTER TABLE donation_transactions
  ADD CONSTRAINT donation_transactions_athlete_id_04e27f72_fk_users_id FOREIGN KEY (athlete_id) REFERENCES `users` (id),
  ADD CONSTRAINT donation_transactions_donor_id_94c39e40_fk_users_id FOREIGN KEY (donor_id) REFERENCES `users` (id),
  ADD CONSTRAINT donation_transactions_transaction_id_4a91a725_fk_transactions_id FOREIGN KEY (transaction_id) REFERENCES `transactions` (id);

--
-- Filtros para la tabla enterprises
--
ALTER TABLE enterprises
  ADD CONSTRAINT enterprises_owner_id_00019aef_fk_users_id FOREIGN KEY (owner_id) REFERENCES `users` (id);

--
-- Filtros para la tabla enterprise_classified_payments
--
ALTER TABLE enterprise_classified_payments
  ADD CONSTRAINT enterprise_classifie_enterprise_id_e88a1d86_fk_enterpris FOREIGN KEY (enterprise_id) REFERENCES enterprises (id),
  ADD CONSTRAINT enterprise_classifie_pricing_plan_id_31e0f6c3_fk_pricing_p FOREIGN KEY (pricing_plan_id) REFERENCES pricing_plans (id),
  ADD CONSTRAINT enterprise_classifie_transaction_id_f9d6ad52_fk_transacti FOREIGN KEY (transaction_id) REFERENCES `transactions` (id);

--
-- Filtros para la tabla enterprise_follows
--
ALTER TABLE enterprise_follows
  ADD CONSTRAINT enterprise_follows_enterprise_id_6fd343a3_fk_enterprises_id FOREIGN KEY (enterprise_id) REFERENCES enterprises (id),
  ADD CONSTRAINT enterprise_follows_user_id_37f5a76b_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla finance_platformrevenue
--
ALTER TABLE finance_platformrevenue
  ADD CONSTRAINT finance_platformreve_related_transaction__4813f738_fk_finance_t FOREIGN KEY (related_transaction_id) REFERENCES finance_transaction (id);

--
-- Filtros para la tabla finance_subscription
--
ALTER TABLE finance_subscription
  ADD CONSTRAINT finance_subscription_user_id_7cc6a5c0_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla finance_transaction
--
ALTER TABLE finance_transaction
  ADD CONSTRAINT finance_transaction_recipient_id_6419c599_fk_users_id FOREIGN KEY (recipient_id) REFERENCES `users` (id),
  ADD CONSTRAINT finance_transaction_user_id_6c085a0b_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla finance_userwallet
--
ALTER TABLE finance_userwallet
  ADD CONSTRAINT finance_userwallet_user_id_0b7b5b2c_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla friendships
--
ALTER TABLE friendships
  ADD CONSTRAINT friendships_user1_id_6bd3a177_fk_users_id FOREIGN KEY (user1_id) REFERENCES `users` (id),
  ADD CONSTRAINT friendships_user2_id_f50fb9d3_fk_users_id FOREIGN KEY (user2_id) REFERENCES `users` (id);

--
-- Filtros para la tabla friend_requests
--
ALTER TABLE friend_requests
  ADD CONSTRAINT friend_requests_receiver_id_6e370850_fk_users_id FOREIGN KEY (receiver_id) REFERENCES `users` (id),
  ADD CONSTRAINT friend_requests_sender_id_e02b64d5_fk_users_id FOREIGN KEY (sender_id) REFERENCES `users` (id);

--
-- Filtros para la tabla learning_evaluacion
--
ALTER TABLE learning_evaluacion
  ADD CONSTRAINT learning_evaluacion_ibfk_1 FOREIGN KEY (tema_id) REFERENCES learning_tema (id) ON DELETE CASCADE;

--
-- Filtros para la tabla learning_logros
--
ALTER TABLE learning_logros
  ADD CONSTRAINT learning_logros_seccion_requerida_id_c895434c_fk_learning_ FOREIGN KEY (seccion_requerida_id) REFERENCES learning_secciones (id);

--
-- Filtros para la tabla learning_progresousuario
--
ALTER TABLE learning_progresousuario
  ADD CONSTRAINT learning_progresousuario_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES `users` (id) ON DELETE CASCADE,
  ADD CONSTRAINT learning_progresousuario_ibfk_2 FOREIGN KEY (tema_id) REFERENCES learning_tema (id) ON DELETE CASCADE;

--
-- Filtros para la tabla learning_progreso_usuario
--
ALTER TABLE learning_progreso_usuario
  ADD CONSTRAINT learning_progreso_usuario_tema_id_3a303025_fk_learning_temas_id FOREIGN KEY (tema_id) REFERENCES learning_temas (id),
  ADD CONSTRAINT learning_progreso_usuario_usuario_id_411dd269_fk_users_id FOREIGN KEY (usuario_id) REFERENCES `users` (id);

--
-- Filtros para la tabla learning_tema
--
ALTER TABLE learning_tema
  ADD CONSTRAINT learning_tema_ibfk_1 FOREIGN KEY (seccion_id) REFERENCES learning_seccion (id) ON DELETE CASCADE;

--
-- Filtros para la tabla learning_temacontenido
--
ALTER TABLE learning_temacontenido
  ADD CONSTRAINT learning_temacontenido_ibfk_1 FOREIGN KEY (tema_id) REFERENCES learning_tema (id) ON DELETE CASCADE;

--
-- Filtros para la tabla learning_temapuntoclave
--
ALTER TABLE learning_temapuntoclave
  ADD CONSTRAINT learning_temapuntoclave_ibfk_1 FOREIGN KEY (tema_id) REFERENCES learning_tema (id) ON DELETE CASCADE;

--
-- Filtros para la tabla learning_temas
--
ALTER TABLE learning_temas
  ADD CONSTRAINT learning_temas_seccion_id_ea050eeb_fk_learning_secciones_id FOREIGN KEY (seccion_id) REFERENCES learning_secciones (id);

--
-- Filtros para la tabla learning_tema_contenido
--
ALTER TABLE learning_tema_contenido
  ADD CONSTRAINT learning_tema_contenido_tema_id_ee7f1211_fk_learning_temas_id FOREIGN KEY (tema_id) REFERENCES learning_temas (id);

--
-- Filtros para la tabla learning_tema_puntos_clave
--
ALTER TABLE learning_tema_puntos_clave
  ADD CONSTRAINT learning_tema_puntos_clave_tema_id_c3622af5_fk_learning_temas_id FOREIGN KEY (tema_id) REFERENCES learning_temas (id);

--
-- Filtros para la tabla learning_usuariologro
--
ALTER TABLE learning_usuariologro
  ADD CONSTRAINT learning_usuariologro_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES `users` (id) ON DELETE CASCADE,
  ADD CONSTRAINT learning_usuariologro_ibfk_2 FOREIGN KEY (logro_id) REFERENCES learning_logro (id) ON DELETE CASCADE;

--
-- Filtros para la tabla learning_usuario_logros
--
ALTER TABLE learning_usuario_logros
  ADD CONSTRAINT learning_usuario_logros_logro_id_5e49ea8f_fk_learning_logros_id FOREIGN KEY (logro_id) REFERENCES learning_logros (id),
  ADD CONSTRAINT learning_usuario_logros_usuario_id_f1c4b513_fk_users_id FOREIGN KEY (usuario_id) REFERENCES `users` (id);

--
-- Filtros para la tabla media_storage_mediaalbum
--
ALTER TABLE media_storage_mediaalbum
  ADD CONSTRAINT media_storage_mediaalbum_owner_id_72fc69a7_fk_users_id FOREIGN KEY (owner_id) REFERENCES `users` (id);

--
-- Filtros para la tabla media_storage_mediaalbum_files
--
ALTER TABLE media_storage_mediaalbum_files
  ADD CONSTRAINT media_storage_mediaa_mediaalbum_id_ef230dba_fk_media_sto FOREIGN KEY (mediaalbum_id) REFERENCES media_storage_mediaalbum (id),
  ADD CONSTRAINT media_storage_mediaa_mediafile_id_4721ea14_fk_media_sto FOREIGN KEY (mediafile_id) REFERENCES media_storage_mediafile (id);

--
-- Filtros para la tabla media_storage_mediafile
--
ALTER TABLE media_storage_mediafile
  ADD CONSTRAINT media_storage_mediafile_uploaded_by_id_e049b458_fk_users_id FOREIGN KEY (uploaded_by_id) REFERENCES `users` (id);

--
-- Filtros para la tabla messages
--
ALTER TABLE messages
  ADD CONSTRAINT messages_chat_room_id_d23e48ac_fk_chat_rooms_id FOREIGN KEY (chat_room_id) REFERENCES chat_rooms (id),
  ADD CONSTRAINT messages_reply_to_id_59eac9e3_fk_messages_id FOREIGN KEY (reply_to_id) REFERENCES messages (id),
  ADD CONSTRAINT messages_sender_id_dc5a0bbd_fk_users_id FOREIGN KEY (sender_id) REFERENCES `users` (id);

--
-- Filtros para la tabla message_reactions
--
ALTER TABLE message_reactions
  ADD CONSTRAINT message_reactions_message_id_7f9c0331_fk_messages_id FOREIGN KEY (message_id) REFERENCES messages (id),
  ADD CONSTRAINT message_reactions_user_id_58a64546_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla message_reads
--
ALTER TABLE message_reads
  ADD CONSTRAINT message_reads_message_id_028abfc8_fk_messages_id FOREIGN KEY (message_id) REFERENCES messages (id),
  ADD CONSTRAINT message_reads_user_id_3ad09fda_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla notifications
--
ALTER TABLE notifications
  ADD CONSTRAINT notifications_recipient_id_e1133bac_fk_users_id FOREIGN KEY (recipient_id) REFERENCES `users` (id),
  ADD CONSTRAINT notifications_sender_id_57e62d28_fk_users_id FOREIGN KEY (sender_id) REFERENCES `users` (id);

--
-- Filtros para la tabla posts
--
ALTER TABLE posts
  ADD CONSTRAINT posts_user_id_4291758d_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla post_bookmarks
--
ALTER TABLE post_bookmarks
  ADD CONSTRAINT post_bookmarks_post_id_ebbc9298_fk_posts_id FOREIGN KEY (post_id) REFERENCES posts (id),
  ADD CONSTRAINT post_bookmarks_user_id_c31fa900_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla post_reactions
--
ALTER TABLE post_reactions
  ADD CONSTRAINT post_reactions_post_id_31c1e1da_fk_posts_id FOREIGN KEY (post_id) REFERENCES posts (id),
  ADD CONSTRAINT post_reactions_user_id_a5d827c4_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla post_reports
--
ALTER TABLE post_reports
  ADD CONSTRAINT post_reports_post_id_4011e572_fk_posts_id FOREIGN KEY (post_id) REFERENCES posts (id),
  ADD CONSTRAINT post_reports_reporter_id_35f51914_fk_users_id FOREIGN KEY (reporter_id) REFERENCES `users` (id),
  ADD CONSTRAINT post_reports_reviewed_by_id_6dfbb48a_fk_users_id FOREIGN KEY (reviewed_by_id) REFERENCES `users` (id);

--
-- Filtros para la tabla post_shares
--
ALTER TABLE post_shares
  ADD CONSTRAINT post_shares_post_id_9fb2561f_fk_posts_id FOREIGN KEY (post_id) REFERENCES posts (id),
  ADD CONSTRAINT post_shares_user_id_cab9d5be_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla post_views
--
ALTER TABLE post_views
  ADD CONSTRAINT post_views_post_id_00b5c446_fk_posts_id FOREIGN KEY (post_id) REFERENCES posts (id),
  ADD CONSTRAINT post_views_user_id_d468eac9_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla reels_reel
--
ALTER TABLE reels_reel
  ADD CONSTRAINT reels_reel_author_id_6fd60eb5_fk_users_id FOREIGN KEY (author_id) REFERENCES `users` (id);

--
-- Filtros para la tabla reels_reelcomment
--
ALTER TABLE reels_reelcomment
  ADD CONSTRAINT reels_reelcomment_author_id_7970e133_fk_users_id FOREIGN KEY (author_id) REFERENCES `users` (id),
  ADD CONSTRAINT reels_reelcomment_parent_id_b23a54b6_fk_reels_reelcomment_id FOREIGN KEY (parent_id) REFERENCES reels_reelcomment (id),
  ADD CONSTRAINT reels_reelcomment_reel_id_5c2ee5ca_fk_reels_reel_id FOREIGN KEY (reel_id) REFERENCES reels_reel (id);

--
-- Filtros para la tabla reels_reelcomment_likes
--
ALTER TABLE reels_reelcomment_likes
  ADD CONSTRAINT reels_reelcomment_li_reelcomment_id_4c7beadb_fk_reels_ree FOREIGN KEY (reelcomment_id) REFERENCES reels_reelcomment (id),
  ADD CONSTRAINT reels_reelcomment_likes_user_id_d6a85d7e_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla reels_reel_likes
--
ALTER TABLE reels_reel_likes
  ADD CONSTRAINT reels_reel_likes_reel_id_a3d63489_fk_reels_reel_id FOREIGN KEY (reel_id) REFERENCES reels_reel (id),
  ADD CONSTRAINT reels_reel_likes_user_id_5a6adcad_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla stories
--
ALTER TABLE stories
  ADD CONSTRAINT stories_user_id_9073c7a2_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla story_reactions
--
ALTER TABLE story_reactions
  ADD CONSTRAINT story_reactions_story_id_a4241753_fk_stories_id FOREIGN KEY (story_id) REFERENCES stories (id),
  ADD CONSTRAINT story_reactions_user_id_2dff8abd_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla story_replies
--
ALTER TABLE story_replies
  ADD CONSTRAINT story_replies_story_id_379a727e_fk_stories_id FOREIGN KEY (story_id) REFERENCES stories (id),
  ADD CONSTRAINT story_replies_user_id_4e96c5d7_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla story_views
--
ALTER TABLE story_views
  ADD CONSTRAINT story_views_story_id_7b7003ab_fk_stories_id FOREIGN KEY (story_id) REFERENCES stories (id),
  ADD CONSTRAINT story_views_user_id_0f152653_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla transactions
--
ALTER TABLE transactions
  ADD CONSTRAINT transactions_enterprise_id_456d86a6_fk_enterprises_id FOREIGN KEY (enterprise_id) REFERENCES enterprises (id),
  ADD CONSTRAINT transactions_payment_account_id_294a3399_fk_payment_accounts_id FOREIGN KEY (payment_account_id) REFERENCES payment_accounts (id),
  ADD CONSTRAINT transactions_pricing_plan_id_937776da_fk_pricing_plans_id FOREIGN KEY (pricing_plan_id) REFERENCES pricing_plans (id),
  ADD CONSTRAINT transactions_user_id_766cc893_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id),
  ADD CONSTRAINT transactions_verified_by_id_2c2b302a_fk_users_id FOREIGN KEY (verified_by_id) REFERENCES `users` (id);

--
-- Filtros para la tabla users_groups
--
ALTER TABLE users_groups
  ADD CONSTRAINT users_groups_group_id_2f3517aa_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES auth_group (id),
  ADD CONSTRAINT users_groups_user_id_f500bee5_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla users_user_permissions
--
ALTER TABLE users_user_permissions
  ADD CONSTRAINT users_user_permissio_permission_id_6d08dcd2_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES auth_permission (id),
  ADD CONSTRAINT users_user_permissions_user_id_92473840_fk_users_id FOREIGN KEY (user_id) REFERENCES `users` (id);

--
-- Filtros para la tabla user_follows
--
ALTER TABLE user_follows
  ADD CONSTRAINT user_follows_follower_id_02b002df_fk_users_id FOREIGN KEY (follower_id) REFERENCES `users` (id),
  ADD CONSTRAINT user_follows_following_id_7f71c40b_fk_users_id FOREIGN KEY (following_id) REFERENCES `users` (id);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
