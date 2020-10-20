const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
//Get all Entry Details
router.get("/", (req, res) => {
  let vechino = req.query.varVehRegNo;
  let fromdate = req.query.varFromDate;
  let todate = req.query.varToDate;
  var sqlstring="select count(*) AS TotalTripCount FROM benz.Expenses where VehRegNo=" +vechino +" && WorkDate>=" +fromdate +" && WorkDate<=" +todate +" && LocationName not in('Khali','M-Khali','M-Khali-');";

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
router.get("/:idExpenses/UpdateTotals", (req, res) => {
var sqlqueryupdates="CALL sp_UpdateTotals"

                    mysqlConnection.query(
                      sqlqueryupdates,
                      (err, results, fields) => {
                        if (!err) {
                          // console.log(rows);
                          //var Array = rows;
                          res.json({
                            AffectedRows: results.affectedRows,
                            ChangedRows:results.changedRows,
                            Message:"Updated Succuessfully"

                          });
                        } else {
                          console.log(err);
                        }
                      }
                    );
});

router.post("/", (req, res) => {
  let user = req.query;
  //console.clear();
  console.log(user);

  var sql =
    "SET @varWorkDate=?;SET @VarAmount=?;SET @VarAmount2=?;SET @VarAmount3=?;SET @VarTotalRounds=?;SET @varVehRegNo=?; \
    CALL benz.NewMonthlyEntry(@varWorkDate,@VarAmount,@VarAmount2,@VarAmount3,@VarTotalRounds,@varVehRegNo);";
  //  console.log(sql);
  mysqlConnection.query(
    sql,
    [
      user.varWorkDate,
      user.VarAmount,
      user.VarAmount2,
      user.VarAmount3,
      user.VarTotalRounds,
      user.varVehRegNo
    ],
    (err, results) => {
        if (err) {
            console.log(err);
          return res.json(err);
         
        } else {
            console.log(results);
          return res.json({
            MAXID: results,
          });
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
