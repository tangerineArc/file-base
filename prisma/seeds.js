#! /usr/bin/env node

"use strict";

import { PrismaClient } from "@prisma/client";
// import { getUsersByName, getUsersWithPosts } from "@prisma/client/sql";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.post.deleteMany({});

  // const usersWithPostCounts = await prisma.$queryRawTyped(getUsersWithPosts());
  // console.log(usersWithPostCounts);

  // const users = await prisma.$queryRawTyped(getUsersByName("Alice"));
  // console.log(users);

  const passwords = JSON.parse(process.env.SEED_PASSWORDS);
  const hashedPasswords = await Promise.all(
    passwords.map((text) => bcrypt.hash(text, 10))
  );

  await prisma.user.createMany({
    data: [
      {
        name: "Swagatam",
        email: "swa@tam.dev",
        passwordHash: hashedPasswords[0],
      },
      {
        name: "Tangerine",
        email: "T@ngerine.dev",
        passwordHash: hashedPasswords[1],
      },
      { name: "Lemon", email: "lem@on.dev", passwordHash: hashedPasswords[2] },
    ],
  });

  const users = await prisma.user.findMany();

  await prisma.post.createMany({
    data: [
      {
        title: "Post-1",
        content: "post 1 description",
        published: true,
        authorId: users[0].id,
      },
      { title: "Post-2", content: "post 2 description", authorId: users[1].id },
      {
        title: "Post-3",
        content: "post 3 description",
        published: true,
        authorId: users[1].id,
      },
      { title: "Post-4", content: "post 4 description", authorId: users[2].id },
    ],
  });
}

main()
  .then(() => {
    console.log("... seeding finished successfully");
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
