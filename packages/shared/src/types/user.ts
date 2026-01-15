/**
 * User entity representing a family member
 */
export interface User {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** When the user was created */
  createdAt: Date;
}
