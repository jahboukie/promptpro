#!/usr/bin/env node

/**
 * AI Prompting Tool Setup Script
 *
 * This script helps set up the AI Prompting Tool project by:
 * 1. Checking prerequisites
 * 2. Installing dependencies
 * 3. Setting up the database
 * 4. Starting the development server
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

// Welcome message
console.log(`
${colors.bright}${colors.blue}==================================================${colors.reset}
${colors.bright}${colors.blue}        AI Prompting Tool - Setup Script          ${colors.reset}
${colors.bright}${colors.blue}==================================================${colors.reset}

This script will help you set up the AI Prompting Tool project.
It will:
  1. Check prerequisites
  2. Install dependencies
  3. Set up the database
  4. Start the development server

`);

// Function to execute shell commands and return output
function execCommand(command, options = {}) {
  try {
    return execSync(command, { stdio: options.silent ? 'ignore' : 'inherit' });
  } catch (error) {
    if (options.ignoreError) {
      return null;
    }
    console.error(`${colors.red}Error executing command: ${command}${colors.reset}`);
    throw error;
  }
}

// Function to check if a command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to check Node.js version
function checkNodeVersion() {
  console.log(`${colors.bright}Checking Node.js version...${colors.reset}`);
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);

    if (majorVersion < 20) {
      console.log(`${colors.yellow}Warning: You are using Node.js ${nodeVersion}. We recommend Node.js 20 or later.${colors.reset}`);
      return false;
    } else {
      console.log(`${colors.green}Node.js ${nodeVersion} detected. ✓${colors.reset}`);
      return true;
    }
  } catch (error) {
    console.error(`${colors.red}Error: Node.js not found. Please install Node.js 20 or later.${colors.reset}`);
    return false;
  }
}

// Function to check npm version
function checkNpmVersion() {
  console.log(`${colors.bright}Checking npm version...${colors.reset}`);
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(npmVersion.split('.')[0], 10);

    if (majorVersion < 9) {
      console.log(`${colors.yellow}Warning: You are using npm ${npmVersion}. We recommend npm 9 or later.${colors.reset}`);
      return false;
    } else {
      console.log(`${colors.green}npm ${npmVersion} detected. ✓${colors.reset}`);
      return true;
    }
  } catch (error) {
    console.error(`${colors.red}Error: npm not found. Please install npm 9 or later.${colors.reset}`);
    return false;
  }
}

// Function to check if PostgreSQL is available
function checkPostgres() {
  console.log(`${colors.bright}Checking PostgreSQL...${colors.reset}`);

  if (process.env.DATABASE_URL) {
    console.log(`${colors.green}DATABASE_URL environment variable found. ✓${colors.reset}`);
    return true;
  }

  if (commandExists('psql')) {
    console.log(`${colors.green}PostgreSQL client (psql) detected. ✓${colors.reset}`);
    return true;
  } else {
    console.log(`${colors.yellow}Warning: PostgreSQL client (psql) not found.${colors.reset}`);
    console.log(`${colors.yellow}You will need to set up a PostgreSQL database manually.${colors.reset}`);
    return false;
  }
}

// Function to install dependencies
function installDependencies() {
  console.log(`\n${colors.bright}Installing dependencies...${colors.reset}`);
  execCommand('npm install');
  console.log(`${colors.green}Dependencies installed successfully. ✓${colors.reset}`);
}

// Function to check if .env file exists, create if not
function setupEnvFile() {
  console.log(`\n${colors.bright}Setting up environment variables...${colors.reset}`);

  const envPath = path.join(process.cwd(), '.env');

  if (fs.existsSync(envPath)) {
    console.log(`${colors.green}Found existing .env file. ✓${colors.reset}`);
    return;
  }

  // Create a basic .env file
  const defaultEnv = `# Database URL for PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_prompting_tool

# Server settings
PORT=5000
NODE_ENV=development
`;

  fs.writeFileSync(envPath, defaultEnv);
  console.log(`${colors.green}Created .env file with default settings. ✓${colors.reset}`);
  console.log(`${colors.yellow}Note: You may need to edit the .env file to match your database settings.${colors.reset}`);
}

// Function to set up the database
function setupDatabase() {
  console.log(`\n${colors.bright}Setting up database...${colors.reset}`);

  if (!process.env.DATABASE_URL) {
    console.log(`${colors.yellow}Warning: DATABASE_URL not set in environment.${colors.reset}`);
    console.log(`${colors.yellow}Attempting to use default settings from .env file.${colors.reset}`);

    // Load variables from .env file
    dotenv.config();
  }

  if (!process.env.DATABASE_URL) {
    console.log(`${colors.red}Error: DATABASE_URL still not available.${colors.reset}`);
    console.log(`${colors.yellow}Please set up your database connection and try again.${colors.reset}`);
    return false;
  }

  try {
    console.log(`${colors.bright}Pushing database schema...${colors.reset}`);
    execCommand('npm run db:push', { ignoreError: true });
    console.log(`${colors.green}Database schema pushed successfully. ✓${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error setting up database: ${error.message}${colors.reset}`);
    return false;
  }
}

// Function to start the development server
function startDevServer() {
  console.log(`\n${colors.bright}Starting development server...${colors.reset}`);
  console.log(`${colors.green}The application will be available at http://localhost:5000${colors.reset}`);
  console.log(`${colors.yellow}Press Ctrl+C to stop the server.${colors.reset}`);
  execCommand('npm run dev');
}

// Main function
async function main() {
  // Check prerequisites
  console.log(`${colors.bright}Step 1: Checking prerequisites${colors.reset}`);
  const nodeOk = checkNodeVersion();
  const npmOk = checkNpmVersion();
  const postgresOk = checkPostgres();

  if (!nodeOk || !npmOk) {
    console.log(`\n${colors.red}Please install the required prerequisites and try again.${colors.reset}`);
    process.exit(1);
  }

  if (!postgresOk) {
    console.log(`\n${colors.yellow}You will need to set up PostgreSQL manually.${colors.reset}`);
  }

  // Confirm continuation
  rl.question(`\n${colors.bright}Continue with setup? (y/n) ${colors.reset}`, answer => {
    if (answer.toLowerCase() !== 'y') {
      console.log(`\n${colors.yellow}Setup cancelled.${colors.reset}`);
      rl.close();
      return;
    }

    // Install dependencies
    console.log(`\n${colors.bright}Step 2: Installing dependencies${colors.reset}`);
    installDependencies();

    // Set up environment
    console.log(`\n${colors.bright}Step 3: Setting up environment${colors.reset}`);
    setupEnvFile();

    // Set up database
    console.log(`\n${colors.bright}Step 4: Setting up database${colors.reset}`);
    const dbOk = setupDatabase();

    if (!dbOk) {
      console.log(`\n${colors.yellow}Database setup incomplete. You will need to set up the database manually.${colors.reset}`);
    }

    // Ask if user wants to start the dev server
    rl.question(`\n${colors.bright}Start the development server? (y/n) ${colors.reset}`, answer => {
      if (answer.toLowerCase() === 'y') {
        // Start development server
        console.log(`\n${colors.bright}Step 5: Starting development server${colors.reset}`);
        startDevServer();
      } else {
        console.log(`\n${colors.green}Setup completed! You can start the server with: npm run dev${colors.reset}`);
        rl.close();
      }
    });
  });
}

// Run the script
main().catch(error => {
  console.error(`${colors.red}An error occurred: ${error.message}${colors.reset}`);
  process.exit(1);
});