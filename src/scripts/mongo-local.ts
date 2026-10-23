/**
 * Local Mongo without Docker — uses mongodb-memory-server with a persistent data dir.
 * Keep this process running while you develop (npm run mongo:local).
 */
import { mkdirSync } from "fs";
import { resolve } from "path";
import { MongoMemoryServer } from "mongodb-memory-server";

const PORT = Number(process.env.MONGO_LOCAL_PORT || 27017);
const dbPath = resolve(process.cwd(), ".data", "mongo");

async function main() {
  mkdirSync(dbPath, { recursive: true });

  console.log(`Starting local Mongo on port ${PORT}…`);
  console.log(`Data directory: ${dbPath}`);

  const mongod = await MongoMemoryServer.create({
    instance: {
      port: PORT,
      dbPath,
      storageEngine: "wiredTiger",
    },
  });

  const uri = mongod.getUri("madhavam");
  console.log(`Mongo ready: ${uri}`);
  console.log("Set MONGODB_URI in .env.local to:");
  console.log(`  mongodb://127.0.0.1:${PORT}/madhavam`);
  console.log("Then run: npm run seed && npm run dev");
  console.log("Keep this terminal open. Ctrl+C to stop.");

  const stop = async () => {
    console.log("\nStopping Mongo…");
    await mongod.stop();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);

  // Keep alive
  await new Promise(() => {});
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
