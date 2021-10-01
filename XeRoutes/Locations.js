const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
const { checkToken } = require("../auth/token_validation");
//Get all user Details
router.get("/", (req, res) => {
    mysqlConnection.query("SELECT idDealerData,Name,State,Location,ContactPerson,Mobile,Email,CONCAT('https://api.whatsapp.com/send?phone=91',Mobile,'&text=urlencodedtext') As WhatsApp,isVarified,logoPath FROM DealerData;", (err, results) => {
        if (err) {

            return res.json(err);
        }
        else {
            return res.json({
                Locations: results
            })
        }
    })

})
//get specific userinformation

router.get("/:idDealerData", (req, res) => {
    try {
        mysqlConnection.query("SELECT * FROM DealerData where idDealerData=?", [req.params.idDealerData], (err, results) => {
            if (!err) {
                //  var Array=rows;
                // res.json(Array[0]);
                return res.json({
                    Company: results
                })
            }
            else {
                console.log(err);
            }
        })
    } catch (e) {
        console.error('err thrown: ' + err.stack);
    }
})

//get specific userinformation
router.get("/login", (req, res) => {
    var { userid, password } = req.query;
  //  console.log(userid, password);
    return res.send("Logging in");

})



router.post("/", (req, res) => {
    let user = req.query;

    var sql = "SET @varName=?;SET @varDescription=?; \
    CALL sp_new_location(@varName,@varDescription);";


    mysqlConnection.query(sql, [user.varName, user.varDescription], (err, rows, fields) => {
        if (!err) {

            rows.forEach(element => {
                if (element.constructor == Array) {
                    res.status(201).json(" Inserted LocationID :" + element[0].idLocations);
                }
            });
        }
        else {
            if (err.errno == 1062) {
                res.status(409).send("Location Already Exisists");
            }
            else {
                res.status(400).json(err);
            }
        }
    })

})

router.put("/", (req, res) => {
    let user = req.query;

    var sql = "SET @varId=?;SET @varName=?;SET @varDescription=?; \
    CALL sp_update_location(@varId,@varName,@varDescription);";


    mysqlConnection.query(sql, [user.varId, user.varName, user.varDescription], (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if (element.constructor == Array) {
                    res.status(202).json('Updated Successfully');
                }
            });
        }
        else {
            res.status(400).send(JSON.stringify(err, undefined, 2));
        }
    })

})
module.exports = router;