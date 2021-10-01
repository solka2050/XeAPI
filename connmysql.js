var mysql = require("mysql");
/*const connection = mysql.createConnection({
  host: '192.168.1.126',
  // user: 'root',
  // password: 'l(}NHmUD3${#&IfI8rc(uuZC!novd!',
  user: 'adminer',
  password: 'Googleit@9211',
  database: 'dhulltra_benz',
  multipleStatements: true
});


connection.connect((err) => {
  if (!err) {
    console.log("DB is Connected");
  }
  else {
    console.log("Connection Failed" + JSON.stringify(err, undefined, 2));
  }
});
*/


if (process.env.NODE_ENV == "development"){
  var db_config = {
    host: process.env.developmenthost,
    user: process.env.developmentusername,
    password: process.env.developmentpassword,
    database: 'currency_kharido',
    multipleStatements: true,
    port:3306
  };
} else {
  var db_config = {
    host: process.env.ip,
    user: process.env.user,
    password: process.env.password,
    database: 'currency_kharido',
    multipleStatements: true,
    port:7614
  };
}

var connection;
//connection = mysql.createConnection(db_config);

function handleDisconnect() {
  var datetime = new Date();
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {
    // The server is either down
    if (!err) {
      
      console.log("DB is Connected " + datetime);
    } else {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("DB is DisConnected " + datetime);
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}

handleDisconnect();
module.exports = connection;
