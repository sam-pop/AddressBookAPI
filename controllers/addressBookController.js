const Contact = require("../models");
const db = require("../db");

const indexName = "addressbook";
const documentType = "contacts";

module.exports = {
  getAllContacts: function(pageSize, pageOffset, query) {},
  getContact: function(name) {
    db.get({
      index: indexName,
      type: documentType,
      id: name
    });
  },
  addContact: function(contact) {
    const { name, address, phone, email } = contact;
    db.create({
      index: indexName,
      type: documentType,
      id: name,
      body: {
        address: address,
        phone: phone,
        email: email
      }
    });
  },
  updateContact: function(name) {},
  deleteContact: function(name) {}
};
