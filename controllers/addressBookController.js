require("../models");
const db = require("../db");

const INDEX = process.env.INDEX || "addressbook";
const TYPE_DOCUMENT = process.env.TYPE_DOCUMENT || "contact";

module.exports = {
  getAllContacts: function(pageSize, pageOffset, query) {},
  getContact: function(name) {
    return db.get({
      index: INDEX,
      type: TYPE_DOCUMENT,
      id: name
    });
  },
  addContact: function(contact) {
    // const { name, address, phone, email } = contact;
    const { name } = contact;
    return db.create({
      index: INDEX,
      type: TYPE_DOCUMENT,
      id: name,
      body: contact
    });
  },
  updateContact: function(name, contact) {
    const contactToAdd = new Contact(contact);
    return db.update({
      index: INDEX,
      type: TYPE_DOCUMENT,
      id: name,
      body: { ...contactToAdd, doc: { title: "Updated" } }
    });
  },
  deleteContact: function(name) {
    return db.delete({
      index: INDEX,
      type: TYPE_DOCUMENT,
      id: name
    });
  }
};
