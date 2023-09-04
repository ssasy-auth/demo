import { getServerWallet, createToken, verifyToken, decodeToken } from "../auth";
import { createUser, getUserByPublicKey, getUserById } from "../data";
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
 * Represents the result of a challenge response which is the 
 * claimant's public key and signature
 */
type ChallengeResult = { publicKey: string, signature?: string };

/**
 * Provides helper functions for the authentication middleware
 */
const helper = {
  /**
   * Verifies a challenge response and returns the claimant's public key and signature if valid
   */
  async verifyChallenge(wallet: Wallet, challengeResponseUri: string): Promise<ChallengeResult | null> {
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
 * Generates a challenge for the claimant to solve
 */
async function postChallenge(req: Request, res: Response) {
  const { publicKey } = req.body as { publicKey: string };

  if (!publicKey) {
    return res.status(400).json({ message: "Missing public key" });
  }

  let wallet: Wallet;

  try {
    wallet = await getServerWallet();
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to setup server wallet";
    return res.status(500).json({ message: errorMessage });
  }

  try {
    // get user signature from database if it exists
    const user: IUser | null = await getUserByPublicKey(publicKey);

    // generate challenge with public key and user signature
    const encryptedChallenge: string = await wallet.generateChallenge(publicKey, user?.credential.signature);

    return res.status(200).json({ ciphertext: encryptedChallenge });
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to generate challenge"
    return res.status(401).json({ message: errorMessage });
  }
};

/**
 * Verifies the claimant's challenge response and creates a new user
 */
async function postRegister(req: Request, res: Response) {
  type RegisterRequest = { publicKey: string, challengeResponse: string, username: string };
  const request = req.body as RegisterRequest;

  let signature: string;

  try {
    const wallet: Wallet = await getServerWallet();
    const result: ChallengeResult | null = await helper.verifyChallenge(wallet, request.challengeResponse);

    if (!result) {
      throw new Error("Failed to verify challenge");
    }

    if (!result.signature) {
      throw new Error("User's signature is missing from challenge");
    }

    signature = result.signature;

  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to verify challenge"
    return res.status(401).json({ message: errorMessage });
  }

  try {

    // check that user with public key doesn't already exist
    const userWithPublicKey = await getUserByPublicKey(request.publicKey);

    if(userWithPublicKey) {
      return res.status(400).json({ message: "User with public key already exists" });
    }

    const user = await createUser(request.publicKey, signature, request.username);
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
  type LoginRequest = { publicKey: string, challengeResponse: string };
  const request = req.body as LoginRequest;

  try {
    const wallet: Wallet = await getServerWallet();
    const result: ChallengeResult | null = await helper.verifyChallenge(wallet, request.challengeResponse);

    if (!result) {
      throw new Error("Failed to verify challenge");
    }

  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to verify challenge"
    return res.status(401).json({ message: errorMessage });
  }

  // check that user with public key exists
  const user = await getUserByPublicKey(request.publicKey);

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