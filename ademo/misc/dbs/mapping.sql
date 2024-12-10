CREATE TABLE `mapping` (
  `id` varchar(32) NOT NULL COMMENT 'a md5 result which generated from triplet',
  `triplet` varchar(32) NOT NULL COMMENT 'a string combined with "siteid,type_abbr,agent_username"',
  `type` tinyint NOT NULL DEFAULT '1' COMMENT '0 means id''s generated from deprecated function, 1 means id''s genertated normally',
  PRIMARY KEY (`id`)
)
