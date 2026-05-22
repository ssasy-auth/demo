import jsonwebtoken from "jsonwebtoken";

const TOKEN_SECRET = "secret";
const TOKEN_DURATION = "1h";

/**
 * Returns a token for the given user id
 * 
 * @param data - payload to encode
 */
function createToken(data: any): string {
  const payload = { data };
  return jsonwebtoken.sign(payload, TOKEN_SECRET, { expiresIn: TOKEN_DURATION });
}

/**
 * Returns the payload data of the given token
 * 
 * @param token - token to decode
 * @returns payload data
 */
function decodeToken(token: string): any {
  const decoded: jsonwebtoken.JwtPayload | string | null = jsonwebtoken.decode(token);

  if(decoded === null) {
    return undefined;
  }

  if(typeof decoded === "string") {
    return decoded;
  }

  return decoded.data;
}

/**
 * Returns true if the token is valid
 * 
 * @param token - token to verify
 */
function verifyToken(token: string): boolean {
  try {
    jsonwebtoken.verify(token, TOKEN_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

export { 
  createToken, 
  decodeToken,
  verifyToken
};