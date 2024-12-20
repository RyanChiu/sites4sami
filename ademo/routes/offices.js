var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    if (req.session.role < 2 && req.session.role >= 0) {
      var sites = await tricks.querySites();
      var data = await tricks.queryOffices(req.session.role, req.session.userid);
      var assites = {};
      for (let offi of data) {
        assites[offi["id"]] = await tricks.queryAssignedSites4Offi(offi["id"]);
      }
      var title = tricks.getTitle(__filename);
      res.render('offices', { 
        title: title,
        navs: req.session.navs,
        user: req.session.username,
        role: req.session.role,
        sites: sites,
        assites: assites,
        data: data,
        newags: req.session.iaNum
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
  if (req.session && req.session.loggedin) {
    if (req.session.role < 2) {
      var title = "Offices";
      var params = [
        "%" + req.body.iptOffice + "%"
      ];
      var sql = "select * from view_office where username like ? order by username";
      var sites = await tricks.querySites();
      var data = await tricks.queryData(sql, [params[0]]);
      // console.log("[debug from post in offices:]"); console.log(data); // debug
      res.render('offices', {
        title: title,
        navs: req.session.navs,
        user: req.session.username,
        role: req.session.role,
        sites: sites,
        data: data,
        newags: req.session.iaNum
      })
    } else {
      res.redirect('home?tips=Not allowed.');
    }
  } else {
    res.redirect('logout');
  }
})

module.exports = router;
