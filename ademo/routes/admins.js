var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin && req.session.role == 0) {
    var data = await tricks.queryData("select * from user where type = 1");
    var title = "Admins";
    res.render('admins', { 
      title: title,
      navs: req.session.navs,
      user: req.session.username,
      data: data,
      newags: req.session.iaNum
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
