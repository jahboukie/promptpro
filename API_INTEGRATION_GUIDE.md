# AI Model API Integration Guide

This document provides detailed information about the various AI model integrations in the PromptPro AI application. It covers implementation details for xAI (Grok), OpenAI, Anthropic Claude, and Google Gemini models.

## Table of Contents

1. [Overview](#overview)
2. [xAI (Grok) Integration](#xai-grok-integration)
3. [OpenAI Integration](#openai-integration)
4. [Anthropic Claude Integration](#anthropic-claude-integration)
5. [Google Gemini Integration](#google-gemini-integration)
6. [API Key Management](#api-key-management)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

## Overview

PromptPro AI integrates with multiple AI provider APIs to generate responses based on user prompts. Each provider has unique capabilities, models, and API structures.

### Integrated Providers

| Provider | Primary Models | Key Features | Integration Method |
|----------|----------------|--------------|-------------------|
| xAI      | grok-2-1212, grok-2-vision-1212 | Text & vision capabilities, long context window | OpenAI SDK with custom base URL |
| OpenAI   | gpt-4o | Multimodal capabilities, JSON output | Native OpenAI SDK |
| Anthropic | claude-3-sonnet-20240229 | Strong reasoning, long context window | Anthropic SDK |
| Google   | gemini-pro | Multimodal capabilities, knowledge cutoff | Google AI SDK |

## xAI (Grok) Integration

xAI's Grok models are accessed using the OpenAI SDK with a custom base URL.

### Available Models

- **grok-2-1212**: Text-only model with 131,072 token context window
- **grok-2-vision-1212**: Text and image model with 8,192 token context window

### Implementation Details

```typescript
// grok.ts
import OpenAI from "openai";

// Initialize client with xAI's base URL and API key
const openai = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: process.env.XAI_API_KEY 
});

// Function for generating text responses
async function generateResponse(
  prompt: string,
  model: string = "grok-2-1212",
  userId?: string
): Promise<string> {
  try {
    // Get client instance (potentially user-specific)
    const client = await getOpenAIClientForUser(userId);
    
    // Call the completions API
    const response = await client.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating response with xAI:", error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

// Function for generating structured outputs
async function generateStructuredResponse(
  prompt: string,
  model: string = "grok-2-1212",
  responseFormat: string = "json",
  userId?: string
): Promise<any> {
  try {
    const client = await getOpenAIClientForUser(userId);
    
    // Create system message based on desired output format
    const systemMessage = `You are a helpful assistant that generates responses in ${responseFormat} format.`;
    
    const response = await client.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2048,
    });

    // Parse JSON response if applicable
    if (responseFormat === "json") {
      return JSON.parse(response.choices[0].message.content || "{}");
    }
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating structured response with xAI:", error);
    throw new Error(`Failed to generate structured response: ${error.message}`);
  }
}

// Function for processing images (with vision model)
async function analyzeImage(
  base64Image: string,
  prompt: string = "Analyze this image in detail",
  userId?: string
): Promise<string> {
  try {
    const client = await getOpenAIClientForUser(userId);
    
    const response = await client.chat.completions.create({
      model: "grok-2-vision-1212",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 1024,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error analyzing image with xAI:", error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}
```

## OpenAI Integration

OpenAI integration uses the native OpenAI SDK.

### Available Models

- **gpt-4o**: Latest multimodal model with 8,192 token context window

### Implementation Details

```typescript
// openai.ts
import OpenAI from "openai";

// Initialize with OpenAI API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function for text generation
async function generateWithOpenAI(
  prompt: string,
  model: string = "gpt-4o",
  userId?: string
): Promise<string> {
  try {
    // Get OpenAI client (potentially user-specific)
    const client = await getOpenAIClientForUser(userId);
    
    const response = await client.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating with OpenAI:", error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

// Function for JSON output
async function generateJSONWithOpenAI(
  prompt: string,
  model: string = "gpt-4o",
  userId?: string
): Promise<any> {
  try {
    const client = await getOpenAIClientForUser(userId);
    
    const response = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that responds in JSON format."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error generating JSON with OpenAI:", error);
    throw new Error(`Failed to generate JSON response: ${error.message}`);
  }
}

// Function for image analysis
async function analyzeImageWithOpenAI(
  base64Image: string,
  prompt: string = "Analyze this image in detail",
  userId?: string
): Promise<string> {
  try {
    const client = await getOpenAIClientForUser(userId);
    
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error analyzing image with OpenAI:", error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}
```

## Anthropic Claude Integration

Anthropic Claude integration uses the Anthropic SDK.

### Available Models

- **claude-3-sonnet-20240229**: Text model with 200,000 token context window

### Implementation Details

```typescript
// anthropic.ts
import Anthropic from '@anthropic-ai/sdk';

// Function to get Anthropic client (potentially user-specific)
async function getAnthropicClientForUser(userId?: string): Promise<Anthropic> {
  let apiKey = process.env.ANTHROPIC_API_KEY;
  
  // If userId is provided, try to get their API key
  if (userId) {
    const userKeys = await storage.getApiKeysByUserId(userId);
    if (userKeys?.anthropicKey) {
      apiKey = decryptApiKey(userKeys.anthropicKey);
    }
  }
  
  if (!apiKey) {
    throw new Error("No Anthropic API key available");
  }
  
  return new Anthropic({ apiKey });
}

// Function for text generation
async function generateWithClaude(
  prompt: string,
  model: string = "claude-3-sonnet-20240229",
  userId?: string
): Promise<string> {
  try {
    const anthropic = await getAnthropicClientForUser(userId);
    
    const message = await anthropic.messages.create({
      model: model,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    return message.content[0].text;
  } catch (error) {
    console.error("Error generating with Claude:", error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

// Function for JSON output
async function generateJSONWithClaude(
  prompt: string,
  model: string = "claude-3-sonnet-20240229",
  userId?: string
): Promise<any> {
  try {
    const anthropic = await getAnthropicClientForUser(userId);
    
    const message = await anthropic.messages.create({
      model: model,
      max_tokens: 2048,
      system: "Please provide your response in valid JSON format.",
      messages: [{ role: 'user', content: prompt }],
    });

    // Parse JSON from text response
    const jsonText = message.content[0].text;
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating JSON with Claude:", error);
    throw new Error(`Failed to generate JSON response: ${error.message}`);
  }
}
```

## Google Gemini Integration

Google Gemini integration uses the Google AI SDK.

### Implementation Details

```typescript
// gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Function to get Google AI client (potentially user-specific)
async function getGeminiClientForUser(userId?: string): Promise<GoogleGenerativeAI> {
  let apiKey = process.env.GEMINI_API_KEY;
  
  // If userId is provided, try to get their API key
  if (userId) {
    const userKeys = await storage.getApiKeysByUserId(userId);
    if (userKeys?.geminiKey) {
      apiKey = decryptApiKey(userKeys.geminiKey);
    }
  }
  
  if (!apiKey) {
    throw new Error("No Gemini API key available");
  }
  
  return new GoogleGenerativeAI(apiKey);
}

// Function for text generation
async function generateWithGemini(
  prompt: string,
  model: string = "gemini-pro",
  userId?: string
): Promise<string> {
  try {
    const genAI = await getGeminiClientForUser(userId);
    const geminiModel = genAI.getGenerativeModel({ model: model });
    
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    
    return response.text();
  } catch (error) {
    console.error("Error generating with Gemini:", error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}
```

## API Key Management

The application securely manages API keys for multiple providers.

### Database Schema

```typescript
// API Keys table in schema.ts
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  xaiKey: varchar("xai_key"),
  openaiKey: varchar("openai_key"),
  anthropicKey: varchar("anthropic_key"),
  geminiKey: varchar("gemini_key"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ApiKeys = typeof apiKeys.$inferSelect;
export type InsertApiKeys = z.infer<typeof insertApiKeysSchema>;
```

### Encryption Functions

```typescript
// Encryption for API keys
function encryptApiKey(key: string): string {
  // In a production environment, use a proper encryption method
  // This is a simplified example
  const algorithm = 'aes-256-cbc';
  const cryptoKey = crypto.scryptSync(process.env.ENCRYPTION_SECRET!, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, cryptoKey, iv);
  
  let encrypted = cipher.update(key, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${iv.toString('hex')}:${encrypted}`;
}

// Decryption for API keys
function decryptApiKey(encryptedKey: string): string {
  // In a production environment, use a proper decryption method
  // This is a simplified example
  const [ivHex, encryptedText] = encryptedKey.split(':');
  const algorithm = 'aes-256-cbc';
  const cryptoKey = crypto.scryptSync(process.env.ENCRYPTION_SECRET!, 'salt', 32);
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, cryptoKey, iv);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### API Routes for Key Management

```typescript
// API Routes for managing keys
app.get("/api/integrations/keys", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const keys = await storage.getApiKeysByUserId(userId);
    
    // Return masked keys for security
    const maskedKeys = {
      userId: keys?.userId,
      xaiKey: keys?.xaiKey ? "••••••••" : null,
      openaiKey: keys?.openaiKey ? "••••••••" : null,
      anthropicKey: keys?.anthropicKey ? "••••••••" : null,
      geminiKey: keys?.geminiKey ? "••••••••" : null,
    };
    
    res.json(maskedKeys);
  } catch (error) {
    console.error("Error fetching API keys:", error);
    res.status(500).json({ message: "Failed to fetch API keys" });
  }
});

app.post("/api/integrations/keys", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { xai_api_key, openai_api_key, anthropic_api_key, gemini_api_key } = req.body;
    
    // Encrypt keys before storing
    const keysToSave = {
      userId,
      xaiKey: xai_api_key ? encryptApiKey(xai_api_key) : null,
      openaiKey: openai_api_key ? encryptApiKey(openai_api_key) : null,
      anthropicKey: anthropic_api_key ? encryptApiKey(anthropic_api_key) : null,
      geminiKey: gemini_api_key ? encryptApiKey(gemini_api_key) : null,
    };
    
    // Check if user already has keys
    const existingKeys = await storage.getApiKeysByUserId(userId);
    
    let savedKeys;
    if (existingKeys) {
      savedKeys = await storage.updateApiKeys(userId, keysToSave);
    } else {
      savedKeys = await storage.saveApiKeys(keysToSave);
    }
    
    // Return masked keys for security
    const maskedKeys = {
      userId: savedKeys.userId,
      xaiKey: savedKeys.xaiKey ? "••••••••" : null,
      openaiKey: savedKeys.openaiKey ? "••••••••" : null,
      anthropicKey: savedKeys.anthropicKey ? "••••••••" : null,
      geminiKey: savedKeys.geminiKey ? "••••••••" : null,
    };
    
    res.json(maskedKeys);
  } catch (error) {
    console.error("Error saving API keys:", error);
    res.status(500).json({ message: "Failed to save API keys" });
  }
});
```

## Error Handling

The application implements robust error handling for API interactions.

### Common Error Types

1. **Authentication Errors**: Missing or invalid API keys
2. **Rate Limit Errors**: Exceeded API rate limits
3. **Model Errors**: Requested model not available
4. **Content Filtering Errors**: Content flagged by provider filters
5. **Connectivity Errors**: Network or timeout issues

### Error Handling Implementation

```typescript
// Universal error handler for AI API calls
async function safeAPICall<T>(
  apiCall: () => Promise<T>,
  errorContext: string
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    // Check for common error types
    if (error.status === 401 || error.status === 403) {
      throw new Error(`Authentication error: Invalid or missing API key for ${errorContext}`);
    }
    
    if (error.status === 429) {
      throw new Error(`Rate limit exceeded for ${errorContext}. Please try again later.`);
    }
    
    if (error.message?.includes("content filter")) {
      throw new Error(`Content was flagged by ${errorContext} content filter. Please modify your prompt.`);
    }
    
    // Generic error with original message
    throw new Error(`Error from ${errorContext}: ${error.message}`);
  }
}

// Usage example
async function generateResponse(prompt: string, model: string, userId?: string): Promise<string> {
  return safeAPICall(
    async () => {
      const client = await getOpenAIClientForUser(userId);
      const response = await client.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: prompt }],
      });
      return response.choices[0].message.content || "";
    },
    model.includes("grok") ? "xAI" : "OpenAI"
  );
}
```

## Best Practices

### Performance Optimization

1. **Client Caching**: Cache client instances for reuse
2. **Response Caching**: Cache identical prompts for a short period
3. **Efficient Token Usage**: Minimize token count in prompts
4. **Streaming Responses**: Use streaming for long responses

### Security Considerations

1. **API Key Encryption**: Encrypt all API keys at rest
2. **No Client Exposure**: Never expose API keys to the client
3. **Prompt Sanitization**: Sanitize user inputs before sending to APIs
4. **Content Filtering**: Implement additional content filtering if needed

### Cost Management

1. **Token Tracking**: Track token usage for billing purposes
2. **User Quotas**: Implement user-specific usage quotas
3. **Model Selection**: Use smaller models for simpler tasks
4. **Usage Analytics**: Monitor API usage patterns

---

*Last updated: May 8, 2025*