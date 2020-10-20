const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
//Get all Entry Details
router.get("/", (req, res) => {
  mysqlConnection.query(
    "SELECT Rent, DelhiEntry, Diesel, Repairing, Food, Kaanta, TollTax, Other  FROM benz.Expenses where idExpenses=?;",
    [req.query.varidExpenses],
    (err, results) => {
      if (err) {
        return res.json(err);
      } else {
        // console.log(results);
        return res.json({
          Entries: results,
        });
      }
    }
  );
});
//get specific userinformation

router.get("/:idExpenses", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM benz.Expenses where idExpenses=?;",
    [req.params.idExpenses],
    (err, rows, fields) => {
      if (!err) {
        // console.log(rows);
        var Array = rows;
        res.json({
          EntryDetails: Array[0],
        });
      } else {
        console.log(err);
      }
    }
  );
});

//get specific userinformation
router.get("/login", (req, res) => {
  var { userid, password } = req.query;
  console.log(userid, password);
  return res.send("Logging in");
});

router.post("/", (req, res) => {
  let user = req.query;
  //console.clear();
  console.log(user);

  var sql =
    "SET @varWorkDate=?;SET @varRent=?;SET @varDelhiEntry=?;SET @varDiesel=?;SET @varRepairing=?;SET @varRepairingId=?;SET @varFood=?;SET @varKaanta=?;SET @varTollTax=?;SET @varOther=?;SET @varEntryType=?;SET @varDescription=?;SET @varLocationName=?;SET @varVehRegNo=?;SET @varDriverId=? \
    CALL benz.sp_new_ExpensesEntry(@varWorkDate,@varRent,@varDelhiEntry,@varDiesel,@varRepairing,@varRepairingId,@varFood,@varKaanta,@varTollTax,@varOther,@varEntryType,@varDescription,@varLocationName,@varVehRegNo,@varDriverId);";

  mysqlConnection.query(
    sql,
    [
      user.varWorkDate,
      user.varRent,
      user.varDelhiEntry,
      user.varDiesel,
      user.varRepairing,
      user.varRepairingId,
      user.varFood,
      user.varKaanta,
      user.varTollTax,
      user.varOther,
      user.varEntryType,
      user.varDescription,
      user.varLocationName,
      user.varVehRegNo,
      user.varDriverId,
    ],
    (err, rows, fields) => {
      if (!err) {
        // console.log(rows.RowDataPacket);
        rows.forEach((element) => {
          if (element.constructor == Array) {
            //  console.log(element);
            res.status(201).json(" Inserted Record :" + element[0].idExpenses);
          }
        });
      } else {
        if (err.errno == 1062) {
          res.status(409).send("Record Already Exisists");
        } else {
          res.status(400).json(err);
        }
      }
    }
  );
});

router.put("/", (req, res) => {
  let user = req.body;

  var sql =
    "SET @_userid=?;SET @_password=?;SET @_email=?;SET @_phone=?; \
    CALL SpUsersEdit(@_userid,@_password,@_email,@_phone);";

  mysqlConnection.query(
    sql,
    [user.userid, user.password, user.email, user.phone],
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
router.patch("/", (req, res) => {
  mysqlConnection.query(
    "SELECT max(`idExpenses`)+1 AS idExpenses  FROM benz.Expenses;",
    (err, results) => {
      if (err) {
        return res.json(err);
      } else {
        return res.json({
          MAXID: results,
        });
      }
    }
  );
});
module.exports = router;
