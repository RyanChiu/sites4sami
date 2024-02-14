create table user (
    id int not null primary key AUTO_INCREMENT,
    username varchar(64) not null UNIQUE,
    password varchar(32) not null,
    pwd_crypted varchar(128) not null,
    type int not null,
    status tinyint not null)
comment="type:0 as a superadmin, 1as an admin, 2 as an office, 3 as an agent"

