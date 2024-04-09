var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var data = await tricks.queryLogs(req.session.role, req.session.userid);
    var data1 = await tricks.queryHitlogs(req.session.role, req.session.userid);
    res.render('logs', { 
      title: "Logs",
      navs: req.session.navs,
      user: req.session.username,
      role: req.session.role,
      data: data,
      data1: data1,
      tab: 0
    });
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  if (req.session && req.session.loggedin) {
    var data = data1 = [];
    var tab = 0;
    if (req.body.iptUsername != undefined) {
      data = await tricks.queryLogs(
        req.session.role, req.session.userid, 
        "username like '%" + req.body.iptUsername + "%'"
      );
      tab = 0;
    }
    if (req.body.iptUsername1 != undefined) {
      data1 = await tricks.queryHitlogs(
        req.session.role, req.session.userid, 
        "agent like '%" + req.body.iptUsername1 + "%'"
      );
      tab = 1;
    }
    res.render('logs', { 
      title: "Logs",
      navs: req.session.navs,
      user: req.session.username,
      role: req.session.role,
      data: data,
      data1: data1,
      tab: tab
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
