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
      res.redirect('home?tips=Not allowed.');
    }
    var params = req.query;
    // console.log("params from get:"); console.log(params); // debug
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
    var title, data, offices, sites, status = null;
    offices = await tricks.queryOffices(req.session.role, req.session.userid);
    sites = await tricks.querySites();
    // console.log("debug[add agent]"); console.log(offices); //debug
    switch (paramOp) {
      case "":
      case "add":
        title = "Add Agent";
        data = "";
        res.render('agents_dwit', { 
          title: title,
          navs: req.session.navs,
          user: req.session.username,
          role: req.session.role,
          offices: offices,
          sites: sites,
          data: data,
          newags: req.session.iaNum
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
        // console.log("data for edit agent:"); console.log(data); // debug
        res.render('agents_dwit', { 
          title: title,
          navs: req.session.navs,
          user: req.session.username,
          role: req.session.role,
          offices: offices_edit,
          sites: sites,
          data: data,
          newags: req.session.iaNum
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
          navs: req.session.navs,
          newags: req.session.iaNum
        })
        break;
    }
    if (status !== null) {
      title = "Agents";
      await tricks.queryData("update user set status = ? where id = ?", [status, paramId]);
      data = await tricks.queryAgents(req.session.role, req.session.userid);

      //save the new agents number to session
      var newags = await tricks.queryAgents(req.session.role, req.session.userid, " status = 0");
      req.session.iaNum = newags.length;
      console.log(`[debug from agents_dwit(get method):<how many unapproved>] ${req.session.iaNum}`);

      if (paramRef) {
        res.render('approveagents', { 
          title: title,
          navs: req.session.navs,
          user: req.session.username,
          data: data,
          newags: req.session.iaNum
        });
      } else {
        res.render('agents', { 
          title: title,
          navs: req.session.navs,
          user: req.session.username,
          offices: offices,
          data: data,
          newags: req.session.iaNum
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
      res.redirect('home?tips=Not allowed.');
    }
    var title = "Agents";
    var params = [];
    let iptSites = req.body.iptSites;
    // console.log(`[debug from agents_dwit(update):]${JSON.stringify(req.body)}`);
    req.body.iptSites = [];
    if (iptSites != undefined) {
      for (let iptSite of iptSites) {
        req.body.iptSites.push(parseInt(iptSite))
      }
      iptSites = '"[' + req.body.iptSites.join(",") + ']"';
    } else {
      iptSites= '"[]"';
    }
    var rst = null;
    var sql = "";
    if (req.body.submitType == "add") {
      /*
      sql = "insert into user (officeid, 1stname, lstname, username, password, pwd_crypted, type, status, note) values ("
        + params[0] + ", '" + params[1] + "', '" + params[2] + "', '" + params[3] + "', '" 
        + params[4] + "', '" + tricks.cryptIt(params[4]) + "', 3, 0, '" + params[5] + "')";
      rst = await tricks.queryData(sql);
      */
      sql = "insert into user (officeid, 1stname, lstname, username, password, pwd_crypted, type, status, note, sites) values ("
        + "?, ?, ?, ?, ?, ?, 3, 0, ?, ?)";
      params = [
        parseInt(req.body.selOffice), 
        req.body.ipt1stName, req.body.iptLstName, 
        req.body.iptUsername, req.body.iptPassword, tricks.cryptIt(req.body.iptPassword),
        req.body.txtNote, iptSites
      ];
      rst = await tricks.queryData(sql, params);

      //save the new agents number to session
      var newags = await tricks.queryAgents(req.session.role, req.session.userid, " status = 0");
      req.session.iaNum = newags.length;
      console.log(`[debug from agents_dwit(post method "add"):<how many unapproved>] ${req.session.iaNum}`);

    } else if (req.body.submitType == "edit") { // basically will be never used, this very block
      /*
      sql = "update user set 1stname = '" + params[1] + "', lstname = '" + params[2] + "', username = '" + params[3] + "', "
        + "password = '" + params[4] + "', pwd_crypted = '" + tricks.cryptIt(params[4]) + "', "
        + "note = '" + params[5] + "', status = " + (params[6] == 1 ? 1 : 0)
        + " where id = " + params[7] + "";
      rst = await tricks.queryData(sql);
      */
      sql = "update user set 1stname = ?, lstname = ?, username = ?, "
        + "password = ?, pwd_crypted = ?, note = ?, status = ?, sites = ? where id = ?";
      params = [
        req.body.ipt1stName, req.body.iptLstName, 
        req.body.iptUsername, req.body.iptPassword, tricks.cryptIt(req.body.iptPassword),
        req.body.txtNote, req.body.chkStatus == 1 ? 1 : 0, iptSites,
        parseInt(req.body.iptId)
      ];
      rst = await tricks.queryData(sql, params);
    } else if (req.body.submitType == "ajax_edit_") {
      let ags = await tricks.queryAgents(req.session.role, req.session.userid, " id = " + req.body.iptId);
      res.set('Content-Type', 'text/html');
      if (ags) {
        res.send({
          "rst": 1,
          "ags": ags[0]
        })
      } else {
        res.send({
          "rst": 0
        })
      }
    } else if (req.body.submitType == "ajax_edit") {
      sql = "update user set officeid = ?, 1stname = ?, lstname = ?, username = ?, "
        + "password = ?, pwd_crypted = ?, note = ?, status = ?, sites = JSON_ARRAY(" + req.body.selSites + ") where id = ?";
      params = [
        parseInt(req.body.selOffice), req.body.ipt1stName, req.body.iptLstName, 
        req.body.iptUsername, req.body.iptPassword, tricks.cryptIt(req.body.iptPassword),
        req.body.txtNote, parseInt(req.body.chkStatus) == 1 ? 1 : 0,
        parseInt(req.body.iptId)
      ];
      rst = await tricks.queryData(sql, params);

      //save the new agents number to session
      var newags = await tricks.queryAgents(req.session.role, req.session.userid, " status = 0");
      req.session.iaNum = newags.length;
      console.log(`[debug from agents_dwit(ajax_edit):<how many unapproved>] ${req.session.iaNum}`);
      
      res.set('Content-Type', 'text/html');
      if (rst) {
        res.send({
          "rst": 1,
          "newags": newags.length
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
      rst = await tricks.queryData(sql, [st, req.body.agentid]);
      // console.log(`[debug from agents_dwit(ajax_hide):]with status is:${st}("hidden":${req.body.hidden})`);

      //save the new agents number to session
      var newags = await tricks.queryAgents(req.session.role, req.session.userid, " status = 0");
      req.session.iaNum = newags.length;
      console.log(`[debug from agents_dwit(ajax_hide):<how many unapproved>] ${req.session.iaNum}`);

      res.set('Content-Type', 'text/html');
      if (rst) {
        res.send({
          "rst": 1,
          "newags": newags.length
        })
      } else {
        res.send({
          "rst": 0
        })
      }
    } else if (req.body.submitType == "ajax_approve") {
      var st;
      if (req.body.approved.toString() === "true") st = 1;
      else st = 0;
      sql = "update user set status = ? where id = ?";
      rst = await tricks.queryData(sql, [st, req.body.agentid]);
      // console.log(`[debug from agents_dwit(ajax_approve):]with status is:${st}("approved":${req.body.approved})`);

      //save the new agents number to session
      var newags = await tricks.queryAgents(req.session.role, req.session.userid, " status = 0");
      req.session.iaNum = newags.length;
      console.log(`[debug from agents_dwit(ajax_approve):<how many unapproved>] ${req.session.iaNum}`);

      res.set('Content-Type', 'text/html');
      if (rst) {
        res.send({
          "rst": 1,
          "newags": newags.length
        })
      } else {
        res.send({
          "rst": 0
        })
      }
    }
    // console.log("[debug for agents_dwit db op] rst/body:"); console.log(rst); console.log(req.body); //debug
    var offices = await tricks.queryOffices(req.session.role, req.session.userid);
    var data = await tricks.queryAgents(req.session.role, req.session.userid);

    res.render('agents', { 
      title: title,
      navs: req.session.navs,
      user: req.session.username,
      offices: offices,
      data: data,
      newags: req.session.iaNum
    });
  } else {
    res.redirect('logout');
  }
});

module.exports = router;
