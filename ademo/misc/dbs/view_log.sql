create view view_log as select a.id, a.userid, b.username, b.type as role, (select username from user where id = b.officeid) as office, intime, outtime from log
 a, user b where a.userid = b.id;
