const router = require("express").Router();
// const addressBookController = require("../../controllers");

router
  .get("/", (req, res) => {
    res.json("hello world");
  })
  .post("/", (req, res) => {
    res.json("posted!");
  });

module.exports = router;
