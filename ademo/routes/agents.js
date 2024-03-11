var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    if (req.session.role == 3) {
      res.redirect('home?tips=Now allowed.');
    }
    var params = req.query;
    var title = "Agents", data = null, offices = null;
    console.log("[debug] params/session from get:"); console.log(params); console.log(req.session); // debug
    if (JSON.stringify(params) == '{}' || !params.office || isNaN(params.office)) {
      data = await tricks.queryAgents(req.session.role, req.session.userid); //queryData("select * from view_agent");
      offices = await tricks.queryOffices(req.session.role, req.session.userid);
      if (JSON.stringify(params) !== '{}' && (!params.office || isNaN(params.office))) {
        var data0 = [];
        var offices0 = [];
        for (let row of data) {
          if (row.office == params.office) data0.push(row);
        }
        for (let row of offices) {
          if (row.username == params.office) offices0.push(row);
        }
        data = data0;
        offices = offices0;
      }
      console.log("[debug 202403091456]:"); console.log(offices0); console.log(data0); //debug
      res.render('agents', { 
        title: title,
        navs: req.session.navs,
        user: req.session.username,
        offices: offices,
        data: data
      });
    } else {
      title = "Home";
      res.render('home', { 
        title: title,
        navs: req.session.navs,
        user: req.session.username
      });
    }
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  if (req.session && req.session.loggedin) {
    if (req.session.role == 3) {
      res.redirect('home?tips=Now allowed.');
    }
    var title = "Agents";
    var offices = await tricks.queryOffices(req.session.role, req.session.userid);
    var params = [
      req.body.selOffice, 
      req.body.iptAgent,
      req.body.iptStatus
    ];
    var sql = "select * from view_agent where office = ? and username like '%" + params[1] + "%'";
    var data = null;
    if (params[2] !== "-111") {
      sql += " and status = ?;";
      data = await tricks.queryData(sql, [params[0], params[2]]);
    } else {
      data = await tricks.queryData(sql, [params[0]]);
    }
    console.log("[debug] sql for agent search:"); console.log(sql); // debug
    
    res.render('agents', { 
      title: title,
      navs: req.session.navs,
      params: params,
      user: req.session.username,
      offices: offices,
      data: data
    });
  } else {
    res.redirect('logout');
  }
})

module.exports = router;
