const DataService = require("./app-data/data-service");
const sendEmails = require("./src/nodemailer/email-sender");
const moment = require("moment");
const knex = require("knex");
const { DATABASE_URL } = require("./src/config");

const db = knex({
  client: "pg",
  connection: DATABASE_URL
});

const today = moment().format("MM-DD");
let bdayPeople;

const findBday = async (db, date) => {
  bdayPeople = await DataService.findBdayFriend(db, date);
  const emails = await bdayPeople.map(person => {
    return sendEmails.sendEmailReminder(person);
  });
  return emails;
};

module.exports.init = function() {
  findBday(db, today);
};
