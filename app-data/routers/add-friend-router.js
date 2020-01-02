const path = require("path");
const express = require("express");
const logger = require("../../src/logger");
const DataService = require("../data-service");
const jwt = require("jsonwebtoken");
const validateBearerToken = require("../../src/validate-token");
const { JWT_KEY } = require("../../src/config");

const addFriendRouter = express.Router();
const bodyParser = express.json();

addFriendRouter
  .route("/addfriend")
  .post(bodyParser, validateBearerToken, (req, res, next) => {
    jwt.verify(req.token, JWT_KEY, (err, authData) => {
      if (err) {
        res.status(401).json({ error: `"token problem" ${req.token}` });
      } else {
        const userid = authData.id;

        const { first_name, last_name, dob, relationship } = req.body;

        const newFriend = {
          first_name,
          last_name,
          dob,
          relationship,
          userid
        };

        DataService.insertFriend(req.app.get("db"), newFriend)
          .then(friend => {
            logger.info(`New Friend ${first_name} was created.`);
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `${friend.id}`))
              .json(DataService.serializeFriend(friend));
          })
          .catch(next);
      }
    });
  });

module.exports = addFriendRouter;
