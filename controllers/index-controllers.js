"use strict";

import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import passport from "passport";

import prisma from "../prisma-config/prisma-client.js";

import storageClient from "../supabase-config/storage-client.js";

import validateUser from "../validators/user-validator.js";

const renderSignInPage = (req, res) => {
  const errorMessages = req.session.messages;
  req.session.messages = [];

  const successMessages = [];
  if (req.query.success === "1") {
    successMessages.push("Account created successfully");
    successMessages.push("Sign in to continue");
  }

  res.render("form-page.ejs", {
    title: "FileBase | Sign In",
    type: "sign-in",
    actionRoute: "/sign-in",
    errorMessages,
    successMessages,
  });
};

const renderSignUpPage = (req, res) => {
  res.render("form-page.ejs", {
    title: "FileBase | Sign Up",
    type: "sign-up",
    actionRoute: "/sign-up",
  });
};

const renderHomePage = (req, res) => {
  if (req.user) {
    return res.redirect("/folders");
  }
  res.redirect("/sign-in");
};

const signInUser = passport.authenticate("local", {
  failureRedirect: "/sign-in",
  successRedirect: "/folders",
  failureMessage: true,
});

const signOutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/sign-in");
  });
};

const signUpUser = [
  validateUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { username } = req.body;

      return res.status(400).render("form-page.ejs", {
        title: "FileBase | Sign Up",
        type: "sign-up",
        actionRoute: "/sign-up",
        errorMessages: errors.array().map((err) => err.msg),
        defaults: { username },
      });
    }

    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({ data: { username, passwordHash } });

    const { data, error } = await storageClient.createBucket(username, {
      public: false,
      fileSizeLimit: "2MB",
    });

    /* TO-DO: better error handling ui */
    if (error) {
      await prisma.user.delete({ where: { username } });
      throw new Error(error);
    }

    res.redirect("/sign-in?success=1");
  }),
];

export {
  renderHomePage,
  renderSignInPage,
  renderSignUpPage,
  signInUser,
  signOutUser,
  signUpUser,
};
