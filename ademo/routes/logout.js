var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);
var svgCaptcha = require('svg-captcha');

/* render the page */
router.get('/', async function(req, res, next) {
  var captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;
  console.log("[z.debug.logout]"); console.log(captcha.text);

  if (req.session) {
    req.session.loggedin = false;
    req.session.username = '';
    await tricks.queryData(
      "insert into log (userid, type) values (" + req.session.userid + ", 0)"
    );
    req.session.userid = -1;
  } 
  res.render('login', { 
    title: tricks.getTitle(__filename),
    tag: '',
    captcha: captcha.data
  });
});

module.exports = router;
