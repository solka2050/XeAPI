const Express = require("express");
const mysqlConnection = require("../../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");

router.put("/", (req, res) => {
    let user = req.body;
    
     let token = req.headers.authorization.split(" ")[1];
    token= token.slice(0, -1);
    token= token.slice(1);
    
    


    var sql = "SET @id="+user.id+";SET @token='"+token+"';SET @password='"+user.password+"'; \
    CALL DealerPasswordUpdater(@id,@token,@password);";
    
    console.log(sql);

    mysqlConnection.query(sql, (err, rows, fields) => {
        
        if (!err) {
		//console.log(rows);
            rows.forEach(element => {
                if (element.constructor == Array) {
		            let msg =(element[0].PasswordUpdateStatus);
                   if( msg==='User not Found Or No'){
                    return res.status(401).json({
                        success: 0,
                        message: "invalid credentials"
                    });
                   }
                    res.json({
                        success: 0,
                        message: msg
                    })
                }
            });

        } else if (results < 1) {
	        console.log(err);
            return res.status(401).json({
                success: 0,
                message: "invalid credentials"
            });
        } else {
            console.log(err);
            return res.status(401).json({
                success: 0,
                message: "invalid credentials"
            });
        }


    })


})


module.exports = router;