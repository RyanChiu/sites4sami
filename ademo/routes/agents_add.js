var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var title = "Add Agent";
    var data = await tricks.queryData("select id, username from user where type = 2");
    console.log(data);//debug
    res.render('agents_add', { 
      title: title,
      data: data,
      ofPath: "agents"
    });
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  if (req.session && req.session.loggedin) {
    var title = "Agents";
    var params = [
      req.body.selOffice, 
      req.body.ipt1stName, req.body.iptLstName, 
      req.body.iptUsername, req.body.iptPassword,
      req.body.txtNote
    ];
    var rst = await tricks.queryData(
      "insert into user (officeid, 1stname, lstname, username, password, pwd_crypted, type, status, note) values ("
        + params[0] + ", '" + params[1] + "', '" + params[2] + "', '" + params[3] + "', '" 
        + params[4] + "', '" + tricks.cryptIt(params[4]) + "', 3, 0, '" + params[5] + "')"
    );
    console.log(rst); //debug
    var data = await tricks.queryData("select * from view_agent");
    res.render('agents', { 
      title: title + "(" + params + ")",
      ofPath: title.toLowerCase(),
      data: data
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
