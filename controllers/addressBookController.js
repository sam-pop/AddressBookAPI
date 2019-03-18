const Contact = require("../models");
const db = require("../db");

const INDEX = "addressbook";
const DOCTYPE = "contacts";

module.exports = {
  getAllContacts: function(pageSize, pageOffset, query) {},
  getContact: function(name) {
    return db.get({
      index: INDEX,
      type: DOCTYPE,
      id: name
    });
  },
  addContact: function(contact) {
    // const { name, address, phone, email } = contact;
    const { name } = contact;
    const contactToAdd = new Contact(contact);
    return db.create({
      index: INDEX,
      type: DOCTYPE,
      id: name,
      body: contactToAdd
    });
  },
  updateContact: function(name, contact) {
    const contactToAdd = new Contact(contact);
    return db.update({
      index: INDEX,
      type: DOCTYPE,
      id: name,
      body: { ...contactToAdd, doc: { title: "Updated" } }
    });
  },
  deleteContact: function(name) {
    return db.delete({
      index: INDEX,
      type: DOCTYPE,
      id: name
    });
  }
};
