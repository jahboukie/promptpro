# Run all tests for the PromptPro application

Write-Host "Running PromptPro Tests..." -ForegroundColor Cyan

# Run frontend component tests
Write-Host "`nRunning Frontend Component Tests..." -ForegroundColor Yellow
npm test -- --testPathPattern=client/src/components/__tests__

# Run frontend hook tests
Write-Host "`nRunning Frontend Hook Tests..." -ForegroundColor Yellow
npm test -- --testPathPattern=client/src/hooks/__tests__

# Run frontend page tests
Write-Host "`nRunning Frontend Page Tests..." -ForegroundColor Yellow
npm test -- --testPathPattern=client/src/pages/__tests__

# Run backend API tests
Write-Host "`nRunning Backend API Tests..." -ForegroundColor Yellow
npm test -- --testPathPattern=server/__tests__/marketing-templates-api.test.ts

# Run backend service tests
Write-Host "`nRunning Backend Service Tests..." -ForegroundColor Yellow
npm test -- --testPathPattern=server/__tests__/marketing-template-service.test.ts

# Run integration tests
Write-Host "`nRunning Integration Tests..." -ForegroundColor Yellow
npm test -- --testPathPattern=client/src/__tests__/integration

# Run all tests with coverage
Write-Host "`nRunning All Tests with Coverage..." -ForegroundColor Green
npm run test:coverage

Write-Host "`nAll tests completed!" -ForegroundColor Cyan
