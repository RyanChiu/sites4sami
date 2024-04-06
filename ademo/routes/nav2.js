var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

// Synchronous database opening
const fs = require('fs');
const Reader = require('@maxmind/geoip2-node').Reader;

const dbBuffer = fs.readFileSync('../../maxmind.com/GeoLite2-Country_20240405/GeoLite2-Country.mmdb');

// This reader object should be reused across lookups as creation of it is
// expensive.
const reader = Reader.openBuffer(dbBuffer);

tricks.useSession(router);

/* deal with get */
router.get('/', async function(req, res, next) {
    let params = req.query;
    const tos = tricks.decipherIt(params.to).split(",");// tos will be [{siteid}, {link.abbr}, {agent.username}]
    console.log(`[debug from page nav(1):${tos}`);
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
            var ip4 = tricks.getIP4(req);
            let geo = response = reader.country(ip4);
            url = url.replace("__agent__", tos[2]).replace("__abbr__", tos[1]);
            console.log(`[debug from page nav(2):${url}, and it's visited from: <ip>${ip4}, and <geo>${geo.country.isoCode}`);
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