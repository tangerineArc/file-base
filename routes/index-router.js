"use strict";

import { Router } from "express";

import {
  logInUser,
  logOutUser,
  registerNewUser,
  renderHomePage,
  renderLoginPage,
  renderRegisterPage,
} from "../controllers/index-controllers.js";

const indexRouter = Router();

indexRouter.get("/", renderHomePage);

indexRouter.get("/login", renderLoginPage);
indexRouter.post("/login", logInUser);

indexRouter.get("/register", renderRegisterPage);
indexRouter.post("/register", registerNewUser);

indexRouter.get("/logout", logOutUser);

indexRouter.get("/login-success", (req, res) => {
  res.send("Successfully logged in");
});

indexRouter.get("/login-failure", (req, res) => {
  res.send("Credentials do not match");
});

export default indexRouter;
