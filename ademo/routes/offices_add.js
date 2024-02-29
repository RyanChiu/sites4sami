var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var title = "Add Office";
    res.render('offices_add', { 
      title: title
    });
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  if (req.session && req.session.loggedin) {
    var title = "Offices";
    var params = [
      req.body.ipt1stName, req.body.iptLstName, 
      req.body.iptUsername, req.body.iptPassword,
      req.body.txtNote
    ];
    var rst = await tricks.queryData(
      "insert into user (1stname, lstname, username, password, pwd_crypted, type, status, note) values ('"
        + params[0] + "', '" + params[1] + "', '" + params[2] + "', '"
        + params[3] + "', '" + tricks.cryptIt(params[3]) + "', 2, 0, '" + params[4] + "')"
    );
    console.log(rst); //debug
    var data = await tricks.queryData("select * from view_office");
    res.render('offices', { 
      // title: title + "(" + params + ")",
      title: title,
      data: data
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;