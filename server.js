const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const db = require("./db");

const PORT = process.env.PORT || 3001;
// init express app
const app = express();

// use & config bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API routes
app.use(routes);

// Start the API server
app.listen(PORT, function() {
  console.log(`🤖 API Server listening on PORT ${PORT}!`);
});
