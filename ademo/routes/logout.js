var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

/* render the page */
router.get('/', function(req, res, next) {
  res.render('login', { title: tricks.getTitle(__filename)});
});

module.exports = router;
