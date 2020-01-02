const xss = require("xss");

const DataService = {
  doesUserExist(knex, email) {
    return knex
      .from("users")
      .select("*")
      .where("email", email)
      .first();
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  verifyUser(knex, code) {
    return knex
      .from("users")
      .where("verification_code", code)
      .update({ verified: "true", verification_code: "" });
  },
  changeUsersEmail(knex, userId, email, verification_code) {
    return knex
      .from("users")
      .where("id", userId)
      .update({ email, verification_code, verified: "false" });
  },
  changeUsersPassword(knex, userId, password) {
    return knex
      .from("users")
      .where("id", userId)
      .update({ password });
  },
  deleteUser(knex, userID) {
    return knex
      .from("users")
      .select("*")
      .where("id", userID)
      .delete();
  },
  findUsersFriends(knex, userID) {
    return knex
      .from("users_data")
      .select("*")
      .where("userid", userID);
  },
  findUsersSpecificFriend(knex, userID, friendID) {
    return knex
      .from("users_data")
      .select("*")
      .where({ userid: userID, id: friendID });
  },
  deleteUsersSpecificFriend(knex, userID, friendID) {
    return knex
      .from("users_data")
      .select("*")
      .where({ userid: userID, id: friendID })
      .delete();
  },
  findUsersPassword(knex, email) {
    return knex
      .from("users")
      .select("*")
      .where("email", email)
      .first();
  },
  insertFriend(knex, newFriend) {
    return knex
      .insert(newFriend)
      .into("users_data")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  findBdayFriend(knex, date) {
    return knex
      .from("users_data")
      .select("first_name", "last_name", "dob", "relationship", "name", "email")
      .where("dob", "like", `%${date}`)
      .innerJoin("users", "userid", "users.id");
  },
  serializeUser(user) {
    return {
      id: xss(user.id),
      name: xss(user.name),
      email: xss(user.email),
      password: xss(user.password),
      verified: xss(user.verified),
      verification_code: xss(user.verification_code),
      signup_date: xss(user.signup_date)
    };
  },
  serializeFriend(friend) {
    return {
      id: xss(friend.id),
      first_name: xss(friend.first_name),
      last_name: xss(friend.last_name),
      dob: xss(friend.dob),
      relationship: xss(friend.relationship),
      userid: xss(friend.userid)
    };
  }
};

module.exports = DataService;
