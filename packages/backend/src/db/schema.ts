import { pgTable, uuid, text, real, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Users table - family members using the app
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
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

// Relations for type-safe joins

export const usersRelations = relations(users, ({ many }) => ({
  locations: many(locations),
  createdInviteCodes: many(inviteCodes, { relationName: 'createdInviteCodes' }),
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
