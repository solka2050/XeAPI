//SELECT officename FROM pincode where pincode='110007';

const Express = require("express");
const mysqlConnection = require("../../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
var moment= require("moment");

router.get("/", (req, res) => {
    //console.log(req.query);
    let PinCode = req.query.Pincode;
    

    var sql =
      "SELECT idDealerData, Name, Location, PinCode, State, ContactNo, Email, License,DATE_FORMAT(LicenseExpiryDate, '%d-%m-%Y') AS LicenseExpiryDate, Mobile, GSTIN, ContactPerson, Pan, isVarified, logoPath,\
      officename, divisionname, regionname, circlename, Taluk, Districtname, statename, `Related Suboffice`, `Related Headoffice`,Status FROM DealerData;";
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
  router.get("/:idDealerData", (req, res) => {
    //console.log(req.query);
    let Id = req.params.idDealerData;
    

    var sql =
      "SELECT `idDealerData`,`Name`,`Location`,`PinCode`,`State`,`ContactNo`,`Email`,`License`,DATE_FORMAT(LicenseExpiryDate, '%Y-%m-%d') AS `LicenseExpiryDate`,\
      `Mobile`,`GSTIN`,`ContactPerson`,`Pan`,`isVarified`,`logoPath`,`officename`,`divisionname`,`regionname`,`circlename`,`Taluk`,`Districtname`,`statename`,`Related Suboffice`,`Related Headoffice`,`Password`,`PlanExpireDate` FROM `currency_kharido`.`DealerData`\
       where idDealerData="+Id+";"
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
  router.post("/", (req, res) => {
    console.log(req.body);
    let Id = req.params.idDealerData;
   
   // console.log(mysqlTimestamp);

    var sql =
      "SELECT `idDealerData`,`Name`,`Location`,`PinCode`,`State`,`ContactNo`,`Email`,`License`,DATE_FORMAT(LicenseExpiryDate, '%Y-%m-%d') AS `LicenseExpiryDate`,\
      `Mobile`,`GSTIN`,`ContactPerson`,`Pan`,`isVarified`,`logoPath`,`officename`,`divisionname`,`regionname`,`circlename`,`Taluk`,`Districtname`,`statename`,`Related Suboffice`,`Related Headoffice`,`Password` FROM `currency_kharido`.`DealerData`;"
       //where idDealerData="+Id+";"
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
  router.post("/:idDealerData", (req, res) => {
    //console.log(req.query);
    let Id = req.params.idDealerData;
    

    var sql =
      "SET @word1='"+Id+"';\
      SET @UseridOther =(SELECT UserId FROM currency_kharido.CurrencyData where Code   LIKE  CONCAT('%', @word1, '%') OR Name   LIKE  CONCAT('%', @word1, '%') LIMIT 1) ;\
      SELECT `idDealerData`,`Name`,`Location`,`State` FROM `currency_kharido`.`DealerData`\
      where `idDealerData`  LIKE  CONCAT('%', @word1, '%') OR `idDealerData`  LIKE  CONCAT('%', @UseridOther, '%') OR  `Name` LIKE CONCAT('%', @word1, '%') OR  `Location` LIKE CONCAT('%', @word1, '%') OR  `PinCode` LIKE CONCAT('%', @word1, '%') OR  `State` LIKE CONCAT('%', @word1, '%') OR  `ContactNo` LIKE CONCAT('%', @word1, '%') OR  `Email` LIKE CONCAT('%', @word1, '%') OR  `License` LIKE CONCAT('%', @word1, '%') OR  `LicenseExpiryDate` LIKE CONCAT('%', @word1, '%') OR  `Mobile` LIKE CONCAT('%', @word1, '%') OR  `GSTIN` LIKE CONCAT('%', @word1, '%') OR  `ContactPerson` LIKE CONCAT('%', @word1, '%') OR  `Pan` LIKE CONCAT('%', @word1, '%') OR  `isVarified` LIKE CONCAT('%', @word1, '%') OR  `logoPath` LIKE CONCAT('%', @word1, '%') OR  `officename` LIKE CONCAT('%', @word1, '%') OR  `divisionname` LIKE CONCAT('%', @word1, '%') OR  `regionname` LIKE CONCAT('%', @word1, '%') OR  `circlename` LIKE CONCAT('%', @word1, '%') OR  `Taluk` LIKE CONCAT('%', @word1, '%') OR  `Districtname` LIKE CONCAT('%', @word1, '%') OR  `statename` LIKE CONCAT('%', @word1, '%') OR  `Related Suboffice` LIKE CONCAT('%', @word1, '%') OR  `Related Headoffice` LIKE CONCAT('%', @word1, '%') OR  `Area` LIKE CONCAT('%', @word1, '%');" 
    mysqlConnection.query(sql, (err, results) => {
        if (err) {
  
            return res.json(err);
        }
        else {
            return res.json({
                results: results[2]
            })
        }
    })
  
  })
  router.put("/", (req, res) => {
    let user = req.body;
    let licdate= moment(req.body.licdate).format('YYYY-MM-DD HH:mm:ss');
    var sql =
      "SET @varName=?;SET @varLocation=?;SET @varPinCode=?;SET @varState=?;\
      SET @varContactNo=?;SET @varEmail=?;SET @varLicense=?;SET @varLicenseExpiryDate=?;\
      SET @varMobile=?;SET @varGSTIN=?;SET @varContactPerson=?;SET @varPan=?;\
      SET @varisVarified=?;SET @varlogoPath=?;SET @varofficename=?;SET @vardivisionname=?;\
      SET @varregionname=?;SET @varcirclename=?;SET @varTaluk=?;SET @varDistrictname=?;\
      SET @varstatename=?;SET @varRelatedSuboffice=?;SET @varRelatedHeadoffice=?;\
      SET @varPassword=?; \
      CALL DealerData_NewDealer(@varName,@varLocation,@varPinCode,@varState,\
        @varContactNo,@varEmail,@varLicense,@varLicenseExpiryDate,@varMobile,\
        @varGSTIN,@varContactPerson,@varPan,@varisVarified,\
        @varlogoPath,@varofficename,@vardivisionname,@varregionname,@varcirclename,@varTaluk,\
        @varDistrictname,@varstatename,@varRelatedSuboffice,@varRelatedHeadoffice,@varPassword);";
       
        
    mysqlConnection.query(
      sql,
      [user.name, user.address, user.pinCode,'Delhi', user.Phone,user.email,
       user.LicNo,licdate,user.Phone,user.gstin,user.contactpersonname,user.PAN,1,
      user.logoPath,user.area,'','','','','','','','' ,user.password],
      (err, rows, fields) => {
        if (!err) {
          console.log(rows);
         rows.forEach((element) => {
            if (element.constructor == Array) {
              res.status(202).json({Message:"New Record Added Successfully"});
            }
          });
        } else {
          res.status(400).send(JSON.stringify(err, undefined, 2));
        }
      }
    );
  });
   // Listed Currecny Delete
  router.delete("/:idList", (req, res) => {
    //console.log(req.query);
    let Id = req.params.idList;
    

    var sql =
      "DELETE FROM `currency_kharido`.`CurrencyData` WHERE id="+Id+";"
    mysqlConnection.query(sql, (err, results) => {
        if (err) {
  
            return res.json(err);
        }
        else {
          console.log(results);
            return res.json({
                
                results: results
            })
        }
    })
  
  });
  module.exports = router;