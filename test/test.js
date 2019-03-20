require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const supertest = require("supertest");

const server = require("../server");
const db = require("../db");
const PORT = process.env.PORT || 3001;
const api = supertest("http://localhost:" + PORT);

const testData = require("./testData");

chai.use(chaiHttp);

// empty index and insert test-data
before(async () => {
  return await db
    .deleteByQuery({
      index: process.env.INDEX,
      type: process.env.TYPE_DOCUMENT,
      body: {
        query: {
          match_all: {}
        }
      }
    })
    .then(() => {
      db.index({
        index: process.env.INDEX,
        type: process.env.TYPE_DOCUMENT,
        body: {
          name: "Darth Vader",
          address: "111 First St, Tatooine",
          phone: "0000000001",
          email: "darth@vader.gov"
        }
      });
      for (let contact of testData) {
        db.index({
          index: process.env.INDEX,
          type: process.env.TYPE_DOCUMENT,
          body: {
            name: contact.name,
            address: contact.address,
            phone: contact.phone,
            email: contact.email
          }
        });
      }
    });
});

// GET testing
describe("/GET contact", () => {
  it("it should check the connection", done => {
    api
      .get("/")
      .set("Accept", "application/json")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("it should GET (default page size / less) contacts", done => {
    api
      .get("/contact")
      .set("Accept", "application/json")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        testData.length > +process.env.PAGE_SIZE
          ? +process.env.PAGE_SIZE
          : testData;
        res.body.length.should.be.eql(
          testData.length + 1 > +process.env.PAGE_SIZE
            ? +process.env.PAGE_SIZE
            : testData.length + 1
        );
      }, done());
  });
  it("it should GET 2 contacts using query", done => {
    api
      .get("/contact?pageSize=2")
      .set("Accept", "application/json")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(2);
        done();
      });
  });
  it("it should GET Darth-Vader's contact using query", done => {
    api
      .get("/contact?query=vader")
      .set("Accept", "application/json")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(1);
        expect(res.body).to.include.deep.members([
          {
            name: "Darth Vader",
            address: "111 First St, Tatooine",
            phone: "0000000001",
            email: "darth@vader.gov"
          }
        ]);
        done();
      });
  });
  it("it should GET Darth-Vader's contact (/contact/Darth Vader)", done => {
    api
      .get("/contact/Darth Vader")
      .set("Accept", "application/json")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(1);
        expect(res.body).to.include.deep.members([
          {
            name: "Darth Vader",
            address: "111 First St, Tatooine",
            phone: "0000000001",
            email: "darth@vader.gov"
          }
        ]);
        done();
      });
  });
});

// POST testing
describe("/POST contact", () => {
  it("it should create a new contact", done => {
    api
      .post("/contact")
      .set("Accept", "application/json")
      .send({
        name: "Chewbacca",
        address:
          "3rd tree on the left from the eastern side of the forest, Kashyyyk"
      })
      .expect(201, done());
  });

  it("it should NOT create a new contact (duplicated name)", done => {
    api
      .post("/contact")
      .set("Accept", "application/json")
      .send({
        name: "Chewbacca",
        phone: "1234567890",
        address:
          "7th tree on the right from the northern side of the forest, Kashyyyk"
      })
      .expect(400, done());
  });

  it("it should NOT create a new contact (missing name)", done => {
    api
      .post("/contact")
      .set("Accept", "application/json")
      .send({
        address: "945 Laurel Way",
        phone: "9881574831",
        email: "alealle0@europa.eu"
      })
      .expect(400, done());
  });
});

// PUT testing
describe("/PUT contact", () => {
  it("it should update Vader's contact", done => {
    api
      .put("/contact/Darth Vader")
      .set("Accept", "application/json")
      .send({
        name: "Anakin Skywalker",
        email: "anakin71@gmail.com"
      })
      .expect(200, done());
  });
  it("it should NOT update Skywalker's contact (name already exists)", done => {
    api
      .put("/contact/Anakin Skywalker")
      .set("Accept", "application/json")
      .send({
        name: "Chewbacca"
      })
      .expect(200, done());
  });
});

// DELETE testing
describe("/DELETE contact", () => {
  it("it should delete Chewbacca's contact", done => {
    api
      .delete("/contact/Chewbacca")
      .set("Accept", "application/json")
      .expect(200, done());
  });
});
