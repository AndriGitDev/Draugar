import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

/**
 * JWT payload structure for authenticated users
 */
export interface AuthTokenPayload extends JWTPayload {
  userId: string;
  name: string;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'development-secret-change-in-production'
);

const ALGORITHM = 'HS256';
const TOKEN_EXPIRY = '30d'; // 30-day expiry for family app

/**
 * Sign a JWT token with user payload
 * @param payload - User ID and name
 * @returns JWT token string
 */
export async function signToken(payload: { userId: string; name: string }): Promise<string> {
  const token = await new SignJWT({ userId: payload.userId, name: payload.name })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify a JWT token and return the payload
 * @param token - JWT token string
 * @returns Decoded payload
 * @throws Error if token is invalid or expired
 */
export async function verifyToken(token: string): Promise<AuthTokenPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET, {
    algorithms: [ALGORITHM],
  });

  return payload as AuthTokenPayload;
}
