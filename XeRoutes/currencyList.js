const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
const { checkToken } = require("../auth/token_validation");

router.get("/", (req, res) => {
    mysqlConnection.query("SELECT idCurrencyList,Country,Currency,AlphaCode,Symbol FROM CurrencyList;", (err, results) => {
        if (err) {

            return res.json(err);
        } else {
            return res.json({
                Entries: results
            })
        }
    })

})
router.post("/", (req, res) => {
    let user = req.query;

    var sql = "SET @varCode=?;SET @varName=?; SET @varAmount=?;SET @varSalePrice=?;SET @varBuyPrice=?;SET @varUserId=?;SET @varOrderType=?;SET @varStatus=?;SET @varVisibility=?; \
    CALL CurrencyData_ListCurrency(@varCode,@varName,@varAmount,@varSalePrice,@varBuyPrice,@varUserId,@varOrderType,@varStatus,@varVisibility);";


    mysqlConnection.query(sql, [user.varCode, user.varName,user.varAmount, user.varSalePrice,user.varBuyPrice, user.varUserId,user.varOrderType, user.varStatus,user.varVisibility], (err, rows, fields) => {
        if (!err) {

            rows.forEach(element => {
                if (element.constructor == Array) {
                    res.status(201).json({ InsertedID : + element[0].AffectedRows});
                }
            });
        }
        else {
            if (err.errno == 1062) {
                res.status(409).send("Line Already Exisists");
            }
            else {
                res.status(400).json(err);
            }
        }
    })

})
module.exports = router;