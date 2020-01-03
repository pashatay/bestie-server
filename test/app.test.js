const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const supertest = require("supertest");

describe("Endpoints", () => {
  let verification = "";
  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });
  before("cleanup", () => {
    db.transaction(trx =>
      trx.raw(
        `TRUNCATE
        users,
        users_data`
      )
    );
  });
  after("disconnect from db", () => db.destroy());

  describe("Express App", () => {
    it("should return a message from GET /", () => {
      return supertest(app)
        .get("/")
        .expect(200, "Hello, world!");
    });
  });

  describe("/signup route", () => {
    it("should return an error if get request initiated from signup route", () => {
      return supertest(app)
        .get("/signup")
        .expect(400);
    });

    it("checks if signing up user already exist", () => {
      const user = {
        name: "test",
        email: "test@icloud.com",
        password: "test"
      };
      return supertest(app)
        .post("/signup")
        .send({ user })
        .set("accept", "application/json")
        .expect("content-type", /json/)
        .expect(400);
    });

    it("should creates a new user", () => {
      const user = {
        name: "test",
        email: "test@icloud.com",
        password: "test"
      };
      return supertest(app)
        .post("/signup")
        .send(user)
        .set("accept", "application/json")
        .expect("content-type", /json/)
        .expect(201)
        .then(res => {
          verification = res.body.verification_code;
        });
    });

    describe("login", () => {
      it("error, must login first", () => {
        return supertest(app)
          .get("/login")
          .expect(400);
      });

      it("error, must verify account first", () => {
        const user = {
          email: "test@icloud.com",
          password: "test"
        };
        return supertest(app)
          .post("/login")
          .send(user)
          .set("accept", "application/json")
          .expect("content-type", /json/)
          .expect(401);
      });

      it("error, if login user doesnt exist", () => {
        const user = {
          email: "exist@icloud.com",
          password: "test"
        };
        return supertest(app)
          .post("/login")
          .send(user)
          .set("accept", "application/json")
          .expect("content-type", /json/)
          .expect(400);
      });

      it("should verify account", () => {
        return supertest(app)
          .get("/verification")
          .query({ code: verification })
          .expect(
            201,
            "<h2>Your email has been verified. You can <a href='http://localhost:3000/login'>login</a> now.</h2>"
          );
      });

      it("Should login succesfully", () => {
        const user = {
          email: "test@icloud.com",
          password: "test"
        };
        return supertest(app)
          .post("/login")
          .send(user)
          .set("accept", "application/json")
          .expect("content-type", /json/)
          .expect(200);
      });
    });
  });
});
