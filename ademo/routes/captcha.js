var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);
var svgCaptcha = require('svg-captcha');
svgCaptcha.loadFont(__dirname + '/../public/webfonts/ArialRoundedBold.ttf');

/* GET captcha. */
router.get('/', function(req, res, next) {
    var captcha = svgCaptcha.createMathExpr( {
        noise: 3,
        color: false,
        fontSize: 60,
        background: "white",
        mathMin: 2,
        mathMax: 21
    });
    captcha.data = captcha.data.replace(/fill="#[A-Fa-f0-9]{6}"/g, 'fill="black" stroke="black" stroke-width="1"');
    req.session.captcha = captcha.text;
    //console.log("[z.debug.login]"); console.log(captcha.data);
    res.type('svg');
	res.status(200).send(captcha.data);
  });
  
  module.exports = router;
