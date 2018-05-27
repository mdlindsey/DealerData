-- SQL Dump
--
-- Host: 127.0.0.1:3306
-- Server version: 5.7.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `DealerData_CronJob`
--
CREATE DATABASE IF NOT EXISTS `DealerData_CronJob` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `DealerData_CronJob`;

-- --------------------------------------------------------

--
-- Table structure for table `Errors`
--

DROP TABLE IF EXISTS `Errors`;
CREATE TABLE IF NOT EXISTS `Errors` (
  `ErrorId` int(1) UNSIGNED NOT NULL AUTO_INCREMENT,
  `Worker` varchar(255) NOT NULL,
  `Error` varchar(5000) NOT NULL,
  `Created` int(1) UNSIGNED NOT NULL,
  PRIMARY KEY (`ErrorId`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Output`
--

DROP TABLE IF EXISTS `Output`;
CREATE TABLE IF NOT EXISTS `Output` (
  `OutputId` int(1) UNSIGNED NOT NULL AUTO_INCREMENT,
  `WorkerId` int(1) UNSIGNED NOT NULL,
  `Output` varchar(5000) NOT NULL,
  `Runtime` double UNSIGNED NOT NULL,
  `Created` int(1) UNSIGNED NOT NULL,
  PRIMARY KEY (`OutputId`),
  KEY `WorkerId` (`WorkerId`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Workers`
--

DROP TABLE IF EXISTS `Workers`;
CREATE TABLE IF NOT EXISTS `Workers` (
  `WorkerId` int(1) UNSIGNED NOT NULL AUTO_INCREMENT,
  `WorkerRef` varchar(255) NOT NULL,
  `WorkerIndex` varchar(255) NOT NULL,
  `Modified` int(1) UNSIGNED NOT NULL,
  PRIMARY KEY (`WorkerId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Output`
--
ALTER TABLE `Output`
  ADD CONSTRAINT `output_ibfk_1` FOREIGN KEY (`WorkerId`) REFERENCES `Workers` (`WorkerId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
