import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Prompts table
export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  model: text("model").notNull(),
  goal: text("goal"),
  outputFormat: text("output_format"),
  style: text("style"),
  tone: text("tone"),
  actionVerb: text("action_verb"),
  specificDetails: text("specific_details"),
  useRolePlaying: boolean("use_role_playing").default(false),
  role: text("role"),
  isFavorite: boolean("is_favorite").default(false),
  categoryId: integer("category_id").references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Responses table
export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  promptId: integer("prompt_id").notNull().references(() => prompts.id),
  model: text("model").notNull(),
  generationTime: text("generation_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);

export const insertPromptSchema = createInsertSchema(prompts);
export const selectPromptSchema = createSelectSchema(prompts);

export const insertResponseSchema = createInsertSchema(responses);
export const selectResponseSchema = createSelectSchema(responses);

// Custom Zod schemas for API requests
export const createPromptSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  model: z.string().min(1, "Model is required"),
  goal: z.string().optional(),
  outputFormat: z.string().optional(),
  style: z.string().optional(),
  tone: z.string().optional(),
  actionVerb: z.string().optional(),
  specificDetails: z.string().optional(),
  useRolePlaying: z.boolean().optional(),
  role: z.string().optional(),
  categoryId: z.number().optional(),
});

export const generateResponseSchema = z.object({
  promptId: z.number(),
  model: z.string().min(1, "Model is required"),
});
