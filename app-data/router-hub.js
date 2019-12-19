const express = require("express");
const routerHub = express.Router();

//routers import
const signupRouter = require("./signup-router");
const loginRouter = require("./login-router");
const addFriendRouter = require("./add-friend-router");
const userPageRouter = require("./user-page-router");

//routers path
routerHub.use(signupRouter);
routerHub.use(loginRouter);
routerHub.use(addFriendRouter);
routerHub.use(userPageRouter);

module.exports = routerHub;
