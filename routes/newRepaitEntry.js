const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
//Get all user Details
router.get("/", (req, res) => {
    mysqlConnection.query("SELECT max(RepairId)+1 AS NewRepairId FROM benz.Det_Repair_Entry;", (err, results) => {
        if (err) {

            return res.json(err);
        }
        else {
            return res.json({
                NewId: results
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


/*
router.post("/", (req, res) => {
   // console.log(req);
  // console.log(req.headers);
    var jsondata = req.body;
    console.log(jsondata);

var values = [];

for(var i=0; i< jsondata.length; i++)
  values.push([jsondata[i].varRepairId,jsondata[i].varLineNo,jsondata[i].varDescription,jsondata[i].varAmount]);
console.log(values);
//Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
mysqlConnection.query('INSERT INTO `benz`.`Det_Repair_Entry`(`RepairId`,`LineNo`,`Description`,`Amount`) VALUES ?', [values], function(err,result) {
    if (!err) {

        return res.json({
            Message: "Success"
        })
    }
    else {
        if (err.errno == 1062) {
            res.status(409).send({
                Message: "Record Already Exisists"
            });
        }
        else {
            console.log(err);
            res.status(400).json(err);
        }
    }
});
});/*
    let user = req.body;
    console.log(user);
    let query = "INSERT INTO `benz`.`Det_Repair_Entry`(`RepairId`,`LineNo`,`Description`,`Amount`) VALUES ?";
  
    mysqlConnection.query(query, [user], function(err, result) {
        if (!err) {

            return res.json({
                Repairs: results
            })
        }
        else {
            if (err.errno == 1062) {
                res.status(409).send("Record Already Exisists");
            }
            else {
                res.status(400).json(err);
            }
        }
    })

        /*
    var sql = "SET @varRepairId=?;SET @varLineNo=?;SET @varDescription=?;SET @varAmount=?; \
    CALL benz.sp_new_det_repair_entry(@varRepairId,@varLineNo,@varDescription,@varAmount);";


    mysqlConnection.query(sql, [user.varRepairId,user.varLineNo, user.varDescription,user.varAmount], (err, results) => {
        if (!err) {

            return res.json({
                Repairs: results
            })
        }
        else {
            if (err.errno == 1062) {
                res.status(409).send("Record Already Exisists");
            }
            else {
                res.status(400).json(err);
            }
        }
    })
    */


router.post("/", (req, res) => {
    let user = req.query;   
    let RepairId=req.query.varRepairId;
    var sql = "SET @varWorkDate=?;SET @varRepairId=?;SET @varVehRegNo=?;SET @varDescription=?;SET @varAmount=?; \
    CALL sp_new_det_repair_entry(@varWorkDate,@varRepairId,@varVehRegNo,@varDescription,@varAmount);";
    //in varWorkDate datetime, in varRepairId int,in varDescription varchar(250),in varAmount DECIMAL(24,2),in varVehRegNo varchar(45))

    mysqlConnection.query(sql,[user.varWorkDate,RepairId, user.varDescription, user.varAmount,user.varVehRegNo], (err, rows, fields) => {
        if (!err) {
          // console.log(rows);
          var Array = rows;
        //  console.log(Array);
          res.json({
            ReapirLine: Array[5],
          });
        } else {
          console.log(err);
        }
      }
    );
  });
module.exports = router;