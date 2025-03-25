"use strict";

import { Router } from "express";

import {
  renderHomePage,
  renderSignInPage,
  renderSignUpPage,
  signInUser,
  signOutUser,
  signUpUser,
} from "../controllers/index-controllers.js";

const indexRouter = Router();

indexRouter.get("/", renderHomePage);

indexRouter.get("/sign-in", renderSignInPage);
indexRouter.post("/sign-in", signInUser);

indexRouter.get("/sign-up", renderSignUpPage);
indexRouter.post("/sign-up", signUpUser);

indexRouter.get("/sign-out", signOutUser);

export default indexRouter;
