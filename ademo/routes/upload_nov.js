var express = require('express');
var router = express.Router();
const tricks = require('../modules/ztoolkits/tricks');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/media/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        req.fn = file.fieldname + '-' + uniqueSuffix + "_" + file.originalname;
        cb(null, req.fn);
    }
});
//const upload = multer({dest: 'public/media/'});
const upload = multer({ storage: storage });

tricks.useSession(router);

/* deal with post data */
router.post('/', async (req, res) => {
    let single = upload.single('image');
    // console.log(`[debug for upload_nov(body):]${JSON.stringify(req.body)}`)
    // console.log(`[debug for upload_nov(req):]${req}`)
    single(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.send({
                ok: false,
                msg: "MulterError:" + JSON.stringify(err)
            })
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.send({
                ok: false,
                msg: "Error:" + JSON.stringify(err)
            })
        }
      
        // Everything went fine.
        return res.send({
            ok: true,
            msg: "Good to go!",
            fn: req.fn
        })
    });
});

module.exports = router;