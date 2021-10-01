var express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");

var compression = require('compression');
var helmet = require('helmet');
require("dotenv").config();
/* not to remove*/
const LocationRoutes = require("./XeRoutes/Locations");
const MonthlyEntriesRoutes = require("./XeRoutes/monthlyEntries");


const UploadRoutes = require("./routes/upload");

const filteredEntires = require("./routes/filters");

const terminalRoute = require("./XeRoutes/terminalfilter");
const marketRoute = require("./XeRoutes/markettable");


var app = express();
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));


const CurrencyListRoute = require("./XeRoutes/currencyList");
/* Route for Currecny Terminal Filters*/

app.use("/terminal", terminalRoute);
app.use("/market", marketRoute);


/*---------------------------------------------------------*/

/*Admin Routes */
const AdminDealerList = require("./XeRoutes/adminRoutes/listDealer");
app.use("/admindealerlist", AdminDealerList)

const AdminDealerList1 = require("./XeRoutes/adminRoutes/dealerEdit");
app.use("/dealerpost", AdminDealerList1)

const statePickerDropdown = require("./XeRoutes/DealerRoutes/StatePicker");
app.use("/pickstate", statePickerDropdown)

const LoginRoutes = require("./routes/login");
app.use("/login", LoginRoutes);

const UsersRoutes = require("./routes/Users");
app.use("/users", UsersRoutes);
/*- PinCode-------------------------------------------------------- */

const areasearchRoute = require("./XeRoutes/pincodeSearch");
app.use("/pincode", areasearchRoute);
/*---------------------------------------------------------*/

/*---------------------------------------------------------*/

/*Dealer Routes */

const DealerLogin = require("./XeRoutes/DealerRoutes/Login");
app.use("/dealerlogin", DealerLogin)

const DealerLoginPass = require("./XeRoutes/DealerRoutes/PasswordUpdater");
app.use("/dealerloginpass", DealerLoginPass)



/*---------------------------------------------------------*/

app.use("/symbols", CurrencyListRoute);

app.use("/Locations", LocationRoutes);


app.use("/monthlyEntries", MonthlyEntriesRoutes);
app.use("/filteredEntires", filteredEntires);



app.use("/upload", UploadRoutes);
app.use('/images', express.static(__dirname + '/images'));

//app.listen(process.env.PORT);


const https = require("https");
const fs = require('fs');

const cert = fs.readFileSync('currencykharido_com.crt');
const ca = fs.readFileSync('currencykharido_com.ca-bundle');
const key = fs.readFileSync('currencykharido_com.key');
//const passkey='172D3658FAAA7';
const passkey = 'V^9*%L#650nZ';

let options = {
   cert: cert, // fs.readFileSync('./ssl/example.crt'),
   ca: ca, // fs.readFileSync('./ssl/example.ca-bundle'),
   key: key // fs.readFileSync('./ssl/example.key')
};

// also okay: https.createServer({cert, ca, key}, (req, res) => { ...
////////////////////////////////////////

if (process.env.NODE_ENV == "development") {
   console.error("Running in " + process.env.NODE_ENV);

   app.listen(process.env.PORT, () => {
      console.error(`listening on: http://localhost:${process.env.PORT}` + " In " + process.env.NODE_ENV + " Mode.");

   });
} else {
   https.createServer(options, app).listen(process.env.PORT);
   var datetime = new Date();
   var message = "HTTPS Server runnning on Port:- " + process.env.PORT + " Started at :- " + datetime;
   console.log(message); ////////
}