CREATE TABLE `wallet_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(15) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `public_key` varchar(100) NOT NULL,
  `private_key` varchar(255) NOT NULL, 
  PRIMARY KEY (`id`)
);

CREATE TABLE `txhash` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` VARCHAR(15) NOT NULL,
  `txhash` VARCHAR(255) NOT NULL, 
  PRIMARY KEY (`id`)
)
