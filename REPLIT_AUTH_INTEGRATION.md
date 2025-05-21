# Replit Auth Integration - Technical Documentation

This document provides comprehensive technical documentation on the implementation of Replit Auth in the PromptPro AI application.

## Table of Contents

1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [Server Implementation](#server-implementation)
4. [Client Implementation](#client-implementation)
5. [Database Schema](#database-schema)
6. [Session Management](#session-management)
7. [Protected Routes](#protected-routes)
8. [Best Practices](#best-practices)

## Overview

PromptPro AI uses Replit Auth, which implements OpenID Connect, to provide secure authentication for users. This integration allows users to authenticate using their Replit accounts without requiring a separate username and password.

### Key Features

- Secure OpenID Connect authentication flow
- Session persistence with PostgreSQL store
- User profile data storage and retrieval
- Protected route middleware

## Authentication Flow

The authentication flow follows the OpenID Connect standard:

1. **Initiation**: User clicks "Login with Replit" button
2. **Redirection**: User is redirected to Replit's authentication page
3. **Authorization**: User authorizes the application
4. **Callback**: Replit redirects back to the application with an authorization code
5. **Token Exchange**: The application exchanges the code for access, ID, and refresh tokens
6. **Session Creation**: A user session is created and stored
7. **Profile Data**: User profile information is extracted from the ID token
8. **Database Storage**: User data is stored/updated in the database
9. **Client Notification**: The client is informed of successful authentication

## Server Implementation

### Dependencies

```typescript
import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
```

### Configuration

The server configuration initializes the OpenID Connect client, PostgreSQL session store, and Passport.js:

```typescript
// Get OpenID configuration
const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

// Session configuration
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}
```

### Setting Up Auth Routes

The authentication routes are set up to handle login, callback, and logout:

```typescript
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  // Verify function handles token processing
  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  // Set up strategies for each domain
  for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  // Serialize/deserialize user for session storage
  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Login route
  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  // Callback route
  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  // Logout route
  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}
```

### Authentication Middleware

A middleware function checks if the user is authenticated and refreshes tokens if needed:

```typescript
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    return res.redirect("/api/login");
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    return res.redirect("/api/login");
  }
};
```

## Client Implementation

### Auth Hook

A custom hook manages authentication state on the client side:

```typescript
export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
```

### Protected Route Component

A component wraps protected routes to enforce authentication:

```typescript
export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Component />
}
```

### Auth Status Component

A component shows user profile information and login/logout options:

```tsx
function UserProfile() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return (
      <a
        href="/api/login"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Login with Replit
      </a>
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      <img
        src={user.profileImageUrl || '/default-avatar.png'}
        alt="User avatar"
        className="h-8 w-8 rounded-full"
      />
      <span className="text-sm font-medium">{user.username}</span>
      <a
        href="/api/logout"
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Logout
      </a>
    </div>
  );
}
```

## Database Schema

The database schema includes tables for user information and sessions:

```typescript
// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
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

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
```

## Session Management

The application uses Express sessions with PostgreSQL storage:

### Session Storage

Sessions are stored in a PostgreSQL database using `connect-pg-simple`:

```typescript
const pgStore = connectPg(session);
const sessionStore = new pgStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: false,
  ttl: sessionTtl,
  tableName: "sessions",
});
```

### Session Content

The session contains:

- User claims from the ID token
- Access token
- Refresh token
- Token expiration time

### Token Refresh

The application automatically refreshes expired tokens:

```typescript
const refreshToken = user.refresh_token;
if (!refreshToken) {
  return res.redirect("/api/login");
}

try {
  const config = await getOidcConfig();
  const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
  updateUserSession(user, tokenResponse);
  return next();
} catch (error) {
  return res.redirect("/api/login");
}
```

## Protected Routes

The application uses a combination of server-side and client-side protection for routes:

### Server-Side Protection

```typescript
// Protected API route
app.get("/api/protected", isAuthenticated, async (req, res) => {
  const userId = req.user?.claims?.sub;
  // Process request for authenticated user
});
```

### Client-Side Protection

```tsx
// App routing with protected routes
function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}
```

## Best Practices

### Security Considerations

1. **HTTPS Only**: All authentication interactions occur over HTTPS
2. **HTTP-Only Cookies**: Session cookies are HTTP-only to prevent JavaScript access
3. **CSRF Protection**: Express sessions include CSRF protection mechanisms
4. **Secure Token Storage**: Tokens are stored only in server-side sessions
5. **Appropriate Scopes**: Only necessary OpenID scopes are requested

### Performance Optimization

1. **Memoized Configuration**: OpenID configuration is cached to reduce API calls
2. **Efficient Session Storage**: PostgreSQL provides efficient session storage
3. **Minimal Token Usage**: Tokens are used only when necessary
4. **Strategic Token Refresh**: Tokens are refreshed only when expired

### Error Handling

1. **Graceful Authentication Failures**: Redirects to login on authentication errors
2. **Token Refresh Fallbacks**: Handles token refresh failures appropriately
3. **Missing Session Handling**: Properly handles missing or invalid sessions

---

*Last updated: May 8, 2025*