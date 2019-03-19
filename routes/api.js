const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const addressBookController = require("../controllers");

// TODO map indices
router.get("/contact", (req, res) => {
  if (req.query) console.log(req.query);
});

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
    addressBookController.addContact(req.body);
  }
);

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
