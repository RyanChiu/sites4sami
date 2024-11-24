const http = require("https");
const j2db = require('./j2db');

const args = process.argv.slice(2)
if (args.length == 2) {
  console.log(`[args] siteid:${args[0]}, date:${args[1]}`);
  const options = {
    "method": "POST",
    "hostname": "api.eflow.team",
    "port": null,
    "path": "/v1/affiliates/reporting/conversions",
    "headers": {
      "Content-Type": "application/json",
      "x-eflow-api-key": "76OJawvuQTythMkX56KgQ"
    }
  };
  
  const req = http.request(options, function (res) {
    const chunks = [];
  
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    res.on("end", async function () {
      const body = Buffer.concat(chunks);
      // /*
      var suc = await j2db.eflow_sales2DB(body, args[0], args[1]);
      if (suc) console.log("suc");
      else console.log("not suc");
      j2db.endPool();
      // */
      // console.log(body.toString());
    });
  });
  
  req.write(JSON.stringify({
    timezone_id: 80,
    from: args[1],
    to: args[1],
    show_events: true,
    show_conversions: true,
    query: {
      filters: [],
      search_terms: []
    }
  }));
  req.end();
} else {
  console.log("siteid & date('2024-03-01' alike), please.");
}

/**
 * the following blow is the original script get from "https://gothamclub.everflowclient.io/"
 */
/*
const http = require("https");

const options = {
  "method": "POST",
  "hostname": "api.eflow.team",
  "port": null,
  "path": "/v1/affiliates/reporting/entity",
  "headers": {
    "Content-Type": "application/json",
    "x-eflow-api-key": "76OJawvuQTythMkX56KgQ"
  }
};

const req = http.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(JSON.stringify({
  timezone_id: 80,
  currency_id: 'USD',
  from: '2024-04-25',
  to: '2024-04-25',
  columns: [
    {column: 'offer'},
    {column: 'sub1'},
    {column: 'sub2'},
    {column: 'sub3'},
    {column: 'sub4'},
    {column: 'sub5'}
  ],
  query: {
    filters: [],
    exclusions: [],
    metric_filters: [],
    user_metrics: [],
    settings: {}
  }
}));
req.end();
*/
