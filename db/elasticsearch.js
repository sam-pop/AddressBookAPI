const elasticsearch = require("elasticsearch");

const HOST = process.env.ELASTICSEARCH_HOST || "localhost";
const PORT = process.env.ELASTICSEARCH_PORT || 9200;
const INDEX = process.env.INDEX || "addressbook";

// elasticsearch client setup
const db = new elasticsearch.Client({
  host: `${HOST}:${PORT}`
});

// check connection to elasticsearch cluster
db.ping(
  {
    requestTimeout: 1000
  },
  function(error) {
    if (error) {
      console.trace("elasticsearch cluster is down!");
    } else {
      console.log("elasticsearch cluster OK!");
      // check if our index exists, if not it creates a new index
      db.indices.exists(
        {
          index: INDEX
        },
        (error, exists) => {
          if (!exists) {
            db.indices
              .create({ index: INDEX })
              .then(() => console.log(`${INDEX} index created.`))
              .catch(err => console.log(err.message));
          }
        }
      );
    }
  }
);

module.exports = db;
