var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');
const fs = require('fs');

/* deal with get data */
/**
 * recieving data with method "get", not recommended.
 * will log the data into file "misc/logs/tracks_g.log" with json format,
 * and will send "gotcha" to the poster if successful, "glitched" if failed.
 */
router.get('/', async function(req, res, next) {
    let params = req.query;
    let str_debug = "[debug from page cbs_tracks with get data]" + JSON.stringify(params);
    console.log("<" + tricks.currentNewYorkTime(true) + ">\n" + str_debug);
    try {
        await fs.appendFileSync("misc/logs/tracks_g.log", "<" + tricks.currentNewYorkTime(true) + ">\n" + JSON.stringify(params) + "\n");
    } catch (err) {
        console.log("tracking err (get):" + JSON.stringify(err));
        res.send("glitched.");
    }
    res.send("gotcha.");
});

/* deal with post data */
/**
 * recieving data with method "post", recommended.
 * will log the data into file "misc/logs/tracks.log" with json format,
 * and will send "gotcha" to the poster if successful, "glitched" if failed.
 */
router.post('/', async (req, res) => {
    let params = req.body;
    let str_debug = "[debug from page cbs_tracks with post data]" + JSON.stringify(params);
    console.log("<" + tricks.currentNewYorkTime(true) + ">\n" + str_debug);
    try {
        await fs.appendFileSync("misc/logs/tracks.log", "<" + tricks.currentNewYorkTime(true) + ">\n" + JSON.stringify(params) + "\n");
    } catch (err) {
        console.log("tracking err (post):" + JSON.stringify(err));
        res.send("glitched.");
    }
    res.send("gotcha.");
});

module.exports = router;