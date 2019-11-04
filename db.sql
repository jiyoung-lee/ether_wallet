CREATE TABLE `wallet_info` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(15) NOT NULL UNIQUE,
  `password` varchar(12) NOT NULL,
  `public_key` varchar(100) NOT NULL,
  `private_key` varchar(100) NOT NULL, 
  PRIMARY KEY (`num`)
);

