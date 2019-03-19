const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const addressBookController = require("../controllers");

// GET
router
  // TODO: FINISH THIS ROUTE
  // http://localhost:3001/contact?pageSize={}&page={}&query={}
  .get("/contact", (req, res) => {
    if (req.query) {
      let { pageSize, page, query } = req.query;

      // query = JSON.parse(req.query.query);
      if (!pageSize || isNaN(pageSize)) pageSize = process.env.PAGE_SIZE || 10;
      if (!page || isNaN(page)) page = process.env.PAGE || 1;
      if (!query) {
        addressBookController
          .getAllContacts(pageSize, page)
          .then(result => {
            console.log(result);
            if (result.hits.total > 0)
              res.status(200).json(result.hits.hits.map(h => h._source));
            else res.status(404).send("No contacts");
          })
          .catch(err => {
            res.status(400).json(err.message);
          });
      } else {
        addressBookController
          .getContactByQuery(pageSize, page, query)
          .then(result => {
            console.log(result);
            if (result.hits.total > 0)
              res.status(200).json(result.hits.hits.map(h => h._source));
            else res.status(404).send("No contacts");
          })
          .catch(err => {
            res.status(400).json(err.message);
          });
      }
    }
  })
  // get contact by name
  .get("/contact/:name", (req, res) => {
    addressBookController
      .getContactByName(req.params.name)
      .then(result => {
        if (result.hits.total > 0)
          res.status(200).json(result.hits.hits.map(h => h._source));
        else res.status(404).json(`${req.params.name} could not be found.`);
      })
      .catch(err => {
        res.status(400).json(err.message);
      });
  });

// POST
router.post(
  "/contact",
  [
    check("name")
      .exists({ checkNull: true })
      .isLength({ min: 2 }),
    check("address")
      .optional()
      .isLength({ max: 200 }),
    check("phone")
      .optional()
      .isInt()
      .isLength({ max: 10 }),
    check("email")
      .optional()
      .isEmail()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    addressBookController
      .addContact(req.body)
      .then(() => res.status(201).json(`${req.body.name} was added!`))
      .catch(err => {
        res.status(400).json(err.message);
      });
  }
);

// PUT
router
  // update contact by name
  .put(
    "/contact/:name",
    [
      check("name")
        .exists({ checkNull: true })
        .isLength({ min: 2 }),
      check("address")
        .optional()
        .isLength({ max: 200 }),
      check("phone")
        .optional()
        .isInt()
        .isLength({ max: 10 }),
      check("email")
        .optional()
        .isEmail()
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      addressBookController
        .updateContact(req.params.name, req.body)
        .then(result => {
          if (result.updated > 0)
            res.status(200).json(`${req.body.name} was updated!`);
          else res.status(404).json(`${req.params.name} does not exist`);
        })
        .catch(err => {
          res.status(400).json(err.message);
        });
    }
  );

// DELETE
router
  // delete contact by name
  .delete("/contact/:name", (req, res) => {
    addressBookController
      .deleteContact(req.params.name)
      .then(result => {
        if (result.deleted === 0)
          res.status(404).json(`${req.params.name} does not exist`);
        if (result.deleted === 1)
          res.status(200).json(`${req.params.name} has been deleted!`);
      })
      .catch(err => {
        res.status(400).json(err.message);
      });
  });

module.exports = router;
