var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

/* render the page */
router.get('/', async function(req, res, next) {
    if (typeof(req.session.loggedin) !== undefined && req.session.loggedin) {
        return res.redirect('home');
    } else {
        return res.render("login", {
            title: "",
            navs: [],
            user: req.session.username,
            tips: "",
            tag: ''
        });
    }
});

/* deal with post data */
router.post('/', async (req, res) => {
    var params = [req.body.username, req.body.password, req.body.captcha];
    console.log("[z.debug.login]"); console.log(params);
    if (params[2] == req.session.captcha) {
        if (params[0] && params[1] && params[2]) {
            var sql = "select id, username, type, status from user where username = ? and pwd_crypted = ?";
            data = await tricks.queryData(sql, [params[0], tricks.cryptIt(params[1])]);
            if (data != null && data.length > 0 && data[0]['status'] == 1) {//successflly logged in
                req.session.loggedin = true;
                req.session.username = data[0]['username'];
                req.session.userid = data[0]['id'];
                req.session.role = data[0]['type'];
                req.session.status = data[0]['status'];
                switch (req.session.role) {
                    case 0:
                    default:
                        req.session.navs = ["Home", "News", "Offices", "Agents", "Approve Agents", "Sites", "Stats", "Links", "Logs", "Profile", "Admins", "Settings"];
                        break;
                    case 1:
                        req.session.navs = ["Home", "Offices", "Agents", "Approve Agents", "Sites", "Stats", "Links", "Logs", "Profile", "Settings"];
                        break;
                    case 2:
                        req.session.navs = ["Home", "Agents", "Approve Agents", "Stats", "Links", "Logs", "Profile", "Settings"];
                        break;
                    case 3:
                        req.session.navs = ["Home", "Stats", "Links", "Logs", "Profile", "Settings"];
                        break;
                }
                //save the logged-in in log
                var rst = await tricks.queryData(
                    "insert into log (userid, type, outtime) values (?, 1, null)",
                    req.session.userid
                );
                req.session.loginsertid = rst['insertId'];
                return res.redirect('home');
            } else {
                if (data != null && data.length > 0 && data[0]['status'] != 1) {
                    console.log("~~~~~~~1~~~~~~");
                    res.render("login", {
                        title: "",
                        navs: [],
                        user: req.session.username,
                        tips: "Not allowed to login, please contact your admin.",
                        tag: ''
                    });
                } else {
                    console.log("~~~~~~~2~~~~~~");
                    res.render("login", {
                        title: "",
                        navs: [],
                        user: req.session.username,
                        tips: "Incorrect Username/Password!",
                        tag: ''
                    });
                }
            }
            
        } else {
            console.log("~~~~~~~3~~~~~~");
            res.render("login", {
                title: "",
                navs: [],
                user: req.session.username,
                tips: "Please enter ALL Username/Password.",
                tag: ''
            });
        }
    } else {
        console.log("~~~~~~~4~~~~~~");
        res.render("login", {
            title: "",
            navs: [],
            user: req.session.username,
            tips: "Verification Code not right or empty.",
            tag: ''
        });
    }    
    //res.send(params);
})

module.exports = router;