var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var title = tricks.getTitle(__filename);
    res.render('index', { 
      title: title,
      ofPath: title.toLowerCase()
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
