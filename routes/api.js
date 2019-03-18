const router = require("express").Router();
const Contact = require("../models");
const addressBookController = require("../controllers");

// TODO map indices
router.get("/", (req, res) => {
  res.json("hello world");
});

router.post("/contact", (req, res) => {
  const contact = new Contact(req.body);
  //TODO: if contact is valid do
  addressBookController.addContact(contact);
});

router
  //get contact by name
  .get("/contact/:name", (req, res) => {
    addressBookController
      .getContact(req.params.name)
      .then(result => {
        if (result.found) res.json(result);
      })
      .catch(err => res.json(err.message));
  })
  // update contact by name
  .put("/contact/:name", (req, res) => {
    addressBookController.updateContact(req.params.name, req.body);
  })
  // delete contact by name
  .delete("/contact/:name", (req, res) => {
    addressBookController
      .deleteContact(req.params.name)
      .then(result => {
        if (result.result === "deleted") res.json(result.result);
      })
      .catch(err => {
        res.json(err.message);
      });
  });

module.exports = router;
