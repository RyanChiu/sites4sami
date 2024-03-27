var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var data = await tricks.queryLogs(req.session.role, req.session.userid)
    res.render('logs', { 
      title: "Logs",
      navs: req.session.navs,
      user: req.session.username,
      data: data
    });
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  if (req.session && req.session.loggedin) {
    var data = await tricks.queryLogs(
      req.session.role, req.session.userid, 
      "username like '%" + req.body.iptUsername + "%'"
    );
    res.render('logs', { 
      title: "Logs",
      navs: req.session.navs,
      user: req.session.username,
      data: data
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
