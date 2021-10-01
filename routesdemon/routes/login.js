const Express = require("express");
const mysqlConnection = require("../connmysql");
const router = Express.Router();
var bodyParser = require("body-parser");
const { sign } = require("jsonwebtoken");
const { checkToken } = require("../auth/token_validation");
//Get all user Details
router.get("/", (req, res) => {
    //console.log(req.headers);
    var AccessToken;
    AccessToken='';
    let token = req.get("authorization");
    if (token){AccessToken = token.slice(7);}
    
  
    selectQuery = `SELECT id,Email as email,Password as password,FullName as name,avatar,Type as role,accessToken FROM dhulltra_benz.Users where accessToken='${AccessToken}'`;
    mysqlConnection.query(selectQuery,
        [AccessToken], (err, results) => {
          
            if (!err) {
                res.json(results[0]);
            } else {
                console.log(err);
            }
        })

})

//get specific userinformation

router.get("/:userid", (req, res) => {
    mysqlConnection.query("SELECT * from users where userid=?", [req.params.userid], (err, rows, fields) => {
        if (!err) {
            var Array = rows;
            res.json(Array[3]);
        } else {
            console.log(err);
        }
    })

})

//get specific userinformation
router.post("/", (req, res) => {
  // console.log(req.headers);
    var {
        email,
        password
    } = req.body;
   // console.log(req.body);
    const jsontoken = sign({
        user: req.body
    }, process.env.jwtkey, {
        expiresIn: "8h"
    });
    // console.log(jsontoken);
    var sql = "SET @varemail=?;SET @varpassword=?;SET @accessToken=?;\
    CALL sp_login_user(@varemail,@varpassword,@accessToken);";
    
    mysqlConnection.query(sql, [email, password, jsontoken], (err, rows, fields) => {
        
        if (!err) {
		//console.log(rows);
            rows.forEach(element => {
                if (element.constructor == Array) {
		
                   if( (element[0].id)==0){
                    return res.status(401).json({
                        success: 0,
                        message: "invalid credentials"
                    });
                   };
                    res.json({
                        id: element[0].id,
                        email: element[0].email,
                        password: element[0].password,
                        name: element[0].name,
                        avatar: ' ',
                        role: element[0].role,
                        accessToken: element[0].accessToken
                    })
                }
            });

      /*  } else if (results < 1) {
	
            return res.status(401).json({
                success: 0,
                message: "invalid credentials"
            });*/
        } else {
            return res.status(401).json({
                success: 0,
                message: "invalid credentials"
            });
        }


    })


})

router.get("/api", (req, res) => {
    let user = req.body;
    //SELECT id,Email as email,Password as password,FullName as name,avatar,Type as role,accessToken FROM dhulltra_benz.Users where email='' && Password='';

    var sql = "SET @_userid=?;SET @_password=?;SET @_email=?;SET @_phone=?; \
    CALL SpUsersInsert(@_userid,@_password,@_email,@_phone);";


    mysqlConnection.query(sql, [user.userid, user.password, user.email, user.phone], (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if (element.constructor == Array) {
                    res.status(201).json(" Inserted userid :" + element[0].userid);
                }
            });
        } else {
            if (err.errno == 1062) {
                res.status(409).send("User ID Already Exisists");
            } else {
                res.status(400).json(err);
            }
        }
    })

})

router.put("/", (req, res) => {
    let user = req.body;


    var sql = "SET @_userid=?;SET @_password=?;SET @_email=?;SET @_phone=?; \
    CALL SpUsersEdit(@_userid,@_password,@_email,@_phone);";


    mysqlConnection.query(sql, [user.userid, user.password, user.email, user.phone], (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if (element.constructor == Array) {
                    res.status(202).json('Updated Successfully');
                }
            });
        } else {
            res.status(400).send(JSON.stringify(err, undefined, 2));
        }
    })

})
router.delete("/", (req, res) => {
    var datetime = new Date();
    selectQuery1 = `SELECT  * FROM dhulltra_benz.Users `;
    mysqlConnection.query(selectQuery1,
         (err, results) => {
          
            if (!err) {
                res.json("Hello From Server "+datetime)
               console.log("Last API Refresh Called Time is "+datetime);
            } else {
                res.json(err);
            }
        })
    
})
module.exports = router;