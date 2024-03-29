/**
 * Deal Whih It, D W I
 */
var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    if (req.session.role == 3) {
      res.redirect('home?tips=Now allowed.');
    }
    var params = req.query;
    console.log("params from get:"); console.log(params); // debug
    var paramOp = "", paramId = "", paramRef = null;
    if (JSON.stringify(params) == '{}' 
      || typeof(params["op"]) == "undefined" 
      || typeof(params["id"]) == "undefined") {
      paramOp = "add";
    } else {
      paramOp = params["op"];
      paramId = params["id"];
      paramRef = params["ref"];
    }
    var title, data, offices, status = null;
    offices = await tricks.queryOffices(req.session.role, req.session.userid);
    console.log("debug[add agent]"); console.log(offices); //debug
    switch (paramOp) {
      case "":
      case "add":
        title = "Add Agent";
        data = "";
        res.render('agents_dwit', { 
          title: title,
          navs: req.session.navs,
          user: req.session.username,
          offices: offices,
          data: data
        });
        break;
      case "edit":
        title = "Edit Agent";
        data = await tricks.queryData("select * from view_agent where id = ?", paramId);
        var offices_edit = [{"id" : "", "username" : ""}];
        for (var i = 0, len = offices.length; i < len; i++) {
          if (offices[i]["username"] == data[0]["office"]) {
            offices_edit[0]["id"] = offices[i]["id"];
            offices_edit[0]["username"] = offices[i]["username"];
          }
        } 
        console.log("data for edit agent:"); console.log(data); // debug
        res.render('agents_dwit', { 
          title: title,
          navs: req.session.navs,
          user: req.session.username,
          offices: offices_edit,
          data: data
        });
        break;
      case "approve":
        status = 1;
        break;
      case "suspend":
        status = -1;
        break;
      case "hide":
        status = -2;
        break;
      default:
        res.render('home', {
          title: "It seems sth. went south...",
          navs: req.session.navs
        })
        break;
    }
    if (status !== null) {
      title = "Agents";
      await tricks.queryData("update user set status = ? where id = ?", [status, paramId]);
      data = await tricks.queryAgents(req.session.role, req.session.userid);
      if (paramRef) {
        res.render('approveagents', { 
          title: title,
          navs: req.session.navs,
          user: req.session.username,
          data: data
        });
      } else {
        res.render('agents', { 
          title: title,
          navs: req.session.navs,
          user: req.session.username,
          offices: offices,
          data: data
        });
      }
    }
  } else {
    res.redirect('logout');
  }
});

/* deal with post data */
router.post('/', async (req, res) => {
  if (req.session && req.session.loggedin) {
    if (req.session.role == 3) {
      res.redirect('home?tips=Now allowed.');
    }
    var title = "Agents";
    var params = [];
    console.log("[debug for agent_dwit post] params:"); console.log(params); // debug
    var rst = null;
    var sql = "";
    if (req.body.submitType == "add") {
      /*
      sql = "insert into user (officeid, 1stname, lstname, username, password, pwd_crypted, type, status, note) values ("
        + params[0] + ", '" + params[1] + "', '" + params[2] + "', '" + params[3] + "', '" 
        + params[4] + "', '" + tricks.cryptIt(params[4]) + "', 3, 0, '" + params[5] + "')";
      rst = await tricks.queryData(sql);
      */
      sql = "insert into user (officeid, 1stname, lstname, username, password, pwd_crypted, type, status, note) values ("
        + "?, ?, ?, ?, ?, ?, 3, 0, ?)";
      params = [
        parseInt(req.body.selOffice), 
        req.body.ipt1stName, req.body.iptLstName, 
        req.body.iptUsername, req.body.iptPassword, tricks.cryptIt(req.body.iptPassword),
        req.body.txtNote
      ];
      rst = await tricks.queryData(sql, params);
    } else if (req.body.submitType == "edit") {
      /*
      sql = "update user set 1stname = '" + params[1] + "', lstname = '" + params[2] + "', username = '" + params[3] + "', "
        + "password = '" + params[4] + "', pwd_crypted = '" + tricks.cryptIt(params[4]) + "', "
        + "note = '" + params[5] + "', status = " + (params[6] == 1 ? 1 : 0)
        + " where id = " + params[7] + "";
      rst = await tricks.queryData(sql);
      */
      sql = "update user set 1stname = ?, lstname = ?, username = ?, "
        + "password = ?, pwd_crypted = ?, note = ?, status = ? where id = ?";
      params = [
        req.body.ipt1stName, req.body.iptLstName, 
        req.body.iptUsername, req.body.iptPassword, tricks.cryptIt(req.body.iptPassword),
        req.body.txtNote, req.body.chkStatus == 1 ? 1 : 0, parseInt(req.body.iptId)
      ];
      rst = await tricks.queryData(sql, params);
    }
    console.log("[debug for agent_dwit db op] rst/sql:"); console.log(rst); console.log(sql); console.log(params) //debug
    var offices = await tricks.queryOffices(req.session.role, req.session.userid);
    var data = await tricks.queryAgents(req.session.role, req.session.userid);
    res.render('agents', { 
      title: title,
      navs: req.session.navs,
      user: req.session.username,
      offices: offices,
      data: data
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
