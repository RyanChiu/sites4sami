var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin && req.session.role == 0) {
    var title = tricks.getTitle(__filename);
    let countries = await tricks.queryData("select * from country");
    var richOnes = [];
    for (let c of countries) {
      if (c["rich"] == 1) {
        richOnes.push(c["isoCode"]);
      }
    }
    res.render('settings', { 
      title: title,
      navs: req.session.navs,
      user: req.session.username,
      countries: countries,
      richOnes: richOnes
    });
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res, next) => {
  if (req.session && req.session.loggedin && req.session.role == 0) {
    var rst;
    if (req.body.iptCountries !== undefined) {
      await tricks.queryData("update country set rich = 0");
      rst = await tricks.queryData("update country set rich = 1 where isoCode in (?) ", [req.body.iptCountries]);
    } else {
      rst = await tricks.queryData("update country set rich = 0");
    }
    //console.log(`[debug from settings:]${JSON.stringify(rst)}`);
    res.redirect('settings');
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
