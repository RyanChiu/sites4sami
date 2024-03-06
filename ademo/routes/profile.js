var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var title = tricks.getTitle(__filename);
    var data = await tricks.queryData(
      "select * from user where id = ?",
      [req.session.userid]
    );
    res.render('profile', { 
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
  if (req.session && req.session.loggedin) {
    var sql = "update user set 1stname = ?, lstname = ?, username = ?, "
      + "password = ?, pwd_crypted = ? where id = ?";
    var params = [
      req.body.ipt1stName, req.body.iptLstName, req.body.iptUsername,
      req.body.iptPassword, tricks.cryptIt(req.body.iptPassword),
      parseInt(req.body.iptId)
    ]
    var rst = await tricks.queryData(sql, params);
    res.redirect('home');
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
