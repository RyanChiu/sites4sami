var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    if ((req.session.role == 0 || req.session.role == 1)) {
      var title = tricks.getTitle(__filename);
      var data = await tricks.queryData(
        "select *, JSON_LENGTH(links) as lksamount from site"
      );
      res.render('sites', { 
        title: title,
        navs: req.session.navs,
        user: req.session.username,
        data: data
      });
    } else {
      res.redirect('home?tips=Not allowed.');
    }
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
