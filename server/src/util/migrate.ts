import type { Mongoose } from "mongoose";
import { SerializerModule } from "@ssasy-auth/core";

interface Migration {
  name: string;
  migrate: (connection: Mongoose) => Promise<void>;
}

/**
 * Converts credentials to strings
 */
const migrateCredentials: Migration = {
  name: 'Update credentials',

  migrate: async (connection) => {
    // get all users and accept properties with incorrect types
    const users = await connection.model('user').find({}) as any[];

    for (const user of users) {
      let updated = false;

      if (typeof user.credential.publicKey !== 'string') {
        user.credential.publicKey = await SerializerModule.serializeKey(user.credential.publicKey);
        updated = true;
      }

      if (typeof user.credential.signature !== 'string') {
        user.credential.signature = await SerializerModule.serializeSignature(user.credential.signature);
        updated = true;
      }

      if (updated) {
        await connection.model('user').updateOne({ _id: user._id }, user);
      }
    }
  }
};

export {
  migrateCredentials
}