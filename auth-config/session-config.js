"use strict";

import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";

const sessionStore = new PrismaSessionStore(new PrismaClient(), {
  checkPeriod: 2 * 60 * 1000,
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

const sessionObject = session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
});

export default sessionObject;
