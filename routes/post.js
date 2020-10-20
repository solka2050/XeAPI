const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
//Get all Entry Details
router.get("/", (req, res) => {
  let vechino = req.query.varVehRegNo;
  let fromdate = req.query.varFromDate;
  let todate = req.query.varToDate;
  var sqlstring="select idExpenses, DATE_FORMAT(WorkDate, '%d-%m-%Y') AS WorkDate,FORMAT(Rent,0,'en_IN') AS Rent,\
  FORMAT(DelhiEntry,0,'en_IN') AS DelhiEntry,FORMAT(Diesel,0,'en_IN') AS Diesel,FORMAT(Repairing,0,'en_IN') AS Repairing, RepairingId,FORMAT(Food,0,'en_IN') AS Food,\
  FORMAT(Kaanta,0,'en_IN') AS Kaanta,FORMAT(TollTax,0,'en_IN') AS TollTax,FORMAT(Other,0,'en_IN') AS Other,FORMAT(Total,0,'en_IN') AS Total,FORMAT(Balance,0,'en_IN') AS Balance,\
  EntryType, Description, LocationName,VehRegNo FROM benz.Expenses where VehRegNo=" +vechino +" && WorkDate>=" +fromdate +" && WorkDate<=" +todate +" ORDER BY DATE(WorkDate);";

 // console.log(sqlstring);
  mysqlConnection.query(sqlstring,

    (err, results) => {
      if (err) {
        return res.json(err);
      } else {
        return res.json({
          Entries: results,
        });
      }
    }
  );
});
/* get Repair Entry
select idExpenses, DATE_FORMAT(WorkDate, '%d-%m-%Y') AS WorkDate,FORMAT(Rent,0,'en_IN') AS Rent,\
  FORMAT(DelhiEntry,0,'en_IN') AS DelhiEntry,FORMAT(Diesel,0,'en_IN') AS Diesel,FORMAT(Repairing,0,'en_IN') AS Repairing, RepairingId,FORMAT(Food,0,'en_IN') AS Food,\
  FORMAT(Kaanta,0,'en_IN') AS Kaanta,FORMAT(TollTax,0,'en_IN') AS TollTax,FORMAT(Other,0,'en_IN') AS Other,FORMAT(Total,0,'en_IN') AS Total,FORMAT(Balance,0,'en_IN') AS Balance,\
  EntryType, Description, LocationName,VehRegNo FROM benz.Expenses where VehRegNo=" +vechino +" && WorkDate>=" +fromdate +" && WorkDate<=" +todate +" &&  Repairing>0 && EntryType <>'Monthly Expenses' \
&& EntryType <> 'Monthly Kist' && EntryType <> 'Monthly EMI' && EntryType <> 'Monthly Chakkar' && EntryType <> 'Monday' ORDER BY DATE(WorkDate);
*/
//get specific userinformation
/* select FORMAT(sum(Rent),0,'en_IN') AS Rent,FORMAT(sum(DelhiEntry),0,'en_IN') AS DelhiEntry,FORMAT(sum(Diesel),0,'en_IN') AS Diesel,FORMAT(sum(Repairing),0,'en_IN') AS Repairing,
FORMAT(sum(Food),0,'en_IN') AS Food,FORMAT(sum(Kaanta),0,'en_IN') AS Kaanta,
FORMAT(sum(TollTax),0,'en_IN') AS TollTax,FORMAT(sum(Other),0,'en_IN') AS Other,FORMAT(sum(Total),0,'en_IN') AS Total,FORMAT(sum(Balance),0,'en_IN') AS Balance FROM benz.Expenses
 where VehRegNo='HR-56-B-3692' && WorkDate>'2020-05-01 00:00:00' && WorkDate<'2020-05-14 23:59:59';*/
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
  //console.log(user);

  var sql =
    "SET @varWorkDate=?;SET @varRent=?;SET @varDelhiEntry=?;SET @varDiesel=?;SET @varRepairing=?;SET @varRepairingId=?;SET @varFood=?;SET @varKaanta=?;SET @varTollTax=?;SET @varOther=?;SET @varEntryType=?;SET @varDescription=?;SET @varLocationName=?;SET @varVehRegNo=?;SET @varDriverId=?; \
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
router.delete("/", (req, res) => {
  let vechino = req.query.varVehRegNo;
  let fromdate = req.query.varFromDate;
  let todate = req.query.varToDate;

  mysqlConnection.query(
    "select FORMAT(sum(Rent),0,'en_IN') AS Rent,FORMAT(sum(DelhiEntry),0,'en_IN') AS DelhiEntry,FORMAT(sum(Diesel),0,'en_IN') AS Diesel,FORMAT(sum(Repairing),0,'en_IN') AS Repairing,\
    FORMAT(sum(Food),0,'en_IN') AS Food,FORMAT(sum(Kaanta),0,'en_IN') AS Kaanta,FORMAT(sum(TollTax),0,'en_IN') AS TollTax,FORMAT(sum(Other),0,'en_IN') AS Other,\
    FORMAT(sum(Total),0,'en_IN') AS Total,FORMAT(sum(Balance),0,'en_IN') AS Balance FROM benz.Expenses \
    where VehRegNo=" +
      vechino +
      " && WorkDate>=" +
      fromdate +
      " && WorkDate<=" +
      todate +
      " ORDER BY DATE(WorkDate) DESC;",

    (err, results) => {
      if (err) {
        return res.json(err);
      } else {
        return res.json({
          Entries: results,
        });
      }
    }
  );
});
module.exports = router;
