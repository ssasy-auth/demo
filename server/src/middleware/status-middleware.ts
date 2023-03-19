import { createStatus, getStatusById, indexStatuses } from "../data/status-data";
import type { AuthenticatedRequest } from "./auth-middleware";
import type { Request, Response } from "express";

async function postStatus(req: AuthenticatedRequest, res: Response){
  const { text } = req.body;
  
  try {

    if(!req.user){
      throw new Error("User missing from request");
    }

    if(!text){
      throw new Error("Text is required");
    }

    const status = await createStatus(req.user.id, text);
    return res.status(201).json(status);
  } catch (error) {
    const message = (error as Error).message || "Failed to create status";
    return res.status(500).json({ message: message });
  }
}

async function fetchStatus(req: Request, res: Response){
  const { id } = req.params;

  try {
    const status = await getStatusById(id);

    if(!status){
      throw new Error("Status not found");
    }

    return res.status(200).json(status);
  } catch (error) {
    const message = (error as Error).message || "Failed to fetch status";
    return res.status(500).json({ message: message });
  }
}

async function fetchAllStatuses(req: Request, res: Response){
  try {
    const statuses = await indexStatuses();
    return res.status(200).json(statuses);
  } catch (error) {
    const message = (error as Error).message || "Failed to fetch statuses";
    return res.status(500).json({ message: message });
  }
}

export {
  postStatus,
  fetchStatus,
  fetchAllStatuses
}