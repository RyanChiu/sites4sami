var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* deal with post data */
router.post('/', async (req, res) => {
    let params = req.body;
    if (req.session.role === undefined || req.session.role !== 0 || req.session.username !== "root" ||
        params.day === undefined || params.agent === undefined || params.type === undefined) {
        res.set('Content-Type', 'text/html');
        res.send({
            //"rst": "bad request." + "(rols:" + req.session.role + ", user:" + req.session.username + ", params:" + JSON.stringify(params) + ")", // for debug
            "rst": "bad request.",
            "suc": false
        })
    }   
    var data = await tricks.queryData(
        "select * from sales where day_pulling = ? and agent = ? and type_abbr = ?",
        [params.day, params.agent, params.type]
    );
    var rst = [];
    // rst.push({"sql": "select * from sales where day ='" + params.day + "' and agent = '" + params.agent + "' and type_abbr = '" + params.type + "'"}); // for debug
    if (data) {
        for (let row of data) {
            rst.push({
                "id": row.id,
                "day": row.day_pulling,
                "transaction_id": row.trxid,
                "click_unix_time": row.trxtime,
                "country": row.country,
                "region": row.region,
                "city": row.city,
                "referer": row.referer
            });
        }
    }
    res.set('Content-Type', 'text/html');
    res.send({
        "rst": JSON.stringify(rst),
        "suc": true
    })
});

module.exports = router;
