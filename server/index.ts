import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { validateConfig, PORT, NODE_ENV } from './config';
import { generateAIResponse } from './ai-services';
import { PromptData } from '../shared/types';
import advancedFeaturesRouter from './advanced-features-api';

// Validate environment configuration
validateConfig();

// Create Express app
const app = express();
const port = PORT;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

// API routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from PromptPro API!' });
});

// Mount advanced features router
app.use('/api/advanced', advancedFeaturesRouter);

// Sample API route to get all prompts
app.get('/api/prompts', async (req, res) => {
  try {
    const prompts = await db.query.prompts.findMany();
    res.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// API route for generating responses
app.post('/api/generate', async (req, res) => {
  try {
    const promptData: PromptData = req.body;

    // Validate required fields
    if (!promptData.content || !promptData.model) {
      return res.status(400).json({ error: 'Content and model are required' });
    }

    // Generate response using AI service
    const responseContent = await generateAIResponse(promptData);

    // Return the response
    res.json({
      content: responseContent,
      model: promptData.model,
      promptId: null // In a real app, this would be the ID of the saved prompt
    });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: error.message || 'Failed to generate response' });
  }
});

// API route for checking API key status
app.get('/api/config/ai-services', (req, res) => {
  const services = {
    openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
    xai: process.env.XAI_API_KEY ? 'configured' : 'not configured',
    anthropic: process.env.ANTHROPIC_API_KEY ? 'configured' : 'not configured',
    gemini: process.env.GEMINI_API_KEY ? 'configured' : 'not configured'
  };

  res.json(services);
});

// Serve static files in production
if (NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, '../dist/public')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/public/index.html'));
  });
}

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log('API available at: http://localhost:' + port + '/api/hello');
});
