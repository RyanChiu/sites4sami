var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

router.post('/', async (req, res) => {
    var params = [req.body.username, req.body.password, req.body.captcha];
    console.log("[z.debug.login]"); console.log(params);
    if (params[2] == req.session.captcha) {
        if (params[0] && params[1] && params[2]) {
            var sql = "select id, username, type, status from user where username = ? and pwd_crypted = ?";
            data = await tricks.queryData(sql, [params[0], tricks.cryptIt(params[1])]);
            if (data != null && data.length > 0) {//successflly logged in
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
                        req.session.navs = ["Home", "News", "Offices", "Agents", "Approve Agents", "Sites", "Stats", "Links", "Logs", "Profile", "Settings"];
                        break;
                    case 2:
                        req.session.navs = ["Home", "News", "Agents", "Approve Agents", "Sites", "Stats", "Links", "Logs", "Profile", "Settings"];
                        break;
                    case 3:
                        req.session.navs = ["Home", "News", "Sites", "Stats", "Links", "Logs", "Profile", "Settings"];
                        break;
                }
                //save the logged-in in log
                await tricks.queryData(
                    "insert into log (userid, type) values (" + data[0]['id'] + ", 1)"
                );
                res.redirect('home');
            } else {
                res.render("login", {
                    tips: "Incorrect Username/Password!",
                    tag: ''
                });
            }
            
        } else {
            res.render("login", {
                tips: "Please enter ALL Username/Password.",
                tag: ''
            });
        }
    } else {
        res.render("login", {
            tips: "Verification Code not right or empty.",
            tag: ''
        });
    }
    
    //res.send(params);
})

module.exports = router;