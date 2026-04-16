-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 14, 2026 at 05:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vocaseek`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_kategori` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `nama_kategori`, `icon`, `created_at`, `updated_at`) VALUES
(1, 'Graphics & Design', 'bi-palette', '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(2, 'Code & Programing', 'bi-code-slash', '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(3, 'Digital Marketing', 'bi-megaphone', '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(4, 'Video & Animation', 'bi-play-btn', '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(5, 'Music & Audio', 'bi-music-note-beamed', '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(6, 'Account & Finance', 'bi-bank', '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(7, 'Health & Care', 'bi-heart-pulse', '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(8, 'Data & Science', 'bi-graph-up', '2026-03-13 00:38:58', '2026-03-13 00:38:58');

-- --------------------------------------------------------

--
-- Table structure for table `company_profile`
--

CREATE TABLE `company_profile` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `nama_perusahaan` varchar(255) NOT NULL,
  `industri` varchar(100) DEFAULT NULL,
  `ukuran_perusahaan` varchar(50) DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `notelp` varchar(255) DEFAULT NULL,
  `alamat_kantor_pusat` text DEFAULT NULL,
  `nib` varchar(255) DEFAULT NULL,
  `loa_pdf` varchar(255) DEFAULT NULL,
  `akta_pdf` varchar(255) DEFAULT NULL,
  `logo_perusahaan` varchar(255) DEFAULT NULL,
  `banner_perusahaan` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT NULL,
  `twitter_url` varchar(255) DEFAULT NULL,
  `status_mitra` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `company_profile`
--

INSERT INTO `company_profile` (`id`, `user_id`, `nama_perusahaan`, `industri`, `ukuran_perusahaan`, `website_url`, `deskripsi`, `notelp`, `alamat_kantor_pusat`, `nib`, `loa_pdf`, `akta_pdf`, `logo_perusahaan`, `banner_perusahaan`, `linkedin_url`, `instagram_url`, `twitter_url`, `status_mitra`, `created_at`, `updated_at`) VALUES
(1, 2, 'Bank Mandiri', NULL, NULL, NULL, NULL, '021-123456', NULL, '1234567890123', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(2, 8, 'pt cinta sejati', 'it', '200m', 'https://technova.id', 'hok', '021123456', NULL, '1234567890123', 'company/documents/nYv4daVZyhoDxrH5PivfNBhN4Ohq4YLL2ryoEbz6.pdf', 'company/documents/QT4pASaThkfoZtczQO4cOOuPNySyK9s6odTjMrDy.pdf', 'company/logos/b3L6sjcCjTVxGZQxkwOjaV2owqQhrrXPp9Qxmj6v.png', 'company/banners/Bzmg5RL4EBjfmuftmQ47lFFPtqzCk0JA82o4xz3N.png', 'https://technova.id', NULL, NULL, 'active', '2026-04-07 02:10:51', '2026-04-07 21:33:47'),
(3, 10, 'pt muda mudi', NULL, NULL, NULL, NULL, '021123456', NULL, '1234567890123', 'company/documents/Rh0GFzYPyYtfMtqe30bdmVnjqSYl1y43wCkX90dW.pdf', 'company/documents/mABmfDXYx2u5ZAJCwDJctwNOHiVOH29KJD7ZAa3d.pdf', NULL, NULL, NULL, NULL, NULL, 'active', '2026-04-08 00:35:17', '2026-04-08 01:05:50'),
(4, 18, 'PT.MUNIR JAYA', NULL, NULL, NULL, NULL, '085788972225', NULL, '444555666777', 'company/documents/jxr3ZnkDDrDoAWnJydZIMKsHb37f2d7XHx7dt5eT.pdf', 'company/documents/m00PbE2YYEQNZiTtGdFMnPJcqdD9b58RM8IlcDh4.pdf', NULL, NULL, NULL, NULL, NULL, 'pending', '2026-04-09 01:47:09', '2026-04-09 01:47:09');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `intern_certifications`
--

CREATE TABLE `intern_certifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `intern_experiences`
--

CREATE TABLE `intern_experiences` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `period` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `intern_profiles`
--

CREATE TABLE `intern_profiles` (
  `intern_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `tentang_saya` text DEFAULT NULL,
  `tempat_lahir` varchar(255) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` varchar(255) DEFAULT NULL,
  `notelp` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `provinsi` varchar(255) DEFAULT NULL,
  `kabupaten` varchar(255) DEFAULT NULL,
  `detail_alamat` text DEFAULT NULL,
  `universitas` varchar(255) DEFAULT NULL,
  `jurusan` varchar(255) DEFAULT NULL,
  `cv_pdf` varchar(255) DEFAULT NULL,
  `portofolio_pdf` varchar(255) DEFAULT NULL,
  `skor_pretest` int(11) NOT NULL DEFAULT 0,
  `test_started_at` timestamp NULL DEFAULT NULL,
  `test_finished_at` timestamp NULL DEFAULT NULL,
  `is_profile_complete` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `intern_profiles`
--

INSERT INTO `intern_profiles` (`intern_id`, `user_id`, `foto`, `tentang_saya`, `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `notelp`, `instagram`, `linkedin`, `provinsi`, `kabupaten`, `detail_alamat`, `universitas`, `jurusan`, `cv_pdf`, `portofolio_pdf`, `skor_pretest`, `test_started_at`, `test_finished_at`, `is_profile_complete`, `created_at`, `updated_at`) VALUES
(1, 3, NULL, 'Saya adalah talenta muda yang berdedikasi tinggi.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'UPN Veteran Jawa Timur', 'Informatika', NULL, NULL, 85, NULL, NULL, 0, '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(2, 4, NULL, 'Saya adalah talenta muda yang berdedikasi tinggi.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'UPN Veteran Jawa Timur', 'Informatika', NULL, NULL, 85, NULL, NULL, 0, '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(3, 5, NULL, 'Saya adalah talenta muda yang berdedikasi tinggi.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'UPN Veteran Jawa Timur', 'Informatika', NULL, NULL, 85, NULL, NULL, 0, '2026-03-13 00:38:59', '2026-03-13 00:38:59'),
(4, 6, NULL, 'Saya adalah talenta muda yang berdedikasi tinggi.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'UPN Veteran Jawa Timur', 'Informatika', NULL, NULL, 85, NULL, NULL, 0, '2026-03-13 00:38:59', '2026-03-13 00:38:59'),
(5, 7, 'profiles/photos/YrY9jMPHvcrTPfBgqnTzEBheD6b9kWRdcSimeqU1.png', 'saya suka membantu orang tua', 'tubannan', '2000-05-17', 'laki-laki', NULL, NULL, NULL, 'bali', 'badung', 'depan masjid', 'upn', 'kedokteran', 'profiles/documents/Z3vq54rbuNJrBZ5Gtffeqmf6EyZRJBB41JuNQb5i.pdf', 'profiles/documents/6u8oaGCK3Iy4Dj3vx7tGz61u6V2Ut24ymuEgUtcl.pdf', 0, '2026-04-07 00:38:11', '2026-04-07 00:43:46', 1, '2026-04-06 21:54:01', '2026-04-07 00:43:46'),
(6, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, '2026-04-08 20:37:00', '2026-04-08 20:37:00'),
(7, 13, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, '2026-04-08 20:39:21', '2026-04-08 20:39:21'),
(8, 14, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, '2026-04-08 20:41:28', '2026-04-08 20:41:28'),
(9, 15, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, '2026-04-09 01:04:02', '2026-04-09 01:04:02'),
(10, 16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, '2026-04-09 01:05:59', '2026-04-09 01:05:59'),
(11, 17, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, '2026-04-09 01:26:02', '2026-04-09 01:26:02'),
(12, 19, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, '2026-04-09 17:38:55', '2026-04-09 17:38:55');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_applications`
--

CREATE TABLE `job_applications` (
  `application_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `job_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('PENDING','REVIEW','INTERVIEW','SHORTLISTED','ACCEPTED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_applications`
--

INSERT INTO `job_applications` (`application_id`, `user_id`, `job_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 'PENDING', '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(2, 4, 2, 'SHORTLISTED', '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(3, 5, 1, 'REJECTED', '2026-03-13 00:38:59', '2026-03-13 00:38:59'),
(4, 6, 2, 'PENDING', '2026-03-13 00:38:59', '2026-03-13 00:38:59'),
(5, 7, 1, 'PENDING', '2026-04-07 01:08:01', '2026-04-07 01:08:01'),
(6, 7, 5, 'INTERVIEW', '2026-04-07 20:30:46', '2026-04-07 20:50:47');

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_listings`
--

CREATE TABLE `job_listings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `judul_pekerjaan` varchar(255) NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `perusahaan` varchar(255) NOT NULL,
  `tipe` enum('Full Time','Internship','Freelance','Contract Base') NOT NULL,
  `gaji` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_listings`
--

INSERT INTO `job_listings` (`id`, `user_id`, `category_id`, `judul_pekerjaan`, `lokasi`, `perusahaan`, `tipe`, `gaji`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'Software Engineer', 'Jakarta, Indonesia', 'Apple Inc', 'Full Time', 'Rp 15.000.000', '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(2, 1, 1, 'Senior UI/UX Designer', 'Surabaya, Indonesia', 'Upwork', 'Contract Base', 'Rp 10.000.000', '2026-03-13 00:38:58', '2026-03-13 00:38:58');

-- --------------------------------------------------------

--
-- Table structure for table `lowongan`
--

CREATE TABLE `lowongan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_profile_id` bigint(20) UNSIGNED NOT NULL,
  `judul_posisi` varchar(255) NOT NULL,
  `deskripsi_pekerjaan` text NOT NULL,
  `persyaratan` text NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `tipe_magang` varchar(255) NOT NULL,
  `gaji_per_bulan` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','CLOSED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lowongan`
--

INSERT INTO `lowongan` (`id`, `company_profile_id`, `judul_posisi`, `deskripsi_pekerjaan`, `persyaratan`, `lokasi`, `tipe_magang`, `gaji_per_bulan`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Senior UI/UX Designer', 'Mendesain antarmuka aplikasi perbankan masa depan.', 'Figma, Adobe XD, Understanding of Design System.', 'Jakarta (WFO)', 'Full-time', NULL, 'ACTIVE', '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(2, 1, 'Frontend Engineer', 'Slicing design Figma ke React.js.', 'React.js, Tailwind, Axios.', 'Remote', 'Remote', NULL, 'ACTIVE', '2026-03-13 00:38:58', '2026-03-13 00:38:58'),
(4, 1, 'Backend Developer Intern', 'Membantu develop API Laravel', 'Paham PHP & MySQL', 'Surabaya', 'Remote', '2000000', 'ACTIVE', '2026-04-07 08:03:29', NULL),
(5, 2, 'Backend Developer Laravel', 'Membantu mengembangkan API untuk platform Vocaseek.', 'Paham PHP, Laravel, dan MySQL tingkat dewa.', 'Surabaya / Remote', 'Hybrid', '2.500.000', 'ACTIVE', '2026-04-07 19:38:38', '2026-04-07 19:38:38'),
(6, 3, 'Backend Developer Laravel', 'Membangun API untuk platform Vocaseek.', 'Mahasiswa IT, Paham PHP & MySQL.', 'Surabaya / Remote', 'remote', 'Rp 1.000.000 - 2.000.000', 'ACTIVE', '2026-04-08 01:38:59', '2026-04-08 01:38:59');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_02_24_070508_create_intern_profiles_table', 1),
(5, '2026_02_27_023939_create_company_profiles_table', 1),
(6, '2026_02_27_031624_create_categories_table', 1),
(7, '2026_02_27_031643_create_testimonials_table', 1),
(8, '2026_03_03_035745_create_personal_access_tokens_table', 1),
(9, '2026_03_08_063051_create_lowongan_table', 1),
(10, '2026_03_09_032331_create_job_applications_table', 1),
(11, '2026_03_10_043441_create_test_answers_table', 1),
(12, '2026_03_10_044554_create_intern_experiences_table', 1),
(13, '2026_03_10_064515_create_intern_certifications_table', 1),
(14, '2026_04_09_033558_add_google_id_to_users_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('ardi4nsyah06@gmail.com', 'db59ad291179dfcc73e26cf9af4d7cc3e59fed0dfffa43fefd981e62430032ec', '2026-04-09 01:08:12');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 2, 'auth_token', '6916859f13c130be3eb369dc8cd8cdbfb0f76dcfac5eb1a4b2b197db43f4de6a', '[\"*\"]', NULL, NULL, '2026-03-24 20:45:54', '2026-03-24 20:45:54'),
(2, 'App\\Models\\User', 7, 'auth_token', 'a7a57d24891f7a97005a7314a615f100276744ee1038c9f90d163f5f27cd3efa', '[\"*\"]', NULL, NULL, '2026-04-06 21:54:01', '2026-04-06 21:54:01'),
(4, 'App\\Models\\User', 7, 'auth_token', 'a0e564c75a5d76d1f98e78361d5066419aeadc7de9c6d31be6a99c61d871ef0c', '[\"*\"]', '2026-04-07 20:30:45', NULL, '2026-04-06 23:52:17', '2026-04-07 20:30:45'),
(5, 'App\\Models\\User', 8, 'auth_token', 'c924ec891e607028b3794dbfe94420228d0a4f5d2f3ed9251085bb9bf5c4a044', '[\"*\"]', '2026-04-07 21:33:46', NULL, '2026-04-07 02:10:51', '2026-04-07 21:33:46'),
(6, 'App\\Models\\User', 7, 'auth_token', '1edf02d75b38b9da8130ca5f9d26f42e3e53762a3b6356467923bdffb3421ce4', '[\"*\"]', NULL, NULL, '2026-04-08 00:20:22', '2026-04-08 00:20:22'),
(8, 'App\\Models\\User', 10, 'auth_token', '037540cead04c9fc18a13f3227e615ee4fdba885a1b4ce822589b1c340c0ab99', '[\"*\"]', NULL, NULL, '2026-04-08 00:35:17', '2026-04-08 00:35:17'),
(9, 'App\\Models\\User', 10, 'auth_token', '7b794050cb90824e4b5b0afe32fcdc5ca35cc3f3e9446b82fd73f15b8e988986', '[\"*\"]', '2026-04-08 01:38:59', NULL, '2026-04-08 01:17:25', '2026-04-08 01:38:59'),
(11, 'App\\Models\\User', 12, 'auth_token', '3e2e8cfbf86931c377461f3ac4f9c4c45f617f88b2d7b68cecbc536ca9560692', '[\"*\"]', NULL, NULL, '2026-04-08 20:37:00', '2026-04-08 20:37:00'),
(12, 'App\\Models\\User', 12, 'auth_token', '7f85bbcbdec4074dfbd6a1245638aeefeda6050a48cf36e2311ea374d23d310d', '[\"*\"]', NULL, NULL, '2026-04-08 20:37:22', '2026-04-08 20:37:22'),
(13, 'App\\Models\\User', 13, 'auth_token', '1c953657b6a714f70d31020568495793522a1502bd44c0f071de508e3d2be591', '[\"*\"]', NULL, NULL, '2026-04-08 20:39:21', '2026-04-08 20:39:21'),
(14, 'App\\Models\\User', 14, 'auth_token', '1d902056ed90d0b848847255e86c3358213d84dad0890279c6c4e0fa40417247', '[\"*\"]', NULL, NULL, '2026-04-08 20:41:28', '2026-04-08 20:41:28'),
(15, 'App\\Models\\User', 14, 'auth_token', '0446e6a236de71372f354dd9bdfd73b580fa5e0752ea1ccef72d29d8c9197a59', '[\"*\"]', NULL, NULL, '2026-04-08 20:42:19', '2026-04-08 20:42:19'),
(16, 'App\\Models\\User', 12, 'auth_token', 'bc1bcbe3305174e9ebcc187472ab1046495e5909962033933110ec393538362d', '[\"*\"]', NULL, NULL, '2026-04-08 20:43:07', '2026-04-08 20:43:07'),
(17, 'App\\Models\\User', 15, 'auth_token', '93a62ba21dfb0a8682aecfba1e17893c942c29d3267cede1b714bfbb268dd100', '[\"*\"]', NULL, NULL, '2026-04-09 01:04:02', '2026-04-09 01:04:02'),
(19, 'App\\Models\\User', 16, 'auth_token', '6ed10ca87abe77feb735fbd7bf80aad32dcb61d2fcd79ab6ecfea94b16847fd4', '[\"*\"]', NULL, NULL, '2026-04-09 01:05:59', '2026-04-09 01:05:59'),
(22, 'App\\Models\\User', 18, 'auth_token', 'bcf14851f7ac4285339d5fd50fd795e1d6e59a323425831e377778e8793f184b', '[\"*\"]', NULL, NULL, '2026-04-09 01:47:09', '2026-04-09 01:47:09'),
(37, 'App\\Models\\User', 1, 'auth_token', 'eaf7a32881be61e73ddc4dd5dcb05acb12752c47e7d1c8e277feba96f163adff', '[\"*\"]', '2026-04-11 08:05:16', NULL, '2026-04-11 08:05:13', '2026-04-11 08:05:16'),
(38, 'App\\Models\\User', 1, 'auth_token', '9dd0ba65cdcbe164927c9f3920873d70968962f1964b411f78e4c8e83ef9257d', '[\"*\"]', '2026-04-11 08:18:39', NULL, '2026-04-11 08:13:50', '2026-04-11 08:18:39'),
(39, 'App\\Models\\User', 11, 'auth_token', 'ea118566b0cd20f04ffa3f0ceb8e4728bc5be7ae1e2f0cee9a155eba659003df', '[\"*\"]', '2026-04-11 08:20:56', NULL, '2026-04-11 08:20:55', '2026-04-11 08:20:56'),
(40, 'App\\Models\\User', 19, 'auth_token', '59cf5fad41ec26b713660c0bc36231477872a7c99b1c9dfb73099ee82c018b2a', '[\"*\"]', '2026-04-11 08:24:00', NULL, '2026-04-11 08:24:00', '2026-04-11 08:24:00'),
(41, 'App\\Models\\User', 1, 'auth_token', '8e8614576f2aae5aba746255b718ae4454f77c02f471f73acab0e6eeabda52d6', '[\"*\"]', '2026-04-11 11:28:18', NULL, '2026-04-11 08:25:09', '2026-04-11 11:28:18'),
(42, 'App\\Models\\User', 1, 'auth_token', '2bbb8fe8b4999b8e04b97712b51540006d9d533b9fb626bbc0ea530a8fa5cefd', '[\"*\"]', '2026-04-11 15:42:37', NULL, '2026-04-11 15:06:07', '2026-04-11 15:42:37'),
(43, 'App\\Models\\User', 19, 'auth_token', '6e80523d93239d36d012440583ff0e9abd7e6bc551cb418dbb281dd2a2578a7a', '[\"*\"]', '2026-04-11 15:43:56', NULL, '2026-04-11 15:43:56', '2026-04-11 15:43:56'),
(44, 'App\\Models\\User', 1, 'auth_token', '852f8c807bbd97b1bbdeff2ffd511916cb3bacdb3d2b1dde75f5f184a2ee5691', '[\"*\"]', '2026-04-11 16:37:20', NULL, '2026-04-11 15:46:40', '2026-04-11 16:37:20'),
(45, 'App\\Models\\User', 1, 'auth_token', '6fc89a9890e53d2d316fbf26afc61abe16caf9c827a9bde575d381c3138ccff2', '[\"*\"]', '2026-04-11 18:55:02', NULL, '2026-04-11 16:40:13', '2026-04-11 18:55:02'),
(46, 'App\\Models\\User', 11, 'auth_token', '168a6e128ee9e3efca5f370c244cfb9eb8209db1a7e51658294856cb0c62ea5d', '[\"*\"]', '2026-04-11 18:55:30', NULL, '2026-04-11 18:55:30', '2026-04-11 18:55:30'),
(47, 'App\\Models\\User', 1, 'auth_token', '80f0352e3ac9eea69a1b79a89b46ce1eadf1285994b6dd28ebef79532e636850', '[\"*\"]', '2026-04-11 19:42:21', NULL, '2026-04-11 19:03:04', '2026-04-11 19:42:21'),
(48, 'App\\Models\\User', 11, 'auth_token', '905616c663a5597bf34ee3a7d8b1364909201569438c5b3ad6c96dc12fbab8ff', '[\"*\"]', '2026-04-11 20:55:13', NULL, '2026-04-11 19:43:04', '2026-04-11 20:55:13'),
(49, 'App\\Models\\User', 1, 'auth_token', '84b77b9730d65f98dd306879e55cec083919bc4d4c8eea0f9c176fa4ef6292ef', '[\"*\"]', '2026-04-13 19:23:59', NULL, '2026-04-11 19:45:12', '2026-04-13 19:23:59'),
(50, 'App\\Models\\User', 1, 'auth_token', 'a122df5d228d4cf2040bbfdc547f9c805b5177db207ad3d96ca08c9c0d3019ce', '[\"*\"]', '2026-04-11 23:13:31', NULL, '2026-04-11 20:55:30', '2026-04-11 23:13:31'),
(51, 'App\\Models\\User', 1, 'auth_token', 'aade182f6248aa8f1521959062bdb39572eadd119c841826282b693638293540', '[\"*\"]', '2026-04-12 00:39:26', NULL, '2026-04-12 00:36:46', '2026-04-12 00:39:26'),
(52, 'App\\Models\\User', 19, 'auth_token', '40bf75622759281d54b7a6611c72586785f53e4529c4bc20eb31345dd47aebd3', '[\"*\"]', '2026-04-12 00:41:11', NULL, '2026-04-12 00:41:10', '2026-04-12 00:41:11'),
(53, 'App\\Models\\User', 1, 'auth_token', '09cf0cc8dc81ee987635a1f204ecf06e1f0bfefac3aae21a530f7e66207d873f', '[\"*\"]', '2026-04-12 20:07:10', NULL, '2026-04-12 01:00:53', '2026-04-12 20:07:10'),
(54, 'App\\Models\\User', 1, 'auth_token', '9fcbfb246cf9e3de7eb6598779410a07bd9b5ca35ab97f10bec15c0a91769d6e', '[\"*\"]', '2026-04-12 23:45:19', NULL, '2026-04-12 23:45:18', '2026-04-12 23:45:19'),
(55, 'App\\Models\\User', 11, 'auth_token', '8be144e125a66a2bd68db5a08d86c385256e675718a8273371d58f8550c5e9bf', '[\"*\"]', '2026-04-12 23:50:53', NULL, '2026-04-12 23:50:53', '2026-04-12 23:50:53'),
(56, 'App\\Models\\User', 1, 'auth_token', '2390beabb04eddbbb5bb9704ec47014f64d72e78f0cf7fdbe60f29f40e01478c', '[\"*\"]', '2026-04-13 00:02:47', NULL, '2026-04-12 23:52:28', '2026-04-13 00:02:47'),
(57, 'App\\Models\\User', 11, 'auth_token', '7fa6eab39518148f95fe74e3e3f83e52da3dd4310b779b13dd887f0f9b87d2d5', '[\"*\"]', '2026-04-13 00:03:37', NULL, '2026-04-13 00:03:37', '2026-04-13 00:03:37'),
(58, 'App\\Models\\User', 1, 'auth_token', 'c3688a31787854baaee69366c028efaeb399c94f81a0f39826ad094f900c06aa', '[\"*\"]', '2026-04-13 00:05:10', NULL, '2026-04-13 00:05:09', '2026-04-13 00:05:10'),
(59, 'App\\Models\\User', 11, 'auth_token', 'eae81c05843c954dd00d7e75121c26c6f61b61cdd6569e90688125710f120e14', '[\"*\"]', '2026-04-13 00:05:37', NULL, '2026-04-13 00:05:37', '2026-04-13 00:05:37'),
(60, 'App\\Models\\User', 1, 'auth_token', '6e999059988487021c350a93bf7b401bcd519ed99953d9ee81ddce0df6111260', '[\"*\"]', '2026-04-13 00:06:32', NULL, '2026-04-13 00:06:31', '2026-04-13 00:06:32'),
(61, 'App\\Models\\User', 1, 'auth_token', 'ae1efcc43d219376fe457d2ae6d8d4efa8c42273ca1b302230f89dcfaa42bdc8', '[\"*\"]', '2026-04-13 00:08:27', NULL, '2026-04-13 00:08:27', '2026-04-13 00:08:27'),
(62, 'App\\Models\\User', 1, 'auth_token', '2afef7758a5a2207ddaacdbe3849a26617a7b860a98ccfa73c4872ed0b7fe9d7', '[\"*\"]', '2026-04-13 15:56:14', NULL, '2026-04-13 02:05:47', '2026-04-13 15:56:14'),
(63, 'App\\Models\\User', 19, 'auth_token', '1dfffe1966edc0322f5a826622b36d9a1051dd216ed672f27f29a95f72db8ef1', '[\"*\"]', '2026-04-13 19:12:00', NULL, '2026-04-13 15:55:34', '2026-04-13 19:12:00'),
(64, 'App\\Models\\User', 19, 'auth_token', '89ccfc00ddbe4b248e566c069ac57749d458634cedb8fc7729a6f47b9a51db68', '[\"*\"]', '2026-04-13 16:28:07', NULL, '2026-04-13 16:28:07', '2026-04-13 16:28:07'),
(65, 'App\\Models\\User', 1, 'auth_token', 'b1d0d9e63771ece7eac79080e3937f9e2a14e28a5017d6d3f32d07dfd1469df0', '[\"*\"]', '2026-04-13 19:12:00', NULL, '2026-04-13 16:32:32', '2026-04-13 19:12:00'),
(66, 'App\\Models\\User', 1, 'auth_token', 'c2bc4ef48fac5a3d171e06feccfa959ffb30894674e6e17563f157d105d124e0', '[\"*\"]', '2026-04-13 20:34:26', NULL, '2026-04-13 20:33:54', '2026-04-13 20:34:26');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('2rATRkb93qdmo8ISnKaaeiizRVw6NrUy1UKvA1ja', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYmpGZ1lsOHhBY043dUFrQ0lFeU5KSVdBWEMxd1RxQ0tReVllRUtDWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdXNlcnMtbWFuYWdlbWVudCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776123157),
('3gmWE1rK2FZyVDgJ9baqxJeltO7gAzgzgJv25hwq', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicHZhNHZNd3BWZ0dzOFd2Q2s4MzN3U2xGWU1aRk5sZWdKSm1ySUE3eiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776065086),
('3OOqEKuErclutCe9GbuyzZPkNwb9f3i1daPc1T4G', 19, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVlhnUm55UGJNU0ZXbE5aVDR4TFk5RlZsQXhzMjdKem1PTlk1bzNRRCI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTk7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776120934),
('5bCT7ZMC2mZmB9qYQCyiOk3Aa5k1AVfkm1O7J9in', 19, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVFpFcnpiVDU1YXFNU2lLbVg5UnFETHJlS0k0aTBmM2VBbUhBeGlDcCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776132720),
('5edbJZDU3mBv35a93fulv6dKzCVTBWljA1Kb7xxT', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV294aDJTdjZaQWNBT2ZGZ0hxbGg5UE0zRElqNU5PSFhmd0RZSDQ1UCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdXNlcnMtbWFuYWdlbWVudCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776065134),
('5STwBJYbhRLrKdRfuQN284JTizn0OOUho8w2SPHz', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaEdVeFdlOW1Id29FVXF4V1hucUJlelh6dGthOTlubndVeTVxYUl3bSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdmVyaWZpY2F0aW9uIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776065133),
('6AwyTOtIxweqrGGGAtymP60cEJhJ6AzKUz0GY8Ae', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUWJDOEcwcHd3U2Z2QUVmTlRXV2IwdFBucFduR0lZR3pER1Q0MlpvMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776065124),
('6MCC6Nz3LNxjt2jM7vWAraQiwoJ3TIjOGKiXS5Un', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiTXlHc3h0Uk9hZUJJRVRhc20wRWMwY2tzeHFFbVl1VGs5S0ROZkk1TyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776064759),
('7LuUM81xil1vuHacnA2tknwcoYlRKG8eRwOZ2EYC', 19, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV0tDZ05KdjVMUWlDaWlSVFZMZXJxSDZNMFdvZHZiVWMySkRaREJzZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776122887),
('7nKAdSDqWuOOjye3Xd0FTY1bjGzN2Df0F9OKDqGK', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUmVVSjhvaHJLdjRISTJHdGI1ZnBwOFNHVDBkaEs4ak5ma3g5UFZuRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776133438),
('7taRoZ0m1Lmz4A1zvUUDvlCPCMulsfOUqyNynmCb', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOUNIUEk2amJvcDNFWDVNbll3a3FlOG1IcjBZSFpwaFhNcUM0aFlHVSI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776071147),
('9ukeEk1BNksJbsIjZ6n3q5ZB1AFDEJpJaH0IM4Kx', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWk5wYXRUTnZCVnIxOWl4YjVMQXBIRGs5TnYyMjRwNHdNODNhY3QyciI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776065618),
('AMyM2CVTreoKfFxsDjKne8JRmOh5rEbMSAAbLXvD', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYnVJZ1lwamxsS0JpV2RpemEwQ0RNalc4Q1ZiRkxCUHhFNjR1a0c0OCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776120974),
('BKOezpIskf8R9YjFkeH9kHGNHNs9TOmUesDa7H79', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZUlzdkFReFRwR01XVUpCWm1GQ2JXWW1aaEZWYWFnb1FucUZONGlYWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776065137),
('BKPfE7e94nSttFfnL5TdgxRWssgGJr5yTDb3OMhV', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiazZ0a1NFWDFQWks4djh5aHdLSE5mN0JuNTZUcmxuVEN5Qkt4NmZwTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdXNlcnMtbWFuYWdlbWVudCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776065126),
('ccLSIG2zQwYAx4vLVCxttaAT4FSa0LuaMNt4XOaR', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUDR5VUxONW1RNHR0WVI4a1FxWmJpUHdRWEd2NlZnNHEzTHBmWURjdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776064107),
('CtPaXS4H7TBmKRRAhx3wpqL4i61nwodDTPD8qSnn', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRk9IMFk2ZTlUSGpxU28ySk0wYWt3bDZvVERCcHBkZVpTS2xwMkxGeSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776123156),
('dA9hipMnHtIJUgpPjASMtVNrCSOH2unsPyjAKzn8', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNWUwSkRWQUxsMU9sM0xzME1CcXZCNEZTYnNOMVM5Uk01QzhqMzJ5NCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdmVyaWZpY2F0aW9uIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776065137),
('dE8EzSUqyRuZcF6K6VDTYchi2lAvP17MGp4zhMQa', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVHVIangxMWI0V1VzUHMydms4T0RmcTBFMmFXWXR5NEQydXBLM2dPcyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdmVyaWZpY2F0aW9uIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776065133),
('dglw8x53xCC0TRuqBXPHRlOCae8sxc1hc37Ih9xR', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYkRBa3Eyc3FvcVFncGJRN0hSdnJNUW5XbmFDSnhlSWt2eWpuWWkyUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdXNlcnMtbWFuYWdlbWVudCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776123157),
('DQxCDaKoAK3UTp0uKNwv3pR1IhJBVY41ncS6WjP8', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN05GR0cyMkg5QkZ5ODdYMFBOTDlDSHNncDJHbXBrN2RnbnRIeHpzaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776123156),
('eDCcsHm8JeVVyDHDxchAimlDXwkcDRwglZsKTE3V', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicnBKekp1c1ROdmRrekxGQlVYWnRPRVNsTUxmUXBaSDJUa0ZIQURzNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776137666),
('EGM44EgRvHvVPMPIVW9gfcFYisa39SrnXMQzad35', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicXFqaDl2UXF2cE9saU55Q250bTljMGZCTERMR3hZdE1TSlFEMWxDViI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776064087),
('F7l6mFmF6x27PlrHjTwkRoSzXAv6tXROM2QTswxf', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicWVmd215bk9Pbk40ZzFDd2dNMXAxZjNLNDUxeFQzZ1NYWVdUS1RIUyI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776063991),
('GwA17bsmRa96dzLPeLyULHjQIEJDZ0afI8Cz5tR7', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia1NEZEJ0UURhaGlZdDc3ODI5clpPdGMxVlZYSkxLWElqVXppdmljWiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776065134),
('hijmsywVInwmbobIJcebaBKwIFTwzRBHpk5Eq4Cr', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYURKRXpwTnRFTmdsalIxcmFLMGhybUNqSFN2bzB5ZGthQ2t1RUo4aCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdmVyaWZpY2F0aW9uIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776065128),
('IOZAzSEeUxMb4Ueym434GjJUx32YODcXNS0KewMD', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWXZXSTBmeFVCckR3U0ROaEJDYm9Ud3hKd3JHY1ZGUGJDSlI1cTZUTSI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776137634),
('IpES1V8nPpKAiHMipTxayGQxbUAxC287SuqAMTOb', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDFsOHp2bEVQdkJqTWpaUTBFNUw2Q0lidkFIdnlYT2VoRnZQOGk4WiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776065134),
('iX9yrOfEOI0LRkTJ4UiEMcJJoyZHRHHppeoDb0qe', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36 Edg/146.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicEp2VEVENDZvZlFzR2VwVWVhUVZ2SGJJd1R1eFJyRjFMcGtQQWRiSyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776121608),
('jhACjBThlnskb4UtWjCzK8UGTRuTRtcGzOIq68eQ', 19, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUm9mTFI1Z0E5N015T0JtSEc3cE1EVGNVMUY0eWFGMG9pVmljNnFoQSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776120934),
('K0opSsQMk30N5hlaGicG2oofUClWf45VueZ2G6pt', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36 Edg/146.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOUwwWUJzQXhyNkt4eWdCWHRjb3hFMnV5eHNVQ0lWVHY1YVlNN2k4USI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776121606),
('KiFOKDVkqLbwbzYp6Y8cx9eZjZf8Hu6C7XPC0Fa6', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVXA0RnAzUE9nR1dkbzl3YkZBUW5hczIyamhRalEzb1dYZVc3ZEk5bSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776137634),
('kLUAig2sJ0QanZhCDuMmmXUblx3edvLgkdbZM3y8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibzg2Yk1JOENGVDRhSm9tUFBxZXBpazBObGpjTThPTE9iY3RncXRacCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcG9wdWxhci12YWNhbmNpZXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776121773),
('lv5rg3W37wHcHSjtngLrRgSvmgHVd8iPUD5srHZa', 19, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieFNYMWh4Mmd0YmpqQjFIZFpGRDluYnpadHp3dTB4N1dMWm0xTDRBaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776121722),
('lvZi8KgQeEAYnRKE2Jtpzebsr6iSv1aBB1XUzE1T', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU1k0Zk9iUGxVdjNBSnBMU0F0NGN5emtHbEQ3enZmYkhYRTVwSnJBSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdXNlcnMtbWFuYWdlbWVudCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776065126),
('mmsoJM428SRTjMnMV8fPRrlFXdoHdU5tMME2LJO5', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSjc0OFIxUm9BY2kwelBqU1dIVjJXblJVa0VKaTFxbkJCaDFzY0s0dCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776123134),
('ngImxvANgEurYYYO44RutI9K3F1r3boDsxqkiyGo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY2dBM1k4TzFYeDVHWW55MVR2N1NMcUdxbDhzcnZ5MzhqcktobUx4NyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcG9wdWxhci12YWNhbmNpZXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776121773),
('NPRO77wQHHUo1I92oh2YzAzNkdnDYvS53V1Rmgv3', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidFh4eHo1elVnUG5adlZVdk1QN1B4MnJ6bjZMMUI4NzlwS0JNQzdMbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdmVyaWZpY2F0aW9uIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776065085),
('NZwBW1w9br1OacmQrMaSNSDar3gIWidvjA88ySR9', 19, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibldVSGlNdHE3Znc2WnprM282OTlsUDJ5RXdHd2dxelBUYUQyYUNPUiI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTk7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776122887),
('OdgTBKncs2Bh0JprGBMoXAFGmwIkss1oOM8s4Byw', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTkxZOW9TY3pCb0FFM1htMFVDOTJJV2c3cHdzekxyeVZYYjJ6QzhFZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdXNlcnMtbWFuYWdlbWVudCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776065134),
('p3LU1N98ZilReRUmoCRDhWaqZQ72rRZSTf3mRRJe', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibmlscm0wdGdSWnhKQW44NjV6Y3ZuWHhiTXh6YXljTnFEaDRvaXNHWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdmVyaWZpY2F0aW9uIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776123160),
('pQSu5zS6P4Y8TSzSgpRBsewW1l3rF8cRI5AtFIhR', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiajVMbWNOdDFmbUdIcjVRZXd6VEFpNDROTFpabmphSUVoZmJ4MmZjSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776120972),
('q0HMY4LY6xhIPrkIkqFdjW5jVmoiEiPNdJXr1o2M', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieU40cGRvSGlkWlRwcjRzZkZtYk5vOUVObWRoMHBWalgxcXg0SEk0ZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776133439),
('qa9VxzTCGF2x7bzecAh5e3j1WUbx716g1jIeaxxq', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVHQ5RWtDVHlGclVoZTczYk1BaHR0QjNnNVhLR05XdVVBUEFtZWUxdiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776071148),
('QS5G8hwGm7bkbyg1H13hrYuTWFGkDm159GIBYRvM', 19, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibmRFWmZQbVhva1VkQ2IzTFNQRm1MRElIemtvQjJpb2ViUFBsQ0U3YSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776121722),
('QZJ4tQwjGv3ASdHsV6qK90qZsXxq1kZw1yLzknvX', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidjFUaFZlNGljU2pxSFVSSWdJcVJyOVhITGhFM2RPSVh0Z3pVUkxrNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776065086),
('qZvPXaHYC3mP0cw5WK6kKGASNPoHGJlalk4CiUEt', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidmlrRUdwRG16eDdJN05JNHJXR2gyb3RVa0dxUUhaOExSR3pIT2c0bCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776137666),
('RUrD9A1JnPz0bz6f7OR203dA4SMUkqO0YpVb5rvL', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQlBsM1dJVEE2TWdWajhkZ3NCYWZEOTBjU09TMlFCejJjUnFxdGVvUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776123152),
('UgrXBNhzaqGHFeJaqovC1gHEdIeDtVobKHCiQN3z', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUjlNQVZZRlRCWjM0SnJkSnp2UHh2OUREc042VFNySFBsM0JvRDRETCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776133439),
('ujzwoxaUvnfM0zGBUGwNKNdC7y6KhBquOQQ4ROgI', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid2FBUnMxZDVMTlB5T3hGOExTU1BnZTBSUWxDV1BDTzJvOE9McXJVdCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776132720),
('UR6wNfbGd7NOEJEEAK2CAgrwWMQZ7oBctOjWh61A', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR0xmTklzZWRpMnR1MnpDRk5IeEdxaWJucEVLaW42OUlsVVdhc0J4UyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776065124),
('VkGPLNgX24uwtmswl41rHRXNNb8KNPfkg2DeCEtI', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY2U2VTl4VkNrVXRZeTFUa0dGQjNxOXUwQkN2YTNsVHpJcXMycmZlbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776064082),
('w48plLht9DNE4R7bykYt0jhr7ibcdGnNblBv6o06', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZVZuZjFyM2w3MTR0VG5sdTBpMHMyY3VNODU2QTN1M0Y0Q1FIdlY3ZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776063992),
('w6Bq0p3W8UevEZyQL7118IIntE8DLlw5kZI86ueJ', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNDRScXpLajhCaTcxRkVBaDN0aWVRb0I0MkMyVFplcE9Qd1ZXbnFXSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdmVyaWZpY2F0aW9uIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776123160),
('wzNfJlyama6A5LCrxB1GB0oFapRDIOmNShGXPKm9', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQzRxckg5Vk1qUlUxTHpnaXF5Q0VIV3lSTmpIeVBSQjh3WnNCbG5xeCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776117623),
('X38e9QAFapbsvWSwatOjL36hSDgNPieViSrgUkMt', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZHc4SU9VVHRpMmVwZ2NMZG42bWdRbW9TUHgxU2FPclB5TXlNTTFmYSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776117623),
('yITscNxSjSUhcZjt4V22fH8YBmLPm52W1EKfYlUQ', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZWtsaUtBekkwWW5XOVl5cDV5MnNzcUl6QmNJR0NmTEpyNnYycDc4SSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdmVyaWZpY2F0aW9uIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776065137),
('YsotbVqpsoH6IomdXd8yuC48E4ynjZigucs2MMlv', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZTFoUDdtYVRPRXRGdktpdFZXVlh6OVZYWDIzQ3ZHWkphc3N2TEtUbSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vcGFydG5lcnMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776065137),
('yVaPXvfmi2i3NQOCnrPRU1KKHX1hLdB4qybbtdkK', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidHdBWTlEZHhTeThGSG5VWHB3OWlxN0hvVkV6bzROdWI0ZkhCb0t4ciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdmVyaWZpY2F0aW9uIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776065128),
('YWhFK4hiiRGhCLfH4g1cIcidLtbECf4thCFCFM1X', 19, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ0EzS25ZcXVBbTBNSERzbmllT3NuenNKOUhxcUdnQ1JBTUZ3U2FLbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776132720),
('Z2qMz3PqUo9cZA6XlZ3AHy8005S8IBa2WIk8dq3D', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQUc2VTU1dTI5SndwdHlCcDJGaGpRNzY3YlhYZnlkM01LUjk2ak92cSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvbGFuZ3VhZ2UiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1776132720),
('zPbvW2C4BXxEnLedG7GDk3P2eVwflKie4919EOxW', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR1Fma2pKM0xabnpZenF2R1VjejZpTVhpd05tcW5OWHZFUUVRaEFpVCI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776123152),
('zsjRJovPihsoB5GiLCSEyP36mVxozvXO13Sxkdy3', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNVYzbXFmNk9WbFJMQ2hZSDlnbUpEeFNhQmRuczRod0xwdGpVbndUYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vdmVyaWZpY2F0aW9uIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776065085),
('ZVcySHzP0WsjsoVYzOJsms5VRm6V9BQTYcjE82Jr', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZTF6MTRZcFhkN0t2dzY1clRSN0pTTktFeTB1TDZ4cjc1djVMdGZkdCI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1776064107);

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `test_answers`
--

CREATE TABLE `test_answers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `question_text` text NOT NULL,
  `user_answer` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `test_answers`
--

INSERT INTO `test_answers` (`id`, `user_id`, `question_text`, `user_answer`, `created_at`, `updated_at`) VALUES
(1, 7, 'Ketika melihat ada pekerjaan yang belum selesai, saya bersedia membantu meskipun itu bukan tugas utama saya.', 'Iya', '2026-04-07 00:43:46', '2026-04-07 00:43:46'),
(2, 7, 'Soal nomor 2...', 'Tidak', '2026-04-07 00:43:46', '2026-04-07 00:43:46');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `role` enum('intern','company','staff_admin','super_admin') NOT NULL DEFAULT 'intern',
  `status` varchar(20) DEFAULT 'active',
  `notelp` varchar(20) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `nama`, `email`, `password`, `google_id`, `role`, `status`, `notelp`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin Vocaseek', 'admin@vocaseek.com', '$2y$12$3PwDLjxps8JLV/D59qi3veEjRs72bNXUQaDMiymwSgfOmBEgzJlOK', NULL, 'super_admin', 'active', NULL, NULL, NULL, NULL),
(2, 'HRD Bank Mandiri', 'hrd@mandiri.com', '$2y$12$02QK9hWaTRNwwtQNBIXahOtjEbp7petUODu0SdeAWVkyzWg68n.Tu', NULL, 'company', 'active', NULL, NULL, NULL, NULL),
(3, 'Bagus Setiawan', 'bagus.s@gmail.com', '$2y$12$AJ4DCMX1YWjF.jWYwl4cTuBCxcd7yq0soTq88EhAtr3x.6afVC9Ui', NULL, 'intern', 'active', NULL, NULL, NULL, NULL),
(4, 'Rizky Pratama', 'rizky.dev@yahoo.com', '$2y$12$emP5pcW07pIyGln31kOazOq/.f8COTPZibBl7d2iort7bUecA84vq', NULL, 'intern', 'active', NULL, NULL, NULL, NULL),
(5, 'Adi Wijaya', 'adi.wijaya@gmail.com', '$2y$12$tKCRe0VstCE6zbWc6tTWauNlqouU7mvbK2/mqgrWoD/wRiD74pT8G', NULL, 'intern', 'active', NULL, NULL, NULL, NULL),
(6, 'Siti Aminah', 'siti.a@data.io', '$2y$12$ouB4a.vQXxn581dV0clb4uBOICSeLB.S9CWoLJhRis.CDuQ2yZa16', NULL, 'intern', 'active', NULL, NULL, NULL, NULL),
(7, 'Rendra', 'intern@gmail.com', '$2y$12$YinJLneUY3V/gKvmw2odH.vgEJHCV3QINQ651aZapO2QDzs9EVMZm', NULL, 'intern', 'active', '08123456789', NULL, NULL, NULL),
(8, 'ceo', 'ceo@gmail.com', '$2y$12$pJo.A1iQTPm0c0xZMF/8COn8ansz3sIjmi0lAKYZ1wvRF2YQSiLLi', NULL, 'company', 'active', '021123456', NULL, NULL, NULL),
(10, 'raff', 'rafff@gmail.com', '$2y$12$oAQh2Q.4tQcpqo4vUclvJuchdeIfdb7Yitl5r7cdIBXG/nws88DC6', NULL, 'company', 'active', '021123456', NULL, NULL, NULL),
(11, 'Staff Vocaseek', 'staff@vocaseek.com', '$2y$12$HcRLEFX2RbkV8okfvU/7LuHxEIjZdf7mmv2yoYdKrh3jUB/Ya0BFS', NULL, 'staff_admin', 'active', NULL, NULL, NULL, NULL),
(12, 'Rendra Ardika', 'ardikarendra50@gmail.com', '$2y$12$iTV4pLP8Zq/gB81kWB/fG.UV0uVsx831F0HJy1agvdp00YaGbALaa', '117899192468063213962', 'intern', 'active', '-', NULL, NULL, NULL),
(13, '23081010074 RENDRA ARDIKA', '23081010074@student.upnjatim.ac.id', '$2y$12$kwpLoF4vQrp30rBbN0WCvOaPjUbuX8BHP2AfRPnnHNC5X4FyBFsCG', '100249161429241838897', 'intern', 'active', '-', NULL, NULL, NULL),
(14, 'Udin Makin', 'udinmakin89@gmail.com', '$2y$12$dvP5VDkIvc73RlptbEBMLeds4fyUX4Av8bva2p3Sy2eZMVbw7Vdk6', '111268917215863455383', 'intern', 'active', '-', NULL, NULL, NULL),
(15, 'rafi ardiansyah', 'rafi123@gmail.com', '$2y$12$brA3EkIzBjRqtWQUBfVz7ugnu4HVi54RJsgnq/yCxmtwBn0h1gRfq', NULL, 'intern', 'active', '08123456789', NULL, NULL, NULL),
(16, 'ardiansyah', 'ardi4nsyah06@gmail.com', '$2y$12$koVm6rnaKvA8GzV4CtouU.tA5zhCgfjjHShMAGXJLuQaiGGYUo2Ba', NULL, 'intern', 'active', '08123456789', NULL, NULL, NULL),
(17, 'Muhammad Rafi Ardiansyah', 'rafiardn29@gmail.com', '$2y$12$ZYYBtJeEgyQJFUlNgRKYvO8I94hB8SMuete/jG/NGGWMZVutvInwK', '101570436265370524333', 'intern', 'active', '-', NULL, NULL, NULL),
(18, 'PT.MUNIR JAYA', 'munirjaya@gmail.com', '$2y$12$fgAL3zYUnS7pRe0v8tsAXekrqmyD7xfdBALfa970AhavRrhjwWaPm', NULL, 'company', 'active', '085788972225', NULL, NULL, NULL),
(19, 'Laili Magfiroh Novia', 'lailiinoviaa99@gmail.com', '$2y$12$bqXEGRObZ69b0Zc3coKlu.jZiOOpg5X/CrBaq5ncyPreyDGmuFcsS', NULL, 'intern', 'active', '082335073437', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company_profile`
--
ALTER TABLE `company_profile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `intern_certifications`
--
ALTER TABLE `intern_certifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `intern_experiences`
--
ALTER TABLE `intern_experiences`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `intern_profiles`
--
ALTER TABLE `intern_profiles`
  ADD PRIMARY KEY (`intern_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD PRIMARY KEY (`application_id`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_listings`
--
ALTER TABLE `job_listings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lowongan`
--
ALTER TABLE `lowongan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `test_answers`
--
ALTER TABLE `test_answers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `company_profile`
--
ALTER TABLE `company_profile`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `intern_certifications`
--
ALTER TABLE `intern_certifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `intern_experiences`
--
ALTER TABLE `intern_experiences`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `intern_profiles`
--
ALTER TABLE `intern_profiles`
  MODIFY `intern_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_applications`
--
ALTER TABLE `job_applications`
  MODIFY `application_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `job_listings`
--
ALTER TABLE `job_listings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `lowongan`
--
ALTER TABLE `lowongan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `test_answers`
--
ALTER TABLE `test_answers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
