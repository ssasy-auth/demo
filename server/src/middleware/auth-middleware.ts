import { getServerWallet, createToken, verifyToken, decodeToken } from "../auth";
import { createUser, getUserByPublicKey, getUserById } from "../data";
import { EncoderModule, KeyModule, KeyChecker, StandardCiphertext } from "@this-oliver/ssasy";
import type { IUser, UserDocument } from "../data";
import type { Request, Response, NextFunction } from "express";
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
    config?: { requireChallenge?: boolean, requireSignature?: boolean, requireUsername?: boolean, requireToken?: boolean }
  ): AuthDetails {  
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
  
    return {
      publicKey,
      challenge,
      username
    }
  },
  /**
   * Verifies a challenge and returns the user's public key
   */
  async inspectChallenge(challenge: string, publicKey: RawKey): Promise<{ publicKey: PublicKey, signature?: StandardCiphertext }> {
    // decode the challenge
    const decodedChallengeCiphertext = await EncoderModule.decodeCiphertext(challenge);
    // convert raw key to processed key
    const processedPublicKey = await KeyModule.importKey(publicKey) as PublicKey;
    
    // check if the challenge is valid
    const wallet = await getServerWallet();
    const result = await wallet.verifyChallenge(decodedChallengeCiphertext);
    
    if (!result) {
      throw new Error("Failed to verify challenge");
    }
  
    // check if the challenge's public key matches the provided public key
    const isSameKey: boolean = await KeyChecker.isSameKey(processedPublicKey, result.publicKey);
    if(!isSameKey) {
      throw new Error("Public key does not match challenge");
    }

    return result;
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
  
    const { id } = decodeToken(token);
  
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
    let encryptedChallenge = await wallet.generateChallenge(processedPublicKey);

    // add user signature to the challenge
    const user: IUser | null = await getUserByPublicKey(publicKey.crypto.x as string, publicKey.crypto.y as string);

    encryptedChallenge = {
      ...encryptedChallenge,
      signature: user?.credential.signature as StandardCiphertext
    }

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

  let signature: StandardCiphertext;

  try {
    const result = await helper.inspectChallenge(challenge, publicKey);

    if(!result.signature) {
      throw new Error("User's signature is missing from challenge");
    }

    signature = result.signature;

  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to verify challenge"
    return res.status(500).json({ message: errorMessage });
  }
  
  try {
    const user = await createUser(publicKey, signature, username as string);
    return res.status(201).json(user);
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
async function verifyAccessToken(req: AuthenticatedRequest, res: Response, next: NextFunction){
  try {

    const token = req.headers.authorization?.split(" ")[1];

    if(!token) {
      throw new Error("Access token is required for this route");
    }

    const userId = helper.verifyUserAccessToken(token);

    if(!userId) {
      throw new Error("Invalid access token");
    }

    const user = await getUserById(userId);

    if(!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    // add user to request
    req.user = user;

    next();
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