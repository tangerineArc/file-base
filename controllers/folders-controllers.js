"use strict";

import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import { randomBytes } from "node:crypto";

import prisma from "../prisma-config/prisma-client.js";

import storageClient from "../supabase-config/storage-client.js";

import buildFolderTree from "../utils/tree-builder.js";
import formatDate from "../utils/date-formatter.js";
import provideIcon from "../utils/icon-provider.js";

import validateFolder from "../validators/folder-validator.js";

const renderFoldersPage = asyncHandler(async (req, res) => {
  let { folders: allFolders } = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { folders: true },
  });

  const folderStructure = buildFolderTree(allFolders);

  const { folderId } = req.params;

  let folders;
  if (folderId) {
    folders = await prisma.folder.findMany({
      where: { parentFolderId: folderId },
    });
  } else {
    folders = await prisma.folder.findMany({
      where: { AND: [{ ownerId: req.user.id }, { parentFolderId: null }] },
    });
  }

  let files;
  if (folderId) {
    files = await prisma.file.findMany({ where: { folderId } });
  } else {
    files = await prisma.file.findMany({
      where: { AND: [{ ownerId: req.user.id }, { folderId: null }] },
    });
  }

  const path = [];
  if (folderId) {
    let currFolder = await prisma.folder.findUnique({
      where: { id: folderId },
    });
    path.unshift(currFolder);

    while (true) {
      if (!currFolder.parentFolderId) break;

      currFolder = await prisma.folder.findUnique({
        where: { id: currFolder.parentFolderId },
      });
      path.unshift(currFolder);
    }
  }
  path.unshift({ name: req.user.username, id: null });

  res.render("folders-page", {
    folderStructure,
    path,
    folders,
    files,
    folderId: folderId || null,
    provideIcon,
    formatDate,
  });
});

const createFolder = [
  validateFolder,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      /* TO-DO: create error-handling ui */
      throw new Error(
        errors
          .array()
          .map((err) => err.msg)
          .join(" :: ")
      );
    }

    const { folderId } = req.params;
    const { folderName } = req.body;

    await prisma.folder.create({
      data: {
        name: folderName,
        ownerId: req.user.id,
        parentFolderId: folderId || null,
      },
    });

    res.redirect(`/folders/${folderId || ""}`);
  }),
];

const saveFile = asyncHandler(async (req, res) => {
  const { folderId } = req.params;

  const filePath = [];

  if (folderId) {
    let curr = await prisma.folder.findUnique({ where: { id: folderId } });

    filePath.unshift(`${curr.id}-${curr.name}`);

    while (true) {
      if (!curr.parentFolderId) break;

      curr = await prisma.folder.findUnique({
        where: { id: curr.parentFolderId },
      });

      filePath.unshift(`${curr.id}-${curr.name}`);
    }
  }

  const filename = `${randomBytes(16).toString("hex")}_${
    req.file.originalname
  }`;
  filePath.push(filename);

  const { data, error } = await storageClient
    .from(req.user.username)
    .upload(filePath.join("/"), req.file.buffer, {
      contentType: req.file.mimetype,
    });

  /* TO-DO: error handling ui */
  if (error) {
    throw new Error("Failed to upload file");
  }

  await prisma.file.create({
    data: {
      filename,
      originalName: req.file.originalname,
      destination: data.path,
      fileSize: req.file.size,
      folderId: folderId || null,
      ownerId: req.user.id,
      mimetype: req.file.mimetype,
    },
  });

  res.redirect(`/folders/${folderId || ""}`);
});

const downloadFile = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const file = await prisma.file.findUnique({ where: { id: fileId } });

  const { data, error } = await storageClient
    .from(req.user.username)
    .createSignedUrl(file.destination, 60); // 60s

  if (error) {
    throw new Error("Failed to download file");
  }

  const fileResponse = await fetch(data.signedUrl);

  if (!fileResponse.ok) {
    throw new Error("Failed to fetch file");
  }

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${file.originalName}`
  );
  res.setHeader("Content-Type", fileResponse.headers.get("content-type"));

  const fileStream = fileResponse.body.getReader();

  while (true) {
    const { value, done } = await fileStream.read();

    if (value) res.write(value);
    if (done) break;
  }

  res.end();
});

const generateFilePublicUrl = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const { visibilityDuration } = req.body;

  const file = await prisma.file.findUnique({ where: { id: fileId } });

  const { data, error } = await storageClient
    .from(req.user.username)
    .createSignedUrl(file.destination, Number(visibilityDuration));

  if (error) {
    throw new Error("Failed to generate URL");
  }

  res.json({ url: data.signedUrl });
});

const deleteFile = asyncHandler(async (req, res) => {
  const { fileId, folderId } = req.params;

  const deletedFile = await prisma.file.delete({ where: { id: fileId } });

  const { _, error } = await storageClient
    .from(req.user.username)
    .remove([deletedFile.destination]);

  if (error) {
    throw new Error("Failed to delete file");
  }

  res.redirect(`/folders/${folderId || ""}`);
});

const deleteFolderAndItsContents = asyncHandler(async (req, res) => {
  const { parentFolderId, folderId } = req.params;

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    include: { children: true, files: true },
  });

  let { files, children } = folder;

  while (children.length) {
    let { files: _files, children: _children } = await prisma.folder.findUnique(
      {
        where: { id: children.shift().id },
        include: { children: true, files: true },
      }
    );

    files.push(..._files);

    children.shift();
    children.push(..._children);
  }

  await prisma.folder.delete({ where: { id: folderId } });

  if (files.length) {
    const { _, error } = await storageClient
      .from(req.user.username)
      .remove(files.map((file) => file.destination));

    if (error) {
      throw new Error("Failed to delete folder");
    }
  }

  res.redirect(`/folders/${parentFolderId || ""}`);
});

export {
  createFolder,
  deleteFile,
  deleteFolderAndItsContents,
  downloadFile,
  generateFilePublicUrl,
  renderFoldersPage,
  saveFile,
};
