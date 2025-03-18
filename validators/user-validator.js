import { body } from "express-validator";

const validateUser = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Email is invalid"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be a minimum of 8 characters"),
];

export default validateUser;
