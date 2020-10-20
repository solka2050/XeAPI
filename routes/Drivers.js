const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
//Get all user Details
router.get("/", (req, res) => {
    mysqlConnection.query("SELECT * FROM benz.Drivers;", (err, results) => {
        if (err) {

            return res.json(err);
        } else {
            return res.json({
                Drivers: results
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
            } else {
                console.log(err);
            }
        })
    } catch (e) {
        console.error('err thrown: ' + err.stack);
    }
})

//get specific userinformation
router.get("/status", (req, res) => {
    var {
        userid,
        password
    } = req.query;
    console.log(userid, password);
    return res.send("Logging in");

})



router.post("/", (req, res) => {
    let user = req.query;
    mysqlConnection.query("UPDATE `benz`.`Drivers` SET `Status` =" + user.varStatus + " WHERE `idDrivers` =" + user.id + ";", (err, results) => {
        if (err) {

            return res.json(err);
        } else {
          //  console.log(results);
            return res.json({
                Drivers: results
            })
        }
    })

})
router.post("/:idDrivers", (req, res) => {
    let user = req.query;
    let Driverid=req.params.idDrivers;
    var sql = 
    "SET @varidDrivers=?;\
    SET @varPhoneNumber=?;\
    SET @varName=?;\
    SET @varAddress=?;\
    SET @varPanNumber=?;\
    SET @varAdhaarNumber=?;\
    SET @varPanPhoto=?;\
    SET @varAadhaarPhoto=?;\
    SET @varAssociatedVehicle=?;\
    SET @varPassword=?;\
    CALL sp_update_driver(@varidDrivers,@varPhoneNumber,@varName,@varAddress,@varPanNumber,@varAdhaarNumber,@varPanPhoto,@varAadhaarPhoto,@varAssociatedVehicle,@varPassword);";


    mysqlConnection.query(sql,
        [Driverid,user.varPhoneNumber, user.varName, user.varAddress, user.varPanNumber, user.varAdhaarNumber, user.varPanPhoto, user.varAadhaarPhoto, user.varAssociatedVehicle, user.varPassword],
        (err, rows, fields) => {
            if (!err) {
                rows.forEach(element => {
                    if (element.constructor == Array) {
                        res.status(202).json({
                            Message: 'Updated Successfully'
                        });
                    }
                });
            } else {
                res.status(400).send(JSON.stringify(err, undefined, 2));
            }
        })

})
router.put("/", (req, res) => {
    let user = req.query;

    var sql = 
    "SET @varPhoneNumber=?;SET @varName=?;SET @varAddress=?;SET @varPanNumber=?;SET @varAdhaarNumber=?;SET @varPanPhoto=?;SET @varAadhaarPhoto=?;SET @varAssociatedVehicle=?;SET @varPassword=?;\
    CALL sp_new_driver(@varPhoneNumber,@varName,@varAddress,@varPanNumber,@varAdhaarNumber,@varPanPhoto,@varAadhaarPhoto,@varAssociatedVehicle,@varPassword);";


    mysqlConnection.query(sql,
        [user.varPhoneNumber, user.varName, user.varAddress, user.varPanNumber, user.varAdhaarNumber, user.varPanPhoto, user.varAadhaarPhoto, user.varAssociatedVehicle, user.varPassword],
        (err, rows, fields) => {
            if (!err) {
                rows.forEach(element => {
                    if (element.constructor == Array) {
                        res.status(202).json({
                            Message: 'Inserted Successfully'
                        });
                    }
                });
            } else {
                res.status(400).send(JSON.stringify(err, undefined, 2));
            }
        })

})
module.exports = router;