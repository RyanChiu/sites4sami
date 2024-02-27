create view view_agent as
select a.id, a.username, a.1stname, a.lstname, a.password, a.note, b.username as office, a.status, a.registered, max(c.intime) as lastlogintime, count(c.intime) as logintimes
from user a, (select id, username from user where type = 2) b, log c
where a.id = c.userid and a.officeid = b.id and a.type = 3 and c.type = 1
group by a.id
