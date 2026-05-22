import type { Mongoose } from "mongoose";
import type { PublicKey } from "@ssasy-auth/core";
import { SerializerModule } from "@ssasy-auth/core";

interface Migration {
  name: string;
  migrate: (connection: Mongoose) => Promise<void>;
}

/**
 * Converts credential properties to strings
 */
const migrateCredentials: Migration = {
  name: 'Update credentials',

  migrate: async (connection) => {
    // get all users and accept properties with incorrect types
    const users = await connection.model('user').find({}).lean() as any[];

    for (const user of users) {
      let updated = false;

      if(
        typeof user.credential === 'string' ||
        (typeof user.credential.publicKey === 'string' && (typeof user.credential.signature === 'string' || user.credential.signature === undefined ))
      ) {
        // skip if already a string
        continue;
      }

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

/**
 * Serializes credential object
 */
const migrateCredentialsToUri: Migration = {
  name: 'Update credentials from object to uri',
  migrate: async (connection) => {
    const users = await connection.model('user').find({}).lean() as any[];

    for (const user of users) {
      if(typeof user.credential === 'string'){
        continue;
      }

      const publicKey = await SerializerModule.deserializeKey(user.credential.publicKey) as PublicKey;
      const signatureUri = user.credential.signature ? await SerializerModule.deserializeSignature(user.credential.signature) : undefined;

      user.credential = await SerializerModule.serializeCredential(publicKey, signatureUri);

      // overwrite credential object with string (force the update)
      await connection.model('user').updateOne({ _id: user._id }, user);
    }
  }
};

export {
  migrateCredentials,
  migrateCredentialsToUri
}