import mongoose from "mongoose";
import type { Document } from "mongoose";
import type { RawKey, StandardCiphertext } from "@ssasy-auth/core";

interface ICredential {
  /**
	 * user's public key
	 */
	publicKey: RawKey;

  /**
   * user's signature. (usage recommended to protect user against phishing attacks)
   */
  signature: StandardCiphertext;
}

interface IUser {
	/**
	 * authentication credentials
	 */
	credential: ICredential
	/**
	 * username
	 */
	username: string;
}

type UserDocument = IUser & Document;

const UserSchema = new mongoose.Schema<IUser>(
  {
    credential: {
      publicKey: { type: Object, required: true, unique: true },
      signature: { type: Object, required: true }
    },
    username: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("user", UserSchema);

/**
 * Handles user-specific errors
 * 
 * @param error - error to handle
 * @returns error to throw
 */
function handleUserError(error: Error): Error {
  // handle duplicate key error
  if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000") // duplicate key error
  ) {

    if (error.message.includes("username")) {
      return new Error("username taken");
    }

    if(error.message.includes("publicKey")) {
      return new Error("public key has already been registered");
    }
  }

  // otherwise, return the error
  return error;
}

async function createUser(publicKey: RawKey, signature: StandardCiphertext, username: string): Promise<UserDocument | null> {
  try {
    const user = new UserModel({ 
      credential: { publicKey, signature },
      username
    });
    return await user.save();
  } catch (err) {
    const error: Error = handleUserError(err as Error);
    throw error;
  }
}

async function getUserById(id: string): Promise<UserDocument | null> {
  return UserModel.findById(id).exec();
}

async function getUserByPublicKey(xValue: string, yValue: string): Promise<UserDocument | null> {
  return await UserModel.findOne({
    "credential.publicKey.crypto.x": xValue,
    "credential.publicKey.crypto.y": yValue
  }).exec();
}

async function indexUsers(): Promise<UserDocument[]> {
  return await UserModel.find().exec();
}

export {
  IUser,
  ICredential,
  UserDocument,
  createUser,
  getUserById,
  getUserByPublicKey,
  indexUsers
};