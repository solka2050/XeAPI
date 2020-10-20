const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
const { checkToken } = require("../auth/token_validation");
//Get all user Details
router.get("/", (req, res) => {
  mysqlConnection.query("SELECT RegNo FROM benz.Vehicles;", (err, results) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json({
        Vehicles: results,
      });
    }
  });
});
//get specific userinformation

router.get("/:idVehicles", (req, res) => {
  try {
    mysqlConnection.query(
      "SELECT * FROM benz.Vehicles where idVehicles=?",
      [req.params.idVehicles],
      (err, results) => {
        if (!err) {
          //  var Array=rows;
          // res.json(Array[0]);
          return res.json({
            Vehicles: results,
          });
        } else {
          console.log(err);
        }
      }
    );
  } catch (e) {
    console.error("err thrown: " + err.stack);
  }
});

//get specific userinformation
router.get("/login", (req, res) => {
  var { userid, password } = req.query;
  console.log(userid, password);
  return res.send("Logging in");
});

router.post("/", (req, res) => {
  let user = req.query;

  var sql =
    "SET @varRegNo=?;SET @varModel=?;SET @varDescription=?; \
    CALL sp_new_Vehicles(@varRegNo,@varModel,@varDescription);";

  mysqlConnection.query(
    sql,
    [user.varRegNo,user.varModel, user.varDescription],
    (err, rows, fields) => {
      if (!err) {
      //  console.log(rows);
        rows.forEach((element) => {
         // console.log(element);
          if (element.constructor == Array) {
            res
              .status(201)
              .json({
                VehicleDetails:[
                {
                  idVehicles: element[0].idVehicles,
                  RegNo: element[0].RegNo,Model:element[0].Model,
                  Description:element[0].Description
                }
              ]
            });
          }
        });
      } else {
        if (err.errno == 1062) {
          res.status(409).json({Message:"Vehicle Already Exisists"});
        } else {
          res.status(400).json(err);
        }
      }
    }
  );
});

router.put("/", (req, res) => {
  let user = req.query;

  var sql =
    "SET @varidVehicles=?;SET @varRegNo=?;SET @varModel=?;SET @varDescription=?; \
    CALL sp_update_Vehicles(@varidVehicles,@varRegNo,@varModel,@varDescription);";

  mysqlConnection.query(
    sql,
    [user.varidVehicles, user.varRegNo,user.varModel, user.varDescription],
    (err, rows, fields) => {
      if (!err) {
        rows.forEach((element) => {
          if (element.constructor == Array) {
            res.status(202).json("Updated Successfully");
          }
        });
      } else {
        res.status(400).send(JSON.stringify(err, undefined, 2));
      }
    }
  );
});
module.exports = router;
