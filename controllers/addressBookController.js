require("../models");
const db = require("../db");

const INDEX = process.env.INDEX || "addressbook";
const TYPE_DOCUMENT = process.env.TYPE_DOCUMENT || "contact";

module.exports = {
  getAllContacts: async function(pageSize, page) {
    const from = (page - 1) * pageSize;
    return await db.search({
      index: INDEX,
      type: TYPE_DOCUMENT,
      body: {
        size: pageSize,
        from: from,
        query: {
          match_all: {}
        }
      }
    });
  },
  getContactsByQuery: async function(pageSize, page, query) {
    const from = (page - 1) * pageSize;
    return await db.search({
      index: INDEX,
      type: TYPE_DOCUMENT,
      body: {
        size: pageSize,
        from: from,
        query: {
          query_string: {
            // search performed on all fields
            // (next line can be uncommented to search only in the 'name' field)
            // default_field: "name",
            query: query
          }
        }
      }
    });
  },
  getContactByName: async function(name) {
    return await db.search({
      index: INDEX,
      type: TYPE_DOCUMENT,
      body: {
        query: {
          match: { name: name }
        }
      }
    });
  },
  addContact: async function(contact) {
    const { name, address, phone, email } = contact;
    return await db.index({
      index: INDEX,
      type: TYPE_DOCUMENT,
      body: {
        name: name,
        address: address,
        phone: phone,
        email: email
      }
    });
  },
  updateContact: async function(qName, contact) {
    const { name, address, phone, email } = contact;
    return await db.updateByQuery({
      index: INDEX,
      type: TYPE_DOCUMENT,
      body: {
        query: {
          match: { name: qName }
        },
        script: `ctx._source.name = '${name}'; ctx._source.address = '${address}'; ctx._source.phone = '${phone}'; ctx._source.email = '${email}';`
      }
    });
  },
  deleteContact: async function(name) {
    return await db.deleteByQuery({
      index: INDEX,
      type: TYPE_DOCUMENT,
      body: {
        query: {
          match: { name: name }
        }
      }
    });
  }
};
