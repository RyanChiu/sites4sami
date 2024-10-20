var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    if (req.session.role < 2) {
      var title = "", data;
      var params = tricks.getDwit(req.query);
      switch (params["op"]) {
        case "":
        case "add":
          title = "Add Office";
          data = "";
          res.render('offices_dwit', {
            title: title,
            navs: req.session.navs,
            user: req.session.username,
            data: data
          })
          break;
        case "edit":
          title = "Edit Office";
          data = await tricks.queryData("select * from view_office where id = ?", params["id"]);
          res.render('offices_dwit', {
            title: title,
            navs: req.session.navs,
            user: req.session.username,
            data: data
          })
          break;
      }
      res.render('offices_dwit', { 
        title: title,
        navs: req.session.navs,
        user: req.session.username,
        data: ""
      });
    } else {
      res.redirect('home?tips=Not allowed.');
    }
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  if (req.session && req.session.loggedin) {
    if (req.session.role < 2) {
      var title = "Offices";
      var params = [];
      var rst = null, sql = "";
      if (req.body.submitType == "add") {
        sql = "insert into user (1stname, lstname, username, password, pwd_crypted, type, status, note) values ("
          + "?, ?, ?, ?, ?, 2, ?, ?)";
        params = [
          req.body.ipt1stName, req.body.iptLstName, 
          req.body.iptUsername, req.body.iptPassword, tricks.cryptIt(req.body.iptPassword),
          (req.body.chkStatus == 1 ? 1 : 0), req.body.txtNote
        ];
        rst = await tricks.queryData(sql, params);
      } else if (req.body.submitType == "edit") {
        sql = "update user set 1stname = ?, lstname = ?, username = ?, password = ?, pwd_crypted = ?, note = ?, status = ? where id = ?";
        params = [
          req.body.ipt1stName, req.body.iptLstName, 
          req.body.iptUsername, req.body.iptPassword, tricks.cryptIt(req.body.iptPassword),
          req.body.txtNote, req.body.chkStatus == 1 ? 1: 0, parseInt(req.body.iptId) 
        ];
        rst = await tricks.queryData(sql, params);
      } else if (req.body.submitType == "ajax_edit") {
        sql = "update user set 1stname = ?, lstname = ?, username = ?, password = ?, pwd_crypted = ?, note = ?, status = ? where id = ?";
        params = [
          req.body.ipt1stName, req.body.iptLstName, 
          req.body.iptUsername, req.body.iptPassword, tricks.cryptIt(req.body.iptPassword),
          req.body.txtNote, req.body.chkStatus == 1 ? 1: 0, parseInt(req.body.iptId) 
        ];
        rst = await tricks.queryData(sql, params);
        // set selected sites for all the agents of the office
        sql = "update user set sites = JSON_ARRAY(" + req.body.selSites + ") where type = 3 and officeid = ?";
        await tricks.queryData(sql, [parseInt(req.body.iptId)]);
        res.set('Content-Type', 'text/html');
        if (rst) {
          res.send({
            "rst": 1
          })
        } else {
          res.send({
            "rst": 0
          })
        }
      } else if (req.body.submitType == "ajax_hide") {
        var st;
        if (req.body.hidden.toString() === "true") st = -1;
        else st = 1;
        sql = "update user set status = ? where id = ?";
        rst = await tricks.queryData(sql, [st, req.body.officeid]);
        // console.log(`[debug from offices_dwit(ajax_hid):]with status is:${st}("hidden":${req.body.hidden})`);
        res.set('Content-Type', 'text/html');
        if (rst) {
          res.send({
            "rst": 1
          })
        } else {
          res.send({
            "rst": 0
          })
        }
      }
      // console.log(rst); //debug
      var data = await tricks.queryOffices(req.session.role, req.session.userid);
      res.render('offices', { 
        // title: title + "(" + params + ")",
        title: title,
        navs: req.session.navs,
        user: req.session.username,
        data: data
      });
    } else {
      res.redirect('home?tips=Not allowed.');
    }
  } else {
    res.redirect('logout');
  }
});

module.exports = router;