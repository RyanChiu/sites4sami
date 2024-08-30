var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    if (req.session.role == 0) {
      var title = tricks.getTitle(__filename);
      var data = "";
      if (req.session.role !== 0) {
        res.redirect('home');
      } else {
        data = await tricks.queryData(
          "select * from news where id = (select max(id) from news);"
        );
        data1 = await tricks.queryData(
          "select * from news where id = (select min(id) from news);"
        );
      }
      res.render('news', { 
        title: title,
        navs: req.session.navs,
        user: req.session.username,
        data: data,
        data1: data1,
        tipDoing: "Uploading"
      });
    } else {
      res.redirect('home?tips=Not allowed.');
    }
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  if (req.session && req.session.loggedin && req.session.role == 0) {
    var rst = null, data = null, data1 = null;
    var content, content1;
    if (req.body.iptCurTab == 0) {
      content = req.body.joditNews;
      content1 = req.body.iptData1;
    } else if (req.body.iptCurTab == 1) {
      content1 = req.body.joditNews;
      content = req.body.iptData1;
    }
    rst = await tricks.queryData(
      "update news set content = ? where id = ?", 
      [content, req.body.iptId]
    );
    rst = await tricks.queryData(
      "update news set content = ? where id = ?", 
      [content1, req.body.iptId1]
    )
    console.log("[debug from update in news page:]"); console.log(rst); // debug
    data = await tricks.queryData(
      "select * from news where id = ?;", req.body.iptId
    );
    data1 = await tricks.queryData(
      "select * from news where id = ?;", req.body.iptId1
    );
    res.render('home', { 
      title: "Home",
      navs: req.session.navs,
      user: req.session.username,
      data: data,
      data1: data1,
      tipDoing: "Uploading"
    });
  } else {
    res.redirect('logout');
  }
})

module.exports = router;
