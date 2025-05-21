import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Check if .env.local exists and load it (overrides .env)
const localEnvPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(localEnvPath)) {
  const localEnvConfig = dotenv.parse(fs.readFileSync(localEnvPath));
  for (const k in localEnvConfig) {
    process.env[k] = localEnvConfig[k];
  }
}

// Database configuration
export const DATABASE_URL = process.env.DATABASE_URL;

// Server configuration
export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';

// API Keys
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const XAI_API_KEY = process.env.XAI_API_KEY;
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Encryption
export const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'default-secret-key-change-in-production';

// Check required environment variables
export function validateConfig() {
  const requiredVars = ['DATABASE_URL'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // Check if at least one AI API key is available
  const aiApiKeys = [OPENAI_API_KEY, XAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY];
  if (!aiApiKeys.some(key => key)) {
    console.warn('Warning: No AI API keys found. AI generation features will not work.');
  }
}
