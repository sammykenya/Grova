import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wallets table for triple wallet system
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  walletType: varchar("wallet_type").notNull(), // 'fiat', 'crypto', 'credits'
  currency: varchar("currency").notNull(),
  balance: decimal("balance", { precision: 20, scale: 8 }).notNull().default('0'),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  fromUserId: varchar("from_user_id").references(() => users.id),
  toUserId: varchar("to_user_id").references(() => users.id),
  fromWalletId: integer("from_wallet_id").references(() => wallets.id),
  toWalletId: integer("to_wallet_id").references(() => wallets.id),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  currency: varchar("currency").notNull(),
  type: varchar("type").notNull(), // 'send', 'receive', 'convert', 'mesh'
  status: varchar("status").notNull().default('pending'), // 'pending', 'completed', 'failed'
  description: text("description"),
  metadata: jsonb("metadata"), // for offline/mesh data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community treasury/chama groups
export const communityGroups = pgTable("community_groups", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  totalPool: decimal("total_pool", { precision: 20, scale: 8 }).notNull().default('0'),
  currency: varchar("currency").notNull().default('KES'),
  nextDisbursement: timestamp("next_disbursement"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community group members
export const communityMembers = pgTable("community_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => communityGroups.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  contribution: decimal("contribution", { precision: 20, scale: 8 }).notNull().default('0'),
  role: varchar("role").notNull().default('member'), // 'admin', 'member'
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Community proposals for voting
export const communityProposals = pgTable("community_proposals", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => communityGroups.id),
  proposedBy: varchar("proposed_by").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 20, scale: 8 }),
  votesFor: integer("votes_for").notNull().default(0),
  votesAgainst: integer("votes_against").notNull().default(0),
  status: varchar("status").notNull().default('active'), // 'active', 'approved', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cash agents for cash-in/cash-out
export const cashAgents = pgTable("cash_agents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  businessName: varchar("business_name").notNull(),
  location: varchar("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('0'),
  totalRatings: integer("total_ratings").default(0),
  isOnline: boolean("is_online").default(true),
  services: jsonb("services"), // ['cash_in', 'cash_out']
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI coaching sessions and tips
export const aiCoachingSessions = pgTable("ai_coaching_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
  category: varchar("category"), // 'savings', 'budgeting', 'investment'
  language: varchar("language").default('en'),
  createdAt: timestamp("created_at").defaultNow(),
});

// User financial goals
export const financialGoals = pgTable("financial_goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  targetAmount: decimal("target_amount", { precision: 20, scale: 8 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 20, scale: 8 }).notNull().default('0'),
  currency: varchar("currency").notNull(),
  targetDate: timestamp("target_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertWallet = typeof wallets.$inferInsert;
export type Wallet = typeof wallets.$inferSelect;

export type InsertTransaction = typeof transactions.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;

export type InsertCommunityGroup = typeof communityGroups.$inferInsert;
export type CommunityGroup = typeof communityGroups.$inferSelect;

export type InsertCommunityMember = typeof communityMembers.$inferInsert;
export type CommunityMember = typeof communityMembers.$inferSelect;

export type InsertCommunityProposal = typeof communityProposals.$inferInsert;
export type CommunityProposal = typeof communityProposals.$inferSelect;

export type InsertCashAgent = typeof cashAgents.$inferInsert;
export type CashAgent = typeof cashAgents.$inferSelect;

export type InsertAICoachingSession = typeof aiCoachingSessions.$inferInsert;
export type AICoachingSession = typeof aiCoachingSessions.$inferSelect;

export type InsertFinancialGoal = typeof financialGoals.$inferInsert;
export type FinancialGoal = typeof financialGoals.$inferSelect;

// Insert schemas
export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunityGroupSchema = createInsertSchema(communityGroups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunityProposalSchema = createInsertSchema(communityProposals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCashAgentSchema = createInsertSchema(cashAgents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAICoachingSessionSchema = createInsertSchema(aiCoachingSessions).omit({
  id: true,
  createdAt: true,
});

export const insertFinancialGoalSchema = createInsertSchema(financialGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
