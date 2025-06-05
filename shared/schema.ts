import { pgTable, text, serial, integer, timestamp, foreignKey, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  credits: integer("credits").notNull().default(1),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  isAdmin: integer("is_admin").notNull().default(0), // 0 = false, 1 = true
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  purchases: many(purchases),
  gradings: many(gradings),
}));

// Purchases table schema
export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  bundleId: integer("bundle_id").notNull(),
  amount: integer("amount").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  status: text("status").notNull().default("completed"),
});

// Purchase relations
export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
}));

// Essay grading history table schema
export const gradings = pgTable("gradings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  essayText: text("essay_text").notNull(),
  rubricId: integer("rubric_id").notNull(),
  scores: text("scores").notNull(), // JSON stringified
  feedback: text("feedback").notNull(),
  recommendations: text("recommendations").notNull(), // JSON stringified
  date: timestamp("date").notNull().defaultNow(),
});

// Grading relations
export const gradingsRelations = relations(gradings, ({ one }) => ({
  user: one(users, {
    fields: [gradings.userId],
    references: [users.id],
  }),
}));

// Contact messages table schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("unread").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  credits: true,
  subscriptionExpiresAt: true,
});

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
  date: true,
  status: true,
});

export const insertGradingSchema = createInsertSchema(gradings).omit({
  id: true,
  scores: true, 
  feedback: true,
  recommendations: true,
  date: true,
}).extend({
  essayText: z.string().min(50, "Essay must be at least 50 characters"),
  rubricId: z.number().int().positive(),
});

// Extend the gradeEssaySchema for the API request
export const gradeEssaySchema = z.object({
  essayText: z.string().min(50, "Essay must be at least 50 characters"),
  rubricId: z.number().int().positive(),
});

// Define types for the schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;
export type Grading = typeof gradings.$inferSelect;

// Define Bundle type for credit purchases
export type Bundle = {
  id: number;
  name: string;
  credits: number;
  price: number;
  bonusCredits: number;
  isPopular: boolean;
  isSubscription: boolean;
};

// Define GradingResult type for API response
export type GradingResult = {
  scores: Record<string, number>;
  overallScore: number;
  feedback: string;
  recommendations: string[];
};

// Login type
export type LoginCredentials = {
  username: string;
  password: string;
};
