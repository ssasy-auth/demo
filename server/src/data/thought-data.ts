import mongoose from "mongoose";
import { Document, Types, Schema } from "mongoose";

interface IThought {
  author: Types.ObjectId;
  text: string;
}

type ThoughtDocument = IThought & Document;

const ThoughtSchema = new mongoose.Schema<IThought>(
  {
    text: { type: String, required: true },
    // author is the id of the user document
    author: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

const ThoughtModel = mongoose.model<IThought>("thought", ThoughtSchema);

async function createThought(author: string, text: string): Promise<ThoughtDocument | null> {
  const newThought = new ThoughtModel({ author, text });
  const thought = await newThought.save();

  return await thought.populate("author");
}

async function getThoughtById(id: string): Promise<ThoughtDocument | null> {
  return ThoughtModel.findById(id).populate("author").exec();
}

async function indexThoughts(): Promise<ThoughtDocument[]> {
  return await ThoughtModel.find().populate("author").exec();
}

async function indexThoughtsByAuthor(author: string): Promise<ThoughtDocument[]> {
  return await ThoughtModel.find({ author }).populate("author").exec();
}

export {
  IThought,
  createThought,
  getThoughtById,
  indexThoughts,
  indexThoughtsByAuthor
};