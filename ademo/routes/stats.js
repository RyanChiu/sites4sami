var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var title = tricks.getTitle(__filename);
    var offices = await tricks.queryOffices(req.session.role, req.session.userid);
    var agents = await tricks.queryAgents(req.session.role, req.session.userid);
    var sites = await tricks.queryData("select * from site");
    res.render('stats', { 
      title: title,
      navs: req.session.navs,
      user: req.session.username,
      offices: offices,
      agents: agents,
      sites: sites
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
