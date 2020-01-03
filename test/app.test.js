const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const supertest = require("supertest");

describe("Endpoints", () => {
  let verification = "";
  let token = "Bearer ";
  const user = {
    name: "test",
    email: "test@icloud.com",
    password: "test"
  };
  const userLogin = {
    email: "test@icloud.com",
    password: "test"
  };
  const userDoesntExist = {
    email: "exist@icloud.com",
    password: "test"
  };
  const newFriend = {
    first_name: "John",
    last_name: "Doe",
    dob: "01/01/2000",
    relationship: "brother"
  };
  const maliciousNewFriend = {
    first_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    last_name: "How-to",
    dob: "12/12/2012",
    relationship: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  };
  let newFriendId = "";

  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
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
      return supertest(app)
        .post("/signup")
        .send({ user })
        .set("accept", "application/json")
        .expect("content-type", /json/)
        .expect(400);
    });

    it("should creates a new user", () => {
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
        return supertest(app)
          .post("/login")
          .send(userLogin)
          .set("accept", "application/json")
          .expect("content-type", /json/)
          .expect(401);
      });

      it("error, if login user doesnt exist", () => {
        return supertest(app)
          .post("/login")
          .send(userDoesntExist)
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
            "<h2>Your email has been verified. You can <a href='https://bestie-server.herokuapp.com/login'>login</a> now.</h2>"
          );
      });

      it("Should login succesfully", () => {
        return supertest(app)
          .post("/login")
          .send(userLogin)
          .set("accept", "application/json")
          .expect("content-type", /json/)
          .expect(200)
          .then(res => {
            token += res.body.token;
            console.log(token);
          });
      });
    });
  });
  describe("user home page", () => {
    it("should fetch users data", () => {
      return supertest(app)
        .get("/mainpage")
        .set("Authorization", token)
        .send(userLogin)
        .expect(201);
    });
    // it("should change users password", () => {
    //   return supertest(app)
    //     .post("/mainpage")
    //     .set("Authorization", token)
    //     .send(userLogin)
    //     .expect(201);
    // });
  });

  describe("add friends", () => {
    it("should add a new friends", () => {
      return supertest(app)
        .post("/addfriend")
        .set("Authorization", token)
        .send(newFriend)
        .expect(201)
        .then(res => {
          newFriendId = res.body.id;
        });
    });
  });
  describe("deletefriends", () => {
    it("should delete a friend", () => {
      return supertest(app)
        .delete(`/usersfriend/${newFriendId}`)
        .set("Authorization", token)
        .expect(204);
    });
  });
  describe("XSS attack", () => {
    beforeEach("insert malicious friend", () => {
      return supertest(app)
        .post("/addfriend")
        .set("Authorization", token)
        .send(maliciousNewFriend)
        .expect(201)
        .then(res => {
          newFriendId = res.body.id;
        });
    });
    it("removes xss atack content", () => {
      return supertest(app)
        .get(`/mainpage`)
        .set("Authorization", token)
        .expect(res => {
          console.log(res.body);
          expect(res.body[0].first_name).to.eql(
            'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
          );
          expect(res.body[0].relationship).to.eql(
            `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
          );
        });
    });
  });
  describe("delete page", () => {
    it("deletes user page", () => {
      return supertest(app)
        .delete("/mainpage")
        .set("Authorization", token)
        .expect(204);
    });
  });
});
