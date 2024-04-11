alter table user add column 1stname varchar(32) not null after username;
alter table user add column lstname varchar(32) not null after 1stname;
alter table user add column note text null after type;

create table user (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `1stname` varchar(32) NOT NULL,
  `lstname` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `pwd_crypted` varchar(128) NOT NULL,
  `type` int NOT NULL,
  `note` text,
  `officeid` int DEFAULT NULL,
  `status` tinyint NOT NULL,
  `registered` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
)
comment="type:0 as a superadmin, 1 as an admin, 2 as an office, 3 as an agent, only when type = 3 the officeid should not be null; status: -1 as not approved, 0 as not activated, 1 as activated"
alter table user add column sites json default null comment 'should be null when type is 0, 1 and 2, only should be like JSON_ARRAY(1, 3) or null when type is 3';
update user set sites = JSON_ARRAY(1, 2, 3) where type = 3;