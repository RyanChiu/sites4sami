drop view view_log;
create view view_log as
select 
	`a`.`id` AS `id`,`a`.`userid` AS `userid`,`b`.`username` AS `username`,`b`.`type` AS `role`,
	(select `user`.`username` from `user` where (`user`.`id` = `b`.`officeid`)) AS `office`,
	`a`.`ip4` AS `ip4`,`a`.`intime` AS `intime`,`a`.`outtime` AS `outtime` 
from (`log` `a` join `user` `b`) 
where (`a`.`userid` = `b`.`id`);