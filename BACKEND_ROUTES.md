# Backend Routes Implementation Guide

This document provides details about how the backend routes are implemented in the AI Prompting Tool.

## Overview

The backend routes are defined in `server/routes.ts` and registered in the Express application. The routes follow RESTful principles and use the storage interface to interact with the database.

## Route Registration

Routes are registered in the `registerRoutes` function in `server/routes.ts`:

```typescript
export async function registerRoutes(app: Express): Promise<Server> {
  // Register routes here
  app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from the backend!" });
  });

  // More routes...

  const server = app.listen(process.env.PORT || 5000);
  return server;
}
```

## API Endpoints Implementation

### Test Endpoint

```typescript
// Test endpoint to verify API status
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});
```

### User Routes

```typescript
// Get user by ID
app.get("/api/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = await storage.getUser(userId);
  
  if (!user) {
    return res.status(404).json({ error: `User not found with ID: ${userId}` });
  }
  
  res.json(user);
});

// Create a new user
app.post("/api/users", async (req, res) => {
  try {
    const userData = insertUserSchema.parse(req.body);
    const newUser = await storage.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: formatZodError(error) });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
});
```

### Prompt Routes

```typescript
// Get all prompts for a user
app.get("/api/prompts", async (req, res) => {
  // In a real app, get userId from authenticated session
  const userId = 1; // Demo user ID
  const prompts = await storage.getPromptsByUserId(userId);
  res.json(prompts);
});

// Get a specific prompt
app.get("/api/prompts/:id", async (req, res) => {
  const promptId = parseInt(req.params.id);
  const prompt = await storage.getPrompt(promptId);
  
  if (!prompt) {
    return res.status(404).json({ error: `Prompt not found with ID: ${promptId}` });
  }
  
  res.json(prompt);
});

// Create a new prompt
app.post("/api/prompts", async (req, res) => {
  try {
    const promptData = insertPromptSchema.parse(req.body);
    const newPrompt = await storage.createPrompt(promptData);
    res.status(201).json(newPrompt);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: formatZodError(error) });
    }
    res.status(500).json({ error: "Failed to create prompt" });
  }
});

// Update a prompt
app.patch("/api/prompts/:id", async (req, res) => {
  try {
    const promptId = parseInt(req.params.id);
    const promptData = insertPromptSchema.partial().parse(req.body);
    
    const updatedPrompt = await storage.updatePrompt(promptId, promptData);
    
    if (!updatedPrompt) {
      return res.status(404).json({ error: `Prompt not found with ID: ${promptId}` });
    }
    
    res.json(updatedPrompt);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: formatZodError(error) });
    }
    res.status(500).json({ error: "Failed to update prompt" });
  }
});

// Delete a prompt
app.delete("/api/prompts/:id", async (req, res) => {
  const promptId = parseInt(req.params.id);
  const success = await storage.deletePrompt(promptId);
  
  if (!success) {
    return res.status(404).json({ error: `Prompt not found with ID: ${promptId}` });
  }
  
  res.json({ success: true });
});
```

### Response Routes

```typescript
// Get responses for a prompt
app.get("/api/prompts/:promptId/responses", async (req, res) => {
  const promptId = parseInt(req.params.promptId);
  const responses = await storage.getResponsesByPromptId(promptId);
  res.json(responses);
});

// Create a new response
app.post("/api/responses", async (req, res) => {
  try {
    const responseData = insertResponseSchema.parse(req.body);
    const newResponse = await storage.createResponse(responseData);
    res.status(201).json(newResponse);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: formatZodError(error) });
    }
    res.status(500).json({ error: "Failed to create response" });
  }
});
```

### Category Routes

```typescript
// Get all categories for a user
app.get("/api/categories", async (req, res) => {
  // In a real app, get userId from authenticated session
  const userId = 1; // Demo user ID
  const categories = await storage.getCategoriesByUserId(userId);
  res.json(categories);
});

// Create a new category
app.post("/api/categories", async (req, res) => {
  try {
    const categoryData = insertCategorySchema.parse(req.body);
    const newCategory = await storage.createCategory(categoryData);
    res.status(201).json(newCategory);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: formatZodError(error) });
    }
    res.status(500).json({ error: "Failed to create category" });
  }
});

// Update a category
app.patch("/api/categories/:id", async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const categoryData = insertCategorySchema.partial().parse(req.body);
    
    const updatedCategory = await storage.updateCategory(categoryId, categoryData);
    
    if (!updatedCategory) {
      return res.status(404).json({ error: `Category not found with ID: ${categoryId}` });
    }
    
    res.json(updatedCategory);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: formatZodError(error) });
    }
    res.status(500).json({ error: "Failed to update category" });
  }
});

// Delete a category
app.delete("/api/categories/:id", async (req, res) => {
  const categoryId = parseInt(req.params.id);
  const success = await storage.deleteCategory(categoryId);
  
  if (!success) {
    return res.status(404).json({ error: `Category not found with ID: ${categoryId}` });
  }
  
  res.json({ success: true });
});
```

### AI Generation Endpoint

```typescript
// Generate AI response
app.post("/api/generate", async (req, res) => {
  try {
    // In a production app, this would call an actual AI API like OpenAI
    // This is a mock implementation for development purposes
    
    const { title, content, model } = req.body;
    
    // Validate required fields
    if (!title || !content || !model) {
      return res.status(400).json({ error: "Missing required fields: title, content, model" });
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock response based on the input
    const responseContent = generateMockResponse(content);
    
    // Optional: save the prompt and response to the database
    // const promptId = await savePromptAndResponse(req.body, responseContent);
    
    res.json({
      content: responseContent,
      model,
      promptId: null // Will be a real ID if saved to database
    });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// Helper function to generate a mock response
function generateMockResponse(content: string): string {
  // This would be replaced with a real AI API call
  const topics = ["AI", "Machine Learning", "Automation", "Natural Language Processing", "Neural Networks"];
  const paragraphs = Math.floor(Math.random() * 3) + 2; // 2-4 paragraphs
  
  let response = `# Response to your prompt\n\n`;
  
  for (let i = 0; i < paragraphs; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    response += `## ${topic}\n\n`;
    response += `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${topic} is revolutionizing how we approach problems. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n`;
  }
  
  // Extract keywords from the input content to make it seem more relevant
  const words = content.split(' ');
  const keywords = words
    .filter(word => word.length > 5)
    .slice(0, 5)
    .map(word => word.replace(/[^a-zA-Z]/g, ''));
  
  if (keywords.length > 0) {
    response += `## Key Points\n\n`;
    keywords.forEach(keyword => {
      response += `- The concept of **${keyword}** is important to consider\n`;
    });
  }
  
  return response;
}

// Helper function to format Zod validation errors
function formatZodError(error: ZodError): string {
  return error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
}
```

## Error Handling Middleware

The application uses an error handling middleware to catch and format errors:

```typescript
// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);
  
  if (err instanceof ZodError) {
    return res.status(400).json({ error: formatZodError(err) });
  }
  
  res.status(500).json({
    error: err.message || "An unexpected error occurred"
  });
});
```

## Authentication (TODO)

The current implementation uses a demo user (ID: 1) for simplicity. In a production environment, you would add authentication middleware:

```typescript
// Authentication middleware (to be implemented)
function authenticate(req: Request, res: Response, next: NextFunction) {
  // Check for valid session/token
  // Set req.user if authenticated
  // Otherwise return 401 Unauthorized
  
  // For now, we'll use a demo user
  req.user = { id: 1, username: "demo" };
  next();
}

// Protected route example
app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: "This is a protected endpoint", user: req.user });
});
```

## Adding New Routes

When adding new routes to the application:

1. Define the route in `server/routes.ts`
2. Implement the required storage methods in `server/storage.ts`
3. Add validation using Zod schemas from `shared/schema.ts`
4. Add error handling for expected error cases
5. Document the route in the API documentation

## Testing Routes

To test the routes during development:

1. Use the API status endpoint to verify the server is running:
   ```
   GET /api/hello
   ```

2. Use tools like curl, Postman, or the browser's fetch API to test endpoints:
   ```javascript
   // Example fetch request
   fetch('/api/prompts', {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json'
     }
   })
   .then(response => response.json())
   .then(data => console.log(data))
   .catch(error => console.error('Error:', error));
   ```