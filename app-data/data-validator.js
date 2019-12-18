const logger = require("../src/logger");
const NO_ERRORS = null;

const DataValidator = {
  doesUserExist(knex, email) {
    return knex
      .from("users")
      .select("*")
      .where("email", email)
      .first();
  }
};
module.exports = DataValidator;
