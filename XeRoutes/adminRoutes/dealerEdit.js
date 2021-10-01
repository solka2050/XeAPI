const Express = require("express");
const mysqlConnection = require("../../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
var moment= require("moment");

router.post("/", (req, res) => {
    let user = req.query;
    
    mysqlConnection.query("UPDATE `currency_kharido`.`DealerData` SET `isVarified` = " + user.varStatus + " WHERE `idDealerData` =" + user.id + " ;", (err, results) => {
        if (err) {

            return res.json(err);
        } else {
          //  console.log(results);
            return res.json({
                Drivers: results
            })
        }
    })

})

router.put("/", (req, res) => {
    let user = req.query;
    let query1="UPDATE `currency_kharido`.`DealerData` SET `Status` = " + user.varStatus + " WHERE `idDealerData` =" + user.id + " ;"
    console.log(query1);
    mysqlConnection.query(query1, (err, results) => {
        if (err) {

            return res.json(err);
        } else {
          //  console.log(results);
            return res.json({
                Drivers: results
            })
        }
    })

})

router.put("/:id", (req, res) => {
    let user = req.body;
    let iduser= req.params.id;
    console.log("This is the id::"+iduser);
    
    
  let query1="UPDATE `currency_kharido`.`DealerData` SET `Name` ='"+ user.name+"',`Location` = '"+user.address+"',`PinCode` = '"+user.pinCode+"',`State` = (SELECT statename FROM pincode where `pincode`= '"+user.pinCode+"' limit 1),`ContactNo` ='"+ user.Phone+"',`Email` = '"+user.email+"',`License` = '"+user.LicNo+"',`LicenseExpiryDate` = '"+user.licdate+"',`Mobile` = '"+user.Phone+"',`GSTIN` = '"+user.gstin+"',`ContactPerson` = '"+user.contactPerson+"',`Pan` = '"+user.PAN+"',`logoPath` = '"+user.logoPath+"',`Password` = '"+user.password+"',`Area` = '"+user.area+"',`updatedAt` = CURRENT_TIMESTAMP(),`PlanExpireDate` = '"+user.plandate+"' WHERE `idDealerData` = "+iduser+";";
    //console.log(query1);
    mysqlConnection.query(query1, (err, results) => {
        if (err) {

            return res.json(err);
        } else {
          //  console.log(results);
            return res.json({
                Drivers: results
            })
        }
    })
    //console.log("I am in inside sudhir")
    //console.log(user);
    //res.json(user);

})

  router.delete("/:idLocations", (req, res) => {
    
    var sql ="SET @id=?;CALL Delete_Dealer_With_Listing(@id);";
      
  
    mysqlConnection.query(
      sql,
      [req.params.idLocations],
      (err, results) => {
        if (!err) {
          
              res.status(202).json({Message:"Record Deleted Successfully"});
            
          
        } else {
          res.status(400).send(JSON.stringify(err, undefined, 2));
        }
      }
    );
  });

module.exports = router;