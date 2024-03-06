var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', function(req, res, next) {
  if (req.session && req.session.loggedin) {
    res.render('index', { title: "Approve Agents"});
    var title = "Approve Agents";
    res.render('home', { 
      title: title,
      navs: req.session.navs,
      user: req.session.username
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
