const app = require("../src/app");

describe("App", () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get("/")
      .expect(200, "Hello, world!");
  });
  it('GET /login responds with 400 containing "you must login first"', () => {
    return supertest(app)
      .get("/login")
      .expect(400, { error: { message: `you must login first` } });
  });
  it("POST /Signup responds with 201", () => {
    return supertest(app)
      .post("/signup")
      .send({
        name: "test",
        email: "test@gmail.com",
        password: "test"
      })
      .then(res => {
        expect(res.id).to.not.be.null;
        expect(res.name).to.equal("test");
      });
  });
});
