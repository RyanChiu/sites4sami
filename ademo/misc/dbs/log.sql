create table log (
    id int not null primary key AUTO_INCREMENT,
    userid int comment "id of the user, no matter it is an admin or an office or an agent",
    type tinyint comment "null as it is meaningless, 0 as log out, 1 as log in",
    intime datetime default current_timestamp comment "when type is 1",
    outtime datetime default current_timestamp comment "when type is 0",
    PRIMARY KEY (`id`)
);
alter table log add column ip4 varchar(16) default null comment "ipv4 address" after outtime;
