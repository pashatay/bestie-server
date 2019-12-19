const express = require("express");
const logger = require("../../src/logger");
const DataService = require("../data-service");
const jwt = require("jsonwebtoken");
const validateBearerToken = require("../../src/validate-token");
const { JWT_KEY } = require("../../src/config");

const userFriendPageRouter = express.Router();
const bodyParser = express.json();

userFriendPageRouter
  .route("/:userId/:friendId")
  .get(bodyParser, validateBearerToken, (req, res, next) => {
    jwt.verify(req.token, JWT_KEY, (err, authData) => {
      if (err) {
        res.status(401).json({ error: `"token problem" ${req.token}` });
      } else {
        const userid = authData.id;
        const { friendid } = req.body;
        DataService.findUsersSpecificFriend(req.app.get("db"), userid, friendid)
          .then(friend => {
            logger.info(`Friend is fetched`);
            res.status(201).json(friend);
          })
          .catch(next);
      }
    });
  })
  .delete(validateBearerToken, (req, res, next) => {
    const { friendid } = req.params;

    jwt.verify(req.token, JWT_KEY, (err, authData) => {
      if (err) {
        res.status(401).json({ error: `"token problem" ${req.token}` });
      } else {
        const userid = authData.id;

        DataService.deleteUsersSpecificFriend(
          req.app.get("db"),
          userid,
          friendid
        )
          .then(friend => {
            logger.info(`Friend with ${friendid} is deleted`);
            res.status(204).end();
          })
          .catch(next);
      }
    });
  });

module.exports = userFriendPageRouter;
