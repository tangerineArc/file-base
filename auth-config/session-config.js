"use strict";

import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";

import prisma from "../prisma-config/prisma-client.js";

const sessionStore = new PrismaSessionStore(prisma, {
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
