const express = require("express");
const routerHub = express.Router();

//routers import
const signupRouter = require("./routers/signup-router");
const loginRouter = require("./routers/login-router");
const addFriendRouter = require("./routers/add-friend-router");
const userPageRouter = require("./routers/user-page-router");
const userFriendPageRouter = require("./routers/user-friend-page-router");

//routers path
routerHub.use(signupRouter);
routerHub.use(loginRouter);
routerHub.use(addFriendRouter);
routerHub.use(userPageRouter);
routerHub.use(userFriendPageRouter);

module.exports = routerHub;
