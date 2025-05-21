import { PromptData } from '../shared/types';
import { getModelRecommendations } from './llm-optimization';

// Define the structure for a prompt analysis result
export interface PromptAnalysisResult {
  score: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  modelRecommendations: string[];
  contentRecommendations: string[];
  structureRecommendations: string[];
  seoRecommendations: string[];
  readabilityScore: number; // 0-100
  clarity: number; // 0-10
  specificity: number; // 0-10
  engagement: number; // 0-10
  persuasiveness: number; // 0-10
  completeness: number; // 0-10
}

/**
 * Analyzes a prompt and provides improvement suggestions
 * @param promptData The prompt data to analyze
 * @returns Analysis results with scores and recommendations
 */
export function analyzePrompt(promptData: PromptData): PromptAnalysisResult {
  // Initialize the analysis result
  const result: PromptAnalysisResult = {
    score: 0,
    strengths: [],
    weaknesses: [],
    improvements: [],
    modelRecommendations: [],
    contentRecommendations: [],
    structureRecommendations: [],
    seoRecommendations: [],
    readabilityScore: 0,
    clarity: 0,
    specificity: 0,
    engagement: 0,
    persuasiveness: 0,
    completeness: 0
  };

  // Check for empty or very short content
  if (!promptData.content || promptData.content.length < 10) {
    result.weaknesses.push('Prompt content is too short or empty');
    result.improvements.push('Add detailed content to your prompt');
    result.score = 10;
    return result;
  }

  // Analyze content length
  const contentLength = promptData.content.length;
  if (contentLength < 50) {
    result.weaknesses.push('Prompt content is very short');
    result.improvements.push('Expand your prompt with more details and context');
    result.specificity -= 2;
  } else if (contentLength > 500) {
    result.strengths.push('Prompt has substantial content');
    result.specificity += 2;
  }

  // Analyze title
  if (!promptData.title || promptData.title.length < 3) {
    result.weaknesses.push('Missing or very short title');
    result.improvements.push('Add a descriptive title that summarizes the prompt purpose');
    result.clarity -= 1;
  } else {
    result.strengths.push('Prompt has a title');
    result.clarity += 1;
  }

  // Analyze specificity
  const specificityScore = analyzeSpecificity(promptData);
  result.specificity += specificityScore;

  if (specificityScore > 7) {
    result.strengths.push('Prompt is highly specific and detailed');
  } else if (specificityScore < 4) {
    result.weaknesses.push('Prompt lacks specificity');
    result.improvements.push('Add more specific details, examples, or constraints');
  }

  // Analyze clarity
  const clarityScore = analyzeClarity(promptData);
  result.clarity += clarityScore;

  if (clarityScore > 7) {
    result.strengths.push('Prompt is clear and well-structured');
  } else if (clarityScore < 4) {
    result.weaknesses.push('Prompt could be clearer');
    result.improvements.push('Use simpler language and more structured formatting');
  }

  // Analyze engagement
  const engagementScore = analyzeEngagement(promptData);
  result.engagement = engagementScore;

  if (engagementScore > 7) {
    result.strengths.push('Prompt is engaging and interesting');
  } else if (engagementScore < 4) {
    result.weaknesses.push('Prompt could be more engaging');
    result.improvements.push('Add more engaging elements like questions or scenarios');
  }

  // Analyze persuasiveness
  const persuasivenessScore = analyzePersuasiveness(promptData);
  result.persuasiveness = persuasivenessScore;

  // Analyze completeness
  const completenessScore = analyzeCompleteness(promptData);
  result.completeness = completenessScore;

  if (completenessScore > 7) {
    result.strengths.push('Prompt is comprehensive and complete');
  } else if (completenessScore < 4) {
    result.weaknesses.push('Prompt is missing important elements');
    result.improvements.push('Consider adding more context, constraints, or examples');
  }

  // Analyze readability
  const readabilityScore = calculateReadabilityScore(promptData.content);
  result.readabilityScore = readabilityScore;

  if (readabilityScore > 70) {
    result.strengths.push('Prompt has good readability');
  } else if (readabilityScore < 40) {
    result.weaknesses.push('Prompt readability could be improved');
    result.improvements.push('Use shorter sentences and simpler language');
  }

  // Get model-specific recommendations
  const modelRecs = getModelRecommendations(promptData);
  result.modelRecommendations = modelRecs;

  // Add structure recommendations
  result.structureRecommendations = generateStructureRecommendations(promptData);

  // Add content recommendations
  result.contentRecommendations = generateContentRecommendations(promptData);

  // Add SEO recommendations if relevant
  if (promptData.content.toLowerCase().includes('seo') ||
      promptData.content.toLowerCase().includes('search engine') ||
      promptData.content.toLowerCase().includes('keyword')) {
    result.seoRecommendations = generateSEORecommendations(promptData);
  }

  // Add model-specific recommendations to improvements
  if (result.modelRecommendations.length > 0) {
    // Add the first two model recommendations to the improvements list
    result.modelRecommendations.slice(0, 2).forEach(rec => {
      if (!result.improvements.includes(rec)) {
        result.improvements.push(rec);
      }
    });
  }

  // Add structure recommendations to improvements
  if (result.structureRecommendations.length > 0) {
    // Add the first structure recommendation to the improvements list
    const structureRec = result.structureRecommendations[0];
    if (!result.improvements.includes(structureRec)) {
      result.improvements.push(structureRec);
    }
  }

  // Add content recommendations to improvements
  if (result.contentRecommendations.length > 0) {
    // Add the first content recommendation to the improvements list
    const contentRec = result.contentRecommendations[0];
    if (!result.improvements.includes(contentRec)) {
      result.improvements.push(contentRec);
    }
  }

  // Calculate overall score
  result.score = calculateOverallScore(
    result.clarity,
    result.specificity,
    result.engagement,
    result.persuasiveness,
    result.completeness,
    result.readabilityScore
  );

  return result;
}

/**
 * Analyzes the specificity of a prompt
 */
function analyzeSpecificity(promptData: PromptData): number {
  let score = 5; // Start with a neutral score

  // Check for specific details
  if (promptData.specificDetails && promptData.specificDetails.length > 50) {
    score += 2;
  }

  // Check for numbers and statistics
  const hasNumbers = /\d+/.test(promptData.content);
  if (hasNumbers) {
    score += 1;
  }

  // Check for specific examples
  const hasExamples = promptData.content.toLowerCase().includes('example') ||
                      promptData.content.toLowerCase().includes('instance') ||
                      promptData.content.toLowerCase().includes('such as');
  if (hasExamples) {
    score += 1;
  }

  // Check for specific constraints or requirements
  const hasConstraints = promptData.content.toLowerCase().includes('must') ||
                         promptData.content.toLowerCase().includes('should') ||
                         promptData.content.toLowerCase().includes('require');
  if (hasConstraints) {
    score += 1;
  }

  return Math.min(10, Math.max(0, score)); // Ensure score is between 0-10
}

/**
 * Analyzes the clarity of a prompt
 */
function analyzeClarity(promptData: PromptData): number {
  let score = 5; // Start with a neutral score

  // Check for clear structure
  const hasStructure = /\d+\.|\*|-|•/.test(promptData.content);
  if (hasStructure) {
    score += 2;
  }

  // Check for short paragraphs
  const paragraphs = promptData.content.split('\n\n');
  const avgParagraphLength = paragraphs.reduce((sum, p) => sum + p.length, 0) / paragraphs.length;
  if (avgParagraphLength < 100) {
    score += 1;
  }

  // Check for simple language
  const words = promptData.content.split(/\s+/);
  const longWords = words.filter(word => word.length > 6).length;
  const longWordRatio = longWords / words.length;
  if (longWordRatio < 0.2) {
    score += 1;
  }

  // Check for jargon and complex terminology
  // This is a simplified check - in a real implementation, you'd use a more sophisticated approach
  const complexTerms = ['paradigm', 'leverage', 'synergy', 'optimize', 'utilize'];
  const hasComplexTerms = complexTerms.some(term => promptData.content.toLowerCase().includes(term));
  if (!hasComplexTerms) {
    score += 1;
  }

  return Math.min(10, Math.max(0, score)); // Ensure score is between 0-10
}

/**
 * Analyzes the engagement level of a prompt
 */
function analyzeEngagement(promptData: PromptData): number {
  let score = 5; // Start with a neutral score

  // Check for questions
  const questionCount = (promptData.content.match(/\?/g) || []).length;
  if (questionCount > 0) {
    score += Math.min(2, questionCount);
  }

  // Check for storytelling elements
  const hasStoryElements = promptData.content.toLowerCase().includes('scenario') ||
                           promptData.content.toLowerCase().includes('imagine') ||
                           promptData.content.toLowerCase().includes('story');
  if (hasStoryElements) {
    score += 1;
  }

  // Check for emotional language
  const emotionalWords = ['exciting', 'amazing', 'wonderful', 'terrible', 'challenging', 'inspiring'];
  const hasEmotionalWords = emotionalWords.some(word => promptData.content.toLowerCase().includes(word));
  if (hasEmotionalWords) {
    score += 1;
  }

  // Check for personal pronouns
  const hasPersonalPronouns = /\byou\b|\byour\b|\bwe\b|\bour\b/i.test(promptData.content);
  if (hasPersonalPronouns) {
    score += 1;
  }

  return Math.min(10, Math.max(0, score)); // Ensure score is between 0-10
}

/**
 * Analyzes the persuasiveness of a prompt
 */
function analyzePersuasiveness(promptData: PromptData): number {
  let score = 5; // Start with a neutral score

  // Check if the tone is persuasive
  if (promptData.tone === 'persuasive') {
    score += 2;
  }

  // Check for persuasive language
  const persuasiveWords = ['proven', 'results', 'benefit', 'advantage', 'value', 'improve'];
  let persuasiveWordCount = 0;
  persuasiveWords.forEach(word => {
    if (promptData.content.toLowerCase().includes(word)) {
      persuasiveWordCount++;
    }
  });
  score += Math.min(2, persuasiveWordCount);

  // Check for social proof elements
  const hasSocialProof = promptData.content.toLowerCase().includes('testimonial') ||
                         promptData.content.toLowerCase().includes('review') ||
                         promptData.content.toLowerCase().includes('expert');
  if (hasSocialProof) {
    score += 1;
  }

  // Check for calls to action
  const hasCallToAction = promptData.content.toLowerCase().includes('call to action') ||
                          promptData.content.toLowerCase().includes('cta') ||
                          /\bclick\b|\bsign up\b|\bregister\b|\bdownload\b/i.test(promptData.content);
  if (hasCallToAction) {
    score += 1;
  }

  return Math.min(10, Math.max(0, score)); // Ensure score is between 0-10
}

/**
 * Analyzes the completeness of a prompt
 */
function analyzeCompleteness(promptData: PromptData): number {
  let score = 3; // Start with a low-medium score

  // Check for all essential prompt elements
  if (promptData.title) score += 1;
  if (promptData.content && promptData.content.length > 100) score += 1;
  if (promptData.model) score += 1;
  if (promptData.goal) score += 1;
  if (promptData.outputFormat) score += 1;
  if (promptData.style) score += 1;
  if (promptData.tone) score += 1;

  // Check for role-playing if enabled
  if (promptData.useRolePlaying && promptData.role) {
    score += 1;
  }

  // Check for specific details
  if (promptData.specificDetails && promptData.specificDetails.length > 50) {
    score += 1;
  }

  return Math.min(10, Math.max(0, score)); // Ensure score is between 0-10
}

/**
 * Calculates a readability score for text
 * This is a simplified implementation of readability scoring
 */
function calculateReadabilityScore(text: string): number {
  // Count sentences (simplified)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // Count words
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const wordCount = words.length;

  // Count syllables (very simplified)
  const syllableCount = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  // Calculate average sentence length
  const avgSentenceLength = wordCount / sentenceCount;

  // Calculate average syllables per word
  const avgSyllablesPerWord = syllableCount / wordCount;

  // Simplified Flesch Reading Ease calculation
  const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);

  // Normalize to 0-100 scale
  return Math.min(100, Math.max(0, fleschScore));
}

/**
 * Very simplified syllable counter
 */
function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  // Remove es, ed at the end
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');

  // Count vowel groups
  const syllableCount = word.match(/[aeiouy]{1,2}/g);
  return syllableCount ? syllableCount.length : 1;
}

/**
 * Calculates an overall score based on component scores
 */
function calculateOverallScore(
  clarity: number,
  specificity: number,
  engagement: number,
  persuasiveness: number,
  completeness: number,
  readabilityScore: number
): number {
  // Weight the components
  const weightedClarity = clarity * 2;
  const weightedSpecificity = specificity * 2;
  const weightedEngagement = engagement * 1.5;
  const weightedPersuasiveness = persuasiveness * 1.5;
  const weightedCompleteness = completeness * 2;
  const weightedReadability = readabilityScore * 0.1;

  // Calculate total score out of 100
  const totalWeight = 2 + 2 + 1.5 + 1.5 + 2 + 0.1;
  const weightedSum = weightedClarity + weightedSpecificity + weightedEngagement +
                      weightedPersuasiveness + weightedCompleteness + weightedReadability;

  return Math.round((weightedSum / totalWeight) * 10);
}

/**
 * Generates structure recommendations
 */
function generateStructureRecommendations(promptData: PromptData): string[] {
  const recommendations: string[] = [];

  // Check for clear sections
  if (!promptData.content.includes('\n\n')) {
    recommendations.push('Break your prompt into clear sections with blank lines between them');
  }

  // Check for numbered lists or bullet points
  if (!(/\d+\.|\*|-|•/).test(promptData.content)) {
    recommendations.push('Use numbered lists or bullet points to structure information');
  }

  // Check for headings
  if (!(/^#+\s|^[A-Z][A-Z\s]+:/).test(promptData.content)) {
    recommendations.push('Consider adding headings to organize your prompt');
  }

  // Check for paragraph length
  const paragraphs = promptData.content.split('\n\n');
  const longParagraphs = paragraphs.filter(p => p.length > 200).length;
  if (longParagraphs > 0) {
    recommendations.push('Break long paragraphs into smaller, more digestible chunks');
  }

  // Add general structure recommendation if needed
  if (recommendations.length === 0) {
    recommendations.push('Your prompt structure looks good');
  }

  return recommendations;
}

/**
 * Generates content recommendations
 */
function generateContentRecommendations(promptData: PromptData): string[] {
  const recommendations: string[] = [];

  // Check for examples
  if (!promptData.content.toLowerCase().includes('example') &&
      !promptData.content.toLowerCase().includes('instance') &&
      !promptData.content.toLowerCase().includes('such as')) {
    recommendations.push('Include specific examples to illustrate what you want');
  }

  // Check for context
  if (promptData.content.length < 100) {
    recommendations.push('Add more context to help the AI understand your requirements');
  }

  // Check for specific instructions
  if (!promptData.content.toLowerCase().includes('should') &&
      !promptData.content.toLowerCase().includes('must') &&
      !promptData.content.toLowerCase().includes('need')) {
    recommendations.push('Include specific instructions about what the AI should do');
  }

  // Check for output format instructions
  if (!promptData.outputFormat) {
    recommendations.push('Specify the desired output format (paragraph, bullet points, etc.)');
  }

  // Check for tone instructions
  if (!promptData.tone) {
    recommendations.push('Specify the desired tone for the response');
  }

  // Add general content recommendation if needed
  if (recommendations.length === 0) {
    recommendations.push('Your prompt content looks comprehensive');
  }

  return recommendations;
}

/**
 * Generates SEO recommendations
 */
function generateSEORecommendations(promptData: PromptData): string[] {
  const recommendations: string[] = [];

  // Check for keyword mentions
  if (!promptData.content.toLowerCase().includes('keyword')) {
    recommendations.push('Specify primary and secondary keywords for SEO content');
  }

  // Check for search intent
  if (!promptData.content.toLowerCase().includes('intent') &&
      !promptData.content.toLowerCase().includes('searching for')) {
    recommendations.push('Clarify the search intent (informational, transactional, etc.)');
  }

  // Check for content structure guidance
  if (!promptData.content.toLowerCase().includes('heading') &&
      !promptData.content.toLowerCase().includes('h1') &&
      !promptData.content.toLowerCase().includes('h2')) {
    recommendations.push('Include guidance on heading structure (H1, H2, H3) for SEO content');
  }

  // Check for meta description
  if (!promptData.content.toLowerCase().includes('meta description')) {
    recommendations.push('Request a meta description to be included with SEO content');
  }

  // Check for word count guidance
  if (!(/\d+\s*words/).test(promptData.content)) {
    recommendations.push('Specify a target word count for SEO content');
  }

  return recommendations;
}
