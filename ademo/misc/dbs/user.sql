create table user (
    id int not null primary key AUTO_INCREMENT,
    username varchar(64) not null UNIQUE,
    password varchar(32) not null,
    pwd_crypted varchar(128) not null,
    type int not null,officeid int null,
    status tinyint not null,
    registered datetime default current_timestamp)
comment="type:0 as a superadmin, 1 as an admin, 2 as an office, 3 as an agent, only when type = 3 the officeid should not be null; status: -1 as not approved, 0 as not activated, 1 as activated"