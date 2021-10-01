const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
//Get all user Details
router.post("/", (req, res) => {
    mysqlConnection.query("SELECT * FROM dhulltra_benz.Locations;", (err, results) => {
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

router.get("/:idLocations", (req, res) => {
    try {
        mysqlConnection.query("SELECT * FROM dhulltra_benz.Locations where idLocations=?", [req.params.idLocations], (err, results) => {
            if (!err) {
                //  var Array=rows;
                // res.json(Array[0]);
                return res.json({
                    Locations: results
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
   // console.log(userid, password);
    return res.send("Logging in");

})



router.get("/", (req, res) => {
    let user = req.query;

    var sql = "SET @varidExpenses=?;SET @varRent=?;SET @varDelhiEntry=?;SET @varDiesel=?;SET @varRepairing=?;SET @varRepairingId=0;SET @varFood=?;SET @varKaanta=?;SET @varTollTax=?;SET @varOther=?; \
    CALL sp_admin_update_ExpensesEntry(@varidExpenses,@varRent,@varDelhiEntry,@varDiesel,@varRepairing,@varRepairingId,@varFood,@varKaanta,@varTollTax,@varOther);";


    mysqlConnection.query(sql, [user.varidExpenses, user.varRent,user.varDelhiEntry,user.varDiesel,user.varRepairing, user.varFood,user.varKaanta, user.varTollTax,user.varOther], (err, rows, fields) => {
        if (!err) {

            rows.forEach(element => {
                if (element.constructor == Array) {
                    res.status(201).json(" Updated Record");
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