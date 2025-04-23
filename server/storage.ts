import { users, purchases, gradings, type User, type InsertUser, type Purchase, type Bundle, type GradingResult } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, desc } from "drizzle-orm";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Define the bundles available for purchase
const bundles: Bundle[] = [
  {
    id: 1,
    name: "Single Essay",
    credits: 1,
    price: 1.50,
    bonusCredits: 0,
    isPopular: false,
    isSubscription: false
  },
  {
    id: 2,
    name: "5 Essay Pack",
    credits: 5,
    price: 5.00,
    bonusCredits: 1,
    isPopular: true,
    isSubscription: false
  },
  {
    id: 3,
    name: "10 Essay Pack",
    credits: 10,
    price: 8.50,
    bonusCredits: 2,
    isPopular: false,
    isSubscription: false
  },
  {
    id: 4,
    name: "Unlimited Monthly",
    credits: 0,
    price: 15.00,
    bonusCredits: 0,
    isPopular: false,
    isSubscription: true
  }
];

// Rubric templates
const rubrics = [
  { id: 1, name: "General Academic Essay" },
  { id: 2, name: "Argumentative Essay" },
  { id: 3, name: "College Admissions Essay" },
  { id: 4, name: "Research Paper" },
  { id: 5, name: "Literary Analysis" }
];

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSubscription(userId: number, expiryDate: Date): Promise<User>;
  addUserCredits(userId: number, credits: number): Promise<User>;
  getBundleById(id: number): Promise<Bundle | undefined>;
  getAllBundles(): Promise<Bundle[]>;
  createPurchase(purchase: Omit<Purchase, "id" | "date" | "status">): Promise<Purchase>;
  getUserPurchases(userId: number): Promise<Purchase[]>;
  gradeEssay(essayText: string, rubricId: number): Promise<GradingResult>;
  createGrading(grading: Omit<any, "id" | "date">): Promise<any>;
  
  sessionStore: any; // Express session store
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Express session store

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users)
      .values({
        ...insertUser,
        credits: 1, // Give one free credit to new users
      })
      .returning();
    return user;
  }
  
  async updateUserSubscription(userId: number, expiryDate: Date): Promise<User> {
    const [updatedUser] = await db.update(users)
      .set({ subscriptionExpiresAt: expiryDate })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }
  
  async addUserCredits(userId: number, creditsToAdd: number): Promise<User> {
    // First get current credits to ensure we don't go below 0
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      throw new Error("User not found");
    }
    
    let newCredits = user.credits + creditsToAdd;
    if (newCredits < 0) newCredits = 0;
    
    const [updatedUser] = await db.update(users)
      .set({ credits: newCredits })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }
  
  async getBundleById(id: number): Promise<Bundle | undefined> {
    return bundles.find(bundle => bundle.id === id);
  }
  
  async getAllBundles(): Promise<Bundle[]> {
    return bundles;
  }
  
  async createPurchase(purchase: Omit<Purchase, "id" | "date" | "status">): Promise<Purchase> {
    const [newPurchase] = await db.insert(purchases)
      .values({
        ...purchase,
        status: "completed",
      })
      .returning();
    
    return newPurchase;
  }
  
  async getUserPurchases(userId: number): Promise<Purchase[]> {
    return db.select()
      .from(purchases)
      .where(eq(purchases.userId, userId))
      .orderBy(desc(purchases.date));
  }
  
  async gradeEssay(essayText: string, rubricId: number): Promise<GradingResult> {
    // In a real application, this would call an AI model
    // For now, generate a plausible result
    
    const criteriaNames = [
      "Content & Organization", 
      "Grammar & Mechanics", 
      "Critical Thinking", 
      "Evidence & Analysis"
    ];
    
    // Generate random scores between 7 and 10
    const scores: Record<string, number> = {};
    let total = 0;
    
    criteriaNames.forEach(criterion => {
      const score = Math.floor(Math.random() * 4) + 7; // Random score between 7 and 10
      scores[criterion] = score;
      total += score;
    });
    
    const overallScore = parseFloat((total / criteriaNames.length).toFixed(1));
    
    const feedback = [
      "This essay demonstrates strong organizational skills and clear argumentation. The introduction effectively establishes the thesis, and each paragraph contributes to developing the central argument.",
      "The writing is generally clear and concise, with only minor grammatical errors. Sentence structure is varied and appropriate, enhancing the overall readability of the essay.",
      "While the critical analysis shows good understanding of the subject matter, some claims would benefit from more substantial evidence. Consider incorporating more specific examples or data to strengthen your arguments.",
      "The conclusion effectively summarizes the main points but could be more impactful by including broader implications of your argument."
    ];
    
    const recommendations = [
      "Consider reorganizing the third paragraph to more clearly support your thesis statement.",
      "Strengthen your argument by including more specific examples and source citations.",
      "Review your use of passive voice; converting to active voice would strengthen your writing.",
      "Consider addressing counter-arguments to demonstrate a more comprehensive understanding of the topic."
    ];
    
    return {
      scores,
      overallScore,
      feedback: feedback.join(" "),
      recommendations
    };
  }
  
  async createGrading(grading: Omit<any, "id" | "date">): Promise<any> {
    const [newGrading] = await db.insert(gradings)
      .values({
        userId: grading.userId,
        essayText: grading.essayText,
        rubricId: grading.rubricId,
        scores: JSON.stringify(grading.scores),
        feedback: grading.feedback,
        recommendations: JSON.stringify(grading.recommendations),
      })
      .returning();
    
    return {
      ...newGrading,
      scores: JSON.parse(newGrading.scores),
      recommendations: JSON.parse(newGrading.recommendations),
    };
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private purchases: Map<number, Purchase>;
  private gradings: Map<number, any>;
  sessionStore: any; // Express session store
  currentId: {
    users: number;
    purchases: number;
    gradings: number;
  };

  constructor() {
    this.users = new Map();
    this.purchases = new Map();
    this.gradings = new Map();
    this.currentId = {
      users: 1,
      purchases: 1,
      gradings: 1
    };
    
    // Seed initial users
    this.seedUsers();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000
    });
  }

  // Seed initial users as specified in requirements
  private seedUsers() {
    const seedUsers = [
      { id: 1, username: "free_user", email: "free_user@example.com", password: "password", credits: 1, subscriptionExpiresAt: null },
      { id: 2, username: "pack5_user", email: "pack5_user@example.com", password: "password", credits: 6, subscriptionExpiresAt: null },
      { id: 3, username: "pack10_user", email: "pack10_user@example.com", password: "password", credits: 12, subscriptionExpiresAt: null },
      { id: 4, username: "subscriber", email: "subscriber@example.com", password: "password", credits: 0, subscriptionExpiresAt: new Date("2099-12-31T23:59:59Z") }
    ];

    seedUsers.forEach(user => {
      this.users.set(user.id, user as User);
    });
    
    this.currentId.users = 5;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { 
      ...insertUser, 
      id,
      credits: 1, // Give one free credit to new users
      subscriptionExpiresAt: null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserSubscription(userId: number, expiryDate: Date): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    user.subscriptionExpiresAt = expiryDate;
    this.users.set(userId, user);
    
    return user;
  }
  
  async addUserCredits(userId: number, credits: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    user.credits += credits;
    if (user.credits < 0) user.credits = 0;
    
    this.users.set(userId, user);
    
    return user;
  }
  
  async getBundleById(id: number): Promise<Bundle | undefined> {
    return bundles.find(bundle => bundle.id === id);
  }
  
  async getAllBundles(): Promise<Bundle[]> {
    return bundles;
  }
  
  async createPurchase(purchase: Omit<Purchase, "id" | "date" | "status">): Promise<Purchase> {
    const id = this.currentId.purchases++;
    const newPurchase: Purchase = {
      ...purchase,
      id,
      date: new Date(),
      status: "completed"
    };
    
    this.purchases.set(id, newPurchase);
    return newPurchase;
  }
  
  async getUserPurchases(userId: number): Promise<Purchase[]> {
    return Array.from(this.purchases.values())
      .filter(purchase => purchase.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date descending
  }
  
  async gradeEssay(essayText: string, rubricId: number): Promise<GradingResult> {
    // In a real application, this would call an AI model
    // For now, generate a plausible result
    
    const criteriaNames = [
      "Content & Organization", 
      "Grammar & Mechanics", 
      "Critical Thinking", 
      "Evidence & Analysis"
    ];
    
    // Generate random scores between 7 and 10
    const scores: Record<string, number> = {};
    let total = 0;
    
    criteriaNames.forEach(criterion => {
      const score = Math.floor(Math.random() * 4) + 7; // Random score between 7 and 10
      scores[criterion] = score;
      total += score;
    });
    
    const overallScore = parseFloat((total / criteriaNames.length).toFixed(1));
    
    const feedback = [
      "This essay demonstrates strong organizational skills and clear argumentation. The introduction effectively establishes the thesis, and each paragraph contributes to developing the central argument.",
      "The writing is generally clear and concise, with only minor grammatical errors. Sentence structure is varied and appropriate, enhancing the overall readability of the essay.",
      "While the critical analysis shows good understanding of the subject matter, some claims would benefit from more substantial evidence. Consider incorporating more specific examples or data to strengthen your arguments.",
      "The conclusion effectively summarizes the main points but could be more impactful by including broader implications of your argument."
    ];
    
    const recommendations = [
      "Consider reorganizing the third paragraph to more clearly support your thesis statement.",
      "Strengthen your argument by including more specific examples and source citations.",
      "Review your use of passive voice; converting to active voice would strengthen your writing.",
      "Consider addressing counter-arguments to demonstrate a more comprehensive understanding of the topic."
    ];
    
    return {
      scores,
      overallScore,
      feedback: feedback.join(" "),
      recommendations
    };
  }
  
  async createGrading(grading: Omit<any, "id" | "date">): Promise<any> {
    const id = this.currentId.gradings++;
    const newGrading = {
      ...grading,
      id,
      date: new Date()
    };
    
    this.gradings.set(id, newGrading);
    return newGrading;
  }
}

// Switch from MemStorage to DatabaseStorage
export const storage = new DatabaseStorage();
