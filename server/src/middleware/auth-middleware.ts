import { getServerWallet, createToken, verifyToken, decodeToken } from "../auth";
import { createUser, getUserByPublicKey, getUserById } from "../data";
import { EncoderModule, KeyModule, KeyChecker } from "@this-oliver/ssasy";
import type { IUser, UserDocument } from "../data";
import type { Request, Response } from "express";
import type { RawKey, PublicKey } from "@this-oliver/ssasy";

/**
 * An extension of the express request object that adds a user property
 * for routes that require authentication
 */
interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

interface AuthDetails {
  publicKey: RawKey;
  challenge: string;
  username?: string;
  token?: string;
}

/**
 * Provides helper functions for the authentication middleware
 */
const helper = {
  /**
   * Extracts authentication details from a request
   */
  extractAuthDetails(
    req: Request, 
    config?: { requireUsername?: boolean, requireToken?: boolean }
  ): AuthDetails {  
    const token = req.headers.authorization?.split(" ")[1];
    const { publicKey, challenge, username } = req.body as { publicKey: RawKey, challenge: string, username: string };
  
    if (!challenge) {
      throw new Error("Missing challenge");
    }
    
    if (!publicKey) {
      throw new Error("Missing public key");
    }
  
    if (config?.requireUsername === true && !username) {
      throw new Error("Missing username");
    }
  
    if (config?.requireToken === true && !token) {
      throw new Error("Missing token");
    }
  
    return {
      publicKey,
      challenge,
      username,
      token
    }
  },
  /**
   * Verifies a challenge and returns the user's public key
   */
  async inspectChallenge(challenge: string, publicKey: RawKey): Promise<void> {
    // decode the challenge
    const decodedChallenge = await EncoderModule.decodeCiphertext(challenge);
    // convert raw key to processed key
    const processedPublicKey = await KeyModule.importKey(publicKey) as PublicKey;
    
    // check if the challenge is valid
    const wallet = await getServerWallet();
    const verifiedPublicKey = await wallet.verifyChallenge(decodedChallenge);
    
    if (!verifiedPublicKey) {
      throw new Error("Failed to verify challenge");
    }
  
    // check if the challenge's public key matches the provided public key
    const isSameKey: boolean = await KeyChecker.isSameKey(processedPublicKey, verifiedPublicKey);
    if(!isSameKey) {
      throw new Error("Public key does not match challenge");
    }
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
  
    if(!verified) {
      throw new Error("Token is invalid");
    }
  
    const { id } = decodeToken(token) as { id: string };
  
    return id;
  }
}


/**
 * Generates a challenge for the claimant to solve
 */
async function postChallenge(req: Request, res: Response) {
  const { publicKey } = req.body as { publicKey: RawKey };

  if (!publicKey) {
    return res.status(400).json({ message: "Missing public key" });
  }

  try {
    const wallet = await getServerWallet();
    const processedPublicKey = await KeyModule.importKey(publicKey) as PublicKey;
    const encryptedChallenge = await wallet.generateChallenge(processedPublicKey);
    const encryptedChallengeString = await EncoderModule.encodeCiphertext(encryptedChallenge);

    return res.status(200).json({ ciphertext: encryptedChallengeString });
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to generate challenge"
    return res.status(500).json({ message: errorMessage });
  }
};

/**
 * Verifies the claimant's solution and creates a new user
 */
async function postRegister(req: Request, res: Response){
  let authDetails: AuthDetails;

  try {
    authDetails = helper.extractAuthDetails(req, { requireUsername: true });
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to extract auth details"
    return res.status(500).json({ message: errorMessage });
  }

  const { 
    publicKey, 
    challenge, // encrypted challenge
    username
  } = authDetails;

  try {
    await helper.inspectChallenge(challenge, publicKey);
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to verify challenge"
    return res.status(500).json({ message: errorMessage });
  }

  const user: IUser = {
    username: username as string,
    publicKey: publicKey
  };
  
  try {
    const createdUser = await createUser(user.publicKey, user.username);
    return res.status(201).json(createdUser);
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to create user";
    return res.status(500).json({ message: errorMessage });
  }
}

/**
 * Verifies the claimant's solution and returns access tokens
 */
async function postLogin(req: Request, res: Response){

  let authDetails: AuthDetails;

  try {
    authDetails = helper.extractAuthDetails(req);
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to extract auth details"
    return res.status(500).json({ message: errorMessage });
  }

  const { challenge, publicKey } = authDetails;

  try {
    await helper.inspectChallenge(challenge, publicKey);
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to verify challenge"
    return res.status(500).json({ message: errorMessage });
  }

  // check that user with public key exists
  const user = await getUserByPublicKey(publicKey.crypto.x!, publicKey.crypto.y!);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = helper.createUserAccessToken(user.id);

  return res.status(200).json({ user, token });
}

/**
 * Verifies the request access token and attaches the user to the request
 */
async function verifyAccessToken(req: AuthenticatedRequest, res: Response){
  try {
    const { token } = helper.extractAuthDetails(req, { requireToken: true });

    if(!token) {
      throw new Error("Access token is required for this route");
    }

    const userId = helper.verifyUserAccessToken(token);
    const user = await getUserById(userId);

    if(!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    // add user to request
    req.user = user;

  } catch (error) {
    const message = (error as Error).message || "Failed to verify token";
    return res.status(500).json({ message });
  }
}

export {
  AuthenticatedRequest,
  postChallenge,
  postRegister,
  postLogin,
  verifyAccessToken
}