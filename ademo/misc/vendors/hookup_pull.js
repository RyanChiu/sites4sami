const http = require("https");
const j2db = require('./j2db');
const {exec} = require('child_process');

// get the script name itself
let tmpNames = process.argv[1].split("/");
var scriptName = tmpNames[tmpNames.length - 1];
/**
 * it take 2 params:
 * 1st one is siteId;
 * 2nd one is date, like "2024-10-13"
 */
const args = process.argv.slice(2)
if (args.length == 2) {
  console.log(`[args] siteId:${args[0]}, date:${args[1]}`);

  //var offerids = args[0].split(",");
  var data = [];
  // url = "https://vortexadssolutions.com/api-net/reports/subs?";
  url = "https://cashboom.com/api-aff/reports/subs?";
  (async () => {
    var links = await j2db.getLinks(args[0]);
    var abbrs = [];
    for (let link of links) {
      abbrs.push(link.abbr);
    }
    var offerids = abbrs;
    for (let offerid of offerids) {
      setTimeout(function() {}, 1600); // try to avoid "too many requests error from the server"
      var rst = await getReports(url, args[1], offerid);
      //console.log(`[debug] offerid (${offerid}):${rst.data}`);
      /**
       * put data that gathering from the tracking server into 
       * formated ones that could be fit with inserting into our own DB
       */
      var reports = null;
      try {
        reports = JSON.parse(rst.data);
      } catch (err) {
        console.log(`failed to parse JSON: ${err}`);
      }
      if (reports != null) {
        for (let row of reports.subs) {
          data.push({
            offerid: offerid,
            sub: row.sub,
            raw_clicks: row.raw_clicks,
            unique_clicks: row.unique_clicks,
            revenue: row.revenue,
            payout: row.payout,
            conversions_count: row.conversions_count,
            events_count: row.events_count
          });
        }
      }
      var stats = {};
      for (let row of data) {
        if (!(row.sub in stats)) {
          row["sales"] = {
            [row.offerid]: row.conversions_count
          };
          stats[row.sub] = row;
        } else {
          stats[row.sub]["sales"][row.offerid] = row.conversions_count;
          stats[row.sub].raw_clicks += row.raw_clicks;
          stats[row.sub].unique_clicks = parseInt(stats[row.sub].unique_clicks)
            + parseInt(row.unique_clicks);
          stats[row.sub].revenue += row.revenue;
          stats[row.sub].payout += row.payout;
          stats[row.sub].conversions_count += row.conversions_count;
          stats[row.sub].events_count += row.events_count;
        }
      }
    }
    // console.log(`[debug]set of stats: \n ${JSON.stringify(stats)}`);
    /**
     * according the stats that get from the trakcer server, and 
     * reorgnized with JSON format,
     * then we try to insert them into our own DB:
     * 1, empty a record by "site, agent, day"
     * 2, insert the new record by "site, agent, day"
     */
    var agents = await j2db.getAgents();
    var i = 0;
    console.log(`start__________________<${scriptName}>`);
    for (let agent of agents) {
      if (!(agent in stats)) {
        // if the agent is not one of the keys in stats, then do nothing
      } else {
        // console.log(`[debug] screen the data of legal agent(s):${JSON.stringify(stats[agent])}`);
        // 1, empty a rec
        let effectedRows = await j2db.emptyDayRec(agent, args[0], args[1]);
        // 2, insert an updatedly new one
        let rst = await j2db.executeSql(
          "insert into stats (trxtime, agentid, officeid, siteid, raws, uniques, sales0, sales1) values ( \
              ?, (select distinct id from user where username = ?), \
              (select distinct officeid from user where username = ?), ?, ?, ?, \
              JSON_ARRAY(?), JSON_ARRAY(?))",
          [
            args[1] + " 00:00:00", agent, agent, parseInt(args[0], 10), 
            stats[agent].raw_clicks, stats[agent].unique_clicks, 
            [stats[agent].sales[abbrs[0]] == null ? 0 : stats[agent].sales[abbrs[0]], links[0].payout, links[0].earning],
            [stats[agent].sales[abbrs[1]] == null ? 0 : stats[agent].sales[abbrs[1]], links[1].payout, links[1].earning]
          ]
        );
        console.log(`${rst.affectedRows} rec(s) inserted into stats.(after ${effectedRows} deleted)`);
        i++;
        console.log(`row ${i} : ${JSON.stringify(stats[agent])}\n`);
      }
    }
    console.log(`____________________end (${i})<${scriptName}>`);

    j2db.endPool();
  })();
} else {
  console.log("siteId(1 or 3 alike) & date('2024-03-01' alike), please.");
}

async function getReports(url, day, offerid) {
  var req = url
    + "sub=sub1&startDate=" + day
    + "&endDate=" + day
    + "&offerId=" + offerid;
  var cmd = 'curl "' + req 
    // + '" -H "API-Key: BGB7VQ1U2Y6OD90ATCQP9M725B2OVX1DZ6CR9EH5"';
    + '" -H "API-Key: cf71ce80f0c15bf9b9042280cf5d2d77"';
  // console.log(`[debug]for ${offerid}: ${cmd}`);
  var rst = {
    rst: 0, 
    data: ""
  };
  let read = async() => {
    return new Promise((res, rej) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          res({
            rst: 0,
            data: ""
          });
          rej(error);
        }
        res({
          rst: 1,
          data: stdout
        });
      });
    })
  }
  return await read();
  
}