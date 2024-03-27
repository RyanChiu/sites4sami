const tricks = require('../../modules/ztoolkits/tricks');
const pool = tricks.getMysql().createPool(tricks.getDBSettings());

async function executeSql(sql, holders) {
    try {
        const data = await new Promise((res, rej) => {
            pool.query(sql, holders, (err, rst) => {
                if (err) return rej(err);
                return res(rst);
            })
        })
        return data;
    } catch(err) {
        console.log(err);
        return null;
    }
}

async function getLinks(siteId) {
    let sites = await executeSql(
        "select * from site where id = ?", siteId
    );
    var links = [];
    if (sites && typeof(sites[0]) !== undefined) {
        var lnks = JSON.parse("[" + sites[0]["links"] + "]");
        for (let lnk of lnks) {
            links.push(lnk);
        }
    }
    return links;
}

async function getAgents() {
    let data = await executeSql(
        "select username from user where type = ? and status = ?", [3, 1]
    );
    var agents = [];
    for (let row of data) {
        agents.push(row["username"]);
    }
    return agents;
}

async function emptyDayRec(agent, siteId, date) {
    let where = "where convert(trxtime, date) = ? \
        and siteid = ? \
        and agentid = (select distinct id from user where username = ?)";
    var rec;
    /*
    rec = await executeSql(
        "select * from stats " + where,
        [date, siteId, agent]
    )
    console.log(`dayRecEmpty select sql result: ${JSON.stringify(rec)}`);
    if (!emptyIt) {
        if (rec && rec.length != 0 && typeof(rec[0]) !== undefined) {
            return false;
        } else {
            return true;
        }
    } else {
        rec = await executeSql(
            "delete from stats " + where, 
            [date, siteId, agent]
        )
        console.log(`dayRecEmpty delete sql result: ${JSON.stringify(rec)}`);
    }*/
    rec = await executeSql(
        "delete from stats " + where, 
        [date, siteId, agent]
    )
    return rec.affectedRows;
    //console.log(`dayRecEmpty delete sql result: ${JSON.stringify(rec)}`);
}

exports.endPool = function() {
    pool.end();
}

/* for cherry */
exports.cherry2DB = async function (
    data/*json*/, siteId="", 
    date="2024-03-17"/*only a whole day allowed, such as '2024-02-01'*/) {
    var stats = null;
    try {
        stats = JSON.parse(data);
    } catch (err) {
        console.log(err);
        return false;
    }
    if (stats == null) return false;

    /* get links for site cherry */
    var links = await getLinks(siteId);
    //console.log(`abbrs:${JSON.stringify(links)}`);
    var abbrs = [];
    for (let link of links) {
        abbrs.push(link.abbr);
    }
    /* get agents */
    var agents = await getAgents();
    //console.log(`agents:${agents}`);
    //if (abbrs.indexOf("LSS") !== -1) console.log("Getcha");
    //if (agents.indexOf("test01") !== -1) console.log("Getcha, too");
    
    var i = 0, j = 0;
    for (let row of stats.table) {
        j++;
        var agent = row.columns[1].label;
        var abbr = row.columns[2].label;
        var raws = row.reporting.total_click;
        var uniques = row.reporting.unique_click;
        var sales0 = sales1 = [0, 0, 0];
        if (abbrs.indexOf(abbr) !== -1 && agents.indexOf(agent) !== -1) {
            i++;
            console.log(i+"___"+
                row.columns[1].column_type
                + ":" + row.columns[1].label
                + "," +
                row.columns[2].column_type
                + ":" + row.columns[2].label
                + "," +
                "total_click:" + row.reporting.total_click + "," +
                "unique_click:" + row.reporting.unique_click + "," +
                "convertion:" + row.reporting.cv
            );
            switch (abbr.indexOf(abbr)) {
                case 0:
                    sales0 = [row.reporting.cv, links[0].payout * row.reporting.cv, links[0].earning * row.reporting.cv];
                    break;
                case 1:
                    sales1 = [row.reporting.cv, links[1].payout * row.reporting.cv, links[1].earning * row.reporting.cv];
                    break;
            }
            // step 1, delete it. step 2, insert the latest
            let effectedRows = await emptyDayRec(agent, siteId, date);
            let rst = await executeSql(
                "insert into stats (trxtime, agentid, officeid, siteid, raws, uniques, sales0, sales1) values ( \
                    ?, (select distinct id from user where username = ?), \
                    (select distinct officeid from user where username = ?), ?, ?, ?, \
                    JSON_ARRAY(?), JSON_ARRAY(?))",
                [date + " 00:00:00", agent, agent, parseInt(siteId, 10), raws, uniques, sales0, sales1]
            );
            console.log(`${rst.affectedRows} rec inserted into stats.(after ${effectedRows} deleted)`);
        }
    }
    console.log(`finished.[${j} row(s) processed.]`);
    return true;
}