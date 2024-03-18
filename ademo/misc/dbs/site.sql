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
    '{"url":"https://site.of.provider/?uid=xxx&sub1=__agent__&sub2=__abbr__", "name":"Live Sex Show", "abbr":"LSS", "payout":150.00, "earning":0, "status": 1}', 
    '{"url":"https://site.of.provider/?uid=xxx&sub1=__agent__&sub2=__abbr__", "name":"Live Cam Models", "abbr":"LCM", "payout":150.00, "earning":0, "status": 1}',
    '{"url":"https://site.of.provider/?uid=xxx&sub1=__agent__&sub2=__abbr__", "name":"Naugtiest Girls Live", "abbr":"NGL", "payout":150.00, "earning":0, "status": 1}'
) where id = 1