/**
 * Invite code for authentication
 * Users join by entering an invite code created by existing members
 */
export interface InviteCode {
  /** Unique identifier */
  id: string;
  /** The invite code string */
  code: string;
  /** User who created this code (null for bootstrap admin) */
  createdBy: string | null;
  /** User who used this code (null until used) */
  usedBy: string | null;
  /** When the code was created */
  createdAt: Date;
  /** When the code expires (null = never expires) */
  expiresAt: Date | null;
}
