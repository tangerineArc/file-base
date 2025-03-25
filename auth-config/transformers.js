import prisma from "../prisma-config/prisma-client.js";

const serializer = (user, done) => {
  done(null, user.id);
};

const deserializer = async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    done(null, user);
  } catch (err) {
    done(err);
  }
};

export { serializer, deserializer };
