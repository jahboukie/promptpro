import { PromptData } from '../shared/types';
import { PromptPattern, getAllPromptPatterns, getPromptPatternById } from './prompt-patterns';
import { optimizePromptForModel, getModelRecommendations } from './llm-optimization';

// Define the structure for a content goal
interface ContentGoal {
  id: string;
  name: string;
  description: string;
  recommendedPatterns: string[]; // IDs of recommended prompt patterns
  recommendedModels: string[];
  recommendedOutputFormats: string[];
  recommendedTones: string[];
  recommendedStyles: string[];
}

// Define common content marketing goals
const CONTENT_GOALS: ContentGoal[] = [
  {
    id: 'brand-awareness',
    name: 'Brand Awareness',
    description: 'Increase visibility and recognition of your brand',
    recommendedPatterns: ['social-media-campaign', 'blog-outline'],
    recommendedModels: ['GPT-4', 'Claude 3 Opus', 'Jasper'],
    recommendedOutputFormats: ['paragraph', 'bullet-points'],
    recommendedTones: ['conversational', 'enthusiastic', 'friendly'],
    recommendedStyles: ['creative', 'persuasive']
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation',
    description: 'Capture potential customer information and interest',
    recommendedPatterns: ['email-sequence', 'seo-article'],
    recommendedModels: ['GPT-4', 'Claude 3 Opus', 'Jasper', 'CopyAI'],
    recommendedOutputFormats: ['paragraph', 'bullet-points'],
    recommendedTones: ['persuasive', 'professional', 'friendly'],
    recommendedStyles: ['persuasive', 'professional']
  },
  {
    id: 'conversion',
    name: 'Conversion',
    description: 'Turn prospects into customers',
    recommendedPatterns: ['product-description', 'email-sequence'],
    recommendedModels: ['GPT-4', 'Claude 3 Opus', 'Jasper', 'CopyAI'],
    recommendedOutputFormats: ['paragraph'],
    recommendedTones: ['persuasive', 'enthusiastic', 'urgent'],
    recommendedStyles: ['persuasive', 'professional']
  },
  {
    id: 'customer-retention',
    name: 'Customer Retention',
    description: 'Keep existing customers engaged and loyal',
    recommendedPatterns: ['email-sequence', 'social-media-campaign'],
    recommendedModels: ['GPT-4', 'Claude 3 Opus', 'Jasper'],
    recommendedOutputFormats: ['paragraph', 'bullet-points'],
    recommendedTones: ['friendly', 'appreciative', 'helpful'],
    recommendedStyles: ['conversational', 'professional']
  },
  {
    id: 'seo',
    name: 'SEO',
    description: 'Improve search engine rankings and organic traffic',
    recommendedPatterns: ['seo-article', 'blog-outline'],
    recommendedModels: ['GPT-4', 'Claude 3 Opus'],
    recommendedOutputFormats: ['paragraph'],
    recommendedTones: ['informative', 'authoritative'],
    recommendedStyles: ['informative', 'professional']
  },
  {
    id: 'thought-leadership',
    name: 'Thought Leadership',
    description: 'Establish authority and expertise in your industry',
    recommendedPatterns: ['seo-article', 'blog-outline'],
    recommendedModels: ['GPT-4', 'Claude 3 Opus'],
    recommendedOutputFormats: ['paragraph', 'bullet-points'],
    recommendedTones: ['authoritative', 'informative', 'professional'],
    recommendedStyles: ['informative', 'professional']
  }
];

// Define the structure for a content type
interface ContentType {
  id: string;
  name: string;
  description: string;
  recommendedPatterns: string[]; // IDs of recommended prompt patterns
  recommendedModels: string[];
  recommendedOutputFormats: string[];
  recommendedTones: string[];
  recommendedStyles: string[];
  averageLength: string;
}

// Define common content types
const CONTENT_TYPES: ContentType[] = [
  {
    id: 'prompt-engineering',
    name: 'Prompt Engineering',
    description: 'Specialized prompts for optimizing LLM outputs',
    recommendedPatterns: ['llm-prompt-engineering'],
    recommendedModels: ['GPT-4', 'Claude 3 Opus'],
    recommendedOutputFormats: ['paragraph'],
    recommendedTones: ['technical', 'professional', 'instructive'],
    recommendedStyles: ['technical', 'professional', 'instructive'],
    averageLength: '500-1,000 words'
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Long-form content published on a blog',
    recommendedPatterns: ['blog-outline', 'seo-article'],
    recommendedModels: ['GPT-4', 'Claude 3 Opus'],
    recommendedOutputFormats: ['paragraph'],
    recommendedTones: ['conversational', 'informative', 'professional'],
    recommendedStyles: ['informative', 'conversational', 'professional'],
    averageLength: '1,000-2,000 words'
  },
  {
    id: 'social-media-post',
    name: 'Social Media Post',
    description: 'Short-form content for social platforms',
    recommendedPatterns: ['social-media-campaign'],
    recommendedModels: ['GPT-4', 'GPT-3.5 Turbo', 'Jasper', 'CopyAI'],
    recommendedOutputFormats: ['paragraph', 'bullet-points'],
    recommendedTones: ['conversational', 'enthusiastic', 'friendly'],
    recommendedStyles: ['creative', 'conversational', 'persuasive'],
    averageLength: '50-280 characters'
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Content delivered directly to subscriber inboxes',
    recommendedPatterns: ['email-sequence'],
    recommendedModels: ['GPT-4', 'Claude 3 Opus', 'Jasper', 'CopyAI'],
    recommendedOutputFormats: ['paragraph'],
    recommendedTones: ['conversational', 'friendly', 'persuasive'],
    recommendedStyles: ['conversational', 'persuasive', 'professional'],
    averageLength: '300-500 words'
  },
  {
    id: 'product-description',
    name: 'Product Description',
    description: 'Content that describes and sells a product',
    recommendedPatterns: ['product-description'],
    recommendedModels: ['GPT-4', 'GPT-3.5 Turbo', 'Jasper', 'CopyAI'],
    recommendedOutputFormats: ['paragraph'],
    recommendedTones: ['enthusiastic', 'persuasive'],
    recommendedStyles: ['persuasive', 'professional'],
    averageLength: '200-400 words'
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Focused page designed to convert visitors',
    recommendedPatterns: ['product-description'],
    recommendedModels: ['GPT-4', 'Claude 3 Opus', 'Jasper', 'CopyAI'],
    recommendedOutputFormats: ['paragraph', 'bullet-points'],
    recommendedTones: ['persuasive', 'enthusiastic'],
    recommendedStyles: ['persuasive', 'professional'],
    averageLength: '500-1,000 words'
  },
  {
    id: 'whitepaper',
    name: 'Whitepaper',
    description: 'In-depth, authoritative document on a specific topic',
    recommendedPatterns: ['seo-article'],
    recommendedModels: ['GPT-4', 'Claude 3 Opus'],
    recommendedOutputFormats: ['paragraph'],
    recommendedTones: ['authoritative', 'professional', 'informative'],
    recommendedStyles: ['informative', 'professional'],
    averageLength: '2,000-5,000 words'
  }
];

/**
 * Gets all available content goals
 */
export function getAllContentGoals(): ContentGoal[] {
  return CONTENT_GOALS;
}

/**
 * Gets a content goal by ID
 */
export function getContentGoalById(id: string): ContentGoal | undefined {
  return CONTENT_GOALS.find(goal => goal.id === id);
}

/**
 * Gets all available content types
 */
export function getAllContentTypes(): ContentType[] {
  return CONTENT_TYPES;
}

/**
 * Gets a content type by ID
 */
export function getContentTypeById(id: string): ContentType | undefined {
  return CONTENT_TYPES.find(type => type.id === id);
}

/**
 * Strategy recommendation interface
 */
export interface StrategyRecommendation {
  recommendedPatterns: PromptPattern[];
  recommendedModels: string[];
  recommendedOutputFormats: string[];
  recommendedTones: string[];
  recommendedStyles: string[];
  additionalTips: string[];
}

/**
 * Recommends a strategy based on content goal and type
 */
export function recommendStrategy(
  contentGoalId: string,
  contentTypeId: string
): StrategyRecommendation {
  const contentGoal = getContentGoalById(contentGoalId);
  const contentType = getContentTypeById(contentTypeId);

  if (!contentGoal || !contentType) {
    throw new Error('Invalid content goal or type');
  }

  // Find patterns that are recommended for both the goal and type
  const commonPatternIds = contentGoal.recommendedPatterns.filter(
    patternId => contentType.recommendedPatterns.includes(patternId)
  );

  // If no common patterns, use all patterns from both
  const patternIds = commonPatternIds.length > 0
    ? commonPatternIds
    : [...new Set([...contentGoal.recommendedPatterns, ...contentType.recommendedPatterns])];

  // Get the actual pattern objects
  const recommendedPatterns = patternIds
    .map(id => getPromptPatternById(id))
    .filter((pattern): pattern is PromptPattern => pattern !== undefined);

  // Find common models, output formats, tones, and styles
  const recommendedModels = findCommonItems(contentGoal.recommendedModels, contentType.recommendedModels);
  const recommendedOutputFormats = findCommonItems(contentGoal.recommendedOutputFormats, contentType.recommendedOutputFormats);
  const recommendedTones = findCommonItems(contentGoal.recommendedTones, contentType.recommendedTones);
  const recommendedStyles = findCommonItems(contentGoal.recommendedStyles, contentType.recommendedStyles);

  // Generate additional tips
  const additionalTips = [
    `For ${contentType.name} content with a ${contentGoal.name} goal, aim for approximately ${contentType.averageLength}.`,
    `${contentType.name} content typically performs best with a ${recommendedTones[0] || 'conversational'} tone.`,
    `Consider using the ${recommendedPatterns[0]?.name || 'Blog Post Outline'} pattern as a starting point.`,
    `${contentGoal.name} content often benefits from including specific calls-to-action.`
  ];

  return {
    recommendedPatterns,
    recommendedModels,
    recommendedOutputFormats,
    recommendedTones,
    recommendedStyles,
    additionalTips
  };
}

/**
 * Finds common items between two arrays
 */
function findCommonItems<T>(array1: T[], array2: T[]): T[] {
  const common = array1.filter(item => array2.includes(item));
  return common.length > 0 ? common : [...new Set([...array1, ...array2])];
}

/**
 * Analyzes user input and recommends a strategy
 */
export function analyzeUserInput(input: string): StrategyRecommendation {
  const inputLower = input.toLowerCase();

  // Check for prompt engineering related keywords
  const isPromptEngineering =
    inputLower.includes('prompt') &&
    (inputLower.includes('engineer') ||
     inputLower.includes('llm') ||
     inputLower.includes('gpt') ||
     inputLower.includes('claude') ||
     inputLower.includes('gemini') ||
     inputLower.includes('ai model') ||
     inputLower.includes('language model'));

  if (isPromptEngineering) {
    // If it's about prompt engineering, use that content type
    return recommendStrategy('thought-leadership', 'prompt-engineering');
  }

  // Extract potential content type
  const contentTypeMatch = CONTENT_TYPES.find(type =>
    inputLower.includes(type.id) ||
    inputLower.includes(type.name.toLowerCase())
  );

  // Extract potential content goal
  const contentGoalMatch = CONTENT_GOALS.find(goal =>
    inputLower.includes(goal.id) ||
    inputLower.includes(goal.name.toLowerCase())
  );

  // Default to blog post and brand awareness if no matches
  const contentTypeId = contentTypeMatch?.id || 'blog-post';
  const contentGoalId = contentGoalMatch?.id || 'brand-awareness';

  return recommendStrategy(contentGoalId, contentTypeId);
}

/**
 * Recommends a complete prompt based on user input
 */
export function recommendPrompt(input: string, model: string = 'GPT-4'): PromptData {
  const inputLower = input.toLowerCase();

  // Directly check for prompt engineering related keywords
  const isPromptEngineering =
    inputLower.includes('prompt') &&
    (inputLower.includes('engineer') ||
     inputLower.includes('llm') ||
     inputLower.includes('gpt') ||
     inputLower.includes('claude') ||
     inputLower.includes('gemini') ||
     inputLower.includes('ai model') ||
     inputLower.includes('language model'));

  let selectedPattern;
  let strategy;

  if (isPromptEngineering) {
    // If it's about prompt engineering, use that pattern directly
    selectedPattern = getPromptPatternById('llm-prompt-engineering');
    // Create a default strategy for prompt engineering
    strategy = {
      recommendedPatterns: [selectedPattern],
      recommendedModels: ['GPT-4', 'Claude 3 Opus'],
      recommendedOutputFormats: ['paragraph'],
      recommendedTones: ['professional', 'technical'],
      recommendedStyles: ['technical', 'professional'],
      additionalTips: [
        'For prompt engineering content, focus on specific model capabilities and limitations.',
        'Include examples of effective prompts for different use cases.',
        'Consider the unique characteristics of each LLM architecture.',
        'Provide clear guidance on how to test and iterate on prompts.'
      ]
    };
  } else {
    // Otherwise, use the strategy selection approach
    strategy = analyzeUserInput(input);
    selectedPattern = strategy.recommendedPatterns[0];
  }

  if (!selectedPattern) {
    throw new Error('No suitable prompt pattern found');
  }

  // Extract potential variables from the input
  const extractedVariables = extractVariablesFromInput(input, selectedPattern.template);

  // Apply the pattern with extracted variables
  const patternWithVariables = applyVariablesToTemplate(selectedPattern.template, extractedVariables);

  // Create a basic prompt from the pattern
  const promptData: PromptData = {
    title: `${selectedPattern.name} for ${input}`,
    content: patternWithVariables,
    model: strategy.recommendedModels.includes(model) ? model : strategy.recommendedModels[0],
    goal: 'generate-content',
    outputFormat: strategy.recommendedOutputFormats[0],
    style: strategy.recommendedStyles[0],
    tone: strategy.recommendedTones[0],
    actionVerb: selectedPattern.defaultParams.actionVerb || 'Create',
    specificDetails: strategy.additionalTips.join('\n\n'),
    useRolePlaying: selectedPattern.defaultParams.useRolePlaying || false,
    role: selectedPattern.defaultParams.role || '',
  };

  // Optimize the prompt for the selected model
  return optimizePromptForModel(promptData);
}

/**
 * Extracts variables from a template
 */
function extractVariablesFromTemplate(template: string): string[] {
  const matches = template.match(/{{([^}]+)}}/g) || [];
  return matches.map(match => match.slice(2, -2));
}

/**
 * Attempts to extract variable values from user input
 */
function extractVariablesFromInput(input: string, template: string): Record<string, string> {
  const variables = extractVariablesFromTemplate(template);
  const extractedValues: Record<string, string> = {};

  // Extract title from input if it exists
  if (variables.includes('title')) {
    const titleMatch = input.match(/(?:about|on|for|regarding|titled?)\s+["']?([^"'\n.,]+)/i);
    if (titleMatch && titleMatch[1]) {
      extractedValues['title'] = titleMatch[1].trim();
    } else {
      // Use the entire input as the title if no specific title is found
      extractedValues['title'] = input;
    }
  }

  // Extract audience from input if it exists
  if (variables.includes('audience')) {
    const audienceMatch = input.match(/(?:for|targeting|aimed at|to)\s+["']?([^"'\n.,]+(?:\s+audience|s|ers|ors|people|professionals|experts|beginners|users)?)/i);
    if (audienceMatch && audienceMatch[1]) {
      extractedValues['audience'] = audienceMatch[1].trim().replace(/\s+(audience|s|ers|ors|people)$/i, '');
    } else {
      extractedValues['audience'] = 'content creators and marketers';
    }
  }

  // Extract topic from input if it exists
  if (variables.includes('topic')) {
    extractedValues['topic'] = extractedValues['title'] || input;
  }

  // Extract target LLM from input if it exists
  if (variables.includes('targetLLM')) {
    // First, check for specific LLM mentions
    const specificLLMMatch = input.match(/(?:for|using|with|in)\s+["']?(GPT-4|GPT-3\.5|Claude|Gemini|Llama|Mistral|Bard|PaLM)(?:\s+|$)/i);
    if (specificLLMMatch && specificLLMMatch[1]) {
      extractedValues['targetLLM'] = specificLLMMatch[1].trim();
    } else {
      // Fall back to more general pattern
      const llmMatch = input.match(/(?:for|using|with|in)\s+["']?([A-Za-z0-9-]+(?:\s+[A-Za-z0-9]+)?(?:\s+[A-Za-z0-9]+)?)(?:\s+LLMs?|\s+models?|\s+AI)/i);
      if (llmMatch && llmMatch[1]) {
        extractedValues['targetLLM'] = llmMatch[1].trim();
      } else {
        extractedValues['targetLLM'] = 'GPT-4';
      }
    }

    // If the input is about "different LLMs" but mentions a specific one, use that
    if (input.toLowerCase().includes('different llm') && extractedValues['targetLLM'] !== 'different') {
      // Keep the specific LLM
    } else if (input.toLowerCase().includes('different llm')) {
      extractedValues['targetLLM'] = 'GPT-4'; // Default to GPT-4 for "different LLMs"
    }
  }

  // Extract purpose from input if it exists
  if (variables.includes('purpose')) {
    const purposeMatch = input.match(/(?:for|to)\s+["']?([^"'\n.,]+(?:\s+purposes?|ing|tion|ment|goals?)?)/i);
    if (purposeMatch && purposeMatch[1]) {
      extractedValues['purpose'] = purposeMatch[1].trim().replace(/\s+(purposes?|ing|tion|ment|goals?)$/i, '');
    } else {
      extractedValues['purpose'] = 'creating high-quality content';
    }
  }

  // Extract industry from input if it exists
  if (variables.includes('industry')) {
    const industryMatch = input.match(/(?:in|for|within|the)\s+["']?([^"'\n.,]+(?:\s+industry|sector|field|market|niche)?)/i);
    if (industryMatch && industryMatch[1]) {
      extractedValues['industry'] = industryMatch[1].trim().replace(/\s+(industry|sector|field|market|niche)$/i, '');
    } else {
      extractedValues['industry'] = 'artificial intelligence and content creation';
    }
  }

  // Set default values for common variables
  if (variables.includes('goal') && !extractedValues['goal'])
    extractedValues['goal'] = 'educating the audience and establishing authority';

  if (variables.includes('hook') && !extractedValues['hook'])
    extractedValues['hook'] = 'a compelling statistic or question';

  if (variables.includes('keyTakeaway') && !extractedValues['keyTakeaway'])
    extractedValues['keyTakeaway'] = 'the importance of the topic';

  if (variables.includes('desiredAction') && !extractedValues['desiredAction'])
    extractedValues['desiredAction'] = 'implement the strategies discussed';

  if (variables.includes('tone') && !extractedValues['tone'])
    extractedValues['tone'] = 'conversational yet informative';

  if (variables.includes('primaryKeyword') && !extractedValues['primaryKeyword'])
    extractedValues['primaryKeyword'] = extractedValues['title'] || input;

  if (variables.includes('secondaryKeywords') && !extractedValues['secondaryKeywords'])
    extractedValues['secondaryKeywords'] = 'related industry terms';

  // Set default values for enhanced blog outline variables
  if (variables.includes('statistic') && !extractedValues['statistic'])
    extractedValues['statistic'] = 'Studies show that well-engineered prompts can improve AI response relevance by up to 70%';

  if (variables.includes('mainSection1') && !extractedValues['mainSection1'])
    extractedValues['mainSection1'] = 'Understanding the Fundamentals';

  if (variables.includes('mainSection2') && !extractedValues['mainSection2'])
    extractedValues['mainSection2'] = 'Key Strategies and Techniques';

  if (variables.includes('mainSection3') && !extractedValues['mainSection3'])
    extractedValues['mainSection3'] = 'Practical Applications';

  if (variables.includes('mainSection4') && !extractedValues['mainSection4'])
    extractedValues['mainSection4'] = 'Future Trends and Developments';

  return extractedValues;
}

/**
 * Applies variables to a template
 */
function applyVariablesToTemplate(template: string, variables: Record<string, string>): string {
  let result = template;

  // Special handling for prompt engineering template
  if (template.includes('PART 1: LLM ANALYSIS') && variables['topic']) {
    // Extract the actual topic from the input
    const topicValue = variables['topic'];
    const actualTopic = topicValue.replace(/^Create a prompt for GPT-4 about /, '').trim();

    // Update the topic variable with the cleaned version
    variables['topic'] = actualTopic;
  }

  // Apply all variables to the template
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });

  return result;
}
