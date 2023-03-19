import mongoose from "mongoose";
import type { Document } from "mongoose";
import type { RawKey } from "@this-oliver/ssasy";

interface IUser {
	/**
	 * public key for authentication purposes
	 */
	publicKey: RawKey;
	/**
	 * username
	 */
	username: string;
}

type UserDocument = IUser & Document;

const UserSchema = new mongoose.Schema<IUser>(
  {
    publicKey: { type: Object, required: true },
    username: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("user", UserSchema);

async function createUser(publicKey: RawKey, username: string): Promise<UserDocument | null> {
  const user = new UserModel({ publicKey, username });
  return await user.save();
}

async function getUserById(id: string): Promise<UserDocument | null> {
  return UserModel.findById(id).exec();
}

async function getUserByPublicKey(xValue: string, yValue: string): Promise<UserDocument | null> {
  return await UserModel.findOne({
    "publicKey.crypto.x": xValue,
    "publicKey.crypto.y": yValue
  }).exec();
}

async function indexUsers(): Promise<UserDocument[]> {
  return await UserModel.find().exec();
}

export {
  IUser,
  UserDocument,
  createUser,
  getUserById,
  getUserByPublicKey,
  indexUsers
};