var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', function(req, res, next) {
  if (req.session) {
    req.session.loggedin = false;
    req.session.username = '';
  } 
  res.render('login', { title: tricks.getTitle(__filename)});
});

module.exports = router;
