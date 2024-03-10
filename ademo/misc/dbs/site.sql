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

/**
sample for update/insert the filed 'links',
it must quote with '' but not with "",
"" should be inside '', that's very important
**/
update site 
set links = JSON_ARRAY(
    '{"url":"u.4", "payout":21.03, "earning":30.31}', '{"url":"u.3", "payout":21.02, "earning":31.03}'
) where id = 1