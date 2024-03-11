var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
  if (req.session && req.session.loggedin) {
    if (req.session.role == 0) {
        var params = req.query, paramOp = "", paramId = "";
        if (JSON.stringify(params) == '{}'
            || typeof(params["op"]) == "undefined" 
            || typeof(params["id"]) == "undefined"
        ) {
            paramOp = "add";
        } else {
            paramOp = params["op"];
            paramId = params["id"];
        }
        var data;
        if (paramOp == "add") {
            data = "";
        } else if (paramOp == "edit") {
            data = await tricks.queryData(
                "select * from site where id = ?", req.query.id
            );
        } else {
            res.redirect('sites');
        }
        res.render('sites_dwit', { 
        title: "Sites",
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

/* deal with post data */
router.post('/', async (req, res) => {
    if (req.session && req.session.loggedin) {
        if (req.session.role == 0) {
            var params = [], rst = null, sql = "";
            if (req.body.submitType == "add") {
                sql = "insert into site"
                    + " (name, short, abbr, url, clickparam, type, status)"
                    + " values (?, ?, ?, ?, ?, ?, ?)";
                params = [
                    req.body.iptName, req.body.iptShort, req.body.iptAbbr, req.body.iptUrl,
                    req.body.iptClickparam, req.body.iptType, req.body.chkStatus
                ];
                rst = await tricks.queryData(sql, params);
            } else if (req.body.submitType = "edit") {
                sql = "update site"
                    + " set name = ?, short = ?, abbr = ?, url = ?,"
                    + " clickparam = ?, type = ?, status = ?"
                    + " where id = ?";
                params = [
                    req.body.iptName, req.body.iptShort, req.body.iptAbbr, req.body.iptUrl,
                    req.body.iptClickparam, req.body.iptType, req.body.chkStatus,
                    req.body.iptId
                ];
                rst = await tricks.queryData(sql, params);
            }
            res.redirect('sites');
        } else {
            res.redirect('home?tips=Not allowed.');
        }
    } else {
        res.redirect('logout');
    }
});

module.exports = router;