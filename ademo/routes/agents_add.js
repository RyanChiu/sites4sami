var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', function(req, res, next) {
  res.render('agents_add', { 
    title: tricks.getTitle(__filename),
  });
  
  if (req.session && req.session.loggedin) {
    var title = "Add Agent";
    res.render('agents_add', { 
      title: title,
      tag: "agents"
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
