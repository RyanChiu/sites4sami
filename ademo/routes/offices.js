var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

/* render the page */
router.get('/', function(req, res, next) {
  async function renderIt(sql) {
    try {
        const data = await tricks.queryPromise(sql);
        res.render('offices', { title: 'Offices', data: data });
        console.log(data);
    } catch(error) {
        console.log(error);
    }
  }

  renderIt("select * from user where type = 2");

  //res.render('index', { title: tricks.getTitle(__filename)});
});

module.exports = router;
