const elasticsearch = require("elasticsearch");

const HOST = "localhost";
const PORT = 9200;

// elasticsearch client setup
const db = new elasticsearch.Client({
  host: `${HOST}:${PORT}`,
  log: "trace"
});

// check that elasticsearch server is running properly
db.ping(
  {
    requestTimeout: 1000
  },
  function(error) {
    if (error) {
      console.trace("elasticsearch cluster is down!");
    } else {
      console.log("elasticsearch cluster OK!");
    }
  }
);

module.exports = db;
