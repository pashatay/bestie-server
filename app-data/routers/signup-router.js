const path = require("path");
const express = require("express");
const xss = require("xss");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const logger = require("../../src/logger");
const DataService = require("../data-service");
const sendEmails = require("../../src/email-sender");

const signupRouter = express.Router();
const bodyParser = express.json();

signupRouter
  .route("/signup")
  .get(bodyParser, (req, res, next) => {
    return res.status(400).send({
      error: { message: `you must login first` }
    });
  })
  .post(bodyParser, (req, res, next) => {
    const verification_code = randomstring.generate();
    const { name, email, password } = req.body;
    const newUser = { name, email, password, verification_code };
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailIsValid = regex.test(newUser["email"]);

    for (const field of ["name", "email", "password"]) {
      if (!newUser[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

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
          error: { message: `User with email ${email} is already exist!` }
        });
      }
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        }
        newUser.password = hash;
        DataService.insertUser(req.app.get("db"), newUser)
          .then(user => {
            logger.info(`User ${name} created.`);
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `${user.id}`))
              .json(user);
          })
          .then(sendEmails.sendEmailVerification({ verification_code, email }))
          .catch(next);
      });
    });
  });

module.exports = signupRouter;
