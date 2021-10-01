const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
//Get all Entry Details
router.get("/", (req, res) => {

 
 // console.log(req.params);
  var sqlqueryupdates="SET @varCode=?;SET @TypeOfOrder=?;SET @varStatus=?;SET @varVisibility=?;CALL CurrencyData_MarketOrders(@varCode,@TypeOfOrder,@varStatus,@varVisibility)"

                      mysqlConnection.query(
                        sqlqueryupdates,[req.query.varCode,req.query.TypeOfOrder,req.query.varStatus,req.query.varVisibility],
                        (err, results, fields) => {
                          if (!err) {
                            console.clear();
                            // console.log(results);
                            //var Array = rows;
                            res.json({
                              
                              QuickWatch: results[4],
                            
  
                            });
                          } else {
                            console.log(err);
                          }
                        }
                      );
  });

router.get("/:isVarified", (req, res) => {
  console.log(req.params.isVarified);
  var sqlqueryupdates="SET @varIsVarified=?;CALL isVarifiedState(@varIsVarified)"
  
                      mysqlConnection.query(
                        sqlqueryupdates,[req.params.isVarified],
                        (err, results, fields) => {
                          if (!err) {
                           // console.clear();
                           //  console.log(results);
                            //var Array = rows;
                            res.json({
                             // Listings:results[1][0].Listings,
                             Locations: results[1]
  
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
  var sql =
    "SELECT id, Code, Name, Amount, SalePrice, BuyPrice,(SELECT Name FROM DealerData where idDealerData=UserId) As Dealer, OrderType, Status, Visibility, DATE_FORMAT(DateAdded, '%d-%m-%Y') AS Date FROM CurrencyData where Visibility='Visible' AND Status='Open';";
  mysqlConnection.query(sql, (err, results) => {
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

router.post("/:Code", (req, res) => {
  var Code=req.params.Code;
  var sql =
    "SELECT id, Code, Name, Amount, SalePrice, BuyPrice,(SELECT Name FROM DealerData where idDealerData=UserId) As Dealer, OrderType, Status, Visibility, DATE_FORMAT(DateAdded, '%d-%m-%Y') AS Date FROM CurrencyData where Visibility='Visible' AND Status='Open' AND Code='"+Code+"';";
  mysqlConnection.query(sql, (err, results) => {
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
    "SELECT max(`idExpenses`)+1 AS idExpenses  FROM dhulltra_benz.Expenses;",
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
    FORMAT(sum(Total),0,'en_IN') AS Total,FORMAT(sum(Balance),0,'en_IN') AS Balance FROM dhulltra_benz.Expenses \
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
