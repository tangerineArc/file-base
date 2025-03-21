import { body } from "express-validator";

const validateFolder = [
  body("folderName")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage(
      "Folder name must be at least 1 character and at most 255 characters long"
    )
    .matches(/^[a-zA-Z0-9_!.*'()\-]+$/)
    .withMessage(
      "Folder name can only contain alphanumeric characters, and the symbols: ! * . ' () -"
    ),
];

export default validateFolder;
