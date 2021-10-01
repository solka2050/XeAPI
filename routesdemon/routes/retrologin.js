var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connectApp")();
const auth=require("../config/auth");

var routes = function () {
       
        
    router.get("/",(req,res)=> {
            conn.connect().then(function () {
		var sqlQuery = "SELECT [Code],[Description],[Customer Price Group Code] FROM [SkylarkDB].[dbo].[Skylark Feeds Pvt_ Ltd_$State]";
                // console.log("Query:"+sqlQuery);
                var myConn = new sql.Request(conn);
                      req.query(sqlQuery ,(err, results)=>{
                        if(err)
                            {
                                    return res.json(err);
                            }
                            else
                            {
                                return res.json({ States:results })
                            }
                        })
      			conn.close();
                })        
   
        return router;
    })
}
    
    module.exports = routes;