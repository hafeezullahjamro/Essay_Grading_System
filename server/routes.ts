import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { gradeEssaySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

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
    
    // Generate grading result (in a real app, this would call an AI model)
    const result = await storage.gradeEssay(essayText, rubricId);
    
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

  const httpServer = createServer(app);
  return httpServer;
}
