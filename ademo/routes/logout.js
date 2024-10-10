var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);
var svgCaptcha = require('svg-captcha');

/* render the page */
router.get('/', async function(req, res, next) {
  var captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;
  // console.log("[z.debug.logout]"); console.log(captcha.text);

  if (req.session && req.session.loggedin) {
    req.session.loggedin = false;
    req.session.username = '';
    var rst = await tricks.queryData(
      "update log set outtime = str_to_date(?, '%m/%d/%Y, %h:%i:%s %p') where id = ?",
      [
        tricks.currentNewYorkTime(),
        req.session.loginsertid
      ]
    );
    req.session.userid = -1;
    req.session.iaNum = null;
    // console.log(["debug from logout page:"]); console.log(rst); // debug
  } 
  res.render('login', { 
    title: "",//tricks.getTitle(__filename),
    tag: '',
    captcha: captcha.data
  });
});

module.exports = router;
