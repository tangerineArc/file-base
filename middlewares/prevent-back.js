"use strict";

export default function preventBack(req, res, next) {
  res.setHeader("Cache-Control", "no-store");
  next();
}
