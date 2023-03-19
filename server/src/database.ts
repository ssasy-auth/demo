import { Enviroment } from "./config";
import mongoose from "mongoose";

async function connect () {
  await mongoose.connect(Enviroment.DATABASE);
}

export default { connect };