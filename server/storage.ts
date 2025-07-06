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
  communityMessages,
  communityAnnouncements,
  type CommunityMessage,
  type InsertCommunityMessage,
  type CommunityAnnouncement,
  type InsertCommunityAnnouncement,
  agentBookings,
  type AgentBooking,
  type InsertAgentBooking,
  startupIdeas,
  investments,
  type StartupIdea,
  type InsertStartupIdea,
  type Investment,
  type InsertInvestment,
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

  // Community messaging operations
  getCommunityMessages(groupId: number, limit?: number): Promise<CommunityMessage[]>;
  createCommunityMessage(message: InsertCommunityMessage): Promise<CommunityMessage>;
  getCommunityAnnouncements(groupId: number): Promise<CommunityAnnouncement[]>;
  createCommunityAnnouncement(announcement: InsertCommunityAnnouncement): Promise<CommunityAnnouncement>;
  markAnnouncementAsViewed(announcementId: number, userId: string): Promise<void>;

  // Agent booking operations
  createAgentBooking(booking: InsertAgentBooking): Promise<AgentBooking>;
  getUserBookings(userId: string): Promise<AgentBooking[]>;
  updateMemberContribution(groupId: number, userId: string, additionalAmount: number): Promise<void>;
  updateGroupTotalPool(groupId: number, additionalAmount: number): Promise<void>;

  // Startup ideas and investments
  getStartupIdeas(): Promise<StartupIdea[]>;
  createStartupIdea(idea: InsertStartupIdea): Promise<StartupIdea>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  getUserInvestments(userId: string): Promise<Investment[]>;
  updateIdeaFunding(ideaId: number, additionalFunding: number): Promise<void>;

  async getMentors(): Promise<any>;
  async createMentor(mentorData: any): Promise<any>;
  async getMentorshipSessions(userId: string): Promise<any>;
  async createMentorshipSession(sessionData: any): Promise<any>;
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
    let agents = await db
      .select()
      .from(cashAgents)
      .orderBy(asc(cashAgents.businessName));

    // If no agents exist, create sample ones
    if (agents.length === 0) {
      const sampleAgents = [
        {
          userId: 'agent-1',
          businessName: 'QuickCash Mart',
          location: 'Westlands, Nairobi',
          latitude: '-1.2670',
          longitude: '36.8070',
          rating: '4.5',
          totalRatings: 156,
          isOnline: true,
          services: ['cash_in', 'cash_out']
        },
        {
          userId: 'agent-2',
          businessName: 'Express Money Services',
          location: 'CBD, Nairobi',
          latitude: '-1.2840',
          longitude: '36.8210',
          rating: '4.2',
          totalRatings: 89,
          isOnline: true,
          services: ['cash_in', 'cash_out', 'bill_payments']
        },
        {
          userId: 'agent-3',
          businessName: 'Family Store & Cash',
          location: 'Kasarani, Nairobi',
          latitude: '-1.2200',
          longitude: '36.8980',
          rating: '4.7',
          totalRatings: 203,
          isOnline: false,
          services: ['cash_in', 'cash_out']
        },
        {
          userId: 'agent-4',
          businessName: 'Metro Cash Point',
          location: 'Kilimani, Nairobi',
          latitude: '-1.2890',
          longitude: '36.7830',
          rating: '4.3',
          totalRatings: 67,
          isOnline: true,
          services: ['cash_in', 'cash_out', 'mobile_money']
        },
        {
          userId: 'agent-5',
          businessName: 'Swift Pay Hub',
          location: 'Parklands, Nairobi',
          latitude: '-1.2630',
          longitude: '36.8150',
          rating: '4.6',
          totalRatings: 134,
          isOnline: true,
          services: ['cash_in', 'cash_out', 'forex']
        }
      ];

      for (const agentData of sampleAgents) {
        await db.insert(cashAgents).values(agentData);
      }

      agents = await db
        .select()
        .from(cashAgents)
        .orderBy(asc(cashAgents.businessName));
    }

    return agents;
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

  // Community messaging operations
  async getCommunityMessages(groupId: number, limit = 50): Promise<CommunityMessage[]> {
    return await db
      .select()
      .from(communityMessages)
      .where(eq(communityMessages.groupId, groupId))
      .orderBy(desc(communityMessages.createdAt))
      .limit(limit);
  }

  async createCommunityMessage(message: InsertCommunityMessage): Promise<CommunityMessage> {
    const [newMessage] = await db.insert(communityMessages).values(message).returning();
    return newMessage;
  }

  async getCommunityAnnouncements(groupId: number): Promise<CommunityAnnouncement[]> {
    return await db
      .select()
      .from(communityAnnouncements)
      .where(and(eq(communityAnnouncements.groupId, groupId), eq(communityAnnouncements.isActive, true)))
      .orderBy(desc(communityAnnouncements.createdAt));
  }

  async createCommunityAnnouncement(announcement: InsertCommunityAnnouncement): Promise<CommunityAnnouncement> {
    const [newAnnouncement] = await db.insert(communityAnnouncements).values(announcement).returning();
    return newAnnouncement;
  }

  async markAnnouncementAsViewed(announcementId: number, userId: string): Promise<void> {
    const [announcement] = await db
      .select()
      .from(communityAnnouncements)
      .where(eq(communityAnnouncements.id, announcementId));

    if (announcement) {
      const viewedBy = announcement.viewedBy as string[] || [];
      if (!viewedBy.includes(userId)) {
        viewedBy.push(userId);
        await db
          .update(communityAnnouncements)
          .set({ viewedBy, updatedAt: new Date() })
          .where(eq(communityAnnouncements.id, announcementId));
      }
    }
  }

  async updateMemberContribution(groupId: number, userId: string, additionalAmount: number): Promise<void> {
    const [member] = await db
      .select()
      .from(communityMembers)
      .where(and(eq(communityMembers.groupId, groupId), eq(communityMembers.userId, userId)));

    if (member) {
      const currentContribution = parseFloat(member.contribution);
      const newContribution = (currentContribution + additionalAmount).toString();

      await db
        .update(communityMembers)
        .set({ contribution: newContribution })
        .where(and(eq(communityMembers.groupId, groupId), eq(communityMembers.userId, userId)));
    }
  }

  async updateGroupTotalPool(groupId: number, additionalAmount: number): Promise<void> {
    const [group] = await db
      .select()
      .from(communityGroups)
      .where(eq(communityGroups.id, groupId));

    if (group) {
      const currentPool = parseFloat(group.totalPool);
      const newPool = (currentPool + additionalAmount).toString();

      await db
        .update(communityGroups)
        .set({ totalPool: newPool, updatedAt: new Date() })
        .where(eq(communityGroups.id, groupId));
    }
  }

  // Agent booking operations
  async createAgentBooking(booking: InsertAgentBooking): Promise<AgentBooking> {
    const [newBooking] = await db.insert(agentBookings).values(booking).returning();
    return newBooking;
  }

  async getUserBookings(userId: string): Promise<AgentBooking[]> {
    return await db
      .select()
      .from(agentBookings)
      .where(eq(agentBookings.userId, userId))
      .orderBy(desc(agentBookings.createdAt));
  }

  // Startup ideas and investments
  async getStartupIdeas(): Promise<StartupIdea[]> {
    let ideas = await db
      .select()
      .from(startupIdeas)
      .orderBy(desc(startupIdeas.createdAt));

    // If no ideas exist, create sample ones
    if (ideas.length === 0) {
      const sampleIdeas = [
        {
          creatorId: 'demo-founder-1',
          title: 'GreenPay - Eco-Friendly Mobile Payments',
          description: 'A mobile payment platform that plants trees for every transaction, promoting environmental sustainability while providing seamless payment solutions.',
          category: 'fintech',
          fundingGoal: '2000000',
          currentFunding: '450000',
          currency: 'KES',
          minimumInvestment: '50000',
          equity: '15',
          stage: 'seed',
          status: 'open',
          tags: ['payments', 'environment', 'mobile', 'sustainability'],
          likesCount: 24,
          viewsCount: 156
        },
        {
          creatorId: 'demo-founder-2',
          title: 'FarmConnect - Direct Farm-to-Market Platform',
          description: 'Connecting smallholder farmers directly with urban markets, eliminating middlemen and ensuring fair prices for both farmers and consumers.',
          category: 'agritech',
          fundingGoal: '1500000',
          currentFunding: '300000',
          currency: 'KES',
          minimumInvestment: '25000',
          equity: '20',
          stage: 'seed',
          status: 'open',
          tags: ['agriculture', 'marketplace', 'farmers', 'food'],
          likesCount: 18,
          viewsCount: 89
        },
        {
          creatorId: 'demo-founder-3',
          title: 'HealthTracker AI - Personalized Health Monitoring',
          description: 'AI-powered health monitoring app that provides personalized health insights and early disease detection using smartphone sensors.',
          category: 'healthtech',
          fundingGoal: '3000000',
          currentFunding: '750000',
          currency: 'KES',
          minimumInvestment: '75000',
          equity: '12',
          stage: 'seed',
          status: 'open',
          tags: ['health', 'AI', 'monitoring', 'prevention'],
          likesCount: 31,
          viewsCount: 203
        }
      ];

      for (const ideaData of sampleIdeas) {
        await db.insert(startupIdeas).values(ideaData);
      }

      ideas = await db
        .select()
        .from(startupIdeas)
        .orderBy(desc(startupIdeas.createdAt));
    }

    return ideas;
  }

  async createStartupIdea(idea: InsertStartupIdea): Promise<StartupIdea> {
    const [newIdea] = await db.insert(startupIdeas).values(idea).returning();
    return newIdea;
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const [newInvestment] = await db.insert(investments).values(investment).returning();
    return newInvestment;
  }

  async getUserInvestments(userId: string): Promise<Investment[]> {
    return await db
      .select()
      .from(investments)
      .where(eq(investments.investorId, userId))
      .orderBy(desc(investments.createdAt));
  }

  async updateIdeaFunding(ideaId: number, additionalFunding: number): Promise<void> {
    const [idea] = await db
      .select()
      .from(startupIdeas)
      .where(eq(startupIdeas.id, ideaId));

    if (idea) {
      const currentFunding = parseFloat(idea.currentFunding);
      const newFunding = (currentFunding + additionalFunding).toString();

      await db
        .update(startupIdeas)
        .set({ 
          currentFunding: newFunding, 
          updatedAt: new Date(),
          viewsCount: idea.viewsCount + 1
        })
        .where(eq(startupIdeas.id, ideaId));
    }
  }

  async getMentors(): Promise<any> {
    // Return sample mentor data since mentors table doesn't exist yet
    return [
      {
        id: 1,
        name: 'Sarah Kiprotich',
        expertise: 'Financial Planning',
        experienceYears: 8,
        hourlyRate: 2500,
        rating: 4.8,
        availability: 'weekdays_evenings',
        bio: 'Experienced financial advisor specializing in investment strategies and retirement planning.'
      },
      {
        id: 2,
        name: 'David Mwangi',
        expertise: 'Business Development',
        experienceYears: 12,
        hourlyRate: 3000,
        rating: 4.9,
        availability: 'weekends',
        bio: 'Business mentor with expertise in startup growth and market expansion.'
      }
    ];
  }

  async createMentor(mentorData: any): Promise<any> {
    // Return mock mentor creation response
    return {
      id: Math.floor(Math.random() * 1000),
      ...mentorData,
      rating: 0,
      totalSessions: 0,
      createdAt: new Date()
    };
  }

  async getMentorshipSessions(userId: string): Promise<any> {
    // Return sample mentorship sessions
    return [
      {
        id: 1,
        mentorName: 'Sarah Kiprotich',
        topic: 'Investment Portfolio Review',
        sessionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        durationMinutes: 60,
        status: 'scheduled'
      }
    ];
  }

  async createMentorshipSession(sessionData: any): Promise<any> {
    // Return mock session creation response
    return {
      id: Math.floor(Math.random() * 1000),
      ...sessionData,
      status: 'scheduled',
      createdAt: new Date()
    };
  }
}

export const storage = new DatabaseStorage();