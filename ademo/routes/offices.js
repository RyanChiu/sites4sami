var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var data = await tricks.queryData("select * from view_office");
    var title = tricks.getTitle(__filename);
    res.render('offices', { 
      title: title,
      data: data
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
