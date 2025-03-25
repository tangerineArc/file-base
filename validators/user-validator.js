import { body } from "express-validator";

import prisma from "../prisma-config/prisma-client.js";

const validateUser = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage(
      "Username must be at least 3 characters and at most 255 characters long"
    )
    .isAlphanumeric()
    .withMessage("Username must only have alphanumeric characters")
    .custom(async (username) => {
      const count = await prisma.user.count({
        where: { username: username.toLowerCase() },
      });
      if (count) {
        throw new Error(`Username ${username} has already been taken`);
      }
      return true;
    }),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be a minimum of 8 characters")
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("Password fields do not match");
      }
      return true;
    }),
];

export default validateUser;
