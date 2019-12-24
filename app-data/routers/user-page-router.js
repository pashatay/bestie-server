const express = require("express");
const logger = require("../../src/logger");
const DataService = require("../data-service");
const jwt = require("jsonwebtoken");
const validateBearerToken = require("../../src/validate-token");
const { JWT_KEY } = require("../../src/config");

const userPageRouter = express.Router();
const bodyParser = express.json();

userPageRouter
  .route("/mainpage")
  .get(bodyParser, validateBearerToken, (req, res, next) => {
    jwt.verify(req.token, JWT_KEY, (err, authData) => {
      if (err) {
        res.status(401).json({ error: `"token problem" ${req.token}` });
      } else {
        const userid = authData.id;
        DataService.findUsersFriends(req.app.get("db"), userid)
          .then(friends => {
            logger.info(`Friends list fetched`);
            res.status(201).json(friends);
          })
          .catch(next);
      }
    });
  })
  .delete(validateBearerToken, (req, res, next) => {
    jwt.verify(req.token, JWT_KEY, (err, authData) => {
      if (err) {
        res.status(401).json({ error: `"token problem" ${req.token}` });
      } else {
        const userid = authData.id;
        DataService.deleteUser(req.app.get("db"), userid)
          .then(user => {
            logger.info(`your page was deleted`);
            res.status(204).end();
          })
          .catch(next);
      }
    });
  });
module.exports = userPageRouter;
