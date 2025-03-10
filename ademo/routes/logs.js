var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var data = await tricks.queryLogs(req.session.role, req.session.userid);
    var dataHit = await tricks.queryHitlogs(req.session.role, req.session.userid);
    var offices = await tricks.queryOffices(req.session.role, req.session.userid);
    var agents = await tricks.queryAgents(req.session.role, req.session.userid);
    var sites = await tricks.queryData("select * from site order by name");
    var links = await tricks.queryLinks();
    // console.log(`[debug<links>] ${JSON.stringify(links)}`); // debug code, should be removed later
    var countries = await tricks.queryCountries();
    res.render('logs', { 
      title: "Logs",
      navs: req.session.navs,
      user: req.session.username,
      role: req.session.role,
      offices: offices,
      agents: agents,
      sites: sites,
      links: links,
      data: data,
      dataHit: dataHit,
      countries: countries,
      tab: 1,
      newags: req.session.iaNum
    });
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  if (req.session && req.session.loggedin) {
    var data = [], dataHit = [];
    var offices = await tricks.queryOffices(req.session.role, req.session.userid);
    var agents = await tricks.queryAgents(
      req.session.role, req.session.userid,
      (req.body.selOffice_clog != undefined ? (parseInt(req.body.selOffice_clog) == -111 ? " 1 = 1 " : " officeid = " + req.body.selOffice_clog) : " 1 = 1 ")
    );
    var sites = await tricks.queryData("select * from site order by name");
    var links = await tricks.queryLinks();
    var countries = await tricks.queryCountries();
    var tab = 0;
    if (req.body.iptUsername != undefined) {
      data = await tricks.queryLogs(
        req.session.role, req.session.userid, 
        "username like '%" + req.body.iptUsername + "%'"
      );
      dataHit = await tricks.queryHitlogs(req.session.role, req.session.userid);
    } else if (req.body.selAgent_clog != undefined) {
      var cond = " 1 = 1 ";
      cond += (parseInt(req.body.selOffice_clog) == -111 ? "" : " and officeid = " + req.body.selOffice_clog);
      cond += (parseInt(req.body.selAgent_clog) == -111 ? "" : " and agentid = " + req.body.selAgent_clog);
      cond += (parseInt(req.body.selSite_clog) == -111 ? "" : " and siteid = " + req.body.selSite_clog);
      if (req.body.iptIP_clog != "") cond += ( " and ip4 like '%" + req.body.iptIP_clog + "%'");
      cond += (" and (convert(time, date) >= str_to_date('" 
        + req.body.iptDateStart_clog + "', '%m/%d/%Y') and convert(time, date) <= str_to_date('" 
        + req.body.iptDateEnd_clog + "', '%m/%d/%Y'))");
      dataHit = await tricks.queryHitlogs(
        req.session.role, req.session.userid, 
        cond
      );
      data = await tricks.queryLogs(req.session.role, req.session.userid);
      tab = 1;
    }
    res.render('logs', { 
      title: "Logs",
      navs: req.session.navs,
      user: req.session.username,
      role: req.session.role,
      offices: offices,
      agents: agents,
      sites: sites,
      links: links,
      data: data,
      dataHit: dataHit,
      countries: countries,
      post_params: req.body,
      tab: tab,
      newags: req.session.iaNum
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
