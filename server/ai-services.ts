import { OPENAI_API_KEY, XAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY } from './config';
import { PromptData } from '../shared/types';
import OpenAI from 'openai';
import { OpenAI as XAI } from 'openai';

// Initialize OpenAI client
let openaiClient: OpenAI | null = null;
if (OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
}

// Initialize xAI client (Grok)
let xaiClient: XAI | null = null;
if (XAI_API_KEY) {
  xaiClient = new OpenAI({
    baseURL: 'https://api.x.ai/v1',
    apiKey: XAI_API_KEY,
  });
}

// Mock function for Anthropic (Claude) - would use actual SDK in production
const generateWithClaude = async (prompt: string): Promise<string> => {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  // In a real implementation, this would use the Anthropic SDK
  console.log('Generating with Claude:', prompt.substring(0, 50) + '...');

  // Generate a more realistic mock response based on the prompt
  const mockResponse = generateMockResponse(prompt, 'Claude');
  return mockResponse;
};

// Mock function for Google Gemini - would use actual SDK in production
const generateWithGemini = async (prompt: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  // In a real implementation, this would use the Google AI SDK
  console.log('Generating with Gemini:', prompt.substring(0, 50) + '...');

  // Generate a more realistic mock response based on the prompt
  const mockResponse = generateMockResponse(prompt, 'Gemini');
  return mockResponse;
};

// Helper function to generate a more realistic mock response based on the prompt
const generateMockResponse = (prompt: string, model: string): string => {
  // Extract the title or main topic from the prompt
  const titleMatch = prompt.match(/title[d:]?\s*["']?([^"'\n]+)["']?/i);
  const topicMatch = prompt.match(/(?:about|on|for|regarding)\s+["']?([^"'\n.,]+)/i);

  const title = titleMatch ? titleMatch[1].trim() :
                topicMatch ? topicMatch[1].trim() :
                'the requested topic';

  // Create a mock response that reflects the actual prompt content
  return `Blog Post Title: "${title}"\n\n` +
    `This is a mock response from ${model} based on your prompt about ${title}.\n\n` +
    `In a production environment, this would generate a complete response using the ${model} API.\n\n` +
    `Your prompt requested content about: ${title}\n\n` +
    `Here's a brief outline of what the full response would include:\n\n` +
    `1. Introduction to ${title}\n` +
    `2. Key points about ${title}\n` +
    `3. Analysis of trends related to ${title}\n` +
    `4. Practical applications or examples\n` +
    `5. Conclusion and next steps\n\n` +
    `The full response would be approximately 1,500 words of high-quality content.`;
};

// Generate response based on model
export async function generateAIResponse(promptData: PromptData): Promise<any> {
  const { content, model, goal, outputFormat, style, tone, actionVerb, specificDetails, useRolePlaying, role } = promptData;

  // Construct a well-formatted prompt
  let formattedPrompt = content;

  // Replace any remaining template variables with default values
  formattedPrompt = replaceTemplateVariables(formattedPrompt, promptData.title || '');

  // Add role-playing context if enabled
  if (useRolePlaying && role) {
    formattedPrompt = `You are a ${role}. ${formattedPrompt}`;
  }

  // Add specific details if provided
  if (specificDetails) {
    formattedPrompt += `\n\nAdditional details: ${specificDetails}`;
  }

  // Add formatting instructions
  if (outputFormat) {
    formattedPrompt += `\n\nPlease format your response as ${outputFormat}.`;
  }

  // Add style and tone instructions
  if (style || tone) {
    formattedPrompt += `\n\nUse a ${style || 'casual'} style with a ${tone || 'informative'} tone.`;
  }

  console.log('Generating response with model:', model);
  console.log('Prompt:', formattedPrompt.substring(0, 100) + '...');

  try {
    // Route to the appropriate AI service based on the model
    if (model.toLowerCase().includes('gpt')) {
      if (!openaiClient) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await openaiClient.chat.completions.create({
        model: model.toLowerCase(),
        messages: [{ role: 'user', content: formattedPrompt }],
        max_tokens: 1000,
      });

      return response.choices[0].message.content || '';
    }
    else if (model.toLowerCase().includes('grok')) {
      if (!xaiClient) {
        throw new Error('xAI API key not configured');
      }

      const response = await xaiClient.chat.completions.create({
        model: 'grok-2-1212',
        messages: [{ role: 'user', content: formattedPrompt }],
        max_tokens: 1000,
      });

      return response.choices[0].message.content || '';
    }
    else if (model.toLowerCase().includes('claude')) {
      return await generateWithClaude(formattedPrompt);
    }
    else if (model.toLowerCase().includes('gemini')) {
      return await generateWithGemini(formattedPrompt);
    }
    else {
      // Default to a mock response if model is not recognized
      return generateMockResponse(formattedPrompt, model);
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

/**
 * Replaces any remaining template variables with default values
 */
function replaceTemplateVariables(content: string, title: string): string {
  // Extract the topic from the title
  const topicMatch = title.match(/(?:about|on|for|regarding|titled?)\s+["']?([^"'\n.,]+)/i);
  const topic = topicMatch ? topicMatch[1].trim() : title;

  // Extract potential LLM name from the title
  const llmMatch = title.match(/(?:for|using|with|in)\s+["']?([A-Za-z0-9-]+(?:\s+[A-Za-z0-9]+)?(?:\s+[A-Za-z0-9]+)?)(?:\s+LLMs?|\s+models?|\s+AI)/i);
  let targetLLM = llmMatch ? llmMatch[1].trim() : 'GPT-4';

  // If the title contains "different LLMs", extract the specific LLM mentioned earlier
  if (title.toLowerCase().includes('different llm') || title.toLowerCase().includes('different ai model')) {
    const specificLLMMatch = title.match(/(?:for|using|with|in)\s+["']?(GPT-4|GPT-3\.5|Claude|Gemini|Llama|Mistral|Bard|PaLM)(?:\s+|$)/i);
    if (specificLLMMatch) {
      targetLLM = specificLLMMatch[1].trim();
    }
  }

  // Define default values for common template variables
  const defaultValues: Record<string, string> = {
    // Basic blog post variables
    title: topic,
    audience: 'content creators and marketers',
    topic: topic,
    goal: 'educating the audience and establishing authority',
    hook: 'a compelling statistic or question',
    keyTakeaway: 'the importance of the topic',
    desiredAction: 'implement the strategies discussed',
    tone: 'conversational yet informative',
    primaryKeyword: topic,
    secondaryKeywords: 'related industry terms',

    // Enhanced blog outline variables
    industry: 'artificial intelligence and content creation',
    statistic: 'Studies show that well-engineered prompts can improve AI response relevance by up to 70%',
    mainSection1: 'Understanding the Fundamentals',
    mainSection2: 'Key Strategies and Techniques',
    mainSection3: 'Practical Applications',
    mainSection4: 'Future Trends and Developments',
    point1_1: 'Core concepts and terminology',
    point1_2: 'Historical development and context',
    point1_3: 'Current state of the technology',
    point2_1: 'Best practices and methodologies',
    point2_2: 'Common challenges and solutions',
    point2_3: 'Tools and resources available',
    point3_1: 'Case study from the industry',
    point3_2: 'Implementation steps and guidelines',
    point3_3: 'Measuring success and ROI',

    // LLM-specific prompt engineering variables
    targetLLM: targetLLM,
    purpose: 'creating high-quality content',
    modelName: targetLLM,

    // Social media variables
    'product/service': 'our AI content platform',
    duration: '4 weeks',
    postsPerPlatform: '5-7',
    valueProposition: 'increased productivity and content quality',
    twitterFocus: 'quick tips and industry news',
    instagramEmphasis: 'visual results and success stories',
    facebookFocus: 'community building and user testimonials',
    linkedinHashtags: '#AIWriting #ContentCreation #ProductivityTips',
    twitterHashtags: '#AI #ContentMarketing #WritingTips',
    instagramHashtags: '#ContentCreators #AITools #DigitalMarketing',
    brandVoice: 'helpful, innovative, and approachable',

    // Email sequence variables
    numberOfEmails: '5',
    funnelStage: 'consideration',
    conversionGoal: 'signing up for a free trial',
    painPoint: 'time-consuming content creation process',
    valueEvidence: 'case studies and testimonials',
    commonObjection: 'concerns about AI-generated content quality',
    socialProofExample: 'success stories from similar businesses',
    urgencyElement: 'limited-time discount offer',
    incentive: 'extended trial period',
    personalizationElements: 'name, company, and industry',
    length: 'medium-length (300-500 words)'
  };

  // Replace any remaining template variables with default values
  let result = content;
  const templateVars = result.match(/{{([^}]+)}}/g) || [];

  templateVars.forEach(match => {
    const varName = match.slice(2, -2);
    const defaultValue = defaultValues[varName] || `[${varName}]`;
    result = result.replace(new RegExp(`{{${varName}}}`, 'g'), defaultValue);
  });

  return result;
}
