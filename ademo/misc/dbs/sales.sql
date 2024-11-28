CREATE TABLE `sales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `day_pulling` date NOT NULL COMMENT 'like 2024-11-21, data of which request by pulling from server',
  `trxid` varchar(64) NOT NULL COMMENT 'transaction_id',
  `trxtime` int DEFAULT NULL COMMENT 'click_unix_timestamp, a 10-digit num',
  `agent` varchar(32) NOT NULL COMMENT 'not id of the agent, but user name of it',
  `type_abbr` varchar(8) NOT NULL COMMENT 'not id of the site, but abbreviation of it',
  `conversion_id` varchar(64) NOT NULL,
  `conversion_user_ip` varchar(16) DEFAULT NULL,
  `country` varchar(64) DEFAULT NULL,
  `region` varchar(32) DEFAULT NULL,
  `city` varchar(32) DEFAULT NULL,
  `referer` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transactionid` (`trxid`)
)
alter table sales add column session_user_ip varchar(16) default null after type_abbr;
