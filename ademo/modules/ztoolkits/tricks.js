const net = require('net');
const mysql = require('mysql2');
const session = require("express-session");
const crypto = require('crypto');
const dbSalt = "4sitesofsami202402";
const ALGORITHM = 'aes-192-cbc';
const codecSalt = '_2412012257_';
const dbSettings = {
    host: "localhost",
    user: "sami",
    password: "4sites0fsami",
    database: "gwr",
    //stream: net.connect('/var/run/mysqld/mysqld.sock')
    stream: function() {
        var socket = net.connect('/var/run/mysqld/mysqld.sock');
        socket.setKeepAlive(true);
        return socket;
    }
};

exports.currentNewYorkTime = function(showTZ = false) {
    let t = new Date();
    let tz = "America/New_York";
    let st = t.toLocaleString("en-US", {timeZone:tz});
    if (showTZ) return st + " {" + tz + "}";
    else return st;
}

exports.getMysql = function() {
    return mysql;
}

exports.getDBSettings = function() {
    return dbSettings;
}

/* crypt it */
exports.cryptIt = function (str) {
    var md5 = crypto.createHash("md5");
    return md5.update(str + dbSalt).digest("base64");
}

/* cipher and decipher */
/**
 * cipherIt function take 1 param, which is the string need to be ciphered.
 * decipherIt function take 1 param, which is the string need to be deciphered.
 * >>>>>>>>and the following contents shoule be noticed<<<<<<<<<<<<
 * createCipher is deprecated, and we found that when the str's length
 * is longer than 15, then there will be some messed characters in the return of cipherIt().
 * So, in order not affect the old generated links, when it's longer than 15,
 * it needs to be replaced by "checkCypher()/enCypher()/deCypher()".
 */

/**
 * check if the pair dec/enc is in table `mapping`, and if not, generate it.
 * @param {string} dec - a decoded string
 * @param {string} enc - an encoded string
 * @param {number} type - 0 means should be deprecated, 1 means a normal none
 * @returns {json} - .tag(1 means 'new pair interted', 2 means 'the pair exists', 0 means failed
 *                 - .dec, original/decoded string
 *                 - .enc, coded string
 */
async function checkCypher(dec = null, enc, type = 1) {
    let data = await queryData(
        "select * from mapping where id = ?", [enc + ""]
    );
    if (data !== [] && data.length > 0) {
        console.log(`[debug] cypher '${enc}' exists, it's connected to '${JSON.stringify(data)}'.`);
        return {
            "tag": 1,
            "dec": dec == null ? data[0]['triplet'] : dec,
            "enc": enc
        }
    } else {
        console.log(`[debug] cypher '${enc}' doesn't exist'.(${JSON.stringify(data)})`);
        if (dec == null) {
            return {
                "tag": 0,
                "dec": dec,
                "enc": enc
            }
        }
        let rst = await queryData(
            "insert into mapping values (?, ?, ?)",
            [enc, dec, type]
        );
        if (rst == null) {
            return {
                "tag": 0,
                "dec": dec,
                "enc": enc
            }
        } else {
            return {
                "tag": 2,
                "dec": dec,
                "enc": enc
            }
        }
    }
}
async function enCypher(str) {
    let md5 = crypto.createHash('md5');
    let cypher = md5.update(str + codecSalt).digest('hex');
    let rst = await checkCypher(str, cypher);
    if (rst.tag == 0) {
        return "";
    } else {
        return cypher;
    }
}
async function deCypher(cypher) {
    let rst = await checkCypher(null, cypher);
    if (rst.tag == 0) return null;
    return rst.dec;
}
exports.cipherIt = async function (str) {
    // console.log(`[debug (from cipherIt())] str(length:${str.length}): ${str}`);
    if (str.length < 16) {
        console.log(`[debug (from cipherIt)] old deprecated 'createCipher'.`);
        const cipher = crypto.createCipher(ALGORITHM, dbSalt);
        let encrypted = cipher.update(str);
        encrypted += cipher.final('hex');
        // return encrypted;
        let rst = await checkCypher(str, encrypted, 0);
        return rst.tag == 0 ? "" : encrypted;
    } else {
        return await enCypher(str);
    }
}
exports.decipherIt = async function (str) {
    let dec = await deCypher(str);
    console.log(`[debug (from decipherIt)]: ${dec}`);
    if (dec == null) { 
        try {
            const decipher = crypto.createDecipher(ALGORITHM, dbSalt);
            let decrypted = decipher.update(str, 'hex');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (err) {
            return "";
        }
    } else {
        return dec;
    }
}

/* use session */
exports.useSession = function (router, forSuperAdmin = false) {
    router.use(session({
        secret: 'secret which need to be changed when offically deployed',
        resave: !forSuperAdmin,
        saveUninitialized: true,
        cookie: {
            maxAge: (forSuperAdmin ? 1000 * 60 * 60 * 24 * 365 * 10 /*10 years*/ : 1000 * 60 * 60 * 8 /*8 hours*/)
        }
    }));
}

/* connection pool */
const pool = mysql.createPool(dbSettings);

/* promised query */
queryPromise = function(sql) {
    return new Promise((resolve, reject) => {
       pool.query(sql, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
       })
    })
}

queryPromise = function(sql, holders) {
    return new Promise((resolve, reject) => {
       pool.query(sql, holders, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
       })
    })
}

/* query */
exports.queryData = queryData = async function (sql) {
    try {
        const data = await queryPromise(sql);
        // console.log(data); //debug
        return data;
    } catch(error) {
        console.log(error);
        return null;
    }
}

exports.queryData = queryData = async function (sql, holders) {
    try {
        const data = await queryPromise(sql, holders);
        // console.log(data); //debug
        return data;
    } catch(error) {
        console.log(error);
        return null;
    }
}

exports.queryOffices = async function(role, userid, cond="1=1") {
    var sql = "select * from view_office";
    var orderBy = " order by username";
    var offices;
    switch (role) {
        case 0:
        case 1:
        default:
          offices = await queryData(sql + " where (" + cond + ")" + orderBy);
          break;
        case 2:
          offices = await queryData(sql + " where id = ? and (" + cond + ")" + orderBy, [userid]);
          break;
        case 3:
          offices = await queryData(sql + " where id = (select officeid from user where id = ?) and ("  + cond + ")" + orderBy, [userid]);
          break;
      }
      return offices;
}

exports.queryAgents = async function(role, userid, cond="1=1", orderBy = " order by username, office") {
    var sql = "select * from view_agent";
    var agents;
    switch (role) {
        case 0:
        case 1:
        default:
            agents = await queryData(sql + " where (" + cond + ")" + orderBy);
            break;
        case 2:
            agents = await queryData(sql 
                + " where office = (select username from user where id = ?) and (" + cond + ")" + orderBy, 
                [userid]
            );
            break;
        case 3:
            agents = await queryData(sql + " where id = ? and (" + cond + ")" + orderBy, [userid]);
            break;
    }
    return agents;
}

const LOGS_LIMIT = " limit 2000";
exports.queryLogs = async function(role, userid, cond="", orderBy=" order by intime desc", limit=LOGS_LIMIT) {
    var sql = "select * from view_log ";
    var logs, where = "";
    switch (role) {
        case 0:
            if (cond != "") {
                where = " where " + cond;
            }
            console.log(`[debug from queryLogs():<role:${role}>]${sql + where + orderBy + limit}`);
            logs = await queryData(sql + where + orderBy + limit);
            break;
        case 1:
        default:
            where = " where role != 0 ";
            if (cond != "") {
                where += " and (" + cond + ") "
            }
            console.log(`[debug from queryLogs():<role:${role}>]${sql + where + orderBy + limit}`);
            logs = await queryData(sql + where + orderBy + limit);
            break;
        case 2:
            where = " where (role > 1 and office = (select username from user where id = ?) or userid = ?) ";
            if (cond != "") {
                where += " and (" + cond + ") "
            }
            console.log(`[debug from queryLogs():<role:${role}>]${sql + where + orderBy + limit}`);
            logs = await queryData(sql + where + orderBy + limit, [userid, userid]);
            break;
        case 3:
            where = " where userid = ? ";
            if (cond != "") {
                where += " and (" + cond + ") "
            }
            console.log(`[debug from queryLogs():<role:${role}>]${sql + where + orderBy + limit}`);
            logs = await queryData(sql + where + orderBy + limit, [userid]);
            break;
    }
    return logs;
}

exports.queryHitlogs = async function(role, userid, cond="", orderBy=" order by time desc", limit=LOGS_LIMIT) {
    var sql = "select * from view_hitlog ";
    var logs, where = "";
    switch (role) {
        case 0:
        case 1:
                if (cond != "") {
                where = " where " + cond;
            }
            console.log(`[debug from queryHitlogs():<role:${role}>]${sql + where + orderBy + limit}`);
            logs = await queryData(sql + where + orderBy + limit);
            break;
        case 2:
            where = " where (officeid = ?) ";
            if (cond != "") {
                where += " and (" + cond + ") "
            }
            console.log(`[debug from queryHitlogs():<role:${role}>]${sql + where + orderBy + limit}`);
            logs = await queryData(sql + where + orderBy + limit, [userid]);
            break;
        case 3:
            where = " where agentid = ? ";
            if (cond != "") {
                where += " and (" + cond + ") "
            }
            console.log(`[debug from queryHitlogs():<role:${role}>]${sql + where + orderBy + limit}`);
            logs = await queryData(sql + where + orderBy + limit, [userid]);
            break;
    }
    return logs;
}

exports.queryCountries = async function() {
    var data = await queryData("select * from country");
    var countries = [];
    for (let row of data) {
        countries[row['isoCode']] = row['name'];
    }
    return countries;
}

exports.querySites = async function() {
    var data = await queryData("select id, name, short, abbr, status from site order by name");
    var sites = [];
    for (let site of data) {
        sites.push({
            id: site['id'],
            name: site['name'],
            short: site['short'],
            abbr: site['abbr'],
            status: site['status']
        })
    }
    return sites;
}

/**
 * get all sites and jsonify the links of theirs
 */
exports.querySites4All = querySites4All = async function() {
    var data = await queryData("select * from site order by name");
    var sites = [];
    for (let site of data) {
        var links = null;
        var _links = [];
        try {
            links = JSON.parse(JSON.stringify(site['links']));
            for (let link of links) {
                _links.push(
                    JSON.parse(link)
                );
            }
        } catch (e) {
        }
        sites.push({
            id: site['id'],
            name: site['name'],
            short: site['short'],
            abbr: site['abbr'],
            url: site['url'],
            clickparam: site['clickparam'],
            type: site['type'],
            links: _links,
            status: site['status']
        })
    }
    return sites;
}

/**
 * get all links by identical abbr (abbreviation) with files
 * "site id, site name, link name, link alias"
 */
exports.queryLinks = async function() {
    var links = {};
    var sites = await querySites4All();
    for (let site of sites) {
        for (let link of site.links) {
            links[link.abbr] = {
                "site_id": site['id'],
                "site_name": site['name'],
                "name": link.name,
                "alias": link.alias
            }
        }
    }
    return links;
}

/**
 * check all the agents of the office, and combine the `sites` fields data, 
 * get the collection as the "activated sites" for the office
 * @param {*} id 
 */
exports.queryAssignedSites4Offi = async function(id) {
    var assites = await queryData("select sites from user where officeid = " + id);
    // get the collection of all the assigned sites for the office agent's by agent's
    var collection = [];
    for (let assite of assites) {
        // console.log(`[debug] ${JSON.stringify(assite)}`)
        // collection = collection.concat(assite["sites"].filter(function(v){return !(collection.indexOf(v) > -1)}));
        for (let siteid of assite["sites"]) {
            if (collection.indexOf(siteid) == -1) {
                collection.push(siteid);
            }
        }
    }
    // console.log(`[debug] collection of all the assigned sites for agents of the office (${id}):${collection.toString()}`);
    return collection;
}

exports.getIP4 = function(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
    ip = ip.substr(ip.lastIndexOf(':')+1,ip.length);
    return ip;
    /*
   let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
   return ip;
    */
}

exports.getTitle = function (t) {
    t = t.split('\\').pop().split('/').pop();
    t = t.substring(0, t.indexOf("."));
    t = t.slice(0, 1).toUpperCase() + t.slice(1);
    return t;
}

exports.getDwit = function (params) {
    var op = "", id = "";
    if (JSON.stringify(params) == '{}' || typeof(params["op"]) == "undefined" || typeof(params["id"]) == "undefined") {
        op = "add";
    } else {
        op = params["op"];
        id = params["id"];
    }
    return {
        "op": op,
        "id": id
    }
}
