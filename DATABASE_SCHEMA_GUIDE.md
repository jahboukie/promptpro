# Database Schema Guide - PromptPro AI

This document details the database schema design for the PromptPro AI application, including table structures, relationships, and data models.

## Table of Contents

1. [Overview](#overview)
2. [Schema Diagram](#schema-diagram)
3. [Tables](#tables)
   - [Users](#users)
   - [Sessions](#sessions)
   - [Prompts](#prompts)
   - [Responses](#responses)
   - [Categories](#categories)
   - [API Keys](#api-keys)
4. [Relationships](#relationships)
5. [Type Definitions](#type-definitions)
6. [Data Access Patterns](#data-access-patterns)
7. [Migration Strategy](#migration-strategy)

## Overview

PromptPro AI uses a PostgreSQL database with the Drizzle ORM for data persistence. The schema is designed to support the core features of the application including user management, prompt storage, response tracking, and API key management.

## Schema Diagram

The database schema follows this structure:

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │   prompts   │       │  responses  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──┐   │ id (PK)     │◄──┐   │ id (PK)     │
│ username    │   │   │ userId (FK) │   │   │ promptId(FK)│
│ email       │   │   │ title       │   │   │ content     │
│ firstName   │   │   │ content     │   │   │ model       │
│ lastName    │   └───│ categoryId  │   └───│ genTime     │
│ bio         │       │ model       │       │ createdAt   │
│ profileImage│       │ parameters  │       └─────────────┘
│ createdAt   │       │ createdAt   │               
│ updatedAt   │       │ updatedAt   │               
└─────────────┘       └─────────────┘               

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  categories │       │  api_keys   │       │  sessions   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ sid (PK)    │
│ userId (FK) │       │ userId (FK) │       │ sess        │
│ name        │       │ xaiKey      │       │ expire      │
│ description │       │ openaiKey   │       └─────────────┘
│ createdAt   │       │ anthropicKey│               
│ updatedAt   │       │ geminiKey   │               
└─────────────┘       │ updatedAt   │               
                      └─────────────┘               
```

## Tables

### Users

Stores user account information from Replit Auth.

```typescript
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  bio: text("bio"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

Key characteristics:
- `id` is a string from Replit Auth, used as the primary key
- `username` is unique and required
- `email` is unique but optional (some auth methods may not provide email)
- Includes profile information like name, bio, and profile image
- Timestamps for creation and updates

### Sessions

Stores user session data for authentication.

```typescript
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);
```

Key characteristics:
- Required for Replit Auth session persistence
- `sid` is the session ID used as primary key
- `sess` contains the serialized session data as JSONB
- `expire` indicates when the session expires
- Indexed on expire field for efficient cleanup

### Prompts

Stores user-created prompts.

```typescript
export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  model: varchar("model"),
  parameters: jsonb("parameters"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

Key characteristics:
- `id` is an auto-incrementing integer
- `userId` references the users table
- `content` stores the actual prompt text
- `parameters` stores structured prompt parameters as JSONB
- `model` indicates the AI model used/preferred for this prompt
- `categoryId` optional reference to a category

### Responses

Stores AI-generated responses to prompts.

```typescript
export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  promptId: integer("prompt_id").notNull().references(() => prompts.id),
  content: text("content").notNull(),
  model: varchar("model").notNull(),
  generationTime: float("generation_time"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

Key characteristics:
- `id` is an auto-incrementing integer
- `promptId` references the prompts table
- `content` stores the generated AI response
- `model` records which model generated the response
- `generationTime` tracks how long the generation took in seconds

### Categories

Allows users to organize prompts into categories.

```typescript
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

Key characteristics:
- `id` is an auto-incrementing integer
- `userId` references the users table (categories are user-specific)
- `name` is the category name
- `description` provides optional details about the category

### API Keys

Securely stores encrypted API keys for external services.

```typescript
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  xaiKey: varchar("xai_key"),
  openaiKey: varchar("openai_key"),
  anthropicKey: varchar("anthropic_key"),
  geminiKey: varchar("gemini_key"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

Key characteristics:
- `id` is an auto-incrementing integer
- `userId` references the users table
- Separate fields for each provider's API key (all encrypted before storage)
- All key fields are optional, allowing users to configure only needed services

## Relationships

The schema uses Drizzle's relations API to define relationships between tables:

```typescript
export const usersRelations = relations(users, ({ many }) => ({
  prompts: many(prompts),
  categories: many(categories),
  apiKeys: many(apiKeys),
}));

export const promptsRelations = relations(prompts, ({ one, many }) => ({
  user: one(users, {
    fields: [prompts.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [prompts.categoryId],
    references: [categories.id],
  }),
  responses: many(responses),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  prompt: one(prompts, {
    fields: [responses.promptId],
    references: [prompts.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  prompts: many(prompts),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));
```

## Type Definitions

The application defines TypeScript types for database operations:

```typescript
// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertPromptSchema = createInsertSchema(prompts);
export const insertResponseSchema = createInsertSchema(responses);
export const insertCategorySchema = createInsertSchema(categories);
export const insertApiKeysSchema = createInsertSchema(apiKeys);

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;

export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Response = typeof responses.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertApiKeys = z.infer<typeof insertApiKeysSchema>;
export type ApiKeys = typeof apiKeys.$inferSelect;
```

## Data Access Patterns

The application accesses data through a Storage interface implemented in `server/storage.ts`:

```typescript
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(userData: InsertUser): Promise<User>;

  // Prompt operations
  getPrompt(id: number): Promise<Prompt | undefined>;
  getPromptsByUserId(userId: string): Promise<Prompt[]>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(id: number, prompt: InsertPrompt): Promise<Prompt | undefined>;
  deletePrompt(id: number): Promise<boolean>;

  // Response operations
  getResponse(id: number): Promise<Response | undefined>;
  getResponsesByPromptId(promptId: number): Promise<Response[]>;
  createResponse(response: InsertResponse): Promise<Response>;

  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  getCategoriesByUserId(userId: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: InsertCategory): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // API Keys operations
  getApiKeysByUserId(userId: string): Promise<ApiKeys | undefined>;
  saveApiKeys(keys: InsertApiKeys): Promise<ApiKeys>;
  updateApiKeys(userId: string, keys: Partial<InsertApiKeys>): Promise<ApiKeys | undefined>;
}
```

### Implementation Example

Here's an example implementation for the prompt operations:

```typescript
export class DatabaseStorage implements IStorage {
  async getPrompt(id: number): Promise<Prompt | undefined> {
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id));
    return prompt;
  }

  async getPromptsByUserId(userId: string): Promise<Prompt[]> {
    return await db
      .select()
      .from(prompts)
      .where(eq(prompts.userId, userId))
      .orderBy(desc(prompts.updatedAt));
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const [prompt] = await db
      .insert(prompts)
      .values(insertPrompt)
      .returning();
    return prompt;
  }

  async updatePrompt(id: number, updateData: InsertPrompt): Promise<Prompt | undefined> {
    const [updated] = await db
      .update(prompts)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(prompts.id, id))
      .returning();
    return updated;
  }

  async deletePrompt(id: number): Promise<boolean> {
    const result = await db
      .delete(prompts)
      .where(eq(prompts.id, id))
      .returning({ id: prompts.id });
    return result.length > 0;
  }
}
```

## Migration Strategy

The application uses Drizzle's schema push for development migrations:

```typescript
// migrate.ts
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./db";

async function migrateDb() {
  console.log("Running migrations...");
  
  await migrate(db, { migrationsFolder: "./drizzle" });
  
  console.log("Migrations complete!");
}

// Run migrations
migrateDb().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
```

For deployment, migrations can be executed with:

```bash
npm run db:push
```

This strategy allows for rapid development while ensuring database schema consistency across environments.

---

*Last updated: May 8, 2025*