/**
 * PromptPro Advanced Features Testing Script
 *
 * This script tests all the advanced features of PromptPro:
 * 1. LLM-Specific Optimization
 * 2. Prompt Pattern Library
 * 3. Intelligent Strategy Selection
 * 4. Prompt Analysis
 *
 * It verifies that each feature returns the expected data structure
 * and that the content is appropriate for the given inputs.
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const ADVANCED_API_URL = `${API_BASE_URL}/advanced`;
const GENERATE_API_URL = `${API_BASE_URL}/generate`;
const LOG_DIR = './test-results';
const MODELS = ['GPT-4', 'GPT-3.5 Turbo', 'Claude 3 Opus', 'Claude 3 Sonnet', 'Grok-1'];
const CONTENT_GOALS = ['brand-awareness', 'lead-generation', 'conversion', 'customer-retention', 'seo', 'thought-leadership'];
const CONTENT_TYPES = ['blog-post', 'social-media-post', 'email', 'product-description', 'landing-page', 'whitepaper'];
const USER_INPUTS = [
  'Create a blog post about sustainable fashion to increase brand awareness',
  'Design an email sequence for a SaaS product launch to generate leads',
  'Write product descriptions for a new line of eco-friendly kitchen products',
  'Develop a social media campaign for a fitness app to increase user engagement',
  'Create SEO-optimized content about home office setup for remote workers',
  'Write a whitepaper on artificial intelligence trends in healthcare'
];

// Create log directory if it doesn't exist
try {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
} catch (error) {
  console.error('Error creating log directory:', error);
  // Create log directory in the current directory as fallback
  const fallbackDir = './test-results';
  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true });
  }
}

// Helper function to log results
function logResult(testName, result) {
  const logFile = path.join(LOG_DIR, `${testName}.json`);
  fs.writeFileSync(logFile, JSON.stringify(result, null, 2));
  console.log(`Results logged to ${logFile}`);
}

// Helper function to log test summary
function logSummary(testResults) {
  const summaryFile = path.join(LOG_DIR, 'test-summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(testResults, null, 2));
  console.log(`Test summary logged to ${summaryFile}`);
}

/**
 * Test 1: LLM-Specific Optimization
 * Tests the optimization of prompts for different LLM models
 */
async function testLLMOptimization() {
  console.log('\n=== Testing LLM-Specific Optimization ===');
  const results = [];

  // Test getting model profiles
  try {
    console.log('Fetching model profiles...');
    const response = await fetch(`${ADVANCED_API_URL}/models`);
    const modelProfiles = await response.json();

    console.log(`Retrieved ${Object.keys(modelProfiles).length} model profiles`);
    results.push({
      test: 'Get Model Profiles',
      success: Object.keys(modelProfiles).length > 0,
      modelCount: Object.keys(modelProfiles).length,
      models: Object.keys(modelProfiles)
    });
  } catch (error) {
    console.error('Error fetching model profiles:', error);
    results.push({
      test: 'Get Model Profiles',
      success: false,
      error: error.message
    });
  }

  // Test optimizing prompts for different models
  const basePrompt = {
    title: 'Test Prompt',
    content: 'Write a blog post about sustainable fashion trends in 2024.',
    model: 'GPT-4',
    goal: 'generate-content',
    outputFormat: 'paragraph',
    style: 'informative',
    tone: 'professional',
    actionVerb: 'Write',
    specificDetails: 'Include statistics and examples from leading brands.',
    useRolePlaying: true,
    role: 'Fashion Industry Expert'
  };

  for (const model of MODELS) {
    try {
      console.log(`Optimizing prompt for ${model}...`);
      const response = await fetch(`${ADVANCED_API_URL}/optimize-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptData: basePrompt,
          targetModel: model
        })
      });

      const optimizedPrompt = await response.json();

      // Verify the optimization added model-specific content
      const isOptimized =
        optimizedPrompt.specificDetails.includes(model) &&
        optimizedPrompt.specificDetails.length > basePrompt.specificDetails.length;

      results.push({
        test: `Optimize for ${model}`,
        success: isOptimized,
        originalLength: basePrompt.specificDetails.length,
        optimizedLength: optimizedPrompt.specificDetails.length,
        containsModelName: optimizedPrompt.specificDetails.includes(model)
      });

      console.log(`Optimization for ${model} ${isOptimized ? 'successful' : 'failed'}`);
    } catch (error) {
      console.error(`Error optimizing for ${model}:`, error);
      results.push({
        test: `Optimize for ${model}`,
        success: false,
        error: error.message
      });
    }
  }

  logResult('llm-optimization', results);
  return results;
}

/**
 * Test 2: Prompt Pattern Library
 * Tests retrieving and applying prompt patterns
 */
async function testPromptPatternLibrary() {
  console.log('\n=== Testing Prompt Pattern Library ===');
  const results = [];

  // Test getting all patterns
  try {
    console.log('Fetching all prompt patterns...');
    const response = await fetch(`${ADVANCED_API_URL}/patterns`);
    const patterns = await response.json();

    console.log(`Retrieved ${patterns.length} prompt patterns`);
    results.push({
      test: 'Get All Patterns',
      success: patterns.length > 0,
      patternCount: patterns.length,
      categories: [...new Set(patterns.map(p => p.category))]
    });

    // Test applying each pattern
    for (const pattern of patterns) {
      try {
        console.log(`Applying pattern: ${pattern.name}...`);

        // Extract variables from template
        const variableMatches = pattern.template.match(/{{([^}]+)}}/g) || [];
        const variables = {};

        // Create sample values for each variable
        variableMatches.forEach(match => {
          const varName = match.slice(2, -2);
          variables[varName] = `Sample ${varName.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
        });

        const response = await fetch(`${ADVANCED_API_URL}/apply-pattern`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patternId: pattern.id,
            variables
          })
        });

        const appliedPattern = await response.json();

        // Verify the pattern was applied correctly
        const isApplied =
          appliedPattern.title === pattern.name &&
          appliedPattern.content.includes('Sample') &&
          !appliedPattern.content.includes('{{');

        results.push({
          test: `Apply Pattern: ${pattern.name}`,
          success: isApplied,
          patternId: pattern.id,
          variableCount: Object.keys(variables).length,
          contentLength: appliedPattern.content.length
        });

        console.log(`Pattern ${pattern.name} applied ${isApplied ? 'successfully' : 'unsuccessfully'}`);
      } catch (error) {
        console.error(`Error applying pattern ${pattern.name}:`, error);
        results.push({
          test: `Apply Pattern: ${pattern.name}`,
          success: false,
          error: error.message
        });
      }
    }
  } catch (error) {
    console.error('Error fetching patterns:', error);
    results.push({
      test: 'Get All Patterns',
      success: false,
      error: error.message
    });
  }

  logResult('prompt-pattern-library', results);
  return results;
}

/**
 * Test 3: Intelligent Strategy Selection
 * Tests strategy recommendations based on content goals and types
 */
async function testStrategySelection() {
  console.log('\n=== Testing Intelligent Strategy Selection ===');
  const results = [];

  // Test getting content goals and types
  try {
    console.log('Fetching content goals...');
    const goalsResponse = await fetch(`${ADVANCED_API_URL}/content-goals`);
    const goals = await goalsResponse.json();

    console.log('Fetching content types...');
    const typesResponse = await fetch(`${ADVANCED_API_URL}/content-types`);
    const types = await typesResponse.json();

    console.log(`Retrieved ${goals.length} goals and ${types.length} content types`);
    results.push({
      test: 'Get Goals and Types',
      success: goals.length > 0 && types.length > 0,
      goalCount: goals.length,
      typeCount: types.length
    });

    // Test strategy recommendations for different combinations
    for (const goalId of CONTENT_GOALS) {
      for (const typeId of CONTENT_TYPES) {
        try {
          console.log(`Getting strategy for goal=${goalId}, type=${typeId}...`);
          const response = await fetch(
            `${ADVANCED_API_URL}/recommend-strategy?contentGoalId=${goalId}&contentTypeId=${typeId}`
          );

          const strategy = await response.json();

          // Verify the strategy has the expected structure
          const isValid =
            Array.isArray(strategy.recommendedPatterns) &&
            Array.isArray(strategy.recommendedModels) &&
            Array.isArray(strategy.recommendedOutputFormats) &&
            Array.isArray(strategy.recommendedTones) &&
            Array.isArray(strategy.recommendedStyles) &&
            Array.isArray(strategy.additionalTips);

          results.push({
            test: `Strategy for ${goalId}/${typeId}`,
            success: isValid,
            patternCount: strategy.recommendedPatterns.length,
            modelCount: strategy.recommendedModels.length,
            tipCount: strategy.additionalTips.length
          });

          console.log(`Strategy for ${goalId}/${typeId} ${isValid ? 'valid' : 'invalid'}`);
        } catch (error) {
          console.error(`Error getting strategy for ${goalId}/${typeId}:`, error);
          results.push({
            test: `Strategy for ${goalId}/${typeId}`,
            success: false,
            error: error.message
          });
        }
      }
    }

    // Test AI-based input analysis
    for (const input of USER_INPUTS) {
      try {
        console.log(`Analyzing input: "${input.substring(0, 30)}..."...`);
        const response = await fetch(`${ADVANCED_API_URL}/analyze-input`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input })
        });

        const analysis = await response.json();

        // Verify the analysis has the expected structure
        const isValid =
          Array.isArray(analysis.recommendedPatterns) &&
          Array.isArray(analysis.recommendedModels) &&
          Array.isArray(analysis.additionalTips);

        results.push({
          test: `Analyze Input: "${input.substring(0, 30)}..."`,
          success: isValid,
          patternCount: analysis.recommendedPatterns.length,
          modelCount: analysis.recommendedModels.length,
          tipCount: analysis.additionalTips.length
        });

        console.log(`Input analysis ${isValid ? 'valid' : 'invalid'}`);
      } catch (error) {
        console.error(`Error analyzing input "${input.substring(0, 30)}...":`, error);
        results.push({
          test: `Analyze Input: "${input.substring(0, 30)}..."`,
          success: false,
          error: error.message
        });
      }
    }
  } catch (error) {
    console.error('Error in strategy selection test:', error);
    results.push({
      test: 'Strategy Selection',
      success: false,
      error: error.message
    });
  }

  logResult('strategy-selection', results);
  return results;
}

/**
 * Test 4: Prompt Analysis
 * Tests the prompt analysis feature
 */
async function testPromptAnalysis() {
  console.log('\n=== Testing Prompt Analysis ===');
  const results = [];

  // Test prompts of varying quality
  const testPrompts = [
    // High-quality prompt
    {
      title: 'Comprehensive Blog Post on Remote Work',
      content: 'Write a detailed blog post about the future of remote work in 2024. Include statistics, trends, and expert opinions. Discuss the impact on productivity, work-life balance, and company culture. Provide actionable tips for both employees and managers to thrive in remote environments.',
      model: 'GPT-4',
      goal: 'generate-content',
      outputFormat: 'paragraph',
      style: 'professional',
      tone: 'informative',
      actionVerb: 'Write',
      specificDetails: 'Include at least 5 statistics from reputable sources. Mention companies like Microsoft, Google, and Shopify and their remote work policies.',
      useRolePlaying: true,
      role: 'Workplace Transformation Expert'
    },
    // Medium-quality prompt
    {
      title: 'Remote Work Blog',
      content: 'Write about remote work and its benefits and challenges.',
      model: 'GPT-4',
      goal: 'generate-content',
      outputFormat: 'paragraph',
      style: 'casual',
      tone: 'informative',
      actionVerb: 'Write',
      specificDetails: '',
      useRolePlaying: false,
      role: ''
    },
    // Low-quality prompt
    {
      title: '',
      content: 'remote work',
      model: 'GPT-4',
      goal: '',
      outputFormat: '',
      style: '',
      tone: '',
      actionVerb: '',
      specificDetails: '',
      useRolePlaying: false,
      role: ''
    }
  ];

  for (const [index, promptData] of testPrompts.entries()) {
    try {
      console.log(`Analyzing prompt ${index + 1}...`);
      const response = await fetch(`${ADVANCED_API_URL}/analyze-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptData })
      });

      const analysis = await response.json();

      // Verify the analysis has the expected structure
      const isValid =
        typeof analysis.score === 'number' &&
        Array.isArray(analysis.strengths) &&
        Array.isArray(analysis.weaknesses) &&
        Array.isArray(analysis.improvements) &&
        typeof analysis.clarity === 'number' &&
        typeof analysis.specificity === 'number' &&
        typeof analysis.engagement === 'number' &&
        typeof analysis.persuasiveness === 'number' &&
        typeof analysis.completeness === 'number' &&
        typeof analysis.readabilityScore === 'number';

      // Check if scores align with expected quality
      const expectedScoreRange = index === 0 ? [70, 100] : index === 1 ? [40, 70] : [0, 40];
      const scoreInRange = analysis.score >= expectedScoreRange[0] && analysis.score <= expectedScoreRange[1];

      results.push({
        test: `Analyze Prompt ${index + 1}`,
        success: isValid && scoreInRange,
        score: analysis.score,
        expectedRange: expectedScoreRange,
        scoreInRange,
        strengthCount: analysis.strengths.length,
        weaknessCount: analysis.weaknesses.length,
        improvementCount: analysis.improvements.length,
        clarity: analysis.clarity,
        specificity: analysis.specificity,
        engagement: analysis.engagement,
        persuasiveness: analysis.persuasiveness,
        completeness: analysis.completeness,
        readabilityScore: analysis.readabilityScore
      });

      console.log(`Prompt analysis ${isValid ? 'valid' : 'invalid'}, score: ${analysis.score}`);
    } catch (error) {
      console.error(`Error analyzing prompt ${index + 1}:`, error);
      results.push({
        test: `Analyze Prompt ${index + 1}`,
        success: false,
        error: error.message
      });
    }
  }

  logResult('prompt-analysis', results);
  return results;
}

/**
 * Test 5: End-to-End Test
 * Tests the complete flow from strategy recommendation to prompt generation to response
 */
async function testEndToEnd() {
  console.log('\n=== Testing End-to-End Flow ===');
  const results = [];

  for (const input of USER_INPUTS.slice(0, 2)) { // Limit to 2 inputs to save time
    try {
      console.log(`Testing end-to-end flow for: "${input.substring(0, 30)}..."...`);

      // Step 1: Get prompt recommendation
      console.log('Step 1: Getting prompt recommendation...');
      const recommendResponse = await fetch(`${ADVANCED_API_URL}/recommend-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, model: 'GPT-4' })
      });

      const promptData = await recommendResponse.json();

      // Step 2: Analyze the recommended prompt
      console.log('Step 2: Analyzing recommended prompt...');
      const analysisResponse = await fetch(`${ADVANCED_API_URL}/analyze-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptData })
      });

      const analysis = await analysisResponse.json();

      // Step 3: Generate a response using the prompt
      console.log('Step 3: Generating response...');
      const generateResponse = await fetch(`${GENERATE_API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptData)
      });

      const generatedContent = await generateResponse.json();

      results.push({
        test: `End-to-End: "${input.substring(0, 30)}..."`,
        success: true,
        promptScore: analysis.score,
        responseLength: generatedContent.content.length,
        model: generatedContent.model,
        promptTitle: promptData.title,
        promptContentPreview: promptData.content.substring(0, 100) + '...'
      });

      console.log(`End-to-end test completed successfully`);
    } catch (error) {
      console.error(`Error in end-to-end test for "${input.substring(0, 30)}...":`, error);
      results.push({
        test: `End-to-End: "${input.substring(0, 30)}..."`,
        success: false,
        error: error.message
      });
    }
  }

  logResult('end-to-end', results);
  return results;
}

/**
 * Run all tests and generate a summary
 */
async function runAllTests() {
  console.log('=== Starting PromptPro Advanced Features Tests ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`API Base URL: ${API_BASE_URL}`);

  const startTime = Date.now();

  const testResults = {
    timestamp: new Date().toISOString(),
    llmOptimization: await testLLMOptimization(),
    promptPatternLibrary: await testPromptPatternLibrary(),
    strategySelection: await testStrategySelection(),
    promptAnalysis: await testPromptAnalysis(),
    endToEnd: await testEndToEnd(),
    duration: 0,
    summary: {}
  };

  const endTime = Date.now();
  testResults.duration = (endTime - startTime) / 1000;

  // Generate summary
  const countSuccesses = (results) => results.filter(r => r.success).length;
  const countTests = (results) => results.length;

  testResults.summary = {
    totalTests:
      countTests(testResults.llmOptimization) +
      countTests(testResults.promptPatternLibrary) +
      countTests(testResults.strategySelection) +
      countTests(testResults.promptAnalysis) +
      countTests(testResults.endToEnd),
    totalSuccesses:
      countSuccesses(testResults.llmOptimization) +
      countSuccesses(testResults.promptPatternLibrary) +
      countSuccesses(testResults.strategySelection) +
      countSuccesses(testResults.promptAnalysis) +
      countSuccesses(testResults.endToEnd),
    featureResults: {
      llmOptimization: `${countSuccesses(testResults.llmOptimization)}/${countTests(testResults.llmOptimization)}`,
      promptPatternLibrary: `${countSuccesses(testResults.promptPatternLibrary)}/${countTests(testResults.promptPatternLibrary)}`,
      strategySelection: `${countSuccesses(testResults.strategySelection)}/${countTests(testResults.strategySelection)}`,
      promptAnalysis: `${countSuccesses(testResults.promptAnalysis)}/${countTests(testResults.promptAnalysis)}`,
      endToEnd: `${countSuccesses(testResults.endToEnd)}/${countTests(testResults.endToEnd)}`
    },
    duration: `${testResults.duration.toFixed(2)} seconds`
  };

  testResults.summary.successRate = (
    (testResults.summary.totalSuccesses / testResults.summary.totalTests) * 100
  ).toFixed(2) + '%';

  console.log('\n=== Test Summary ===');
  console.log(`Total Tests: ${testResults.summary.totalTests}`);
  console.log(`Successful Tests: ${testResults.summary.totalSuccesses}`);
  console.log(`Success Rate: ${testResults.summary.successRate}`);
  console.log(`Duration: ${testResults.summary.duration}`);
  console.log('\nFeature Results:');
  Object.entries(testResults.summary.featureResults).forEach(([feature, result]) => {
    console.log(`- ${feature}: ${result}`);
  });

  logSummary(testResults);
  console.log('\n=== Testing Complete ===');
}

// Run all tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
});
