var express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const LocationRoutes = require("./routes/Locations");
const VehiclesRoutes = require("./routes/Vehicles");
const VehicleSelRoutes = require("./routes/VehicleSelect");
const UsersRoutes = require("./routes/Users");
const DriversRoutes = require("./routes/Drivers");
const LoginRoutes = require("./routes/login");
const PostsRoutes = require("./routes/post");
const expenseRoutes = require("./routes/expenseDetails");
const PostsDataRoutes = require("./routes/postdata");

const MobileUserRoutes = require("./routes/mobileUserLogin");
const UpdateDataRoutes = require("./routes/UpdateEntry");
const RepairRoutes = require("./routes/newRepaitEntry");
const UploadRoutes = require("./routes/upload");
const MonthlyEntriesRoutes = require("./routes/monthlyEntries");
const filteredEntires = require("./routes/filters");

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/Locations", LocationRoutes);
app.use("/vehicles", VehiclesRoutes);
app.use("/vecSelect",VehicleSelRoutes),
app.use("/users",UsersRoutes);
app.use("/drivers",DriversRoutes);
app.use("/login", LoginRoutes);
app.use("/expenseEntry", PostsRoutes);
app.use("/postdetail", PostsDataRoutes);
app.use("/expense", expenseRoutes);
app.use("/monthlyEntries", MonthlyEntriesRoutes);
app.use("/filteredEntires", filteredEntires);


app.use("/appuser", MobileUserRoutes);
app.use("/updatedata", UpdateDataRoutes);
app.use("/repairentry",RepairRoutes);
app.use("/upload",UploadRoutes);

app.listen(process.env.PORT);
