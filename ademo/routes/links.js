var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    var offices = await tricks.queryOffices(req.session.role, req.session.userid);
    var agents = await tricks.queryAgents(req.session.role, req.session.userid);
    var sites = await tricks.queryData("select id, name from site where status = 1 order by name");
    res.render('links', { 
      title: "Links",
      navs: req.session.navs,
      user: req.session.username,
      offices: offices,
      agents: agents,
      sites: sites,
      links: [],
      newags: req.session.iaNum
    });
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  let params = req.body;
  if (typeof(params.siteid) !== undefined && typeof(params.agent) !== undefined) {
    var sql = "select * from site where id = ?";
    var sites = await tricks.queryData(sql, [params.siteid]);
    var links = [];
    if (sites && sites.length != 0) {
      if (sites[0]["links"])
        for (let lnk of sites[0]["links"]) {
          let link = JSON.parse(lnk);
          //links.push('{"url": "' + link.url + '?sub1=__sub1__", "params": "' + tricks.cipherIt(link.url + "?sub2=" + params.agent) + '", "payout": ' + link.payout + ', "earning": ' + link.earning + '}');
          //var host = req.protocol + '://' + req.get('Host') + req.originalUrl;
          links.push('\
            {"param": "' + tricks.cipherIt(sites[0]["id"] + "," + link.abbr + "," + params.agent) 
              + '", "name": "' + link.name + '", "abbr": "' + link.abbr + '", "status": "' + link.status
              + '", "alias": "' + link.alias
              + '"}\
          ');
        }
    }
    // console.log("[debug from links with post:]"); console.log(sites[0]["links"]); //debug
    res.set('Content-Type', 'text/html');
    res.send({
      "rst": links
    })
  } else {
    res.set('Content-Type', 'text/html');
    res.send({
      "rst": "bad request."
    })
  }
});

module.exports = router;
