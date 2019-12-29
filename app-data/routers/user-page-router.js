const express = require("express");
const randomstring = require("randomstring");
const bcrypt = require("bcrypt");
const logger = require("../../src/logger");
const DataService = require("../data-service");
const jwt = require("jsonwebtoken");
const sendEmails = require("../../src/email-sender");
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
  })
  .post(bodyParser, validateBearerToken, (req, res, next) => {
    jwt.verify(req.token, JWT_KEY, (err, authData) => {
      if (err) {
        res.status(401).json({ error: `"token problem" ${req.token}` });
      } else {
        let { email, password } = req.body;
        const userid = authData.id;
        if (!password) {
          const verification_code = randomstring.generate();
          const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          const emailIsValid = regex.test(email);

          if (emailIsValid != true) {
            logger.error(`${email} is not valid email`);
            return res.status(400).send({
              error: { message: `${email} is not valid email` }
            });
          }

          DataService.doesUserExist(req.app.get("db"), email).then(user => {
            if (user) {
              logger.error(`User with ${email} is already exist!${user}`);
              return res.status(400).send({
                error: {
                  message: `A user with the email ${email} already exists!`
                }
              });
            } else {
              DataService.changeUsersEmail(
                req.app.get("db"),
                userid,
                email,
                verification_code
              )
                .then(user => {
                  logger.info(`Users email was updated.`);
                  res.status(201).send({
                    message: {
                      message: `Almost done! Please check your inbox for the link to verify your new email.`
                    }
                  });
                })
                .then(
                  sendEmails.sendEmailVerification({ verification_code, email })
                )
                .catch(next);
            }
          });
        } else if (password) {
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            }
            password = hash;
            DataService.changeUsersPassword(req.app.get("db"), userid, password)
              .then(user => {
                logger.info(`Users password was updated.`);
                res.status(201).send({
                  message: {
                    message: `Your password was updated. You can login now with the new password.`
                  }
                });
              })
              .catch(next);
          });
        }
      }
    });
  });

module.exports = userPageRouter;
