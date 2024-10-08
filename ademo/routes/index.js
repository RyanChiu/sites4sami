var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* GET home page. */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var title = "Home";
    var tips = req.query.tips;
    data = await tricks.queryData(
      "select * from news where id = (select max(id) from news);"
    );
    data1 = await tricks.queryData(
      "select * from news where id = (select min(id) from news);"
    );
    res.render('home', { 
      title: title,
      tips: tips,
      navs: req.session.navs,
      user: req.session.username,
      data: data,
      data1: data1,
      newags: req.session.iaNum
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
