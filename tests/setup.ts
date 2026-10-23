import { beforeAll, afterAll } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_SECRET =
    process.env.JWT_SECRET || "test-jwt-secret-madhavam";
  process.env.ADMIN_EMAIL =
    process.env.ADMIN_EMAIL || "admin@earthwavesdevelopers.com";
  process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "test-admin-pass";

  // Use an ephemeral port so tests don't clash with `npm run mongo:local` on 27017
  mongo = await MongoMemoryServer.create({
    instance: { port: 0 },
  });
  const uri = mongo.getUri("madhavam_test");
  process.env.MONGODB_URI = uri;

  await mongoose.connect(uri);
  global.mongooseCache = {
    conn: mongoose,
    promise: Promise.resolve(mongoose),
  };
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
  global.mongooseCache = { conn: null, promise: null };
});
