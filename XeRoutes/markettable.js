const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");


router.get("/", (req, res) => {
    let OrderType = req.query.varOrderType;
    var sql =
      "SELECT id, Code, Name, Amount, SalePrice, BuyPrice,\
      (SELECT Name FROM DealerData where idDealerData=UserId) As Dealer,\
      (SELECT State FROM DealerData where idDealerData=UserId) As State,\
      (SELECT officename FROM DealerData where idDealerData=UserId) As Area,\
      OrderType, Status, Visibility, DATE_FORMAT(DateAdded, '%d-%m-%Y') AS Date,\
      UserId FROM CurrencyData where Visibility='Visible' AND\
      Status='Open' AND OrderType='"+OrderType+"';";
      console.log(sql);
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

  router.post("/", (req, res) => {
    let OrderType = req.query.varOrderType;
    let StateName = req.query.varStateName;
    var sql =
      "SELECT id, Code, Name, Amount, SalePrice, BuyPrice,(SELECT Name FROM DealerData where idDealerData=UserId) As Dealer,\
      OrderType, Status, Visibility,\
      DATE_FORMAT(DateAdded, '%d-%m-%Y') AS Date,\
      (SELECT State FROM DealerData where idDealerData=UserId) As State,\
      (SELECT officename FROM DealerData where idDealerData=UserId) As Area,\
      UserId FROM CurrencyData where Visibility='Visible' AND Status='Open' AND OrderType='"+OrderType+"' AND\
      UserId in (SELECT idDealerData FROM DealerData where State = '"+StateName+"');";
      console.log(sql);
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



  module.exports = router;