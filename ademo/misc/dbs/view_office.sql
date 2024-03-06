drop view view_office;
create view view_office as
select a.id, a.username, a.1stname,a.lstname, a.password, a.type,
	a.note, a.officeid, a.status,a.registered,
	count(distinct b.id) as agents,
	max(c.intime) as lastlogintime
from `user`  a, (select id, username, officeid from user where type = 3 and officeid is not null) b, log c
where a.`type` = 2 and a.id = b.officeid and a.id = c.userid and c.type = 1
group by a.id

union

select a.id,a.username, a.1stname,a.lstname, a.password, a.type,
	a.note, a.officeid, a.status,a.registered,
	0 as agents,
	max(c.intime) as lastlogintime
from user a, log c
where a.type = 2 and a.id not in (select distinct officeid from user where officeid is not null) and a.id = c.userid and c.type = 1
group by a.id

union

select a.id,a.username, a.1stname,a.lstname, a.password, a.type,
	a.note, a.officeid, a.status,a.registered,
	count(b.id) as agents,
	null as lastlogintime
from `user`  a, (select id, username, officeid from user where type = 3) b
where a.`type` = 2 and a.id = b.officeid and a.id not in (select distinct userid from log where type = 1)
group by a.id

union

select a.id,a.username, a.1stname,a.lstname, a.password, a.type,
	a.note, a.officeid, a.status,a.registered,
	0 as agents,
	null as lastlogintime
from user a
where a.type = 2 and (a.id not in (select distinct officeid from user where officeid is not null) 
	and a.id not in (select distinct userid from log where type = 1));