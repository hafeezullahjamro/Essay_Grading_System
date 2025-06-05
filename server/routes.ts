import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { gradeEssaySchema } from "@shared/schema";
import { fileUploadMiddleware, handleFileUpload } from "./fileUpload";
import { gradeEssayWithAI, getRubrics } from "./openai";
import { generateCSVExport, generateJSONExport, generatePDFExport } from "./exportUtils";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Firebase Google Authentication
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { displayName, email, uid, photoURL } = req.body;
      
      if (!email || !uid) {
        return res.status(400).json({ error: "Missing required Firebase user data" });
      }

      // Check if user already exists by email
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create new user from Firebase data
        user = await storage.createUser({
          username: displayName || email.split('@')[0],
          email: email,
          password: `firebase_${uid}`, // Firebase users don't need traditional passwords
        });
      }

      // Log the user in via session
      req.login(user, (err) => {
        if (err) {
          console.error("Session login error:", err);
          return res.status(500).json({ error: "Failed to create session" });
        }
        res.status(200).json(user);
      });
    } catch (error) {
      console.error("Firebase auth error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

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

  // Get user's grading history
  app.get("/api/gradings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const gradings = await storage.getUserGradings(req.user.id);
      res.json(gradings);
    } catch (error) {
      console.error("Error fetching user gradings:", error);
      res.status(500).json({ message: "Failed to fetch grading history" });
    }
  });

  // Export grading results
  app.get("/api/export/:format", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { format } = req.params;
    const { gradingId } = req.query;
    
    try {
      let gradings;
      
      if (gradingId) {
        // Export single grading
        const grading = await storage.getGradingById(parseInt(gradingId as string));
        if (!grading || grading.userId !== req.user.id) {
          return res.status(404).json({ message: "Grading not found" });
        }
        gradings = [grading];
      } else {
        // Export all user's gradings
        gradings = await storage.getUserGradings(req.user.id);
      }
      
      if (gradings.length === 0) {
        return res.status(404).json({ message: "No grading results found" });
      }
      
      // Generate export based on format
      if (format === 'csv') {
        const csvContent = await generateCSVExport(gradings);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=grading-results-${Date.now()}.csv`);
        res.send(csvContent);
      } else if (format === 'json') {
        const jsonContent = generateJSONExport(gradings);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=grading-results-${Date.now()}.json`);
        res.send(JSON.stringify(jsonContent, null, 2));
      } else if (format === 'pdf') {
        const pdfBuffer = await generatePDFExport(gradings, req.user.username);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=grading-results-${Date.now()}.pdf`);
        res.send(pdfBuffer);
      } else {
        res.status(400).json({ message: "Invalid export format. Supported formats: csv, json, pdf" });
      }
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ message: "Export failed" });
    }
  });
  
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const contactSchema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        subject: z.string().min(5, "Subject must be at least 5 characters"),
        message: z.string().min(10, "Message must be at least 10 characters"),
      });

      const validatedData = contactSchema.parse(req.body);
      
      // Store contact message in database
      const contactMessage = await storage.createContactMessage(validatedData);
      
      res.status(201).json({ 
        message: "Contact message sent successfully",
        id: contactMessage.id 
      });
    } catch (error) {
      console.error("Contact form error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
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
