var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');

tricks.useSession(router);

router.post('/', async (req, res) => {
    var params = [req.body.username, req.body.password, req.body.captcha];
    console.log("[z.debug.login]"); console.log(params);
    if (params[2] == req.session.captcha) {
        if (params[0] && params[1] && params[2]) {
            data = await tricks.queryData("select username from user where username = '" + params[0] + "' and password = '" + params[1] + "'");
            if (data != null && data.length > 0) {//successflly logged in
                req.session.loggedin = true;
                req.session.username = data[0]['username'];
                //res.render("login", {tips: req.session.username + ", hey, we looged in."});
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