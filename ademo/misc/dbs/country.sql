create table country (isoCode char(2) not null, name varchar(64) not null, primary key(isoCode));
alter table country add column rich tinyint default 0;