var express = require('express');
var router = express.Router();
const net = require('net');
const mysql = require('mysql2');

/* GET agents listing. */
var con = mysql.createConnection({
	host: "localhost",
	user: "sami",
	password: "4sites0fsami",
	database: "gwr",
	stream: net.connect('/var/run/mysqld/mysqld.sock')
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});

/* render the page */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  var data = null;
  con.query("select * from user", function(err, result) {
    if (err) throw err;
    data = result;
    console.log(result);
    res.render('agents', { title: 'Agents', data: data });
  });

  //res.render('agents', { title: 'Agents', data: data });
  
});

module.exports = router;
