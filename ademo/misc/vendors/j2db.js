const tricks = require('../../modules/ztoolkits/tricks');
const pool = tricks.getMysql().createPool(tricks.getDBSettings());
const timezone = "America/New_York";

exports.timezone = timezone;

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

exports.executeSql = executeSql;

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

exports.getLinks = getLinks;

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

exports.getAgents = getAgents;

/**
 * Get all the clicks/raws/uniques and sales by day for an agent.
 * Right now, clicks/raws/uniques are sum of no mater how many types in a site, but
 * separate sales into different cols.
 * @param table means actually useful tracking data abstract from the API from "api.eflow.team" alike
 * @returns array of rows that coud be inserted into DB 
 */
async function getAll4AgsByDay(table, siteId) {
    var links = await getLinks(siteId);
    var abbrs = [];
    for (let link of links) {
        abbrs.push(link.abbr);
    }
    var agents = await getAgents();

    var ags = [];
    for (let row of table) {
        var agent = row.columns[1].label;
        var abbr = row.columns[2].label;
        if (abbrs.indexOf(abbr) !== -1 && agents.indexOf(agent) !== -1) {
            if (ags.indexOf(agent) == -1) {
                ags.push(agent);
            }
        }
    }
    var records = [];
    for (let ag of ags) {
        records.push(
            {
                "agent" : ag,
                "site": {
                    "id": siteId,
                    "links": abbrs
                },
                "sums": {
                    "raws": 0,
                    "uniques": 0,
                    "sales0": [0, 0, 0],
                    "sales1": [0, 0, 0] 
                }
            }
        )
    }
    for (let row of table) {
        var agent = row.columns[1].label;
        var abbr = row.columns[2].label;
        var raws = row.reporting.total_click;
        var uniques = row.reporting.unique_click;
        var idx = ags.indexOf(agent);
        if (idx != -1) {
            records[idx].sums.raws += raws;
            records[idx].sums.uniques += uniques;
            switch (abbrs.indexOf(abbr)) {
                case 0:
                    records[idx].sums.sales0 = [row.reporting.cv, links[0].payout, links[0].earning];
                    break;
                case 1:
                    records[idx].sums.sales1 = [row.reporting.cv, links[1].payout, links[1].earning];
                    break;
            }
        }
    }
    return records;
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

exports.emptyDayRec = emptyDayRec;

exports.endPool = function() {
    pool.end();
}

/* for data from api.eflow.team */
exports.eflow2DB = async function (
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

    console.log("start__________________");
    let rows = await getAll4AgsByDay(stats.table, siteId);
    var i = 0;
    for (let row of rows) {
        let effectedRows = await emptyDayRec(row.agent, siteId, date);
        let rst = await executeSql(
            "insert into stats (trxtime, agentid, officeid, siteid, raws, uniques, sales0, sales1) values ( \
                ?, (select distinct id from user where username = ?), \
                (select distinct officeid from user where username = ?), ?, ?, ?, \
                JSON_ARRAY(?), JSON_ARRAY(?))",
            [date + " 00:00:00", row.agent, row.agent, parseInt(siteId, 10), row.sums.raws, row.sums.uniques, row.sums.sales0, row.sums.sales1]
        );
        console.log(`${rst.affectedRows} rec(s) inserted into stats.(after ${effectedRows} deleted)`);
       	i++;
       	console.log(`row ${i} : ${JSON.stringify(row)}\n`);
    }
    console.log(`____________________end (${rows.length})`);
    return true;
}