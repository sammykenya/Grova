import {
  users,
  wallets,
  transactions,
  communityGroups,
  communityMembers,
  communityProposals,
  cashAgents,
  aiCoachingSessions,
  financialGoals,
  type User,
  type UpsertUser,
  type Wallet,
  type InsertWallet,
  type Transaction,
  type InsertTransaction,
  type CommunityGroup,
  type InsertCommunityGroup,
  type CommunityMember,
  type InsertCommunityMember,
  type CommunityProposal,
  type InsertCommunityProposal,
  type CashAgent,
  type InsertCashAgent,
  type AICoachingSession,
  type InsertAICoachingSession,
  type FinancialGoal,
  type InsertFinancialGoal,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Wallet operations
  getUserWallets(userId: string): Promise<Wallet[]>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWalletBalance(walletId: number, newBalance: string): Promise<void>;
  getWalletByTypeAndCurrency(userId: string, walletType: string, currency: string): Promise<Wallet | undefined>;

  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  updateTransactionStatus(transactionId: number, status: string): Promise<void>;

  // Community operations
  getCommunityGroups(userId: string): Promise<CommunityGroup[]>;
  createCommunityGroup(group: InsertCommunityGroup): Promise<CommunityGroup>;
  joinCommunityGroup(groupId: number, userId: string): Promise<CommunityMember>;
  getCommunityMembers(groupId: number): Promise<CommunityMember[]>;
  getCommunityProposals(groupId: number): Promise<CommunityProposal[]>;
  createCommunityProposal(proposal: InsertCommunityProposal): Promise<CommunityProposal>;

  // Cash agent operations
  getCashAgents(latitude?: number, longitude?: number, radius?: number): Promise<CashAgent[]>;
  createCashAgent(agent: InsertCashAgent): Promise<CashAgent>;
  updateAgentOnlineStatus(agentId: number, isOnline: boolean): Promise<void>;

  // AI coaching operations
  createAICoachingSession(session: InsertAICoachingSession): Promise<AICoachingSession>;
  getUserCoachingSessions(userId: string, limit?: number): Promise<AICoachingSession[]>;

  // Financial goals operations
  getUserFinancialGoals(userId: string): Promise<FinancialGoal[]>;
  createFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal>;
  updateFinancialGoalProgress(goalId: number, currentAmount: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Wallet operations
  async getUserWallets(userId: string): Promise<Wallet[]> {
    return await db.select().from(wallets).where(eq(wallets.userId, userId));
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const [newWallet] = await db.insert(wallets).values(wallet).returning();
    return newWallet;
  }

  async updateWalletBalance(walletId: number, newBalance: string): Promise<void> {
    await db
      .update(wallets)
      .set({ balance: newBalance, updatedAt: new Date() })
      .where(eq(wallets.id, walletId));
  }

  async getWalletByTypeAndCurrency(userId: string, walletType: string, currency: string): Promise<Wallet | undefined> {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(
        and(
          eq(wallets.userId, userId),
          eq(wallets.walletType, walletType),
          eq(wallets.currency, currency)
        )
      );
    return wallet;
  }

  // Transaction operations
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  async getUserTransactions(userId: string, limit = 10): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(
        sql`${transactions.fromUserId} = ${userId} OR ${transactions.toUserId} = ${userId}`
      )
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  async updateTransactionStatus(transactionId: number, status: string): Promise<void> {
    await db
      .update(transactions)
      .set({ status, updatedAt: new Date() })
      .where(eq(transactions.id, transactionId));
  }

  // Community operations
  async getCommunityGroups(userId: string): Promise<CommunityGroup[]> {
    let groups = await db
      .select({
        id: communityGroups.id,
        name: communityGroups.name,
        description: communityGroups.description,
        totalPool: communityGroups.totalPool,
        currency: communityGroups.currency,
        nextDisbursement: communityGroups.nextDisbursement,
        createdBy: communityGroups.createdBy,
        createdAt: communityGroups.createdAt,
        updatedAt: communityGroups.updatedAt,
      })
      .from(communityGroups)
      .innerJoin(communityMembers, eq(communityGroups.id, communityMembers.groupId))
      .where(eq(communityMembers.userId, userId));

    // If no groups exist, create a sample one
    if (groups.length === 0) {
      const sampleGroup = await db
        .insert(communityGroups)
        .values({
          name: 'My Savings Circle',
          description: 'A community savings group for financial goals',
          totalPool: '45000.00',
          currency: 'KES',
          nextDisbursement: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          createdBy: userId
        })
        .returning();

      // Auto-join the user as admin
      await db.insert(communityMembers).values({
        groupId: sampleGroup[0].id,
        userId: userId,
        contribution: '15000.00',
        role: 'admin'
      });

      // Add some sample members
      const sampleMembers = [
        { userId: 'member-1', contribution: '10000.00', role: 'member' },
        { userId: 'member-2', contribution: '12000.00', role: 'member' },
        { userId: 'member-3', contribution: '8000.00', role: 'member' }
      ];

      for (const member of sampleMembers) {
        await db.insert(communityMembers).values({
          groupId: sampleGroup[0].id,
          userId: member.userId,
          contribution: member.contribution,
          role: member.role
        });
      }

      groups = [sampleGroup[0]];
    }

    return groups;
  }

  async createCommunityGroup(group: InsertCommunityGroup): Promise<CommunityGroup> {
    const [newGroup] = await db.insert(communityGroups).values(group).returning();
    return newGroup;
  }

  async joinCommunityGroup(groupId: number, userId: string): Promise<CommunityMember> {
    const [member] = await db
      .insert(communityMembers)
      .values({ groupId, userId })
      .returning();
    return member;
  }

  async getCommunityMembers(groupId: number): Promise<CommunityMember[]> {
    return await db
      .select()
      .from(communityMembers)
      .where(eq(communityMembers.groupId, groupId));
  }

  async getCommunityProposals(groupId: number): Promise<CommunityProposal[]> {
    return await db
      .select()
      .from(communityProposals)
      .where(eq(communityProposals.groupId, groupId))
      .orderBy(desc(communityProposals.createdAt));
  }

  async createCommunityProposal(proposal: InsertCommunityProposal): Promise<CommunityProposal> {
    const [newProposal] = await db.insert(communityProposals).values(proposal).returning();
    return newProposal;
  }

  // Cash agent operations
  async getCashAgents(latitude?: number, longitude?: number, radius = 10): Promise<CashAgent[]> {
    // For simplicity, return all agents. In production, implement geospatial queries
    return await db
      .select()
      .from(cashAgents)
      .orderBy(asc(cashAgents.businessName));
  }

  async createCashAgent(agent: InsertCashAgent): Promise<CashAgent> {
    const [newAgent] = await db.insert(cashAgents).values(agent).returning();
    return newAgent;
  }

  async updateAgentOnlineStatus(agentId: number, isOnline: boolean): Promise<void> {
    await db
      .update(cashAgents)
      .set({ isOnline, updatedAt: new Date() })
      .where(eq(cashAgents.id, agentId));
  }

  // AI coaching operations
  async createAICoachingSession(session: InsertAICoachingSession): Promise<AICoachingSession> {
    const [newSession] = await db.insert(aiCoachingSessions).values(session).returning();
    return newSession;
  }

  async getUserCoachingSessions(userId: string, limit = 10): Promise<AICoachingSession[]> {
    return await db
      .select()
      .from(aiCoachingSessions)
      .where(eq(aiCoachingSessions.userId, userId))
      .orderBy(desc(aiCoachingSessions.createdAt))
      .limit(limit);
  }

  // Financial goals operations
  async getUserFinancialGoals(userId: string): Promise<FinancialGoal[]> {
    return await db
      .select()
      .from(financialGoals)
      .where(and(eq(financialGoals.userId, userId), eq(financialGoals.isActive, true)))
      .orderBy(desc(financialGoals.createdAt));
  }

  async createFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal> {
    const [newGoal] = await db.insert(financialGoals).values(goal).returning();
    return newGoal;
  }

  async updateFinancialGoalProgress(goalId: number, currentAmount: string): Promise<void> {
    await db
      .update(financialGoals)
      .set({ currentAmount, updatedAt: new Date() })
      .where(eq(financialGoals.id, goalId));
  }
}

export const storage = new DatabaseStorage();