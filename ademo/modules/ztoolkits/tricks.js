const net = require('net');
const mysql = require('mysql2');
const session = require("express-session");
const crypto = require('crypto');
const dbSalt = "4sitesofsami202402";
const ALGORITHM = 'aes-192-cbc';
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
exports.cipherIt = function (str) {
    const cipher = crypto.createCipher(ALGORITHM, dbSalt);
    let encrypted = cipher.update(str);
    encrypted += cipher.final('hex');
    return encrypted;
}
exports.decipherIt = function (str) {
    try {
        const decipher = crypto.createDecipher(ALGORITHM, dbSalt);
        let decrypted = decipher.update(str, 'hex');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (err) {
        return "";
    }
}

/* use session */
exports.useSession = function (router) {
    router.use(session({
        secret: 'secret which need to be changed when offically deployed',
        resave: true,
        saveUninitialized: true
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

exports.queryOffices = async function(role, userid) {
    var sql = "select * from view_office";
    var orderBy = " order by username";
    var offices;
    switch (role) {
        case 0:
        case 1:
        default:
          offices = await queryData(sql + orderBy);
          break;
        case 2:
          offices = await queryData(sql + " where id = ?" + orderBy, [userid]);
          break;
        case 3:
          offices = await queryData(sql + " where id = (select officeid from user where id = ?)" + orderBy, [userid]);
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

exports.queryLogs = async function(role, userid, cond="", orderBy=" order by intime desc") {
    var sql = "select * from view_log ";
    var logs, where = "";
    switch (role) {
        case 0:
            if (cond != "") {
                where = " where " + cond;
            }
            console.log(`[debug from queryLogs():<role:${role}>]${sql + where + orderBy}`);
            logs = await queryData(sql + where + orderBy);
            break;
        case 1:
        default:
            where = " where role != 0 ";
            if (cond != "") {
                where += " and (" + cond + ") "
            }
            console.log(`[debug from queryLogs():<role:${role}>]${sql + where + orderBy}`);
            logs = await queryData(sql + where + orderBy);
            break;
        case 2:
            where = " where (role > 1 and office = (select username from user where id = ?) or userid = ?) ";
            if (cond != "") {
                where += " and (" + cond + ") "
            }
            console.log(`[debug from queryLogs():<role:${role}>]${sql + where + orderBy}`);
            logs = await queryData(sql + where + orderBy, [userid, userid]);
            break;
        case 3:
            where = " where userid = ? ";
            if (cond != "") {
                where += " and (" + cond + ") "
            }
            console.log(`[debug from queryLogs():<role:${role}>]${sql + where + orderBy}`);
            logs = await queryData(sql + where + orderBy, [userid]);
            break;
    }
    return logs;
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