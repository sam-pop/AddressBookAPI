const db = require("../db");

const INDEX = process.env.INDEX || "addressbook";
const TYPE_DOCUMENT = process.env.TYPE_DOCUMENT || "contact";

db.indices
  .putMapping({
    index: INDEX,
    type: TYPE_DOCUMENT,
    body: {
      contact: {
        properties: {
          name: { type: "text" },
          address: { type: "text" },
          phone: { type: "text" },
          email: { type: "text" }
        }
      }
    }
  })
  .catch(err => console.log(err.message));
