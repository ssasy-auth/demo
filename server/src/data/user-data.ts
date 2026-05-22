import mongoose from "mongoose";
import type { Document } from "mongoose";

interface IUser {
	/**
	 * ssasy authentication credential
	 */
	credential: string;
	/**
	 * username
	 */
	username: string;
}

type UserDocument = IUser & Document;

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    credential: { type: String, required: true }
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

    if(error.message.includes("publicKey")) {
      return new Error("public key has already been registered");
    }

    if (error.message.includes("username")) {
      return new Error("username taken");
    }
  }

  // otherwise, return the error
  return error;
}

async function createUser(credential: string, username: string): Promise<UserDocument | null> {
  try {
    const user = new UserModel({ credential: credential, username });
    return await user.save();
  } catch (err) {
    const error: Error = handleUserError(err as Error);
    throw error;
  }
}

async function getUserById(id: string): Promise<UserDocument | null> {
  return UserModel.findById(id).exec();
}

async function getUserByUsername(username: string): Promise<UserDocument | null> {
  return await UserModel.findOne({ "username": username }).exec();
}

async function indexUsers(): Promise<UserDocument[]> {
  return await UserModel.find().exec();
}

async function updateUser(user: UserDocument): Promise<UserDocument | null> {
  return await user.save();
}

export {
  IUser,
  UserDocument,
  createUser,
  getUserById,
  getUserByUsername,
  indexUsers,
  updateUser
};