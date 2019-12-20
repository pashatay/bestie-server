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
});
