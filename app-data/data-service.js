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
  }
};

module.exports = DataService;
