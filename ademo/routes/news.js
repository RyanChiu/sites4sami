var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var title = tricks.getTitle(__filename);
    var data = "";
    if (req.session.role !== 0) {
      res.redirect('home');
    } else {
      data = await tricks.queryData(
        "select * from news where id = (select max(id) from news);"
      );
    }
    res.render('news', { 
      title: title,
      navs: req.session.navs,
      user: req.session.username,
      data: data
    });
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  if (req.session && req.session.loggedin && req.session.role == 0) {
    var rst = null, data = null;
    rst = await tricks.queryData(
      "update news set content = ? where id = ?", 
      [req.body.joitNews, req.body.iptId]
    )
    console.log("[debug from update in news page:]"); console.log(rst); // debug
    data = await tricks.queryData(
      "select * from news where id = ?;", req.body.iptId
    );
    res.render('home', { 
      title: "Home",
      navs: req.session.navs,
      user: req.session.username,
      data: data
    });
  } else {
    res.redirect('logout');
  }
})

module.exports = router;
