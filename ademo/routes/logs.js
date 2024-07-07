var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var data = await tricks.queryLogs(req.session.role, req.session.userid);
    var data1 = await tricks.queryHitlogs(req.session.role, req.session.userid);
    var offices = await tricks.queryOffices(req.session.role, req.session.userid);
    var agents = await tricks.queryAgents(req.session.role, req.session.userid);
    var sites = await tricks.queryData("select * from site order by name");
    var countries = await tricks.queryCountries();
    res.render('logs', { 
      title: "Logs",
      navs: req.session.navs,
      user: req.session.username,
      role: req.session.role,
      offices: offices,
      agents: agents,
      sites, sites,
      data: data,
      data1: data1,
      countries: countries,
      tab: 1
    });
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  if (req.session && req.session.loggedin) {
    var data = data1 = [];
    var offices = await tricks.queryOffices(req.session.role, req.session.userid);
    var agents = await tricks.queryAgents(req.session.role, req.session.userid);
    var sites = await tricks.queryData("select * from site order by name");
    var countries = await tricks.queryCountries();
    var tab = 0;
    if (req.body.iptUsername != undefined) {
      data = await tricks.queryLogs(
        req.session.role, req.session.userid, 
        "username like '%" + req.body.iptUsername + "%'"
      );
      tab = 0;
    }
    if (req.body.selAgent_clog != undefined) {
      var cond = " 1 = 1 ";
      cond += (parseInt(req.body.selOffice_clog) == -111 ? "" : " and officeid = " + req.body.selOffice_clog);
      cond += (parseInt(req.body.selAgent_clog) == -111 ? "" : " and agentid = " + req.body.selAgent_clog);
      cond += (parseInt(req.body.selSite_clog) == -111 ? "" : " and siteid = " + req.body.selSite_clog);
      if (req.body.iptIP_clog != "") cond += ( " and ip4 like '%" + req.body.iptIP_clog + "%'");
      cond += (" and (convert(time, date) >= str_to_date('" 
        + req.body.iptDateStart_clog + "', '%m/%d/%Y') and convert(time, date) <= str_to_date('" 
        + req.body.iptDateEnd_clog + "', '%m/%d/%Y'))");
      data1 = await tricks.queryHitlogs(
        req.session.role, req.session.userid, 
        cond
      );
      tab = 1;
    }
    res.render('logs', { 
      title: "Logs",
      navs: req.session.navs,
      user: req.session.username,
      role: req.session.role,
      offices: offices,
      agents: agents,
      sites, sites,
      data: data,
      data1: data1,
      countries: countries,
      post_params: req.body,
      tab: tab
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
