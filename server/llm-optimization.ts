import { PromptData } from '../shared/types';

// LLM Model characteristics and optimization profiles
interface ModelProfile {
  name: string;
  provider: 'openai' | 'anthropic' | 'xai' | 'google' | 'jasper' | 'copyai';
  contextWindow: number;
  strengths: string[];
  weaknesses: string[];
  preferredFormats: string[];
  specialInstructions: string[];
  compatibleTools: string[]; // Which content tools this works well with
  optimizationTips: string[];
}

// Define model profiles for various LLMs
const MODEL_PROFILES: Record<string, ModelProfile> = {
  'gpt-4': {
    name: 'GPT-4',
    provider: 'openai',
    contextWindow: 8192,
    strengths: [
      'Complex reasoning',
      'Nuanced understanding',
      'Following detailed instructions',
      'Code generation',
      'Creative writing'
    ],
    weaknesses: [
      'Hallucinations in factual content',
      'Verbose responses',
      'Knowledge cutoff limitations'
    ],
    preferredFormats: [
      'Detailed instructions',
      'Step-by-step guidance',
      'JSON structured output',
      'Markdown formatting'
    ],
    specialInstructions: [
      'Use "Let\'s think step by step" for reasoning tasks',
      'Specify output format explicitly',
      'Use system messages for persistent instructions'
    ],
    compatibleTools: ['Jasper AI', 'Copy AI', 'WordAI', 'Frase'],
    optimizationTips: [
      'Break complex tasks into smaller steps',
      'Use explicit formatting instructions',
      'Provide examples for desired output format',
      'Use role prompting for specialized knowledge'
    ]
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    contextWindow: 4096,
    strengths: [
      'Fast responses',
      'Good general knowledge',
      'Creative content generation',
      'Cost-effective'
    ],
    weaknesses: [
      'Less nuanced than GPT-4',
      'Struggles with complex reasoning',
      'More prone to hallucinations'
    ],
    preferredFormats: [
      'Clear, concise instructions',
      'Bullet points',
      'Simple formatting'
    ],
    specialInstructions: [
      'Keep instructions clear and direct',
      'Use examples for complex tasks',
      'Break down multi-step processes'
    ],
    compatibleTools: ['Jasper AI', 'Copy AI', 'Rytr', 'Simplified'],
    optimizationTips: [
      'Keep prompts concise and focused',
      'Use simpler language than with GPT-4',
      'Provide more explicit instructions',
      'Include examples for complex outputs'
    ]
  },
  'claude-3-opus': {
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    contextWindow: 100000,
    strengths: [
      'Extremely long context window',
      'Strong reasoning capabilities',
      'Excellent at following instructions',
      'Reduced hallucinations'
    ],
    weaknesses: [
      'Less creative than some models',
      'More expensive than smaller models',
      'Sometimes overly cautious'
    ],
    preferredFormats: [
      'Detailed instructions',
      'Long-form content',
      'Academic writing',
      'Document analysis'
    ],
    specialInstructions: [
      'Leverage the large context window for document analysis',
      'Use "I need a thoughtful, nuanced response" for complex topics',
      'Specify when creativity is desired'
    ],
    compatibleTools: ['Copy AI', 'Jasper AI', 'Frase', 'Clearscope'],
    optimizationTips: [
      'Provide comprehensive context for best results',
      'Use explicit formatting instructions',
      'Specify tone and style clearly',
      'Leverage its ability to analyze long documents'
    ]
  },
  'claude-3-sonnet': {
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    contextWindow: 200000,
    strengths: [
      'Massive context window',
      'Balanced performance',
      'Good at following instructions',
      'Reduced hallucinations'
    ],
    weaknesses: [
      'Less powerful than Opus',
      'Sometimes overly cautious'
    ],
    preferredFormats: [
      'Clear instructions',
      'Long-form content',
      'Document analysis'
    ],
    specialInstructions: [
      'Leverage the large context window',
      'Be explicit about desired creativity level',
      'Use clear formatting instructions'
    ],
    compatibleTools: ['Copy AI', 'Jasper AI', 'Frase', 'Clearscope'],
    optimizationTips: [
      'Provide comprehensive context',
      'Be explicit about tone and style',
      'Use examples for complex outputs'
    ]
  },
  'grok-1': {
    name: 'Grok-1',
    provider: 'xai',
    contextWindow: 8192,
    strengths: [
      'Creative responses',
      'Conversational style',
      'Up-to-date knowledge',
      'Humor and personality'
    ],
    weaknesses: [
      'Less formal than some models',
      'May be too casual for business content',
      'Newer with less established patterns'
    ],
    preferredFormats: [
      'Conversational prompts',
      'Creative writing tasks',
      'Informal content'
    ],
    specialInstructions: [
      'Specify when a more formal tone is needed',
      'Be clear about factual accuracy requirements',
      'Use examples for specific formats'
    ],
    compatibleTools: ['Jasper AI', 'Copy AI', 'Rytr'],
    optimizationTips: [
      'Embrace conversational style for engagement',
      'Specify tone explicitly for business content',
      'Use examples when specific formats are needed',
      'Leverage its personality for creative content'
    ]
  },
  'gemini-pro': {
    name: 'Gemini Pro',
    provider: 'google',
    contextWindow: 32768,
    strengths: [
      'Strong factual knowledge',
      'Multimodal capabilities',
      'Good at structured data tasks',
      'Long context window'
    ],
    weaknesses: [
      'Less creative than some models',
      'More formal in tone',
      'Newer with less established patterns'
    ],
    preferredFormats: [
      'Structured data requests',
      'Factual content',
      'Technical writing'
    ],
    specialInstructions: [
      'Be explicit when creativity is desired',
      'Use structured format for best results',
      'Specify tone clearly'
    ],
    compatibleTools: ['Jasper AI', 'Copy AI', 'Frase', 'Clearscope'],
    optimizationTips: [
      'Leverage for factual, research-based content',
      'Provide clear structure in prompts',
      'Use examples for creative tasks',
      'Be explicit about desired tone'
    ]
  },
  'jasper': {
    name: 'Jasper AI',
    provider: 'jasper',
    contextWindow: 4000,
    strengths: [
      'Marketing-focused content',
      'SEO optimization',
      'Brand voice consistency',
      'Content templates'
    ],
    weaknesses: [
      'Less versatile than general models',
      'Marketing-specific focus',
      'Limited technical content capabilities'
    ],
    preferredFormats: [
      'Marketing briefs',
      'SEO-focused instructions',
      'Brand guidelines inclusion'
    ],
    specialInstructions: [
      'Include target keywords',
      'Specify target audience clearly',
      'Include brand voice guidelines',
      'Mention desired content length'
    ],
    compatibleTools: ['Jasper AI'],
    optimizationTips: [
      'Include SEO keywords prominently',
      'Specify target audience demographics',
      'Include brand voice characteristics',
      'Mention competitors for positioning'
    ]
  },
  'copyai': {
    name: 'Copy AI',
    provider: 'copyai',
    contextWindow: 4000,
    strengths: [
      'Marketing copy generation',
      'Multiple variations',
      'Social media content',
      'Email marketing'
    ],
    weaknesses: [
      'Less versatile than general models',
      'Marketing-specific focus',
      'Limited technical content capabilities'
    ],
    preferredFormats: [
      'Marketing briefs',
      'Variation requests',
      'Short-form content instructions'
    ],
    specialInstructions: [
      'Request multiple variations',
      'Specify character limits',
      'Include target audience details',
      'Mention content goals'
    ],
    compatibleTools: ['Copy AI'],
    optimizationTips: [
      'Be specific about desired tone and style',
      'Include examples of successful content',
      'Specify engagement goals',
      'Include call-to-action requirements'
    ]
  }
};

/**
 * Optimizes a prompt for a specific LLM model
 * @param promptData The original prompt data
 * @param targetModel Optional target model (if different from promptData.model)
 * @returns Optimized prompt data
 */
export function optimizePromptForModel(promptData: PromptData, targetModel?: string): PromptData {
  const modelName = targetModel || promptData.model;

  // Normalize model name to match keys in MODEL_PROFILES
  const normalizedModelName = normalizeModelName(modelName);

  // Get the model profile or default to GPT-4 if not found
  const modelProfile = MODEL_PROFILES[normalizedModelName] || MODEL_PROFILES['gpt-4'];

  // Create a copy of the prompt data to modify
  const optimizedPrompt: PromptData = { ...promptData };

  // Add model-specific optimization notes to the specific details
  let optimizationNotes = `\n\nOptimized for ${modelProfile.name}:\n`;

  // Add relevant optimization tips based on the content goal
  if (promptData.goal) {
    optimizationNotes += `- For ${promptData.goal} tasks, ${getRelevantTip(modelProfile.optimizationTips, promptData.goal)}\n`;
  }

  // Add format-specific optimizations
  if (promptData.outputFormat) {
    optimizationNotes += `- When creating ${promptData.outputFormat} content, ${getRelevantTip(modelProfile.optimizationTips, promptData.outputFormat)}\n`;
  }

  // Add special instructions based on the model
  optimizationNotes += `- ${getRandomItem(modelProfile.specialInstructions)}\n`;

  // Add compatible tools information
  optimizationNotes += `- This prompt is optimized for use with: ${modelProfile.compatibleTools.join(', ')}\n`;

  // Append optimization notes to specific details
  optimizedPrompt.specificDetails = (optimizedPrompt.specificDetails || '') + optimizationNotes;

  return optimizedPrompt;
}

/**
 * Gets a relevant tip based on a keyword
 */
function getRelevantTip(tips: string[], keyword: string): string {
  // Try to find a tip that contains the keyword
  const relevantTips = tips.filter(tip =>
    tip.toLowerCase().includes(keyword.toLowerCase())
  );

  // Return a relevant tip or a random tip if none match
  return relevantTips.length > 0 ? getRandomItem(relevantTips) : getRandomItem(tips);
}

/**
 * Gets a random item from an array
 */
function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Normalizes model names to match the keys in MODEL_PROFILES
 * Handles different formats and capitalization
 */
function normalizeModelName(modelName: string): string {
  // Convert to lowercase
  const lowerName = modelName.toLowerCase();

  // Handle specific model name mappings
  const modelMappings: Record<string, string> = {
    'gpt-4': 'gpt-4',
    'gpt4': 'gpt-4',
    'gpt 4': 'gpt-4',
    'gpt-3.5-turbo': 'gpt-3.5-turbo',
    'gpt-3.5': 'gpt-3.5-turbo',
    'gpt3.5': 'gpt-3.5-turbo',
    'gpt 3.5': 'gpt-3.5-turbo',
    'claude-3-opus': 'claude-3-opus',
    'claude 3 opus': 'claude-3-opus',
    'claude opus': 'claude-3-opus',
    'claude3 opus': 'claude-3-opus',
    'claude-3-sonnet': 'claude-3-sonnet',
    'claude 3 sonnet': 'claude-3-sonnet',
    'claude sonnet': 'claude-3-sonnet',
    'claude3 sonnet': 'claude-3-sonnet',
    'grok-1': 'grok-1',
    'grok1': 'grok-1',
    'grok 1': 'grok-1',
    'grok': 'grok-1',
    'gemini-pro': 'gemini-pro',
    'gemini pro': 'gemini-pro',
    'gemini': 'gemini-pro',
    'jasper': 'jasper',
    'jasper ai': 'jasper',
    'copyai': 'copyai',
    'copy ai': 'copyai',
    'copy.ai': 'copyai'
  };

  // Check if we have a direct mapping
  if (modelMappings[lowerName]) {
    return modelMappings[lowerName];
  }

  // Try to match by checking if the model name contains any of our known models
  for (const [key, value] of Object.entries(modelMappings)) {
    if (lowerName.includes(key)) {
      return value;
    }
  }

  // If no match found, convert spaces to hyphens and remove any non-alphanumeric characters except hyphens
  return lowerName.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/**
 * Returns model-specific recommendations for the given prompt
 * @param promptData The prompt data
 * @returns Recommendations for improving the prompt
 */
export function getModelRecommendations(promptData: PromptData): string[] {
  const normalizedModelName = normalizeModelName(promptData.model);
  const modelProfile = MODEL_PROFILES[normalizedModelName] || MODEL_PROFILES['gpt-4'];

  const recommendations: string[] = [];

  // Check if the prompt is using the model's strengths
  const isUsingStrengths = modelProfile.strengths.some(strength =>
    promptData.content.toLowerCase().includes(strength.toLowerCase()) ||
    (promptData.specificDetails || '').toLowerCase().includes(strength.toLowerCase())
  );

  if (!isUsingStrengths) {
    recommendations.push(`Consider leveraging ${modelProfile.name}'s strengths: ${modelProfile.strengths.join(', ')}`);
  }

  // Check if the prompt is using preferred formats
  const isUsingPreferredFormat = modelProfile.preferredFormats.some(format =>
    promptData.outputFormat?.toLowerCase().includes(format.toLowerCase())
  );

  if (!isUsingPreferredFormat && promptData.outputFormat) {
    recommendations.push(`${modelProfile.name} works best with these formats: ${modelProfile.preferredFormats.join(', ')}`);
  }

  // Add all optimization tips
  modelProfile.optimizationTips.forEach(tip => {
    recommendations.push(`For ${modelProfile.name}: ${tip}`);
  });

  // Add compatible tools recommendation
  recommendations.push(`This prompt works best with: ${modelProfile.compatibleTools.join(', ')}`);

  // Add model-specific strengths recommendation
  recommendations.push(`${modelProfile.name} excels at: ${modelProfile.strengths.slice(0, 3).join(', ')}`);

  // Add format recommendation
  recommendations.push(`For ${modelProfile.name}, consider using ${getRandomItem(modelProfile.preferredFormats)} format`);

  return recommendations;
}

/**
 * Export model profiles for use in the frontend
 */
export function getModelProfiles(): Record<string, Omit<ModelProfile, 'specialInstructions'>> {
  // Create a copy without the specialInstructions field to avoid exposing internal prompting strategies
  return Object.entries(MODEL_PROFILES).reduce((acc, [key, profile]) => {
    const { specialInstructions, ...rest } = profile;
    acc[key] = rest;
    return acc;
  }, {} as Record<string, Omit<ModelProfile, 'specialInstructions'>>);
}
