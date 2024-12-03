CREATE TABLE `hitlog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(64) DEFAULT NULL COMMENT 'username of the agent',
  `siteid` tinyint DEFAULT NULL,
  `typeabbr` varchar(8) DEFAULT NULL COMMENT 'abbreviation of a type of the site whos id is siteid',
  `linkin` varchar(128) DEFAULT NULL COMMENT 'link which was just visited, generated by this site',
  `linkout` varchar(128) DEFAULT NULL COMMENT 'link just was visited and translated by this site',
  `time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'hit time',
  `ip4` varchar(16) DEFAULT NULL COMMENT 'ipv4 address that shows where the hit comes from',
  `countryISOcode` char(2) DEFAULT NULL COMMENT 'the country ISO code that shows where the ip4 come from',
  PRIMARY KEY (`id`)
);
alter table hitlog add passed tinyint default null comment '1 means the click was passed, 0 means the click was blocked';
alter table hitlog add column referer varchar(256) default null after passed;
