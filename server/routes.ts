import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  generateFinancialTip, 
  analyzeSpendingPatterns, 
  processVoiceCommand,
  generatePersonalizedAdvice 
} from "./openai";
import { 
  insertWalletSchema,
  insertTransactionSchema,
  insertCommunityGroupSchema,
  insertCommunityProposalSchema,
  insertCashAgentSchema,
  insertAICoachingSessionSchema,
  insertFinancialGoalSchema,
  insertCommunityMessageSchema,
  insertCommunityAnnouncementSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Initialize user wallets on first login
  app.post('/api/wallets/initialize', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if user already has wallets
      const existingWallets = await storage.getUserWallets(userId);
      if (existingWallets.length > 0) {
        return res.json({ message: "Wallets already initialized", wallets: existingWallets });
      }

      // Create default wallets
      const defaultWallets = [
        { userId, walletType: 'fiat', currency: 'KES', balance: '14500.00' },
        { userId, walletType: 'crypto', currency: 'BTC', balance: '0.002' },
        { userId, walletType: 'credits', currency: 'CREDITS', balance: '150.00' }
      ];

      const wallets = [];
      for (const walletData of defaultWallets) {
        const wallet = await storage.createWallet(walletData);
        wallets.push(wallet);
      }

      res.json({ message: "Wallets initialized successfully", wallets });
    } catch (error) {
      console.error("Error initializing wallets:", error);
      res.status(500).json({ message: "Failed to initialize wallets" });
    }
  });

  // Get user wallets
  app.get('/api/wallets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const wallets = await storage.getUserWallets(userId);
      res.json(wallets);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  // Create transaction
  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactionData = insertTransactionSchema.parse(req.body);
      
      // Validate that the user owns the from wallet
      const wallets = await storage.getUserWallets(userId);
      const fromWallet = wallets.find(w => w.id === transactionData.fromWalletId);
      
      if (!fromWallet) {
        return res.status(403).json({ message: "Unauthorized: Invalid from wallet" });
      }

      // Check balance
      const amount = parseFloat(transactionData.amount);
      const balance = parseFloat(fromWallet.balance);
      
      if (balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Create transaction
      const transaction = await storage.createTransaction({
        ...transactionData,
        fromUserId: userId,
        status: 'completed'
      });

      // Update wallet balance
      const newBalance = (balance - amount).toString();
      await storage.updateWalletBalance(fromWallet.id, newBalance);

      res.json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Get user transactions
  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await storage.getUserTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // AI Coaching - Get daily tip
  app.get('/api/ai-coach/daily-tip', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const language = (req.query.language as string) || 'en';
      
      // Get user's recent transactions for context
      const transactions = await storage.getUserTransactions(userId, 30);
      
      const tip = await generateFinancialTip({
        transactions,
        userId,
        requestedAt: new Date()
      }, language);

      // Save coaching session
      await storage.createAICoachingSession({
        userId,
        prompt: "daily_tip_request",
        response: tip.tip,
        category: tip.category,
        language
      });

      res.json(tip);
    } catch (error) {
      console.error("Error generating daily tip:", error);
      res.status(500).json({ message: "Failed to generate daily tip" });
    }
  });

  // AI Coaching - Ask question
  app.post('/api/ai-coach/ask', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { question, language = 'en' } = req.body;

      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }

      // Get user profile for context
      const user = await storage.getUser(userId);
      const wallets = await storage.getUserWallets(userId);
      const transactions = await storage.getUserTransactions(userId, 10);

      const userProfile = {
        user,
        wallets,
        recentTransactions: transactions
      };

      const response = await generatePersonalizedAdvice(userProfile, question, language);

      // Save coaching session
      await storage.createAICoachingSession({
        userId,
        prompt: question,
        response,
        category: 'general',
        language
      });

      res.json({ response });
    } catch (error) {
      console.error("Error processing AI question:", error);
      res.status(500).json({ message: "Failed to process question" });
    }
  });

  // AI Coaching - Analyze spending
  app.get('/api/ai-coach/spending-analysis', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const language = (req.query.language as string) || 'en';
      
      const transactions = await storage.getUserTransactions(userId, 50);
      const analysis = await analyzeSpendingPatterns(transactions, language);

      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing spending:", error);
      res.status(500).json({ message: "Failed to analyze spending" });
    }
  });

  // Voice command processing
  app.post('/api/voice/process', isAuthenticated, async (req: any, res) => {
    try {
      const { audioText, language = 'en' } = req.body;

      if (!audioText) {
        return res.status(400).json({ message: "Audio text is required" });
      }

      const result = await processVoiceCommand(audioText, language);
      res.json(result);
    } catch (error) {
      console.error("Error processing voice command:", error);
      res.status(500).json({ message: "Failed to process voice command" });
    }
  });

  // Community Groups
  app.get('/api/community/groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const groups = await storage.getCommunityGroups(userId);
      res.json(groups);
    } catch (error) {
      console.error("Error fetching community groups:", error);
      res.status(500).json({ message: "Failed to fetch community groups" });
    }
  });

  app.post('/api/community/groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const groupData = insertCommunityGroupSchema.parse({
        ...req.body,
        createdBy: userId
      });

      const group = await storage.createCommunityGroup(groupData);
      
      // Auto-join creator as admin
      await storage.joinCommunityGroup(group.id, userId);

      res.json(group);
    } catch (error) {
      console.error("Error creating community group:", error);
      res.status(500).json({ message: "Failed to create community group" });
    }
  });

  app.get('/api/community/groups/:groupId/members', isAuthenticated, async (req: any, res) => {
    try {
      const groupId = parseInt(req.params.groupId);
      const members = await storage.getCommunityMembers(groupId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching community members:", error);
      res.status(500).json({ message: "Failed to fetch community members" });
    }
  });

  app.get('/api/community/groups/:groupId/proposals', isAuthenticated, async (req: any, res) => {
    try {
      const groupId = parseInt(req.params.groupId);
      const proposals = await storage.getCommunityProposals(groupId);
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  app.post('/api/community/groups/:groupId/proposals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const groupId = parseInt(req.params.groupId);
      
      const proposalData = insertCommunityProposalSchema.parse({
        ...req.body,
        groupId,
        proposedBy: userId
      });

      const proposal = await storage.createCommunityProposal(proposalData);
      res.json(proposal);
    } catch (error) {
      console.error("Error creating proposal:", error);
      res.status(500).json({ message: "Failed to create proposal" });
    }
  });

  // Cash Agents
  app.get('/api/cash-agents', isAuthenticated, async (req: any, res) => {
    try {
      const { latitude, longitude, radius } = req.query;
      const agents = await storage.getCashAgents(
        latitude ? parseFloat(latitude as string) : undefined,
        longitude ? parseFloat(longitude as string) : undefined,
        radius ? parseFloat(radius as string) : undefined
      );
      res.json(agents);
    } catch (error) {
      console.error("Error fetching cash agents:", error);
      res.status(500).json({ message: "Failed to fetch cash agents" });
    }
  });

  app.post('/api/cash-agents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const agentData = insertCashAgentSchema.parse({
        ...req.body,
        userId
      });

      const agent = await storage.createCashAgent(agentData);
      res.json(agent);
    } catch (error) {
      console.error("Error creating cash agent:", error);
      res.status(500).json({ message: "Failed to create cash agent" });
    }
  });

  // Financial Goals
  app.get('/api/financial-goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goals = await storage.getUserFinancialGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching financial goals:", error);
      res.status(500).json({ message: "Failed to fetch financial goals" });
    }
  });

  app.post('/api/financial-goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goalData = insertFinancialGoalSchema.parse({
        ...req.body,
        userId
      });

      const goal = await storage.createFinancialGoal(goalData);
      res.json(goal);
    } catch (error) {
      console.error("Error creating financial goal:", error);
      res.status(500).json({ message: "Failed to create financial goal" });
    }
  });

  // Community Messages
  app.get('/api/community/groups/:groupId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const groupId = parseInt(req.params.groupId);
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await storage.getCommunityMessages(groupId, limit);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/community/groups/:groupId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const groupId = parseInt(req.params.groupId);
      
      const messageData = insertCommunityMessageSchema.parse({
        ...req.body,
        groupId,
        userId
      });

      const message = await storage.createCommunityMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Community Announcements
  app.get('/api/community/groups/:groupId/announcements', isAuthenticated, async (req: any, res) => {
    try {
      const groupId = parseInt(req.params.groupId);
      const announcements = await storage.getCommunityAnnouncements(groupId);
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  app.post('/api/community/groups/:groupId/announcements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const groupId = parseInt(req.params.groupId);
      
      const announcementData = insertCommunityAnnouncementSchema.parse({
        ...req.body,
        groupId,
        userId
      });

      const announcement = await storage.createCommunityAnnouncement(announcementData);
      res.json(announcement);
    } catch (error) {
      console.error("Error creating announcement:", error);
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });

  app.post('/api/community/announcements/:announcementId/view', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const announcementId = parseInt(req.params.announcementId);
      
      await storage.markAnnouncementAsViewed(announcementId, userId);
      res.json({ message: "Announcement marked as viewed" });
    } catch (error) {
      console.error("Error marking announcement as viewed:", error);
      res.status(500).json({ message: "Failed to mark announcement as viewed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
