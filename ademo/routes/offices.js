var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var data = await tricks.queryData("select * from user where type = 2");
    var title = tricks.getTitle(__filename);
    res.render('admins', { 
      title: title,
      ofPath: title.toLowerCase()
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
