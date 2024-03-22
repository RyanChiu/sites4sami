var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

var sqlStats = "\
select convert(a.trxtime, date) as day, a.agentid, b.username as agent, \
  a.officeid, (select username from user where a.officeid = user.id) as office, a.siteid, c.name as site, \
  sum(a.raws) as raws, sum(a.uniques) as uniques, sum(a.chargebacks) as chargebacks, sum(a.signups) as signups, sum(a.frauds) as frauds, \
  sum(JSON_EXTRACT(a.sales0, '$[0]')) as sales_type0, \
  sum(JSON_EXTRACT(a.sales0, '$[0]') * JSON_EXTRACT(a.sales0, '$[1]')) as sales_type0_payout, \
  sum(JSON_EXTRACT(a.sales0, '$[0]') * JSON_EXTRACT(a.sales0, '$[2]')) as sales_type0_earning, \
  sum(JSON_EXTRACT(a.sales1, '$[0]')) as sales_type1, \
  sum(JSON_EXTRACT(a.sales1, '$[0]') * JSON_EXTRACT(a.sales1, '$[1]')) as sales_type1_payout, \
  sum(JSON_EXTRACT(a.sales1, '$[0]') * JSON_EXTRACT(a.sales1, '$[2]')) as sales_type1_earning, \
  sum(JSON_EXTRACT(a.sales2, '$[0]')) as sales_type2, \
  sum(JSON_EXTRACT(a.sales2, '$[0]') * JSON_EXTRACT(a.sales2, '$[1]')) as sales_type2_payout, \
  sum(JSON_EXTRACT(a.sales2, '$[0]') * JSON_EXTRACT(a.sales2, '$[2]')) as sales_type2_earning, \
  sum(JSON_EXTRACT(a.sales3, '$[0]')) as sales_type3, \
  sum(JSON_EXTRACT(a.sales3, '$[0]') * JSON_EXTRACT(a.sales3, '$[1]')) as sales_type3_payout, \
  sum(JSON_EXTRACT(a.sales3, '$[0]') * JSON_EXTRACT(a.sales3, '$[2]')) as sales_type3_earning, \
  sum(JSON_EXTRACT(a.sales4, '$[0]')) as sales_type4, \
  sum(JSON_EXTRACT(a.sales4, '$[0]') * JSON_EXTRACT(a.sales4, '$[1]')) as sales_type4_payout, \
  sum(JSON_EXTRACT(a.sales4, '$[0]') * JSON_EXTRACT(a.sales4, '$[2]')) as sales_type4_earning, \
  sum(JSON_EXTRACT(a.sales5, '$[0]')) as sales_type5, \
  sum(JSON_EXTRACT(a.sales5, '$[0]') * JSON_EXTRACT(a.sales5, '$[1]')) as sales_type5_payout, \
  sum(JSON_EXTRACT(a.sales5, '$[0]') * JSON_EXTRACT(a.sales5, '$[2]')) as sales_type5_earning, \
  sum(JSON_EXTRACT(a.sales6, '$[0]')) as sales_type6, \
  sum(JSON_EXTRACT(a.sales6, '$[0]') * JSON_EXTRACT(a.sales6, '$[1]')) as sales_type6_payout, \
  sum(JSON_EXTRACT(a.sales6, '$[0]') * JSON_EXTRACT(a.sales6, '$[2]')) as sales_type6_earning, \
  sum(JSON_EXTRACT(a.sales7, '$[0]')) as sales_type7, \
  sum(JSON_EXTRACT(a.sales7, '$[0]') * JSON_EXTRACT(a.sales7, '$[1]')) as sales_type7_payout, \
  sum(JSON_EXTRACT(a.sales7, '$[0]') * JSON_EXTRACT(a.sales7, '$[2]')) as sales_type7_earning, \
  sum(JSON_EXTRACT(a.sales8, '$[0]')) as sales_type8, \
  sum(JSON_EXTRACT(a.sales8, '$[0]') * JSON_EXTRACT(a.sales8, '$[1]')) as sales_type8_payout, \
  sum(JSON_EXTRACT(a.sales8, '$[0]') * JSON_EXTRACT(a.sales8, '$[2]')) as sales_type8_earning, \
  sum(JSON_EXTRACT(a.sales9, '$[0]')) as sales_type9, \
  sum(JSON_EXTRACT(a.sales9, '$[0]') * JSON_EXTRACT(a.sales9, '$[1]')) as sales_type9_payout, \
  sum(JSON_EXTRACT(a.sales9, '$[0]') * JSON_EXTRACT(a.sales9, '$[2]')) as sales_type9_earning \
from stats a, user b, site c \
";
var where = " where a.agentid = b.id and a.siteid = c.id";//default
var groupBy = {
  detail: " group by day, officeid, agentid, siteid",
  agent:  " group by agentid",
  office: " group by officeid",
  day:    " group by convert(trxtime, date)"
};
var orderBy = " order by day"; //default

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var title = tricks.getTitle(__filename);
    var offices = await tricks.queryOffices(req.session.role, req.session.userid);
    var agents = await tricks.queryAgents(req.session.role, req.session.userid);
    var sites = await tricks.queryData("select * from site");

    var _where = where;
    switch (req.session.role) {
      case 0:
      case 1:
        break;
      case 2:
        _where += " and a.officeid = " + req.session.userid;
        break;
      case 3:
        _where += " and a.agentid = " + req.session.userid;
    }
    var stats = await tricks.queryData(sqlStats + _where + groupBy.detail + orderBy);
    res.render('stats', { 
      title: title,
      navs: req.session.navs,
      user: req.session.username,
      role: req.session.role,
      offices: offices,
      agents: agents,
      sites: sites,
      stats: stats
    });
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  if (req.session && req.session.loggedin) {
    var params = req.body;
    var _where = where;
    if (parseInt(params.selSite) !== -111) {
      _where += " and a.siteid = " + params.selSite;
    }
    if (parseInt(params.selOffice) !== -111) {
      _where += " and a.officeid = " + params.selOffice;
    }
    if (parseInt(params.selAgent) !== -111) {
      _where += " and a.agentid = " + params.selAgent;
    }
    var dates = params.datePeriod.split("-");
    dates[0] = dates[0].trim();
    dates[1] = dates[1].trim();
    _where += " and convert(trxtime, date) >= str_to_date('" 
      + dates[0] + "', '%m/%d/%Y') and convert(trxtime, date) <= str_to_date('" 
      + dates[1] + "', '%m/%d/%Y')"
    var stats = await tricks.queryData(sqlStats + _where + groupBy.detail + orderBy);
    var offices = await tricks.queryOffices(req.session.role, req.session.userid);
    var agents = await tricks.queryAgents(req.session.role, req.session.userid);
    var sites = await tricks.queryData("select * from site");
    res.render('stats', { 
      title: "Stats",
      navs: req.session.navs,
      user: req.session.username,
      role: req.session.role,
      offices: offices,
      agents: agents,
      sites: sites,
      stats: stats
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
