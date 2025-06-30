import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { gradeEssaySchema } from "@shared/schema";
import { fileUploadMiddleware, handleFileUpload } from "./fileUpload";
import { gradeEssayWithAI, getRubrics } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Health check endpoint for monitoring and Docker
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "1.0.0"
    });
  });

  // API routes
  // Get user credits
  app.get("/api/credits", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const user = req.user;
    
    res.json({
      credits: user.credits,
      subscriptionExpiresAt: user.subscriptionExpiresAt
    });
  });
  
  // Purchase credits
  app.post("/api/purchase", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const bundleId = z.number().int().positive().parse(req.body.bundleId);
    
    // Get bundle details
    const bundle = await storage.getBundleById(bundleId);
    if (!bundle) {
      return res.status(404).json({ message: "Bundle not found" });
    }
    
    // Record purchase
    await storage.createPurchase({
      userId: req.user.id,
      bundleId,
      amount: bundle.price * 100 // Store in cents
    });
    
    // Update user credits
    let updatedUser;
    
    if (bundle.isSubscription) {
      // Set subscription expiry date to 30 days from now
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      updatedUser = await storage.updateUserSubscription(req.user.id, expiryDate);
    } else {
      // Add credits to user
      const totalCredits = bundle.credits + bundle.bonusCredits;
      updatedUser = await storage.addUserCredits(req.user.id, totalCredits);
    }
    
    res.json({ credits: updatedUser.credits });
  });
  
  // Grade essay
  app.post("/api/grade", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { essayText, rubricId } = gradeEssaySchema.parse(req.body);
    
    const user = req.user;
    
    // Check if user has credits or active subscription
    const now = new Date();
    const hasSubscription = user.subscriptionExpiresAt && user.subscriptionExpiresAt > now;
    
    if (!hasSubscription && user.credits < 1) {
      return res.status(402).json({ message: "Insufficient credits" });
    }
    
    // If user doesn't have subscription, deduct a credit
    if (!hasSubscription) {
      await storage.addUserCredits(user.id, -1);
    }
    
    // Generate grading result using OpenAI
    const result = await gradeEssayWithAI({ essayText, rubricId });
    
    // Save grading to history
    await storage.createGrading({
      userId: user.id,
      essayText,
      rubricId,
      scores: JSON.stringify(result.scores),
      feedback: result.feedback,
      recommendations: JSON.stringify(result.recommendations)
    });
    
    res.json(result);
  });
  
  // Get purchase history
  app.get("/api/purchases", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const purchases = await storage.getUserPurchases(req.user.id);
    res.json(purchases);
  });
  
  // File upload endpoint for essays
  app.post("/api/upload-essay", fileUploadMiddleware, handleFileUpload);
  
  // Get available rubrics
  app.get("/api/rubrics", (req, res) => {
    const rubrics = getRubrics();
    res.json(rubrics);
  });
  
  // Google authentication endpoint
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { displayName, email, uid, photoURL } = req.body;
      
      if (!email || !uid) {
        return res.status(400).json({ message: "Missing required Google user data" });
      }
      
      // Check if user already exists by email
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create new user from Google account
        user = await storage.createUser({
          username: displayName || email.split('@')[0],
          email: email,
          password: 'google-auth-' + uid // Placeholder password for Google users
        });
        
        // Add welcome credits for new Google users
        user = await storage.addUserCredits(user.id, 99); // Add 99 to the default 1 = 100 total
      }
      
      // Log the user in
      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ message: "Login failed" });
        }
        res.json(user);
      });
      
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
