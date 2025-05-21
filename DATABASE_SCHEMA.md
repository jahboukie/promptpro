# Database Schema Documentation

This document outlines the database schema used in the AI Prompting Tool.

## Overview

The application uses PostgreSQL as the database and Drizzle ORM to interact with it. The schema is defined in `shared/schema.ts` and consists of four main tables: `users`, `prompts`, `responses`, and `categories`.

## Entity Relationship Diagram

```
┌─────────┐     ┌──────────┐     ┌───────────┐
│  users  │1───*│ prompts  │1───*│ responses │
└─────────┘     └──────────┘     └───────────┘
     │1              │N
     │               │
     │               │
     │1              │N
┌─────────────┐      │
│ categories  │1─────┘
└─────────────┘
```

## Tables

### users

Stores user information.

| Column   | Type   | Constraints   | Description          |
|----------|--------|---------------|----------------------|
| id       | serial | PK            | Unique identifier    |
| username | text   | NOT NULL      | User's username      |
| password | text   | NOT NULL      | User's password hash |

```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
});
```

### prompts

Stores prompt configurations created by users.

| Column          | Type     | Constraints   | Description                          |
|-----------------|----------|---------------|--------------------------------------|
| id              | serial   | PK            | Unique identifier                    |
| title           | text     | NOT NULL      | Prompt title                         |
| content         | text     | NOT NULL      | Main prompt content                  |
| userId          | integer  | FK, NOT NULL  | Reference to users.id                |
| model           | text     | NOT NULL      | AI model (e.g., "GPT-4")            |
| goal            | text     | NULL          | Purpose (e.g., "generate-content")   |
| outputFormat    | text     | NULL          | Format (e.g., "bullet-points")       |
| style           | text     | NULL          | Style (e.g., "formal")               |
| tone            | text     | NULL          | Tone (e.g., "informative")           |
| actionVerb      | text     | NULL          | Action verb (e.g., "Summarize")      |
| specificDetails | text     | NULL          | Additional context details           |
| useRolePlaying  | boolean  | DEFAULT false | Whether to use role-playing          |
| role            | text     | NULL          | Role for AI to assume                |
| isFavorite      | boolean  | DEFAULT false | Whether prompt is favorited          |
| categoryId      | integer  | FK, NULL      | Reference to categories.id           |
| createdAt       | timestamp| DEFAULT now() | Creation timestamp                   |

```typescript
export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
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
```

### responses

Stores AI-generated responses to prompts.

| Column    | Type     | Constraints  | Description                    |
|-----------|----------|--------------|--------------------------------|
| id        | serial   | PK           | Unique identifier              |
| content   | text     | NOT NULL     | Response content               |
| model     | text     | NOT NULL     | AI model used                  |
| promptId  | integer  | FK, NOT NULL | Reference to prompts.id        |
| createdAt | timestamp| DEFAULT now()| Creation timestamp             |

```typescript
export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  model: text("model").notNull(),
  promptId: integer("prompt_id")
    .notNull()
    .references(() => prompts.id),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### categories

Stores categories for organizing prompts.

| Column  | Type    | Constraints  | Description                 |
|---------|---------|-------------|-----------------------------|
| id      | serial  | PK           | Unique identifier          |
| name    | text    | NOT NULL     | Category name              |
| icon    | text    | NOT NULL     | Icon identifier            |
| userId  | integer | FK, NOT NULL | Reference to users.id      |

```typescript
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});
```

## Relations

The schema defines explicit relations between tables using Drizzle's relations API.

### User Relations

```typescript
export const usersRelations = relations(users, ({ many }) => ({
  prompts: many(prompts),
  categories: many(categories),
}));
```

### Prompt Relations

```typescript
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
```

### Response Relations

```typescript
export const responsesRelations = relations(responses, ({ one }) => ({
  prompt: one(prompts, {
    fields: [responses.promptId],
    references: [prompts.id],
  }),
}));
```

### Category Relations

```typescript
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  prompts: many(prompts),
}));
```

## Schema Validation

The schema also defines Zod validation schemas for inserting data:

```typescript
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPromptSchema = createInsertSchema(prompts).pick({
  title: true,
  content: true,
  userId: true,
  model: true,
  goal: true,
  outputFormat: true,
  style: true,
  tone: true,
  actionVerb: true,
  specificDetails: true,
  useRolePlaying: true,
  role: true,
  isFavorite: true,
  categoryId: true,
});

export const insertResponseSchema = createInsertSchema(responses).pick({
  content: true,
  model: true,
  promptId: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
  userId: true,
});
```

## TypeScript Types

The schema also exports TypeScript types for use throughout the application:

```typescript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;

export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Response = typeof responses.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
```

## Database Storage Implementation

The database operations are implemented in `server/storage.ts` using the `DatabaseStorage` class, which follows the `IStorage` interface:

```typescript
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Prompt operations
  getPrompt(id: number): Promise<Prompt | undefined>;
  getPromptsByUserId(userId: number): Promise<Prompt[]>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(id: number, prompt: InsertPrompt): Promise<Prompt | undefined>;
  deletePrompt(id: number): Promise<boolean>;

  // Response operations
  getResponse(id: number): Promise<Response | undefined>;
  getResponsesByPromptId(promptId: number): Promise<Response[]>;
  createResponse(response: InsertResponse): Promise<Response>;

  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  getCategoriesByUserId(userId: number): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: InsertCategory): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
}
```

## Database Migration

The application uses Drizzle's `db:push` command to push schema changes to the database:

```bash
npm run db:push
```

This command is defined in `package.json` and uses the configuration in `drizzle.config.ts`.

## Sample Data

The application initializes the database with sample data in the `initSampleData` function in `server/storage.ts`. This includes:

1. A demo user
2. Sample categories
3. Sample prompts

This helps developers get started with the application without having to create data from scratch.