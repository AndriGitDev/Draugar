/**
 * JWT payload structure for authenticated users
 */
export interface AuthPayload {
  /** User's unique identifier */
  userId: string;
  /** User's display name */
  name: string;
}

/**
 * Response from authentication endpoints (join, login)
 */
export interface AuthResponse {
  /** JWT token for authenticated requests */
  token: string;
  /** User information */
  user: {
    id: string;
    name: string;
  };
}
