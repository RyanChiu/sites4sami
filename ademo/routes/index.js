var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('[z.debug]');
  console.log(req.session);
  res.render('index', { title: 'Home' });
});

module.exports = router;