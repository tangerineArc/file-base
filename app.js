"use strict";

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import "dotenv/config";
import express from "express";
import passport from "passport";

import sessionObject from "./auth-config/session-config.js";
import localStrategy from "./auth-config/strategy.js";
import { deserializer, serializer } from "./auth-config/transformers.js";

import indexRouter from "./routes/index-router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

const app = express();

/* set up view engine */
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

/* serve static assets */
app.use(express.static(join(__dirname, "public")));

/* configure session middleware */
app.use(sessionObject);
app.use(passport.session());

/* data parsing middlewares */
app.use(express.urlencoded({ extended: true })); // parse form data

/* set up passport */
passport.use(localStrategy);
passport.serializeUser(serializer);
passport.deserializeUser(deserializer);

/* middleware for providing currentUser data to all routes */
app.use((req, res, next) => {
  res.locals.currentSession = req.session;
  res.locals.currentUser = req.user;
  next();
});

/* routes */
app.use("/", indexRouter);

/* non-existent routes handler */
app.all("*", (req, res) => {
  res.send("No such page: Error 404");
});

/* error-handling middleware */
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.statusCode || 500).send(err.message);
});

/* startup */
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ...`);
});
