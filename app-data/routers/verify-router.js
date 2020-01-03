const express = require("express");
const logger = require("../../src/logger");
const DataService = require("../data-service");

const verifyRouter = express.Router();
const bodyParser = express.json();

verifyRouter.route("/verification").get(bodyParser, (req, res, next) => {
  const { code } = req.query;
  DataService.verifyUser(req.app.get("db"), code)
    .then(user => {
      if (!user) {
        res.status(201).send("<h2>something went wrong</h2>");
      } else {
        logger.info(`User verified`);
        res
          .status(201)
          .send(
            "<h2>Your email has been verified. You can <a href='https://bestie-server.herokuapp.com/login'>login</a> now.</h2>"
          );
      }
    })
    .catch(next);
});

module.exports = verifyRouter;
