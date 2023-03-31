import { createThought, getThoughtById, indexThoughts, indexThoughtsByAuthor } from "../data/thought-data";
import type { AuthenticatedRequest } from "./auth-middleware";
import type { Request, Response } from "express";

async function postThought(req: AuthenticatedRequest, res: Response){
  const { text } = req.body;
  
  try {

    if(!req.user){
      throw new Error("User missing from request");
    }

    if(!text){
      throw new Error("Text is required");
    }

    const thought = await createThought(req.user._id, text);
    return res.status(201).json(thought);
  } catch (error) {
    const message = (error as Error).message || "Failed to create thought";
    return res.status(500).json({ message: message });
  }
}

async function fetchThought(req: Request, res: Response){
  const { id } = req.params;

  try {
    const thought = await getThoughtById(id);

    if(!thought){
      throw new Error("Thought not found");
    }

    return res.status(200).json(thought);
  } catch (error) {
    const message = (error as Error).message || "Failed to fetch thought";
    return res.status(500).json({ message: message });
  }
}

async function fetchAllThoughts(req: Request, res: Response){
  try {
    const thoughts = await indexThoughts();
    return res.status(200).json(thoughts);
  } catch (error) {
    const message = (error as Error).message || "Failed to fetch thoughts";
    return res.status(500).json({ message: message });
  }
}

async function fetchAllThoughtsByAuthor(req: Request, res: Response){
  const { author } = req.params;

  try {
    const thoughts = await indexThoughtsByAuthor(author);
    return res.status(200).json(thoughts);
  } catch (error) {
    const message = (error as Error).message || "Failed to fetch thoughts";
    return res.status(500).json({ message: message });
  }
}

export {
  postThought,
  fetchThought,
  fetchAllThoughts,
  fetchAllThoughtsByAuthor
}