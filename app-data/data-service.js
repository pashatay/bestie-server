const DataService = {
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  }
  findUsersPassword(knex, email) {
    return knex
      .from('users')
      .select('password')
      .where('email', email)
      .first();
  }
};

module.exports = DataService;
