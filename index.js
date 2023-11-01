const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const { connectDB } = require("./src/db/dbconnection");
const config = require("./src/config/config");
const cors = require("cors");
const routes = require("./src/routes/v1");
const path = require("path");
// require("./src/middlewares/upload");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors());
app.options("*", cors());

app.use(express.static(path.join(__dirname, `./public`)));

app.use("/v1", routes);

app.use((req, res, next) => {
  next(new Error("routes not found"));
});

connectDB();

const server = http.createServer(app);
server.listen(config.port, () => {
  console.log("server listing the port 5000" + config.port);
});
