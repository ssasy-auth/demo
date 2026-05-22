import { getServerWallet, createToken, verifyToken, decodeToken } from "../auth";
import { createUser, getUserByUsername, getUserById } from "../data";
import type { IUser, UserDocument } from "../data";
import type { Request, Response, NextFunction } from "express";
import type { Wallet } from "@ssasy-auth/core";

/**
 * An extension of the express request object that adds a user property
 * for routes that require authentication
 */
interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

/**
 * Provides helper functions for the authentication middleware
 */
const helper = {
  /**
   * Verifies a challenge response and returns the claimant's public key and signature if valid
   */
  async verifyChallenge(wallet: Wallet, challengeResponseUri: string): Promise<string | null> {
    wallet = await getServerWallet();
    return await wallet.verifyChallengeResponse(challengeResponseUri);
  },
  /**
   * Generates a token for the user
   * 
   * @param id - user id
   * @returns token
   */
  createUserAccessToken(id: string): string {
    return createToken({ id });
  },
  /**
   * Returns the user's id if the token is valid
   * 
   * @param token - user access token
   * @returns user id
   */
  verifyUserAccessToken(token: string): string {

    const verified = verifyToken(token);

    if (!verified) {
      throw new Error("Token is invalid");
    }

    const { id } = decodeToken(token);

    return id;
  }
}


/**
 * Generates a challenge for the claimant to solve. Uses claimant's credentials if
 * the username is provided (and the user exists), otherwise uses the provided
 * public key.
 */
async function postChallenge(req: Request, res: Response) {
  const { publicKey, username } = req.body as { publicKey?: string, username?: string };

  let wallet: Wallet;

  try {
    wallet = await getServerWallet();
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to setup server wallet";
    return res.status(500).json({ message: errorMessage });
  }

  let encryptedChallenge: string;
  
  try {

    // if username exists then fetch corresponding credential otherwise use public key

    if(username) {
      // get user signature from database if it exists
      const user: IUser | null = await getUserByUsername(username);

      if(!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // generate challenge with public key and user signature
      encryptedChallenge = await wallet.generateChallenge(user?.credential);

    } else if(publicKey) {

      // generate challenge with public key
      encryptedChallenge = await wallet.generateChallenge(publicKey);

    } else {
      throw new Error("Missing public key or username");
    }
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to generate challenge"
    return res.status(401).json({ message: errorMessage });
  }

  return res.status(200).json({ ciphertext: encryptedChallenge });
};

/**
 * Verifies the claimant's challenge response and creates a new user
 */
async function postRegister(req: Request, res: Response) {
  type RegisterRequest = { challengeResponse: string, username: string };
  const request = req.body as RegisterRequest;

  let credential: string;

  try {
    const wallet: Wallet = await getServerWallet();
    const result: string | null = await helper.verifyChallenge(wallet, request.challengeResponse);

    if (!result) {
      throw new Error("Failed to verify challenge");
    }
    
    credential = result;

  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to verify challenge"
    return res.status(401).json({ message: errorMessage });
  }

  try {

    // check that user with username doesn't already exist
    const userWithUsername = await getUserByUsername(request.username);

    if(userWithUsername) {
      return res.status(400).json({ message: `User with ${request.username} username already exists` });
    }

    const user = await createUser(credential, request.username);
    return res.status(201).json(user);
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to create user";
    return res.status(500).json({ message: errorMessage });
  }
}

/**
 * Verifies the claimant's challenge response and returns access tokens
 */
async function postLogin(req: Request, res: Response) {
  type LoginRequest = { username: string, challengeResponse: string };
  const request = req.body as LoginRequest;

  try {
    const wallet: Wallet = await getServerWallet();
    const result: string | null = await helper.verifyChallenge(wallet, request.challengeResponse);

    if (!result) {
      throw new Error("Invalid challenge response");
    }

  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to verify challenge"
    return res.status(401).json({ message: errorMessage });
  }

  // check that user with public key exists
  const user = await getUserByUsername(request.username);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = helper.createUserAccessToken(user.id);

  return res.status(200).json({ user, token });
}

/**
 * Verifies the request access token and attaches the user to the request
 */
async function verifyAccessToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token: string | undefined = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Access token is required for this route");
    }

    const userId: string = helper.verifyUserAccessToken(token);

    if (!userId) {
      throw new Error("Invalid access token");
    }

    const user: UserDocument | null = await getUserById(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    // add user to request
    req.user = user;

    next();
  } catch (error) {
    const message = (error as Error).message || "Failed to verify token";
    return res.status(401).json({ message });
  }
}

export {
  AuthenticatedRequest,
  postChallenge,
  postRegister,
  postLogin,
  verifyAccessToken
};