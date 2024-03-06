var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var title = "Approve Agents";
    var data = await tricks.queryAgents(req.session.role, req.session.userid);
    console.log("[debug from get in approveagents:]");console.log(data); // debug
    res.render('approveagents', { 
      title: title,
      navs: req.session.navs,
      user: req.session.username,
      data: data
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
