"use strict";

import { Router } from "express";

import {
  createFolder,
  deleteFile,
  deleteFolderAndItsContents,
  downloadFile,
  generateFilePublicUrl,
  renderFoldersPage,
  saveFile,
} from "../controllers/folders-controllers.js";

import {
  checkAuthentication,
  verifyResourceAndUser,
} from "../middlewares/authenticators.js";
import upload from "../middlewares/file-uploader.js";

const foldersRouter = Router();

foldersRouter.get("/", checkAuthentication, renderFoldersPage);
foldersRouter.get("/:folderId", verifyResourceAndUser, renderFoldersPage);

foldersRouter.post(
  "/create-file",
  checkAuthentication,
  upload.single("file"),
  saveFile
);
foldersRouter.post(
  "/:folderId/create-file",
  verifyResourceAndUser,
  upload.single("file"),
  saveFile
);

foldersRouter.post("/create-folder", checkAuthentication, createFolder);
foldersRouter.post(
  "/:folderId/create-folder",
  verifyResourceAndUser,
  createFolder
);

foldersRouter.get(
  "/download-file/:fileId",
  verifyResourceAndUser,
  downloadFile
);

foldersRouter.post(
  "/make-file-public/:fileId",
  verifyResourceAndUser,
  generateFilePublicUrl
);

foldersRouter.post("/delete-file/:fileId", verifyResourceAndUser, deleteFile);
foldersRouter.post(
  "/:folderId/delete-file/:fileId",
  verifyResourceAndUser,
  deleteFile
);

foldersRouter.post(
  "/:parentFolderId/delete-folder/:folderId",
  verifyResourceAndUser,
  deleteFolderAndItsContents
);
foldersRouter.post(
  "/delete-folder/:folderId",
  verifyResourceAndUser,
  deleteFolderAndItsContents
);

export default foldersRouter;
