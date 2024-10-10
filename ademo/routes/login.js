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
    if (params[2] == req.session.captcha) {
        if (params[0] && params[1] && params[2]) {
            //var sql = "select id, username, type, status from user where username = ? and pwd_crypted = ?";
            var sql = "select a.id, a.username, a.type, a.status, a.officeid, b.username as offiname, b.status as offistatus\
                from user a, user b where a.username = ? and (a.officeid is not null and a.officeid = b.id) and a.pwd_crypted = ?\
                union\
                select a.id, a.username, a.type, a.status, a.officeid, null, null\
                from user a where a.username = ? and type < 3 and a.pwd_crypted = ?;"
            let data = await tricks.queryData(sql, [params[0], tricks.cryptIt(params[1]), params[0], tricks.cryptIt(params[1])]);
            // console.log(`[z.debug.login:]${JSON.stringify(data)}`);
            if (data != null && data.length > 0 
                && (data[0]['status'] == 1 && data[0]['type'] < 3
                    || data[0]['status'] == 1 && data[0]['type'] == 3 && data[0]['offistatus'] == 1)
            ) {//successflly logged in
                req.session.loggedin = true;
                req.session.username = data[0]['username'];
                req.session.userid = data[0]['id'];
                req.session.role = data[0]['type'];
                req.session.status = data[0]['status'];
                switch (req.session.role) {
                    case 0:
                        tricks.useSession(router, true);
                    default:
                        req.session.navs = ["Home", "News", "Offices", "Agents", "*New*", "Sites", "Stats", "Links", "Logs", "Profile", "Admins", "Set"];
                        break;
                    case 1:
                        req.session.navs = ["Home", "Offices", "Agents", "*New*", "Sites", "Stats", "Links", "Logs", "Profile"];
                        break;
                    case 2:
                        req.session.navs = ["Home", "Agents", "*New*", "Stats", "Links", "Logs", "Profile"];
                        break;
                    case 3:
                        req.session.navs = ["Home", "Stats", "Links", "Logs", "Profile"];
                        break;
                }
                //save the logged-in in log
                var rst = await tricks.queryData(
                    "insert into log (userid, type, intime, outtime, ip4) values (?, 1, str_to_date(?, '%m/%d/%Y, %h:%i:%s %p'), null, ?)",
                    [
                        req.session.userid, 
                        tricks.currentNewYorkTime(), 
                        tricks.getIP4(req)
                    ]
                );
                req.session.loginsertid = rst['insertId'];
                //save the new agents number to session
                var newags = await tricks.queryAgents(req.session.role, req.session.userid, " status = 0");
                req.session.iaNum = newags.length;
                return res.redirect('home');
            } else {
                if (data != null && data.length > 0 
                    && (data[0]['status'] != 1 && data[0]['type'] < 3
                        || data[0]['type'] == 3 && (data[0]['offistatus'] != 1 || data[0]['status'] != 1))
                ) {
                    // console.log("~~~~~~~1~~~~~~");
                    res.render("login", {
                        title: "",
                        navs: [],
                        user: req.session.username,
                        tips: "Not allowed to login, please contact your admin.",
                        tag: ''
                    });
                } else {
                    // console.log("~~~~~~~2~~~~~~");
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
            // console.log("~~~~~~~3~~~~~~");
            res.render("login", {
                title: "",
                navs: [],
                user: req.session.username,
                tips: "Please enter ALL Username/Password.",
                tag: ''
            });
        }
    } else {
        // console.log("~~~~~~~4~~~~~~");
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