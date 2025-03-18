"use strict";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import passport from "passport";

import validateUser from "../validators/user-validator.js";

const prisma = new PrismaClient();

const renderHomePage = (req, res) => {
  res.render("index.ejs");
};

const renderRegisterPage = (req, res) => {
  res.render("register.ejs");
};

const renderLoginPage = (req, res) => {
  res.render("login.ejs");
};

const logInUser = passport.authenticate("local", {
  failureRedirect: "/login-failure",
  successRedirect: "/login-success",
});

const logOutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};

const registerNewUser = [
  validateUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(
        errors
          .array()
          .map((err) => err.msg)
          .join(" :: ")
      );
    }

    const { username, name, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: username,
        name,
        passwordHash,
      },
    });

    res.redirect("/login");
  }),
];

export {
  logInUser,
  logOutUser,
  registerNewUser,
  renderHomePage,
  renderLoginPage,
  renderRegisterPage,
};
