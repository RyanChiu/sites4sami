const net = require('net');
const mysql = require('mysql2');
const session = require("express-session");
const crypto = require('crypto');
const dbSalt = "4sitesofsami202402";

/* crypt it */
exports.cryptIt = function (str) {
    var md5 = crypto.createHash("md5");
    return md5.update(str + dbSalt).digest("base64");
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
const pool = mysql.createPool({
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
})

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
    var sql = "select id, username from user where type = 2";
    var offices;
    switch (role) {
        case 0:
        case 1:
        default:
          offices = await queryData(sql);
          break;
        case 2:
          offices = await queryData(sql + " and id = ?", [userid]);
          break;
        case 3:
          offices = await queryData(sql + " and id = (select officeid from user where id = ?)", [userid]);
          break;
      }
      return offices;
}

exports.queryAgents = async function(role, userid) {
    var sql = "select * from view_agent";
    var agents;
    switch (role) {
        case 0:
        case 1:
        default:
            agents = await queryData(sql);
            break;
        case 2:
            agents = await queryData(sql + " where office = (select username from user where id = ?)", [userid]);
            break;
        case 3:
            agents = await queryData(sql + " where id = ?", [userid]);
            break;
    }
    return agents;
}

exports.getTitle = function (t) {
    t = t.split('\\').pop().split('/').pop();
    t = t.substring(0, t.indexOf("."));
    t = t.slice(0, 1).toUpperCase() + t.slice(1);
    return t;
}