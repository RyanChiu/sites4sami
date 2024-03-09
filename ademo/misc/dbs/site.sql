create table site (
    id int not null auto_increment,
    name varchar(64) not null,
    short varchar(32) not null,
    abbr varchar(16) not null,
    url varchar(256) not null,
    clickparam varchar(32) default null,
    type varchar(32) default "N/A",
    links json default null comment 'show be like this: {[url, payout, earning], [url, payout, earning]}',
    status tinyint default 0,
    primary key (id)
)