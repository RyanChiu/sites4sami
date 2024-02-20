var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

/* render the page */
router.get('/', async function(req, res, next) {
  var data = await tricks.queryData("select * from user where type = 2");
  res.render('admins', { title: 'Admins', data: data });

  //res.render('index', { title: tricks.getTitle(__filename)});
});

module.exports = router;
