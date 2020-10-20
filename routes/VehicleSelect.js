const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
//Get all user Details
router.get("/", (req, res) => {
    mysqlConnection.query("SELECT * FROM benz.Vehicles;", (err, results) => {
        if (err) {

            return res.json(err);
        }
        else {
            return res.json({
                Vehicles: results
            })
        }
    })

})
//get specific userinformation

router.get("/:idLocations", (req, res) => {
    try {
        mysqlConnection.query("SELECT * FROM benz.Locations where idLocations=?", [req.params.idLocations], (err, results) => {
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
    console.log(userid, password);
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