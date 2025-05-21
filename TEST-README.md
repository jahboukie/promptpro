# PromptPro Advanced Features Testing

This directory contains automated tests for the advanced features of PromptPro:

1. LLM-Specific Optimization
2. Prompt Pattern Library
3. Intelligent Strategy Selection
4. Prompt Analysis

## Prerequisites

- Node.js installed (v14 or higher recommended)
- PromptPro backend server running on http://localhost:5000
- Valid API keys configured in your .env.local file (at least one AI service)

## Setup

1. Install the required dependencies:

```bash
npm install --save node-fetch@2
```

Note: We're using node-fetch v2 because v3 requires ESM modules.

## Running the Tests

1. Make sure your PromptPro backend server is running:

```bash
npm run dev
```

2. In a separate terminal, run the tests:

```bash
node test-promptpro.js
```

## Test Results

The test results will be saved in the `test-results` directory:

- `llm-optimization.json`: Results of LLM-specific optimization tests
- `prompt-pattern-library.json`: Results of prompt pattern library tests
- `strategy-selection.json`: Results of intelligent strategy selection tests
- `prompt-analysis.json`: Results of prompt analysis tests
- `end-to-end.json`: Results of end-to-end flow tests
- `test-summary.json`: Overall summary of all tests

## Understanding the Results

Each test result includes:

- `test`: The name of the specific test
- `success`: Whether the test passed (true) or failed (false)
- Additional data specific to each test

The summary includes:

- `totalTests`: Total number of tests run
- `totalSuccesses`: Number of successful tests
- `successRate`: Percentage of tests that passed
- `duration`: How long the tests took to run
- `featureResults`: Breakdown of results by feature

## Troubleshooting

If tests are failing, check the following:

1. Make sure the backend server is running on http://localhost:5000
2. Verify that you have valid API keys configured in your .env.local file
3. Check the server logs for any errors
4. Make sure all required dependencies are installed

## Modifying the Tests

You can modify the test script to:

- Change the API base URL if your server is running on a different port
- Add more test cases for specific features
- Adjust the expected results based on your implementation

## Limitations

- The end-to-end tests require valid API keys for the AI services
- Some tests may take longer to run depending on the response time of the AI services
- The tests assume the API structure matches the implementation in the code
