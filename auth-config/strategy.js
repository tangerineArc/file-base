"use strict";

import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";

import prisma from "../prisma-config/prisma-client.js";

const verifyCallback = async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return done(null, false, { message: "Incorrect username or password" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return done(null, false, { message: "Incorrect username or password" });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const localStrategy = new LocalStrategy(
  { usernameField: "username", passwordField: "password" },
  verifyCallback
);

export default localStrategy;
