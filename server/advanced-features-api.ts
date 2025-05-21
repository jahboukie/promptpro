import express from 'express';
import { PromptData } from '../shared/types';
import { optimizePromptForModel, getModelProfiles } from './llm-optimization';
import {
  getAllPromptPatterns,
  getPromptPatternById,
  getPromptPatternsByCategory,
  getPromptPatternsByContentType,
  getPromptPatternsByGoal,
  applyPromptPattern
} from './prompt-patterns';
import {
  getAllContentGoals,
  getAllContentTypes,
  getContentGoalById,
  getContentTypeById,
  recommendStrategy,
  analyzeUserInput,
  recommendPrompt
} from './strategy-selection';
import { analyzePrompt } from './prompt-analysis';
import {
  generateOptimalPrompt,
  generatePromptVariants,
  applyAndEnhancePattern
} from './services/prompt-engineering-llm';

// Create router
const router = express.Router();

/**
 * Get all model profiles
 * GET /api/advanced/models
 */
router.get('/models', (req, res) => {
  try {
    const modelProfiles = getModelProfiles();
    res.json(modelProfiles);
  } catch (error) {
    console.error('Error getting model profiles:', error);
    res.status(500).json({ error: 'Failed to get model profiles' });
  }
});

/**
 * Optimize a prompt for a specific model
 * POST /api/advanced/optimize-prompt
 */
router.post('/optimize-prompt', (req, res) => {
  try {
    const { promptData, targetModel } = req.body;

    if (!promptData) {
      return res.status(400).json({ error: 'Prompt data is required' });
    }

    const optimizedPrompt = optimizePromptForModel(promptData, targetModel);
    res.json(optimizedPrompt);
  } catch (error) {
    console.error('Error optimizing prompt:', error);
    res.status(500).json({ error: 'Failed to optimize prompt' });
  }
});

/**
 * Get all prompt patterns
 * GET /api/advanced/patterns
 */
router.get('/patterns', (req, res) => {
  try {
    const patterns = getAllPromptPatterns();
    res.json(patterns);
  } catch (error) {
    console.error('Error getting prompt patterns:', error);
    res.status(500).json({ error: 'Failed to get prompt patterns' });
  }
});

/**
 * Get a prompt pattern by ID
 * GET /api/advanced/patterns/:id
 */
router.get('/patterns/:id', (req, res) => {
  try {
    const pattern = getPromptPatternById(req.params.id);

    if (!pattern) {
      return res.status(404).json({ error: 'Pattern not found' });
    }

    res.json(pattern);
  } catch (error) {
    console.error('Error getting prompt pattern:', error);
    res.status(500).json({ error: 'Failed to get prompt pattern' });
  }
});

/**
 * Get prompt patterns by category
 * GET /api/advanced/patterns/category/:category
 */
router.get('/patterns/category/:category', (req, res) => {
  try {
    const patterns = getPromptPatternsByCategory(req.params.category);
    res.json(patterns);
  } catch (error) {
    console.error('Error getting prompt patterns by category:', error);
    res.status(500).json({ error: 'Failed to get prompt patterns by category' });
  }
});

/**
 * Get prompt patterns by content type
 * GET /api/advanced/patterns/content-type/:contentType
 */
router.get('/patterns/content-type/:contentType', (req, res) => {
  try {
    const patterns = getPromptPatternsByContentType(req.params.contentType);
    res.json(patterns);
  } catch (error) {
    console.error('Error getting prompt patterns by content type:', error);
    res.status(500).json({ error: 'Failed to get prompt patterns by content type' });
  }
});

/**
 * Get prompt patterns by goal
 * GET /api/advanced/patterns/goal/:goal
 */
router.get('/patterns/goal/:goal', (req, res) => {
  try {
    const patterns = getPromptPatternsByGoal(req.params.goal);
    res.json(patterns);
  } catch (error) {
    console.error('Error getting prompt patterns by goal:', error);
    res.status(500).json({ error: 'Failed to get prompt patterns by goal' });
  }
});

/**
 * Apply a prompt pattern with variables
 * POST /api/advanced/apply-pattern
 */
router.post('/apply-pattern', (req, res) => {
  try {
    const { patternId, variables } = req.body;

    if (!patternId) {
      return res.status(400).json({ error: 'Pattern ID is required' });
    }

    const promptData = applyPromptPattern(patternId, variables || {});
    res.json(promptData);
  } catch (error) {
    console.error('Error applying prompt pattern:', error);
    res.status(500).json({ error: 'Failed to apply prompt pattern' });
  }
});

/**
 * Get all content goals
 * GET /api/advanced/content-goals
 */
router.get('/content-goals', (req, res) => {
  try {
    const goals = getAllContentGoals();
    res.json(goals);
  } catch (error) {
    console.error('Error getting content goals:', error);
    res.status(500).json({ error: 'Failed to get content goals' });
  }
});

/**
 * Get a content goal by ID
 * GET /api/advanced/content-goals/:id
 */
router.get('/content-goals/:id', (req, res) => {
  try {
    const goal = getContentGoalById(req.params.id);

    if (!goal) {
      return res.status(404).json({ error: 'Content goal not found' });
    }

    res.json(goal);
  } catch (error) {
    console.error('Error getting content goal:', error);
    res.status(500).json({ error: 'Failed to get content goal' });
  }
});

/**
 * Get all content types
 * GET /api/advanced/content-types
 */
router.get('/content-types', (req, res) => {
  try {
    const types = getAllContentTypes();
    res.json(types);
  } catch (error) {
    console.error('Error getting content types:', error);
    res.status(500).json({ error: 'Failed to get content types' });
  }
});

/**
 * Get a content type by ID
 * GET /api/advanced/content-types/:id
 */
router.get('/content-types/:id', (req, res) => {
  try {
    const type = getContentTypeById(req.params.id);

    if (!type) {
      return res.status(404).json({ error: 'Content type not found' });
    }

    res.json(type);
  } catch (error) {
    console.error('Error getting content type:', error);
    res.status(500).json({ error: 'Failed to get content type' });
  }
});

/**
 * Recommend a strategy based on content goal and type
 * GET /api/advanced/recommend-strategy
 */
router.get('/recommend-strategy', (req, res) => {
  try {
    const { contentGoalId, contentTypeId } = req.query;

    if (!contentGoalId || !contentTypeId) {
      return res.status(400).json({ error: 'Content goal ID and content type ID are required' });
    }

    const strategy = recommendStrategy(contentGoalId as string, contentTypeId as string);
    res.json(strategy);
  } catch (error) {
    console.error('Error recommending strategy:', error);
    res.status(500).json({ error: 'Failed to recommend strategy' });
  }
});

/**
 * Analyze user input and recommend a strategy
 * POST /api/advanced/analyze-input
 */
router.post('/analyze-input', (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }

    const strategy = analyzeUserInput(input);
    res.json(strategy);
  } catch (error) {
    console.error('Error analyzing user input:', error);
    res.status(500).json({ error: 'Failed to analyze user input' });
  }
});

/**
 * Recommend a prompt based on user input
 * POST /api/advanced/recommend-prompt
 */
router.post('/recommend-prompt', (req, res) => {
  try {
    const { input, model } = req.body;

    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }

    const promptData = recommendPrompt(input, model);
    res.json(promptData);
  } catch (error) {
    console.error('Error recommending prompt:', error);
    res.status(500).json({ error: 'Failed to recommend prompt' });
  }
});

/**
 * Analyze a prompt and provide improvement suggestions
 * POST /api/advanced/analyze-prompt
 */
router.post('/analyze-prompt', (req, res) => {
  try {
    const { promptData } = req.body;

    if (!promptData) {
      return res.status(400).json({ error: 'Prompt data is required' });
    }

    const analysis = analyzePrompt(promptData);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing prompt:', error);
    res.status(500).json({ error: 'Failed to analyze prompt' });
  }
});

/**
 * Generate an optimal prompt using the PromptEngineer-GPT
 * POST /api/advanced/optimal-prompt
 */
router.post('/optimal-prompt', async (req, res) => {
  try {
    const { userRequest, targetLLM, useCase, additionalContext } = req.body;

    if (!userRequest) {
      return res.status(400).json({ error: 'User request is required' });
    }

    const optimalPrompt = await generateOptimalPrompt(
      userRequest,
      targetLLM || 'GPT-4',
      useCase || 'content-marketing',
      additionalContext || ''
    );

    res.json(optimalPrompt);
  } catch (error) {
    console.error('Error generating optimal prompt:', error);
    res.status(500).json({ error: 'Failed to generate optimal prompt' });
  }
});

/**
 * Generate multiple prompt variants for testing
 * POST /api/advanced/prompt-variants
 */
router.post('/prompt-variants', async (req, res) => {
  try {
    const { userRequest, targetLLM, useCase, numberOfVariants } = req.body;

    if (!userRequest) {
      return res.status(400).json({ error: 'User request is required' });
    }

    const variants = await generatePromptVariants(
      userRequest,
      targetLLM || 'GPT-4',
      useCase || 'content-marketing',
      numberOfVariants || 3
    );

    res.json(variants);
  } catch (error) {
    console.error('Error generating prompt variants:', error);
    res.status(500).json({ error: 'Failed to generate prompt variants' });
  }
});

/**
 * Apply a pattern and enhance it with PromptEngineer-GPT
 * POST /api/advanced/enhance-pattern
 */
router.post('/enhance-pattern', async (req, res) => {
  try {
    const { patternId, variables, targetLLM, useCase } = req.body;

    if (!patternId) {
      return res.status(400).json({ error: 'Pattern ID is required' });
    }

    const enhancedPrompt = await applyAndEnhancePattern(
      patternId,
      variables || {},
      targetLLM || 'GPT-4',
      useCase || 'content-marketing'
    );

    res.json(enhancedPrompt);
  } catch (error) {
    console.error('Error enhancing pattern:', error);
    res.status(500).json({ error: 'Failed to enhance pattern' });
  }
});

export default router;
