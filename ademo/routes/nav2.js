var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* deal with get */
router.get('/', async function(req, res, next) {
    let params = req.query;
    const tos = tricks.decipherIt(params.to).split(",");// tos will be [{siteid}, {link.abbr}, {agent.username}]
    console.log(`[debug from page nav2 without a view:${tos}`);
    var data = await tricks.queryData(
       "select * from site where id = ?", [tos[0]]
    );
    if (data != null && data.length != 0) {
        var lnks = data[0]["links"];
        var url = "";
        if (lnks)
            for (let lnk of lnks) {
                let link = JSON.parse(lnk);
                if (link.abbr == tos[1]) {
                    url = link.url;
                    break;
                }
            }
        if (url != "") {
            url = url.replace("__agent__", tos[2]);
            res.redirect(url);
        } else {
            res.send("Illegal visit.");
        }
    } else {
        res.send("Invalid visit.");
    }
    /*
    if (typeof(params.to) == undefined || isNaN(params.to)) {
        res.send("Illegal visit.");
    } else {
        let agent = tricks.decipherIt(params.to); 
        if (agent !== "") {
            res.send(agent);
        } else {
            res.send("Illegal agent.");
        }
    }
    */
});

module.exports = router;