import { getUserByPublicKey, indexUsers  } from "../data";
import type { Request, Response } from "express";

async function fetchAllUsers (req: Request, res: Response) {
  try {
    const users = await indexUsers();
    return res.status(200).json({ users });
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to fetch users"
    return res.status(500).json({ message: errorMessage });
  }
}

async function fetchUserByPublicKey(req: Request, res: Response) {
  const { x, y } = req.params;

  try {
    const user = await getUserByPublicKey(x, y);
  
    if (!user) {
      throw new Error("User not found");
    }
  
    return res.status(200).json({ user });
    
  } catch (error) {
    const errorMessage = (error as Error).message || "failed to fetch user"
    return res.status(500).json({ message: errorMessage });
  }

}

export {
  fetchAllUsers,
  fetchUserByPublicKey
}