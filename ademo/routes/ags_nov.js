var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* deal with post data */
router.post('/', async (req, res) => {
    console.log("[debug from ags_nov:]"); console.log(req.body); // debug
    let params = req.body;
    if (typeof(params.officeid) !== undefined) {
        var data = await tricks.queryAgents(
            req.session.role, req.session.userid, 
            parseInt(params.officeid) === -111 ? " 1=1 " :
                " office = (select distinct username from user where id =" + params.officeid + ")"
        );
        var rst = [];
        if (data) {
            for (let row of data) {
                rst.push({"id": row.id, "username": row.username, "sites": row.sites});
            }
        }
        res.set('Content-Type', 'text/html');
        res.send({
            "rst": JSON.stringify(rst)
        })
    } else {
        res.set('Content-Type', 'text/html');
        res.send({
            "rst": "bad request."
        })
    }
    /*
    if (req.session && req.session.loggedin) {
        if (!req.body.officeid && typeof(req.body.officeid) !== undefined) {
            var data = await tricks.queryAgents(req.session.role, req.session.userid, " officeid = " + req.body.officeid);
            res.set('Content-Type', 'text/html');
            res.send({
                "rst": JSON.stringify(data)
            })
        } else {
            res.set('Content-Type', 'text/html');
            res.send({
                "rst": "bad request."
            })
        }
    } else {
        res.set('Content-Type', 'text/html');
        res.send({
            "rst": "not allowed."
        })
    }*/
});

module.exports = router;