const net = require('net');
const mysql = require('mysql2');
const session = require("express-session");

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

/* query */
exports.queryData = async function (sql) {
    try {
        const data = await queryPromise(sql);
        console.log(data);
        return data;
    } catch(error) {
        console.log(error);
        return null;
    }
}

exports.getTitle = function (t) {
    t = t.split('\\').pop().split('/').pop();
    t = t.substring(0, t.indexOf("."));
    t = t.slice(0, 1).toUpperCase() + t.slice(1);
    return t;
}