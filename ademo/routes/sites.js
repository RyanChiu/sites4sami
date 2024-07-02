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
        "select *, JSON_LENGTH(links) as lksamount from site order by status desc, name asc"
      );
      var sites = [];
      if (data && data.length != 0 && data[0]["links"])
        for (let row of data) {
          var lnks = "[" + row["links"] + "]";
          // console.log(`[debug from sites page in get(0):]${row["links"]}`);
          // console.log(`[debug from sites page in get(1):]${lnks}`);
          var _links = JSON.parse(lnks);
          row["links_json"] = [];
          for (let _link of _links) {
            row["links_json"].push(_link);
          }
          //row["links_json"] = links;
          sites.push(row);
          /*
          var links = [];
          for (let lnk of row["links"]) {
            var link = JSON.parse(lnk);
            links.push(link);
          }
          row["lnks"] = links;
          sites.push(row);
          */
        }
      res.render('sites', { 
        title: title,
        navs: req.session.navs,
        user: req.session.username,
        role: req.session.role,
        data: sites
      });
    } else {
      res.redirect('home?tips=Not allowed.');
    }
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
