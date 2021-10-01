const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const MIMR_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
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
//Get all user Details
router.get("/", (req, res) => {
    mysqlConnection.query("SELECT * from postdata", (err, results) => {
        if (err) {

            return res.json(err);
        } else {
            return res.json({
                posts: results
            })
        }
    })

})
//get specific userinformation checkAuth

router.get("/:postid",  (req, res) => {
    //console.log(req.body);
    mysqlConnection.query("SELECT * FROM postdata where postid=?", [req.params.postid], (err, rows, fields) => {
        if (!err) {
            var Array = rows;
            res.json(Array[0]);
        } else {
            console.log(err);
            return;
        }
    })

})


router.delete("/:postid", checkAuth, (req, res) => {
    //console.log(req.body);
    mysqlConnection.query("DELETE FROM `postdata` WHERE postid=?", [req.params.postid], (err, results) => {
        if (!err) {

            return res.json({
                message: "Post Deleted Succesfully"
            })
        } else {
            console.log(err);
            return res.status(400).json({
                message: err
            });
        }
    })

})

//get specific userinformation
router.get("/login", checkAuth, (req, res) => {
    var {
        userid,
        password
    } = req.query;
    console.log(userid, password);
    return res.send("Logging in");

})

router.post("/", checkAuth, multer({
    storage: storage
}).single("image1"), (req, res) => {
    let post = req.body;
    console.log(post.Image1);
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
    


    var sql = "SET @_postid=?; SET @_Title=?; SET @_Image1=?; SET @_Image2=?; SET @_Image3=?; \
    SET @_Image4=?; SET @_Image5=?; SET @_Image6=?; SET @_Para1=?;\
    SET @_Para2=?; SET @_Para3=?; SET @_Para4=?; SET @_Para5=?; \
    SET @_Para6=?; \
    CALL SPostDetailInsert(@_postid,@_Title,@_Image1,@_Image2,@_Image3,@_Image4,\
    @_Image5,@_Image6,@_Para1,@_Para2,@_Para3,@_Para4,@_Para5,@_Para6);";
    //  console.log("SQL Query Made:: "+ sql);

  //  var simplesql = "INSERT INTO `postdata`(`postid`,`Title`,`Image1`,`Image2`,`Image3`,`Image4`,`Image5`,`Image6`,`Para1`,`Para2`,`Para3`,`Para4`,`Para5`,`Para6`)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
    mysqlConnection.query(sql, [post.postid, post.Title, post.Image1, post.Image2, post.Image3, post.Image4, post.Image5, post.Image6, post.Para1, post.Para2, post.Para3, post.Para4, post.Para5, post.Para6], (err, rows, fields) => {
        if (!err) {
            var result1;
            // rows.forEach(element=>{
            //   if(element.constructor == Array)
            //   result1= element[0];
            //  var jsonparsed=JSON.parse(result1);
            // console.log(result1);
            rows[14].map(row => {
                result1 = {
                    ...row
                }
            });
            //  })
            // console.log(result1);
            return res.json(result1);
            //res.json(rows);



        } else {
            if (err.errno == 1062) {
                return res.status(409).send({
                    message: "Post Already Exisists"
                });

            } else {
                // console.log(err);
                return res.status(400).json({
                    message: err
                });

            }
        }
    })

})

router.put("/", (req, res) => {
    var sql = "SET @_postid=?; SET @_Title=?; SET @_Image1=?; SET @_Image2=?; SET @_Image3=?; \
    SET @_Image4=?; SET @_Image5=?; SET @_Image6=?; SET @_Para1=?;\
    SET @_Para2=?; SET @_Para3=?; SET @_Para4=?; SET @_Para5=?; \
    SET @_Para6=?; \
    CALL SPostDetailInsert(@_postid,@_Title,@_Image1,@_Image2,@_Image3,@_Image4,\
    @_Image5,@_Image6,@_Para1,@_Para2,@_Para3,@_Para4,@_Para5,@_Para6);";
    //  console.log("SQL Query Made:: "+ sql);

  //  var simplesql = "INSERT INTO `postdata`(`postid`,`Title`,`Image1`,`Image2`,`Image3`,`Image4`,`Image5`,`Image6`,`Para1`,`Para2`,`Para3`,`Para4`,`Para5`,`Para6`)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
    mysqlConnection.query(sql, [post.postid, post.Title, post.Image1, post.Image2, post.Image3, post.Image4, post.Image5, post.Image6, post.Para1, post.Para2, post.Para3, post.Para4, post.Para5, post.Para6], (err, rows, fields) => {
        if (!err) {
            var result1;
            // rows.forEach(element=>{
            //   if(element.constructor == Array)
            //   result1= element[0];
            //  var jsonparsed=JSON.parse(result1);
            // console.log(result1);
            rows[14].map(row => {
                result1 = {
                    ...row
                }
            });
            //  })
            // console.log(result1);
            return res.json(result1);
            //res.json(rows);



        } else {
            if (err.errno == 1062) {
                return res.status(409).send({
                    message: "Post Already Exisists"
                });

            } else {
                // console.log(err);
                return res.status(400).json({
                    message: err
                });

            }
        }
    })
})
module.exports = router;