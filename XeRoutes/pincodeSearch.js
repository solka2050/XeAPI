//SELECT officename FROM pincode where pincode='110007';

const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");


router.get("/", (req, res) => {
    //console.log(req.query);
    let PinCode = req.query.Pincode;
    

    var sql =
      "SELECT officename FROM currency_kharido.pincode where pincode='"+PinCode+"';";
    mysqlConnection.query(sql, (err, results) => {
        if (err) {
  
            return res.json(err);
        }
        else {
            return res.json({
                results: results
            })
        }
    })
  
  })

  module.exports = router;