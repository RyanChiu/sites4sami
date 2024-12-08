CREATE TABLE `mapping` (
  `id` varchar(32) NOT NULL COMMENT 'a md5 result which generated from triplet',
  `triplet` varchar(32) NOT NULL COMMENT 'a string combined with "siteid,type_abbr,agent_username"',
  PRIMARY KEY (`id`)
)
