var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

/* render the page */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  async function renderIt(sql) {
    try {
        const data = await tricks.queryPromise(sql);
        res.render('agents', { title: 'Agents', data: data });
        console.log(data);
    } catch(error) {
        console.log(error);
    }
  }

  renderIt("select * from user where type = 3");

  //res.render('agents', { title: 'Agents', data: data });
  
});

module.exports = router;
