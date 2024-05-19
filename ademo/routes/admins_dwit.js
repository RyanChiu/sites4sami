/**
 * Deal Whih It, D W I
 */
var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
    if (req.session && req.session.loggedin && req.session.role == 0) {
      var title = "Admins";
      var id = req.query["id"];
      var data = await tricks.queryData("select * from user where id = ?", [id]);
      console.log("[debug from get in admins_dwit:]"); console.log(req.query); console.log(data); // debug
      res.render('admins_dwit', { 
        title: title,
        navs: req.session.navs,
        user: req.session.username,
        data: data
      });
    } else {
        res.redirect('logout');
    }
});

/* deal with post data */
router.post('/', async (req, res) => {
    if (req.session && req.session.loggedin && req.session.role == 0) {
        var title = "Admins";
        var params = [];
        var rst = null;
        var sql = "";
        if (req.body.submitType == "add") {
            sql = "insert into user (1stname, lstname, username, password, pwd_crypted, type, status, note) values ("
                + "'', '', ?, ?, ?, 1, 1, '')";
            params = [
                req.body.iptUsername,
                req.body.iptPassword, tricks.cryptIt(req.body.iptPassword)
            ];
            rst = await tricks.queryData(sql, params);
        } else if (req.body.submitType == "edit") {
            sql = "update user set username = ?, password = ?, pwd_crypted = ?"
                + " where id = ?";
            params = [
                req.body.iptUsername,
                req.body.iptPassword, tricks.cryptIt(req.body.iptPassword),
                parseInt(req.body.iptId)
            ];
            rst = await tricks.queryData(sql, params);
        } else if (req.body.submitType == "ajax_hide") {
            var st;
            if (req.body.hidden.toString() === "true") st = 2;
            else st = 1;
            sql = "update user set status = ? where id = ?";
            rst = await tricks.queryData(sql, [st, req.body.adminid]);
            console.log(`[debug from admins_dwit(ajax_hid):]with status is:${st}("hidden":${req.body.hidden})`);
            res.set('Content-Type', 'text/html');
            if (rst) {
              res.send({
                "rst": 1
              })
            } else {
              res.send({
                "rst": 2
              })
            }
          }
        var data = await tricks.queryData("select * from user where type = 1");
        console.log("[debug from post in admins_dwit:]"); console.log(req.query); console.log(data); // debug
        res.render('admins', { 
            title: title,
            navs: req.session.navs,
            user: req.session.username,
            data: data
        });
    } else {
        res.redirect('logout');
    }
});

module.exports = router;