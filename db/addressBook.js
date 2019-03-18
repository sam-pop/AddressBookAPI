const elasticsearch = require("elasticsearch");

// elasticsearch client setup
const db = new elasticsearch.Client({
  host: "localhost:9200"
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
