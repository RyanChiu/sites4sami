var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var title = "Home";
    res.render('index', { 
      title: title,
      ofPath: title.toLowerCase()
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
