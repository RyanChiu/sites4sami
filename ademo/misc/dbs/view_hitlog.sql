create view view_hitlog as
select a.id,
    b.id as agentid, a.username as agent, 
    b.officeid, (select username from user where id = b.officeid) as office, 
    a.siteid, c.name as `site`, a.typeabbr, a.linkin, a.linkout, a.time, 
    a.ip4, a.countryISOcode as country, a.passed, a.referer
from hitlog a, user b, site c
where a.username = b.username and a.siteid = c.id;
