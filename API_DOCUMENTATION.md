# API Documentation

This document provides details about the REST API endpoints implemented in the AI Prompting Tool.

## Base URL

All API endpoints are relative to:

```
http://localhost:5000/api
```

## Authentication

> **Note**: Authentication is not fully implemented in the current version.
> The application assumes a demo user with ID 1 for development purposes.

## Endpoints

### Test Connection

```
GET /hello
```

Returns a simple message to verify the API is working.

**Response**:
```json
{
  "message": "Hello from the backend!"
}
```

### Prompt Operations

#### Get All Prompts for a User

```
GET /prompts
```

**Response**:
```json
[
  {
    "id": 1,
    "title": "Article outline generator",
    "content": "Generate a detailed outline for an article about...",
    "userId": 1,
    "model": "GPT-4",
    "goal": "generate-content",
    "outputFormat": "bullet-points",
    "style": "formal",
    "tone": "informative",
    "actionVerb": null,
    "specificDetails": null,
    "useRolePlaying": false,
    "role": null,
    "isFavorite": true,
    "categoryId": 1,
    "createdAt": "2023-05-06T01:56:20.369Z"
  },
  // ...more prompts
]
```

#### Get a Specific Prompt

```
GET /prompts/:id
```

**Parameters**:
- `id` (path parameter): The ID of the prompt to retrieve

**Response**:
```json
{
  "id": 1,
  "title": "Article outline generator",
  "content": "Generate a detailed outline for an article about...",
  "userId": 1,
  "model": "GPT-4",
  "goal": "generate-content",
  "outputFormat": "bullet-points",
  "style": "formal",
  "tone": "informative",
  "actionVerb": null,
  "specificDetails": null,
  "useRolePlaying": false,
  "role": null,
  "isFavorite": true,
  "categoryId": 1,
  "createdAt": "2023-05-06T01:56:20.369Z"
}
```

#### Create a New Prompt

```
POST /prompts
```

**Request Body**:
```json
{
  "title": "New Prompt",
  "content": "This is a new prompt",
  "userId": 1,
  "model": "GPT-3.5 Turbo",
  "goal": "explain",
  "outputFormat": "paragraph",
  "style": "casual",
  "tone": "friendly",
  "actionVerb": "Explain",
  "specificDetails": "With examples",
  "useRolePlaying": true,
  "role": "Tech Expert",
  "isFavorite": false,
  "categoryId": 2
}
```

**Response**:
```json
{
  "id": 3,
  "title": "New Prompt",
  "content": "This is a new prompt",
  "userId": 1,
  "model": "GPT-3.5 Turbo",
  "goal": "explain",
  "outputFormat": "paragraph",
  "style": "casual",
  "tone": "friendly",
  "actionVerb": "Explain",
  "specificDetails": "With examples",
  "useRolePlaying": true,
  "role": "Tech Expert",
  "isFavorite": false,
  "categoryId": 2,
  "createdAt": "2023-05-06T02:30:15.123Z"
}
```

#### Update a Prompt

```
PATCH /prompts/:id
```

**Parameters**:
- `id` (path parameter): The ID of the prompt to update

**Request Body**:
```json
{
  "title": "Updated Prompt Title",
  "content": "Updated content",
  "isFavorite": true
}
```

**Response**:
```json
{
  "id": 1,
  "title": "Updated Prompt Title",
  "content": "Updated content",
  "userId": 1,
  "model": "GPT-4",
  "goal": "generate-content",
  "outputFormat": "bullet-points",
  "style": "formal",
  "tone": "informative",
  "actionVerb": null,
  "specificDetails": null,
  "useRolePlaying": false,
  "role": null,
  "isFavorite": true,
  "categoryId": 1,
  "createdAt": "2023-05-06T01:56:20.369Z"
}
```

#### Delete a Prompt

```
DELETE /prompts/:id
```

**Parameters**:
- `id` (path parameter): The ID of the prompt to delete

**Response**:
```json
{
  "success": true
}
```

### Category Operations

#### Get All Categories for a User

```
GET /categories
```

**Response**:
```json
[
  {
    "id": 1,
    "name": "Content Generation",
    "icon": "fas fa-star",
    "userId": 1
  },
  // ...more categories
]
```

#### Create a New Category

```
POST /categories
```

**Request Body**:
```json
{
  "name": "New Category",
  "icon": "fas fa-folder",
  "userId": 1
}
```

**Response**:
```json
{
  "id": 5,
  "name": "New Category",
  "icon": "fas fa-folder",
  "userId": 1
}
```

### Generate AI Response

```
POST /generate
```

**Request Body**:
```json
{
  "title": "Generate blog post",
  "content": "I need a blog post about AI tools",
  "model": "GPT-4",
  "goal": "generate-content",
  "outputFormat": "paragraph",
  "style": "casual",
  "tone": "informative",
  "actionVerb": "Write",
  "specificDetails": "Include statistics and examples",
  "useRolePlaying": true,
  "role": "Tech Blogger"
}
```

**Response**:
```json
{
  "content": "# The Rise of AI Tools in Modern Productivity\n\nIn recent years, the...",
  "model": "GPT-4",
  "promptId": null
}
```

## Error Handling

All API endpoints return appropriate HTTP status codes:

- `200 OK`: The request was successful
- `201 Created`: A new resource was created
- `400 Bad Request`: The request was invalid
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An error occurred on the server

Error responses include a message explaining the error:

```json
{
  "error": "Prompt not found with ID: 123"
}
```

## Data Models

### User

```typescript
{
  id: number;
  username: string;
  password: string;
}
```

### Prompt

```typescript
{
  id: number;
  title: string;
  content: string;
  userId: number;
  model: string;
  goal: string | null;
  outputFormat: string | null;
  style: string | null;
  tone: string | null;
  actionVerb: string | null;
  specificDetails: string | null;
  useRolePlaying: boolean;
  role: string | null;
  isFavorite: boolean;
  categoryId: number | null;
  createdAt: Date;
}
```

### Response

```typescript
{
  id: number;
  content: string;
  model: string;
  promptId: number;
  createdAt: Date;
}
```

### Category

```typescript
{
  id: number;
  name: string;
  icon: string;
  userId: number;
}
```