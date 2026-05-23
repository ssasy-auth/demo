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

interface ThoughtConfig {
	/**
	 * Whether to populate the author field
	 */
	populateAuthor?: boolean;
}

async function createThought(
	author: string,
	text: string,
	config: ThoughtConfig = { populateAuthor: true }
): Promise<ThoughtDocument | null> {
	const newThought = new ThoughtModel({ author, text });
	const thought = await newThought.save();

	return config?.populateAuthor ? await thought.populate("author") : thought;
}

async function getThoughtById(
	id: string,
	config: ThoughtConfig = { populateAuthor: true }
): Promise<ThoughtDocument | null> {
	return config?.populateAuthor
		? ThoughtModel.findById(id).populate("author").exec()
		: ThoughtModel.findById(id).exec();
}

async function indexThoughts(
	config: ThoughtConfig = { populateAuthor: true }
): Promise<ThoughtDocument[]> {
	return config?.populateAuthor
    ? await ThoughtModel.find().populate("author").exec()
    : await ThoughtModel.find().exec();
}

async function indexThoughtsByAuthor(
	author: string,
	config: ThoughtConfig = { populateAuthor: true }
): Promise<ThoughtDocument[]> {
	return config?.populateAuthor
    ? await ThoughtModel.find({ author }).populate("author").exec()
    : await ThoughtModel.find({ author }).exec();
}

export {
	IThought,
	createThought,
	getThoughtById,
	indexThoughts,
	indexThoughtsByAuthor,
};
