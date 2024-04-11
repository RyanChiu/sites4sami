var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);
var svgCaptcha = require('svg-captcha');

/* GET captcha. */
router.get('/', function(req, res, next) {
    var captcha = svgCaptcha.createMathExpr( {
        noise: 1,
        color: true,
        mathMin: 2,
        mathMax: 21
    });
    req.session.captcha = captcha.text;
    //console.log("[z.debug.login]"); console.log(captcha.data);
    res.type('svg');
	res.status(200).send(captcha.data);
  });
  
  module.exports = router;