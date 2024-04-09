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

/**
 * 50 "rich" countries in isoCode
 */
const richOnes = ["LU","IE","SG","QA","MO","CH","AE","SM","NO","US","DK","NL","HK","BN","TW","IS","AT","SA","AD","SE","DE","BE","AU","MT","GY","BH","FI","CA","FR","GB","KR","IL","IT","CY","NZ","JP","KW","SI","AW","ES","LT","CZ","PL","EE","PT","BS","HU","PH","PA","SK"];

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
        var ip4 = tricks.getIP4(req);
        let geo = null;
        try {
            geo = reader.country(ip4);
            console.log(`[debug from page nav(2):${url}, and it's visited from: <ip>${ip4}, and <geo>${geo.country.isoCode}`);
        } catch (err) {
            console.log(`[debug from page nav(4)::err from reader.country('${ip4}')]${err}`);
        }

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
            var rst = null;
            var passed = null;
            if (geo == null || richOnes.indexOf(geo.country.isoCode) !== -1) {//if allowed to redirect to the real link
                passed = 1;
            } else {
                passed = 0;
            }
            rst = await tricks.queryData("insert into hitlog (username, siteid, typeabbr, linkin, linkout, ip4, countryISOcode, passed) values \
                (?, ?, ?, ?, ?, ?, ?, ?)", [tos[2], tos[0], tos[1], params.to, url, ip4, geo == null ? null : geo.country.isoCode, passed]);
            console.log(`[debug from page nav(3):record the hit with the result -> ${JSON.stringify(rst)}`);
            if (passed) {
                url = url.replace("__agent__", tos[2]).replace("__abbr__", tos[1]);
                res.redirect(url);
            } else {
                res.send("404");
            }
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