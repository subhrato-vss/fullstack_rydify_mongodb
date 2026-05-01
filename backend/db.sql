-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2025 at 11:37 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `drive_deal`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'Sourav Mourya', 'souravmourya203@gmail.com', '123', '2025-03-20 11:40:22', '2025-03-24 06:21:13');

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `fuelType` enum('Petrol','Diesel','CNG','Electric','Hybrid') NOT NULL,
  `transmissionType` enum('Manual','Automatic','CVT') NOT NULL,
  `mileage` float NOT NULL,
  `kmDriven` int(11) NOT NULL,
  `engineCapacity` int(11) NOT NULL,
  `chassisNumber` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `ownerType` enum('First Owner','Second Owner','Third Owner','Fourth or More') NOT NULL,
  `accidentalHistory` varchar(255) NOT NULL DEFAULT 'No',
  `address` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `dealerId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `status` varchar(255) DEFAULT 'Available',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`id`, `brand`, `model`, `name`, `fuelType`, `transmissionType`, `mileage`, `kmDriven`, `engineCapacity`, `chassisNumber`, `price`, `ownerType`, `accidentalHistory`, `address`, `contact`, `email`, `photo`, `dealerId`, `categoryId`, `status`, `createdAt`, `updatedAt`) VALUES
(3, 'skoda', '2022', 'rapid', 'Petrol', 'Manual', 10.5, 12000, 1200, 'VDFDFV12F', 350000, 'First Owner', 'No', 'L-7/2842 muraby wali gali', 'souravmourya203@gmail.com', 'souravmourya203@gmail.com', '/uploads/skoda.jpg', 2, 1, 'Available', '2025-04-01 09:28:24', '2025-04-01 12:53:32'),
(4, 'Maruti Suzuki ', '2023', 'Dezire', 'Petrol', 'Manual', 15.5, 12000, 12000, 'GJTI123VD', 180000, 'First Owner', 'No', 'L-7/2842 muraby wali gali', '8198850602', 'souravmourya203@gmail.com', '/uploads/dezire.jpg', 2, 5, 'sold', '2025-04-01 09:30:36', '2025-04-02 07:01:49'),
(5, 'Hyundai', '2023', 'i20', 'Petrol', 'Manual', 12.5, 10000, 1200, 'BVNEFEN123V', 150000, 'First Owner', 'No', 'L-7/2842 muraby wali gali', '8198850602', 'souravmourya203@gmail.com', '/uploads/i20.jpg', 2, 1, 'sold', '2025-04-01 09:36:30', '2025-04-02 06:47:10'),
(6, 'Toyota', '2022', 'Innova', 'Petrol', 'Manual', 11.7, 25000, 1600, 'EDDF123SDFV', 760000, 'First Owner', 'No', 'L-7/2842 muraby wali gali', '8198850602', 'souravmourya203@gmail.com', '/uploads/innova.jpg', 2, 5, 'Available', '2025-04-01 09:38:13', '2025-04-02 07:04:18');

-- --------------------------------------------------------

--
-- Table structure for table `car_requests`
--

CREATE TABLE `car_requests` (
  `id` int(11) NOT NULL,
  `carId` int(11) NOT NULL,
  `dealerId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` varchar(255) DEFAULT 'Pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_requests`
--

INSERT INTO `car_requests` (`id`, `carId`, `dealerId`, `userId`, `status`, `createdAt`, `updatedAt`) VALUES
(5, 3, 2, 1, 'Completed', '2025-04-01 12:52:06', '2025-04-01 12:53:32'),
(6, 5, 2, 1, 'Completed', '2025-04-02 06:47:10', '2025-04-02 06:58:59'),
(7, 4, 2, 1, 'Completed', '2025-04-02 07:01:49', '2025-04-02 07:03:38'),
(8, 6, 2, 1, 'Cancelled', '2025-04-02 07:04:11', '2025-04-02 07:04:18');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `photo`, `createdAt`, `updatedAt`) VALUES
(1, 'Sedan', '/categoryPic/sedan.jpg', '2025-03-24 05:35:45', '2025-03-24 05:35:45'),
(3, 'Hatchback', '/categoryPic/hatchback.jpg', '2025-03-24 05:51:34', '2025-03-24 05:51:34'),
(4, 'sports ', '/categoryPic/sports.jpg', '2025-03-24 05:51:59', '2025-03-24 05:51:59'),
(5, 'SUV', '/categoryPic/suv.jpg', '2025-03-24 06:02:08', '2025-03-24 06:02:08');

-- --------------------------------------------------------

--
-- Table structure for table `dealers`
--

CREATE TABLE `dealers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `adhar_card` varchar(255) NOT NULL,
  `pan_card` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Inactive',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dealers`
--

INSERT INTO `dealers` (`id`, `name`, `email`, `password`, `adhar_card`, `pan_card`, `mobile`, `gender`, `photo`, `address`, `city`, `status`, `createdAt`, `updatedAt`) VALUES
(2, 'Rohit Kumar', 'souravmourya203@gmail.com', '123', '435234542333243', 'PDWDWDWW344', '07009057835', 'male', '/dealersPic/driver3.jpg', 'L-7/2842 muraby wali gali', 'Amritsar', 'Active', '2025-03-22 07:33:12', '2025-03-22 08:15:27');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `carId` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `feedback` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `userId`, `carId`, `rating`, `feedback`, `createdAt`, `updatedAt`) VALUES
(1, 1, 3, 1, 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, co', '2025-04-01 09:40:10', '2025-04-01 09:40:10'),
(2, 1, 3, 5, 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions ', '2025-04-01 09:40:30', '2025-04-01 09:40:30'),
(3, 1, 3, 4, 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human h', '2025-04-01 12:33:15', '2025-04-01 12:33:15');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `mobile`, `gender`, `photo`, `address`, `city`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Sourav', 'Mourya', 'souravmourya203@gmail.com', '123', '07009057835', 'male', '/usersPic/driver3.jpg', 'L-7/2842 muraby wali gali', 'Amritsar', 'Active', '2025-03-20 10:37:29', '2025-03-26 06:51:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chassisNumber` (`chassisNumber`),
  ADD KEY `dealerId` (`dealerId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `car_requests`
--
ALTER TABLE `car_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carId` (`carId`),
  ADD KEY `dealerId` (`dealerId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dealers`
--
ALTER TABLE `dealers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `carId` (`carId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `car_requests`
--
ALTER TABLE `car_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `dealers`
--
ALTER TABLE `dealers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cars`
--
ALTER TABLE `cars`
  ADD CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`dealerId`) REFERENCES `dealers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cars_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `car_requests`
--
ALTER TABLE `car_requests`
  ADD CONSTRAINT `car_requests_ibfk_1` FOREIGN KEY (`carId`) REFERENCES `cars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `car_requests_ibfk_2` FOREIGN KEY (`dealerId`) REFERENCES `dealers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `car_requests_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`carId`) REFERENCES `cars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
