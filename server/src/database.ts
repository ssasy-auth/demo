import { Enviroment } from "./config";
import mongoose from "mongoose";
import { migrateCredentials } from "./util/migrate";

async function connect () {
  const connection = await mongoose.connect(Enviroment.DATABASE);

  // run migrations
  await migrateCredentials.migrate(connection);
}

export default { connect };