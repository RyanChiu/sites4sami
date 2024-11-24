CREATE TABLE `sales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `day_pulling` date not null comment 'like 2024-11-21, data of which request by pulling from server',
  `trxid` varchar(64) not null comment 'transaction_id',
  `trxtime` int comment 'click_unix_timestamp, a 10-digit num',
  `agent` varchar(32) NOT NULL comment 'not id of the agent, but user name of it',
  `link_abbr` varchar(8) NOT NULL comment 'not the id of a type, but the abbreviation of it',
  `conversion_id` varchar(64) NOT NULL,
  `conversion_user_ip` varchar(16),
  `country` varchar(64),
  `region` varchar(32),
  `city` varchar(32),
  `referer` varchar(64),
  PRIMARY KEY (`id`)
);
create unique index transactionid on sales(trxid);
