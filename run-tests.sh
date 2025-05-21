#!/bin/bash
# Run all tests for the PromptPro application

echo -e "\033[0;36mRunning PromptPro Tests...\033[0m"

# Run Jest tests with ES modules support
NODE_OPTIONS=--experimental-vm-modules

# Run frontend component tests
echo -e "\n\033[0;33mRunning Frontend Component Tests...\033[0m"
npx jest --testPathPattern=client/src/components/__tests__

# Run frontend hook tests
echo -e "\n\033[0;33mRunning Frontend Hook Tests...\033[0m"
npx jest --testPathPattern=client/src/hooks/__tests__

# Run frontend page tests
echo -e "\n\033[0;33mRunning Frontend Page Tests...\033[0m"
npx jest --testPathPattern=client/src/pages/__tests__

# Run backend API tests
echo -e "\n\033[0;33mRunning Backend API Tests...\033[0m"
npx jest --testPathPattern=server/__tests__/marketing-templates-api.test.ts

# Run backend service tests
echo -e "\n\033[0;33mRunning Backend Service Tests...\033[0m"
npx jest --testPathPattern=server/__tests__/marketing-template-service.test.ts

# Run integration tests
echo -e "\n\033[0;33mRunning Integration Tests...\033[0m"
npx jest --testPathPattern=client/src/__tests__/integration

# Run all tests with coverage
echo -e "\n\033[0;32mRunning All Tests with Coverage...\033[0m"
npx jest --coverage

echo -e "\n\033[0;36mAll tests completed!\033[0m"