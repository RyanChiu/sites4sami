var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

/* deal with get */
router.get('/', async function(req, res, next) {
    let params = req.query;
    console.log(params)
    if (typeof(params.p) !== undefined && params.p == 1) {
        res.send("success" + params.p);
    } else {
        res.send("failed" + params)
    }
});

/* deal with post data */
router.post('/', async (req, res) => {
    let params = req.body;
    let str_debug = "[debug from page cbs_tracks with post data]" + JSON.stringify(params);
    console.log(str_debug);
    res.send("got it:" + str_debug);
});

module.exports = router;