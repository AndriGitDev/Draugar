import { pgTable, uuid, text, real, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Users table - family members using the app
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  publicKey: text('public_key'), // Base64-encoded X25519 public key, nullable until registered
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Locations table - location updates from user devices
 * Note: encrypted_data column is for future E2E encryption implementation
 */
export const locations = pgTable('locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  accuracy: real('accuracy').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  encryptedData: text('encrypted_data'), // For future E2E encryption
});

/**
 * Invite codes table - authentication via invite codes
 * First user has null createdBy (bootstrap admin)
 */
export const inviteCodes = pgTable('invite_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  createdBy: uuid('created_by').references(() => users.id), // null for first user
  usedBy: uuid('used_by').references(() => users.id), // null until used
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'), // null = never expires
});

/**
 * Groups table - family groups with E2E encryption
 * Each group has its own encryption key and server keypair for key distribution
 * Note: In production, serverSecretKey should be in a secrets manager
 */
export const groups = pgTable('groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  encryptionKey: text('encryption_key').notNull(), // Base64-encoded group key
  keyVersion: integer('key_version').notNull().default(1),
  serverPublicKey: text('server_public_key').notNull(), // For key wrapping
  serverSecretKey: text('server_secret_key').notNull(), // Keep secure!
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * Group members junction table - links users to groups
 */
export const groupMembers = pgTable('group_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').notNull().references(() => groups.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

// Relations for type-safe joins

export const usersRelations = relations(users, ({ many }) => ({
  locations: many(locations),
  createdInviteCodes: many(inviteCodes, { relationName: 'createdInviteCodes' }),
  groupMemberships: many(groupMembers),
}));

export const locationsRelations = relations(locations, ({ one }) => ({
  user: one(users, {
    fields: [locations.userId],
    references: [users.id],
  }),
}));

export const inviteCodesRelations = relations(inviteCodes, ({ one }) => ({
  creator: one(users, {
    fields: [inviteCodes.createdBy],
    references: [users.id],
    relationName: 'createdInviteCodes',
  }),
  usedByUser: one(users, {
    fields: [inviteCodes.usedBy],
    references: [users.id],
  }),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  members: many(groupMembers),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));
