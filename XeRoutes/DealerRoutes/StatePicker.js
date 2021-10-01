const Express = require("express");
const mysqlConnection = require("../../connmysql");
const router = Express.Router();



router.get("/", (req, res) => {
    let OrderType = req.query.varOrderType;
    var sql ="SELECT distinct(statename) AS State FROM currency_kharido.pincode ORDER By statename;";
    mysqlConnection.query(sql, (err, results) => {
        if (err) {
  
            return res.json(err);
        }
        else {
            return res.json({
                states: results
            })
        }
    })
  
  })

  module.exports = router;