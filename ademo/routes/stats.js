var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

var cols = [];
cols['detail'] = " convert(a.trxtime, date) as day, a.agentid, b.username as agent, \
  a.officeid, (select username from user where a.officeid = user.id) as office, a.siteid, c.name as site ";
cols['agent'] = " a.agentid, b.username as agent ";
cols['office'] = " a.officeid, (select username from user where a.officeid = user.id) as office ";
cols['day'] = " convert(a.trxtime, date) as day ";
var from = [];
from['detail'] = " from stats a, user b, site c ";
from['agent'] = " from stats a, user b "
from['office'] = "from stats a ";
from['day'] = " from stats a ";
var where = [];
where['detail'] = " where a.agentid = b.id and a.siteid = c.id ";
where['agent'] =  " where a.agentid = b.id ";
where['office'] = " where 1=1 ";
where['day'] = " where 1=1 ";
var groupBy = [];
groupBy['detail'] = " group by day, officeid, agentid, siteid ";
groupBy['agent'] =  " group by agentid ";
groupBy['office'] = " group by officeid ";
groupBy['day'] = " group by convert(a.trxtime, date) ";
var orderBy = [];
orderBy['detail'] = " order by day "; 
orderBy['agent'] = " order by agent ";
orderBy['office'] = " order by office ";
orderBy['day'] = " order by convert(a.trxtime, date) ";

/**
 * 
 * @param {*} byWhat only could be one of "detail, agent, office, day"
 */
function getStatsSql(byWhat, session, post_params = "") {
  var _where = "";
  switch (session.role) {
    case 0:
    case 1:
      break;
    case 2:
      _where += " and a.officeid = " + session.userid;
      break;
    case 3:
      _where += " and a.agentid = " + session.userid;
  }
  if (post_params !== "") {
    if (parseInt(post_params.selSite) !== -111) {
      _where += " and a.siteid = " + post_params.selSite;
    }
    if (parseInt(post_params.selOffice) !== -111) {
      _where += " and a.officeid = " + post_params.selOffice;
    }
    if (parseInt(post_params.selAgent) !== -111) {
      _where += " and a.agentid = " + post_params.selAgent;
    }
    var dates = post_params.datePeriod.split("-");
    dates[0] = dates[0].trim();
    dates[1] = dates[1].trim();
    _where += " and convert(a.trxtime, date) >= str_to_date('" 
      + dates[0] + "', '%m/%d/%Y') and convert(a.trxtime, date) <= str_to_date('" 
      + dates[1] + "', '%m/%d/%Y')";
  }
  var sqlStats = "\
    select " + cols[byWhat] + ", \
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
      sum(JSON_EXTRACT(a.sales9, '$[0]') * JSON_EXTRACT(a.sales9, '$[2]')) as sales_type9_earning "
      + from[byWhat]
      + where[byWhat] + _where
      + groupBy[byWhat]
      + orderBy[byWhat];
    return sqlStats;
}

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var title = tricks.getTitle(__filename);
    var offices = await tricks.queryOffices(req.session.role, req.session.userid);
    var agents = await tricks.queryAgents(req.session.role, req.session.userid);
    var sites = await tricks.queryData("select * from site");

    var stats = await tricks.queryData(getStatsSql('detail', req.session));
    res.render('stats', { 
      title: title,
      navs: req.session.navs,
      user: req.session.username,
      role: req.session.role,
      offices: offices,
      agents: agents,
      sites: sites,
      stats: stats,
      post_params: "",
      viewBy: 'detail'
    });
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  if (req.session && req.session.loggedin) {
    var params = req.body;
    var offices = await tricks.queryOffices(req.session.role, req.session.userid);
    var agents = await tricks.queryAgents(req.session.role, req.session.userid);
    var sites = await tricks.queryData("select * from site");
    var stats = await tricks.queryData(getStatsSql(params.iptViewBy, req.session, req.body));
    //res.send(getStatsSql(req.body.iptViewBy, req.session,  req.body) + JSON.stringify(params));
    res.render('stats', { 
      title: "Stats",
      navs: req.session.navs,
      user: req.session.username,
      role: req.session.role,
      offices: offices,
      agents: agents,
      sites: sites,
      stats: stats,
      post_params: params,
      viewBy: params.iptViewBy
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
