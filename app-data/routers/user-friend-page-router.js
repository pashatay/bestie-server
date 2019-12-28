const express = require("express");
const logger = require("../../src/logger");
const DataService = require("../data-service");
const jwt = require("jsonwebtoken");
const validateBearerToken = require("../../src/validate-token");
const { JWT_KEY } = require("../../src/config");

const userFriendPageRouter = express.Router();
const bodyParser = express.json();

userFriendPageRouter
  .route("/usersfriend/:friendId")
  .all(bodyParser, validateBearerToken, (req, res, next) => {
    jwt.verify(req.token, JWT_KEY, (err, authData) => {
      if (err) {
        res.status(401).json({ error: `"token problem" ${req.token}` });
      } else {
        const userid = authData.id;
        const { friendId } = req.params;
        DataService.findUsersSpecificFriend(req.app.get("db"), userid, friendId)
          .then(friend => {
            if (!friend[0]) {
              return res.status(404).json({
                error: { message: `Friend doesn't exist` }
              });
            }
            res.friend = friend;
            next();
          })
          .catch(next);
      }
    });
  })
  .get((req, res, next) => {
    res.json(res.friend);
  })
  .delete(validateBearerToken, (req, res, next) => {
    jwt.verify(req.token, JWT_KEY, (err, authData) => {
      if (err) {
        res.status(401).json({ error: `"token problem" ${req.token}` });
      } else {
        const userid = authData.id;
        const { friendId } = req.params;
        DataService.deleteUsersSpecificFriend(
          req.app.get("db"),
          userid,
          friendId
        )
          .then(friend => {
            logger.info(`Friend with id#${friendId} is deleted`);
            res.status(204).end();
          })
          .catch(next);
      }
    });
  });

module.exports = userFriendPageRouter;
