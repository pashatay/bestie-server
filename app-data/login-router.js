const path = require("path");
const express = require("express");
const xss = require("xss");
const logger = require("../src/logger");
const DataService = require("./data-service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginRouter = express.Router();
const bodyParser = express.json();

loginRouter.route("/login").post(bodyParser, (req, res, next) => {
  const { email, password } = req.body;
  DataService.findUsersPassword(req.app.get("db"), email.toLowerCase())
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "Incorrect email or password!" });
      }
      return bcrypt.compare(password, user.password).then(passwordsMatch => {
        if (!passwordsMatch) {
          return res
            .status(401)
            .json({ error: "Incorrect email or password!" });
        }
        const token = jwt.sign(
          {
            email: email.toLowerCase(),
            id: user.id
          },
          process.env.JWT_KEY,

          { expiresIn: "1h" }
        );
        res.status(200).json({
          message: "Auth successful",
          token: token,
          id: user.id
        });
        next();
      });
    })

    .catch(next);
});

module.exports = loginRouter;
