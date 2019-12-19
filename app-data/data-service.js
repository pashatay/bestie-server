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
  findUsersFriends(knex, userID) {
    return knex
      .from("users_data")
      .select("*")
      .where("userid", userID);
  },
  findUsersPassword(knex, email) {
    return knex
      .from("users")
      .select("*")
      .where("email", email)
      .first();
  },
  insertData(knex, newFriend) {
    return knex
      .insert(newFriend)
      .into("users_data")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  }
};

module.exports = DataService;
