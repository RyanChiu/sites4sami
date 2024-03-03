var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var params = req.query;
    console.log("params from get:"); console.log(params); // debug
    if (JSON.stringify(params) == '{}') {
      var data = await tricks.queryData("select * from view_agent");
      var offices = await tricks.queryData("select id, username from user where type = 2");
      var title = "Agents";
      res.render('agents', { 
        title: title,
        offices: offices,
        data: data
      });
    } else {
      res.render('home', { 
        
      });
    }
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  if (req.session && req.session.loggedin) {
    var offices = await tricks.queryData("select id, username from user where type = 2");
    var title = "Agents";
    var params = [
      req.body.selOffice, 
      req.body.iptAgent,
      req.body.iptStatus
    ];
    var sql = "select * from view_agent"
      + " where office = '" + params[0] + "'"
      + "   and username like '%" + params[1] + "%'"
    if (params[2] !== "-111")
      sql += "   and status = " + params[2] + ";"
    console.log(sql); // debug
    var data = await tricks.queryData(sql);
    res.render('agents', { 
      title: title,
      params: params,
      offices: offices,
      data: data
    });
  } else {
    res.redirect('logout');
  }
})

module.exports = router;
