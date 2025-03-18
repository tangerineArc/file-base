import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const serializer = (user, done) => {
  done(null, user.id);
};

const deserializer = async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: id } });

    done(null, user);
  } catch (err) {
    done(err);
  }
};

export { serializer, deserializer };
