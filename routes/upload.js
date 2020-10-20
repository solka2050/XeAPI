const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const MIMR_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(req);
        const isValid = MIMR_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "./images");

    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIMR_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post("/", multer({
    storage: storage
}).single("image1"), (req, res) => {
    let post = req.body;
    console.log(post);
    if (req.file.filename==undefined){

    }
    else
    {
        
    const url = req.protocol + '://' + req.get("host");
    const imagepath = url + "/images/" + req.file.filename;
    // console.log("image is made by multer"+imagepath);
    // console.log(post);

    post.Image1 = imagepath;
    }
    //router.post("/", multer({    storage: storage}).array('image1',6), (req, res) => {
    })
module.exports = router;