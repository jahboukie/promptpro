# Setup Guide for AI Prompting Tool

This guide will help you set up and run the AI Prompting Tool on your local machine or deployment environment.

## Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [npm](https://www.npmjs.com/) (v9 or later)
- PostgreSQL database (local or remote)

## 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-prompting-tool
```

## 2. Install Dependencies

Install all required packages for both frontend and backend:

```bash
npm install
```

This installs all the necessary packages specified in `package.json`.

## 3. Database Configuration

### Option 1: Local PostgreSQL

1. Install PostgreSQL on your machine if you haven't already
2. Create a new database:
   ```sql
   CREATE DATABASE ai_prompting_tool;
   ```
3. Create a `.env` file in the project root with the following contents:
   ```
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/ai_prompting_tool
   ```

### Option 2: Remote PostgreSQL (Neon, Supabase, etc.)

1. Create a database on your preferred PostgreSQL hosting provider
2. Get the connection string from your provider
3. Create a `.env` file in the project root with the connection string:
   ```
   DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
   ```

## 4. Initialize the Database Schema

The application uses Drizzle ORM to manage the database schema. Run the following command to push the schema to your database:

```bash
npm run db:push
```

This will create all the necessary tables and relationships defined in `shared/schema.ts`.

## 5. Start the Development Server

To start the development server:

```bash
npm run dev
```

This will start both the backend Express server and the frontend Vite development server.

The application should now be accessible at `http://localhost:5000`.

## 6. Project Structure Overview

### Backend

- `server/index.ts` - Entry point for the Express server
- `server/routes.ts` - API route definitions
- `server/storage.ts` - Database operations implementation
- `server/db.ts` - Database connection setup
- `shared/schema.ts` - Database schema definitions

### Frontend

- `client/src/main.tsx` - Entry point for the React application
- `client/src/App.tsx` - Main component with routing setup
- `client/src/pages/` - Page components
- `client/src/components/` - Reusable UI components
- `client/src/hooks/` - Custom React hooks
- `client/src/lib/` - Utility functions and shared logic

## 7. Development Workflow

1. **Database Schema Changes**:
   - Update `shared/schema.ts` with your changes
   - Run `npm run db:push` to apply the changes

2. **Backend Development**:
   - Add new routes in `server/routes.ts`
   - Add new storage methods in `server/storage.ts`

3. **Frontend Development**:
   - Add new pages in `client/src/pages/`
   - Add new components in `client/src/components/`
   - Add new routes in `client/src/App.tsx`

## 8. Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Port for the Express server | 5000 |
| `NODE_ENV` | Environment (development/production) | development |

## 9. Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the frontend and backend for production
- `npm start` - Start the production server
- `npm run db:push` - Push schema changes to the database
- `npm run db:studio` - Open Drizzle Studio to manage database

## 10. Troubleshooting

### Database Connection Issues

- Verify that your PostgreSQL server is running
- Check that the `DATABASE_URL` in your `.env` file is correct
- Make sure the database user has the necessary permissions

### Development Server Issues

- Check if port 5000 is already in use by another application
- Verify that all dependencies are installed correctly
- Check the console for error messages

## 11. Next Steps

1. **Authentication**: Implement a proper authentication system
2. **AI Provider Integration**: Set up connections to OpenAI or other AI providers
3. **User Management**: Add user registration and profile management
4. **Prompt Templates**: Implement a system for template management