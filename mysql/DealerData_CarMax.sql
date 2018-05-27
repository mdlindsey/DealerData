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
-- Database: `DealerData_CarMax`
--
CREATE DATABASE IF NOT EXISTS `DealerData_CarMax` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `DealerData_CarMax`;

-- --------------------------------------------------------

--
-- Table structure for table `Dealerships`
--

DROP TABLE IF EXISTS `Dealerships`;
CREATE TABLE IF NOT EXISTS `Dealerships` (
  `StoreId` smallint(1) UNSIGNED NOT NULL AUTO_INCREMENT,
  `Modified` int(1) UNSIGNED NOT NULL,
  `Zip` varchar(5) NOT NULL,
  `City` varchar(64) NOT NULL,
  `State` varchar(2) NOT NULL,
  PRIMARY KEY (`StoreId`)
) ENGINE=InnoDB AUTO_INCREMENT=7957 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Dealerships`
--

INSERT INTO `Dealerships` (`StoreId`, `Modified`, `Zip`, `City`, `State`) VALUES
(6001, 1523028451, '19711', 'Newark', 'DE'),
(6002, 1523029600, '92562', 'Murrieta', 'CA'),
(6003, 1523029859, '93551', 'Palmdale', 'CA'),
(6004, 1523030251, '50322', 'Urbandale', 'IA'),
(6007, 1523030560, '62269', 'O\'Fallon', 'IL'),
(6008, 1523030972, '55428', 'Minneapolis', 'MN'),
(6010, 1523031520, '80134', 'Parker', 'CO'),
(6011, 1523031997, '08052', 'Maple Shade Township', 'NJ'),
(6013, 1523032359, '17050', 'Mechanicsburg', 'PA'),
(6014, 1523032855, '93036', 'Oxnard', 'CA'),
(6018, 1523033199, '02062', 'Norwood', 'MA'),
(6021, 1523033560, '31406', 'Savannah', 'GA'),
(6024, 1523033971, '80234', 'Denver', 'CO'),
(6025, 1523034342, '31909', 'Columbus', 'GA'),
(6027, 1523034692, '63123', 'St. Louis', 'MO'),
(6031, 1523035119, '30519', 'Buford', 'GA'),
(6032, 1523035542, '21704', 'Frederick', 'MD'),
(6034, 1523035870, '21801', 'Salisbury', 'MD'),
(6035, 1523036455, '33966', 'Fort Myers', 'FL'),
(6036, 1523036852, '34104', 'Naples', 'FL'),
(6037, 1523037280, '32609', 'Gainesville', 'FL'),
(6038, 1523037671, '79936', 'El Paso', 'TX'),
(6039, 1523038052, '83642', 'Meridian', 'ID'),
(6040, 1523038480, '99212', 'Spokane', 'WA'),
(6041, 1523038853, '49512', 'Grand Rapids', 'MI'),
(6042, 1523039252, '37067', 'Franklin', 'TN'),
(6043, 1523039612, '14623', 'Rochester', 'NY'),
(6045, 1523040092, '80121', 'Littleton', 'CO'),
(6048, 1523040453, '94533', 'Fairfield', 'CA'),
(6049, 1523040759, '12205', 'Albany', 'NY'),
(6050, 1523041052, '32304', 'Tallahassee', 'FL'),
(6051, 1523041294, '36301', 'Dothan', 'AL'),
(6052, 1523041856, '63376', 'St Peters', 'MO'),
(6054, 1523042079, '38866', 'Saltillo', 'MS'),
(6055, 1523042372, '22801', 'Harrisonburg', 'VA'),
(6056, 1523042681, '24502', 'Lynchburg', 'VA'),
(6057, 1523043068, '53719', 'Madison', 'WI'),
(6058, 1523043281, '38305', 'Jackson', 'TN'),
(6061, 1523043656, '32505', 'Pensacola', 'FL'),
(6063, 1523044000, '01923', 'Danvers', 'MA'),
(6065, 1523044480, '98371', 'Puyallup', 'WA'),
(6067, 1523044893, '01581', 'Westborough', 'MA'),
(6068, 1523045455, '94588', 'Pleasanton', 'CA'),
(6070, 1523045751, '06705', 'Waterbury', 'CT'),
(6071, 1523046211, '94538', 'Fremont', 'CA'),
(6072, 1523046761, '95136', 'San Jose', 'CA'),
(6074, 1523047653, '89130', 'Las Vegas', 'NV'),
(6077, 1523048139, '95407', 'Santa Rosa', 'CA'),
(6081, 1523048681, '77469', 'Richmond', 'TX'),
(6082, 1523049055, '37620', 'Bristol', 'TN'),
(6084, 1523049351, '61704', 'Bloomington', 'IL'),
(7100, 1523049654, '19047', 'Langhorne', 'PA'),
(7101, 1523050265, '23060', 'Glen Allen', 'VA'),
(7102, 1523051195, '27612', 'Raleigh', 'NC'),
(7103, 1523051917, '30144', 'Kennesaw', 'GA'),
(7104, 1523052691, '30071', 'Norcross', 'GA'),
(7105, 1523053290, '33613', 'Tampa', 'FL'),
(7106, 1523053892, '28227', 'Charlotte', 'NC'),
(7107, 1523054490, '32822', 'Orlando', 'FL'),
(7108, 1523055091, '33317', 'Fort Lauderdale', 'FL'),
(7109, 1523055757, '75041', 'Garland', 'TX'),
(7110, 1523056356, '33172', 'Miami', 'FL'),
(7111, 1523056890, '77074', 'Houston', 'TX'),
(7112, 1523057490, '76120', 'Fort Worth', 'TX'),
(7113, 1523058088, '33426', 'Boynton Beach', 'FL'),
(7114, 1523058650, '77090', 'Houston', 'TX'),
(7115, 1523059374, '75062', 'Irving', 'TX'),
(7116, 1523060009, '77034', 'Houston', 'TX'),
(7117, 1523060558, '30281', 'Stockbridge', 'GA'),
(7118, 1523061689, '20723', 'Laurel', 'MD'),
(7120, 1523062250, '91764', 'Ontario', 'CA'),
(7121, 1523062957, '21162', 'White Marsh', 'MD'),
(7122, 1523063449, '60566', 'Naperville', 'IL'),
(7123, 1523064088, '60477', 'Tinley Park', 'IL'),
(7126, 1523064513, '91502', 'Burbank', 'CA'),
(7128, 1523065170, '60173', 'Schaumburg', 'IL'),
(7129, 1523065716, '90621', 'Buena Park', 'CA'),
(7130, 1523066314, '23452', 'Virginia Beach', 'VA'),
(7132, 1523067156, '20165', 'Sterling', 'VA'),
(7136, 1523067754, '91010', 'Duarte', 'CA'),
(7144, 1523068409, '46280', 'Indianapolis', 'IN'),
(7146, 1523068955, '60162', 'Hillside', 'IL'),
(7147, 1523069491, '95661', 'Roseville', 'CA'),
(7148, 1523070068, '32225', 'Jacksonville', 'FL'),
(7149, 1523070571, '95828', 'Sacramento', 'CA'),
(7150, 1523071170, '37204', 'Nashville', 'TN'),
(7152, 1523071866, '78229', 'San Antonio', 'TX'),
(7154, 1523072445, '78753', 'Austin', 'TX'),
(7157, 1523072970, '89014', 'Henderson', 'NV'),
(7159, 1523073395, '95356', 'Modesto', 'CA'),
(7164, 1523073874, '97008', 'Beaverton', 'OR'),
(7165, 1523074170, '44128', 'Cleveland', 'OH'),
(7167, 1523074770, '84095', 'South Jordan', 'UT'),
(7171, 1523075194, '28054', 'Gastonia', 'NC'),
(7172, 1523075736, '33760', 'Clearwater', 'FL'),
(7173, 1523076274, '66204', 'Overland Park', 'KS'),
(7174, 1523076808, '40299', 'Louisville', 'KY'),
(7175, 1523077354, '45240', 'Cincinnati', 'OH'),
(7176, 1523078195, '43235', 'Columbus', 'OH'),
(7177, 1523078675, '29607', 'Greenville', 'SC'),
(7178, 1523079066, '53186', 'Waukesha', 'WI'),
(7179, 1523079449, '53224', 'Milwaukee', 'WI'),
(7180, 1523079944, '46410', 'Merrillville', 'IN'),
(7181, 1523080476, '76132', 'Fort Worth', 'TX'),
(7183, 1523081009, '22192', 'Woodbridge', 'VA'),
(7185, 1523081489, '27407', 'Greensboro', 'NC'),
(7186, 1523081968, '37421', 'Chattanooga', 'TN'),
(7187, 1523082395, '70809', 'Baton Rouge', 'LA'),
(7188, 1523082690, '62711', 'Springfield', 'IL'),
(7190, 1523083247, '78745', 'Austin', 'TX'),
(7191, 1523083650, '74133', 'Tulsa', 'OK'),
(7192, 1523084010, '29414', 'Charleston', 'SC'),
(7193, 1523084370, '36606', 'Mobile', 'AL'),
(7194, 1523084916, '87113', 'Albuquerque', 'NM'),
(7195, 1523085569, '92618', 'Irvine', 'CA'),
(7196, 1523085994, '92504', 'Riverside', 'CA'),
(7197, 1523086410, '28134', 'Pineville', 'NC'),
(7198, 1523087368, '33014', 'Hialeah', 'FL'),
(7199, 1523087738, '60453', 'Oak Lawn', 'IL'),
(7201, 1523088208, '80922', 'Colorado Springs', 'CO'),
(7202, 1523088689, '33064', 'Pompano Beach', 'FL'),
(7203, 1523089049, '77065', 'Houston', 'TX'),
(7204, 1523089536, '40515', 'Lexington', 'KY'),
(7206, 1523090076, '20877', 'Gaithersburg', 'MD'),
(7207, 1523090608, '75093', 'Plano', 'TX'),
(7208, 1523091048, '60022', 'Glencoe', 'IL'),
(7209, 1523091450, '30907', 'Augusta', 'GA'),
(7210, 1523091939, '39206', 'Jackson', 'MS'),
(7211, 1523092410, '35806', 'Huntsville', 'AL'),
(7218, 1523093012, '38133', 'Memphis', 'TN'),
(7224, 1523093610, '35244', 'Birmingham', 'AL'),
(7227, 1523093971, '78233', 'San Antonio', 'TX'),
(7230, 1523094346, '32124', 'Daytona Beach', 'FL'),
(7231, 1523094808, '28602', 'Hickory', 'NC'),
(7233, 1523095287, '17601', 'Lancaster', 'PA'),
(7234, 1523095851, '08081', 'Sicklerville', 'NJ'),
(7240, 1523096370, '45449', 'Dayton', 'OH'),
(7241, 1523096917, '37934', 'Knoxville', 'TN'),
(7242, 1523097336, '23114', 'Midlothian', 'VA'),
(7243, 1523097758, '30122', 'Lithia Springs', 'GA'),
(7244, 1523098649, '89146', 'Las Vegas', 'NV'),
(7247, 1523099138, '32771', 'Sanford', 'FL'),
(7248, 1523099610, '73131', 'Oklahoma City', 'OK'),
(7249, 1523100092, '85705', 'Tucson', 'AZ'),
(7250, 1523100515, '98036', 'Lynnwood', 'WA'),
(7257, 1523101051, '20613', 'Brandywine', 'MD'),
(7258, 1523101547, '80538', 'Loveland', 'CO'),
(7260, 1523101957, '32244', 'Jacksonville', 'FL'),
(7262, 1523102250, '02760', 'North Attleborough', 'MA'),
(7264, 1523102676, '93650', 'Fresno', 'CA'),
(7265, 1523103276, '29210', 'Columbia', 'SC'),
(7267, 1523103809, '67207', 'Wichita', 'KS'),
(7268, 1523104291, '64055', 'Independence', 'MO'),
(7270, 1523104718, '68118', 'Omaha', 'NE'),
(7271, 1523105146, '19406', 'King of Prussia', 'PA'),
(7272, 1523105918, '90504', 'Torrance', 'CA'),
(7274, 1523106450, '85353', 'Tolleson', 'AZ'),
(7276, 1523106757, '02920', 'Cranston', 'RI'),
(7278, 1523107252, '27103', 'Winston-Salem', 'NC'),
(7279, 1523107650, '28303', 'Fayetteville', 'NC'),
(7280, 1523108196, '89511', 'Reno', 'NV'),
(7281, 1523108746, '93307', 'Bakersfield', 'CA'),
(7282, 1523109275, '27616', 'Raleigh', 'NC'),
(7283, 1523109756, '43219', 'Columbus', 'OH'),
(7284, 1523110251, '37115', 'Madison', 'TN'),
(7285, 1523111006, '97222', 'Portland', 'OR'),
(7286, 1526343364, '06120', 'Hartford', 'CT'),
(7287, 1526389920, '06512', 'East Haven', 'CT'),
(7290, 1526346663, '22911', 'Charlottesville', 'VA'),
(7291, 1526390212, '22407', 'Fredericksburg', 'VA'),
(7294, 1526391945, '23608', 'Newport News', 'VA'),
(7295, 1523020119, '77449', 'Katy', 'TX'),
(7297, 1523020600, '92626', 'Costa Mesa', 'CA'),
(7298, 1523021009, '30076', 'Roswell', 'GA'),
(7633, 1523021469, '55109', 'St Paul', 'MN'),
(7653, 1523021972, '92111', 'San Diego', 'CA'),
(7654, 1523022400, '92025', 'Escondido', 'CA'),
(7662, 1523022941, '85297', 'Gilbert', 'AZ'),
(7663, 1523024371, '21043', 'Ellicott City', 'MD'),
(7806, 1523025513, '20723', 'Laurel', 'MD'),
(7807, 1523026293, '53142', 'Kenosha', 'WI'),
(7810, 1523027141, '90301', 'Inglewood', 'CA'),
(7950, 1523027921, '30341', 'Atlanta', 'GA'),
(7954, 1523027971, '21030', 'Cockeysville', 'MD'),
(7955, 1523028055, '34205', 'Bradenton', 'FL'),
(7956, 1523029001, '76054', 'Hurst', 'TX');

-- --------------------------------------------------------

--
-- Table structure for table `Moves`
--

DROP TABLE IF EXISTS `Moves`;
CREATE TABLE IF NOT EXISTS `Moves` (
  `MoveId` int(1) UNSIGNED NOT NULL AUTO_INCREMENT,
  `Vin` varchar(17) NOT NULL,
  `OldStoreId` smallint(1) UNSIGNED NOT NULL,
  `NewStoreId` smallint(1) UNSIGNED NOT NULL,
  `Created` int(1) UNSIGNED NOT NULL,
  PRIMARY KEY (`MoveId`),
  UNIQUE KEY `MoveId_2` (`MoveId`),
  KEY `MoveId` (`MoveId`)
) ENGINE=InnoDB AUTO_INCREMENT=343981 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Returns`
--

DROP TABLE IF EXISTS `Returns`;
CREATE TABLE IF NOT EXISTS `Returns` (
  `ReturnId` int(1) UNSIGNED NOT NULL AUTO_INCREMENT,
  `SaleId` int(1) UNSIGNED NOT NULL,
  `Created` int(1) NOT NULL,
  PRIMARY KEY (`ReturnId`),
  KEY `SaleId` (`SaleId`)
) ENGINE=InnoDB AUTO_INCREMENT=4833 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Sales`
--

DROP TABLE IF EXISTS `Sales`;
CREATE TABLE IF NOT EXISTS `Sales` (
  `SaleId` int(1) UNSIGNED NOT NULL AUTO_INCREMENT,
  `Vin` varchar(17) NOT NULL,
  `Created` int(1) NOT NULL,
  PRIMARY KEY (`SaleId`),
  UNIQUE KEY `Vin_2` (`Vin`),
  KEY `Vin` (`Vin`)
) ENGINE=InnoDB AUTO_INCREMENT=592119 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Vehicles`
--

DROP TABLE IF EXISTS `Vehicles`;
CREATE TABLE IF NOT EXISTS `Vehicles` (
  `Vin` varchar(17) NOT NULL,
  `StoreId` smallint(1) UNSIGNED NOT NULL,
  `FirstSeen` int(1) UNSIGNED NOT NULL,
  `LastSeen` int(1) UNSIGNED NOT NULL,
  `Price` mediumint(1) UNSIGNED NOT NULL,
  `Year` smallint(1) UNSIGNED NOT NULL,
  `Make` varchar(32) NOT NULL,
  `Model` varchar(32) NOT NULL,
  `Miles` mediumint(1) UNSIGNED NOT NULL,
  `Cylinders` tinyint(1) UNSIGNED NOT NULL,
  `EngineSize` varchar(6) NOT NULL,
  `DriveTrain` varchar(16) NOT NULL,
  `Transmission` varchar(16) NOT NULL,
  `InteriorColor` varchar(16) NOT NULL DEFAULT '',
  `ExteriorColor` varchar(16) NOT NULL DEFAULT '',
  `MpgCity` smallint(1) UNSIGNED NOT NULL DEFAULT '0',
  `MpgHighway` smallint(1) UNSIGNED NOT NULL DEFAULT '0',
  `NewTireCount` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `AverageRating` float NOT NULL DEFAULT '0',
  `NumberOfReviews` mediumint(1) UNSIGNED NOT NULL DEFAULT '0',
  `StockNumber` mediumint(1) UNSIGNED NOT NULL DEFAULT '0',
  `Highlights` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`Vin`),
  UNIQUE KEY `Vin` (`Vin`),
  KEY `StoreId` (`StoreId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Returns`
--
ALTER TABLE `Returns`
  ADD CONSTRAINT `Returns_ibfk_1` FOREIGN KEY (`SaleId`) REFERENCES `Sales` (`SaleId`);

--
-- Constraints for table `Sales`
--
ALTER TABLE `Sales`
  ADD CONSTRAINT `Sales_ibfk_1` FOREIGN KEY (`Vin`) REFERENCES `Vehicles` (`Vin`);

--
-- Constraints for table `Vehicles`
--
ALTER TABLE `Vehicles`
  ADD CONSTRAINT `Vehicles_ibfk_1` FOREIGN KEY (`StoreId`) REFERENCES `Dealerships` (`StoreId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
