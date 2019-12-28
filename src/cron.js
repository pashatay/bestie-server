const cron = require("node-cron");
const DataService = require("../app-data/data-service");
const sendEmails = require("./email-sender");
const moment = require("moment");
const knex = require("knex");
const { DB_URL } = require("./config");
const db = knex({
  client: "pg",
  connection: DB_URL
});

const today = moment().format("MM-DD");
let bdayPeople;
function findBday(db, date) {
  DataService.findBdayFriend(db, date).then(bday => {
    return (bdayPeople = bday);
    //transfer result to mail function
  });
  if (bdayPeople) {
    console.log(bdayPeople);
    return bdayPeople.map(person => {
      sendEmails.sendEmailReminder(person);
    });
  } else {
    return false;
    console.log(bdayPeople);
  }
}

cron.schedule("0 1 * * *", function() {
  findBday(db, today);
  // console.log(bdayPeople);
  //sendMail();
});
