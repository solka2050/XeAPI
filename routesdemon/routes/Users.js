const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
const { checkToken } = require("../auth/token_validation");
//Get all user Details
router.get("/", (req, res) => {
    mysqlConnection.query("SELECT * FROM dhulltra_benz.Users;", (err, results) => {
        if (err) {

            return res.json(err);
        }
        else {
            return res.json({
                Users: results
            })
        }
    })

})
//get specific userinformation

router.get("/:id", (req, res) => {
    try {
        mysqlConnection.query("SELECT * FROM dhulltra_benz.Users where id=?", [req.params.id], (err, results) => {
            if (!err) {
                //  var Array=rows;
                // res.json(Array[0]);
                return res.json({
                    Users: results
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

router.post("/", (req, res) => {
    let user = req.query;

    sqlQuery="UPDATE `dhulltra_benz`.`Users` SET `Status` = "+user.varStatus+" WHERE `id` =" + user.id + ";";
    //console.log(sqlQuery);
    //statusCode=req.params.varStatus;
    mysqlConnection.query(sqlQuery, (err, results) => {
        if (err) {

            return res.json(err);
        } else {
           // console.log(results);
            return res.json({
                Drivers: results
            })
        }
    })

})

router.post("/", (req, res) => {
    let user = req.query;

    var sql = "SET @varName=?;SET @varPhoneNumber=?;SET @varPassword=?;SET @varEmail=?; \
    CALL sp_new_user(@varName,@varPhoneNumber,@varPassword,@varEmail);";


    mysqlConnection.query(sql, [user.varName, user.varPhoneNumber,user.varPassword, user.varEmail], (err, rows, fields) => {
        if (!err) {

            rows.forEach(element => {
                if (element.constructor == Array) {
                    res.status(201).json(" Inserted UserId :" + element[0].id);
                }
            });
        }
        else {
            if (err.errno == 1062) {
                res.status(409).send("User Already Exisists");
            }
            else {
                res.status(400).json(err);
            }
        }
    })

})

router.put("/", (req, res) => {
    let user = req.query;

    var sql = "SET @varidUsers=?;SET @varPhoneNumber=?;SET @varFullName=?;SET @varPassword=?;SET @varEmail=?; \
    CALL sp_update_user(@varidUsers,@varPhoneNumber,@varFullName,@varPassword,@varEmail);";


    mysqlConnection.query(sql,
         [user.varidUsers, user.varPhoneNumber, user.varFullName,user.varPassword,user.varEmail],
          (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if (element.constructor == Array) 
                {
                    res.status(202).json('Updated Successfully');
                }
            });
        }
        else 
        {
            res.status(400).send(JSON.stringify(err, undefined, 2));
        }
    })

})
module.exports = router;