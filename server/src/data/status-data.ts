import mongoose from "mongoose";
import { Document, Types, Schema } from "mongoose";

interface IStatus {
  author: Types.ObjectId;
  text: string;
}

type StatusDocument = IStatus & Document;

const StatusSchema = new mongoose.Schema<IStatus>(
  {
    text: { type: String, required: true },
    // author is the id of the user document
    author: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

const StatusModel = mongoose.model<IStatus>("status", StatusSchema);

async function createStatus(author: Types.ObjectId, text: string): Promise<StatusDocument | null> {
  const status = new StatusModel({ author, text });
  return await status.save();
}

async function getStatusById(id: string): Promise<StatusDocument | null> {
  return StatusModel.findById(id).exec();
}

async function indexStatuses(): Promise<StatusDocument[]> {
  return await StatusModel.find().exec();
}

async function indexStatusesByAuthor(author: Types.ObjectId): Promise<StatusDocument[]> {
  return await StatusModel.find({ author }).exec();
}

export {
  IStatus,
  createStatus,
  getStatusById,
  indexStatuses,
  indexStatusesByAuthor
};