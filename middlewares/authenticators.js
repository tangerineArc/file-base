"use strict";

import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/sign-in");
};

const verifyResourceAndUser = asyncHandler(async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/sign-in");
  }

  const userId = req.user.id;
  const { folderId, parentFolderId, fileId } = req.params;

  if (folderId) {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      select: { ownerId: true },
    });

    if (!folder || folder.ownerId !== userId) {
      return res.redirect("/");
    }
  }

  if (fileId) {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      select: { ownerId: true },
    });

    if (!file || file.ownerId !== userId) {
      return res.redirect("/");
    }
  }

  if (parentFolderId) {
    const folder = await prisma.folder.findUnique({
      where: { id: parentFolderId },
      select: { ownerId: true },
    });

    if (!folder || folder.ownerId !== userId) {
      return res.redirect("/");
    }
  }

  next();
});

export { checkAuthentication, verifyResourceAndUser };
