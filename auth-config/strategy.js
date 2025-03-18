"use strict";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";

const prisma = new PrismaClient();

const verifyCallback = async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: username } });

    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return done(null, false, { message: "Incorrect password" });
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
