# PromptPro Testing Guide

This document provides instructions for running tests for the PromptPro application.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Running Tests

### Windows

Run the PowerShell script:

```powershell
.\run-tests.ps1
```

### macOS/Linux

Make the shell script executable and run it:

```bash
chmod +x run-tests.sh
./run-tests.sh
```

## Running Specific Tests

You can run specific test suites using npm:

```bash
# Run frontend component tests
npm test -- --testPathPattern=client/src/components/__tests__

# Run frontend hook tests
npm test -- --testPathPattern=client/src/hooks/__tests__

# Run frontend page tests
npm test -- --testPathPattern=client/src/pages/__tests__

# Run backend API tests
npm test -- --testPathPattern=server/__tests__/marketing-templates-api.test.ts

# Run backend service tests
npm test -- --testPathPattern=server/__tests__/marketing-template-service.test.ts

# Run integration tests
npm test -- --testPathPattern=client/src/__tests__/integration
```

## Running Tests with Coverage

To run all tests and generate a coverage report:

```bash
npm run test:coverage
```

The coverage report will be generated in the `coverage` directory.

## Test Structure

The tests are organized as follows:

### Frontend Tests

- **Component Tests**: `client/src/components/__tests__/`
  - Tests for React components

- **Hook Tests**: `client/src/hooks/__tests__/`
  - Tests for custom React hooks

- **Page Tests**: `client/src/pages/__tests__/`
  - Tests for page components

### Backend Tests

- **API Tests**: `server/__tests__/marketing-templates-api.test.ts`
  - Tests for API endpoints

- **Service Tests**: `server/__tests__/marketing-template-service.test.ts`
  - Tests for service functions

### Integration Tests

- **Integration Tests**: `client/src/__tests__/integration/`
  - Tests for frontend-backend integration

## Test Conventions

- Each test file should be named `*.test.ts` or `*.test.tsx`
- Use descriptive test names that explain what is being tested
- Group related tests using `describe` blocks
- Use `beforeEach` and `afterEach` for setup and teardown
- Mock external dependencies to isolate the code being tested

## Continuous Integration

Tests are automatically run on pull requests and pushes to the main branch using GitHub Actions.

## Troubleshooting

If you encounter issues running the tests:

1. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

2. Clear the Jest cache:
   ```bash
   npx jest --clearCache
   ```

3. Check for TypeScript errors:
   ```bash
   npm run check
   ```
