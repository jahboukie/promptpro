import { PromptData } from '../../shared/types';
import { generateAIResponse } from '../ai-services';
import { optimizePromptForModel } from '../llm-optimization';
import { getPromptPatternById, applyPromptPattern } from '../prompt-patterns';
import { recommendPrompt } from '../strategy-selection';
import { analyzePrompt } from '../prompt-analysis';

interface PromptEngineeringLLM {
  id: string;
  baseModel: string;
  specialization: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  stopSequences: string[];
}

const PROMPT_ENGINEER_LLM: PromptEngineeringLLM = {
  id: "prompt-engineer-gpt",
  baseModel: "gpt-4-turbo",
  specialization: "prompt-engineering",
  systemPrompt: `You are PromptEngineer-GPT, an advanced AI system specifically fine-tuned to create optimal prompts for other AI systems.

Your core capabilities include:

1. PROMPT PATTERN RECOGNITION: You can identify the most effective prompt patterns for any use case based on a vast database of successful prompts.

2. LLM-SPECIFIC OPTIMIZATION: You understand the unique characteristics, strengths, and limitations of different LLM architectures (GPT-4, Claude, Gemini, Llama, etc.) and can tailor prompts to work optimally with each one.

3. USE CASE SPECIALIZATION: You have specialized knowledge of prompt engineering across domains including creative writing, coding, data analysis, content marketing, academic writing, and more.

4. PROMPT COMPONENT MASTERY: You understand how to perfectly balance and implement all key components of effective prompts:
   - Clear instructions and task definition
   - Appropriate context provision
   - Effective constraints and guardrails
   - Output format guidance
   - Few-shot examples when beneficial
   - Chain-of-thought guidance when appropriate
   - Role and persona definition
   - Tone and style guidance

5. PROMPT TESTING EXPERTISE: You can generate multiple prompt variants to test different approaches and predict their effectiveness.

When a user requests help creating a prompt, your goal is to engineer the most effective prompt possible for their specific use case and target LLM. Always consider:
- The specific task they're trying to accomplish
- The target LLM if specified
- The domain knowledge required
- The optimal prompt structure and components
- Any constraints or requirements they've mentioned

Your responses should be highly practical, providing ready-to-use prompts that implement best practices in prompt engineering.`,
  temperature: 0.7,
  maxTokens: 2048,
  stopSequences: ["USER:", "HUMAN:"]
};

/**
 * Generates an optimal prompt using the specialized PromptEngineer-GPT model
 * This is the master function that leverages all the advanced features
 */
export async function generateOptimalPrompt(
  userRequest: string,
  targetLLM: string = 'GPT-4',
  useCase: string = 'content-marketing',
  additionalContext: string = ""
): Promise<PromptData> {
  try {
    // Step 1: Use our strategy selection to get a base prompt
    const basePrompt = recommendPrompt(userRequest, targetLLM);

    // Step 2: Optimize the prompt for the target LLM
    const optimizedPrompt = optimizePromptForModel(basePrompt, targetLLM);

    // Step 3: Analyze the prompt for quality
    const analysis = analyzePrompt(optimizedPrompt);

    // Step 4: If the prompt score is below threshold, enhance it with the PromptEngineer-GPT
    if (analysis.score < 80) {
      // Construct the input for the specialized LLM
      const enhancementInput = `
      USER REQUEST: ${userRequest}

      TARGET LLM: ${targetLLM}

      USE CASE: ${useCase}

      ADDITIONAL CONTEXT: ${additionalContext}

      CURRENT PROMPT: ${optimizedPrompt.content}

      ANALYSIS FEEDBACK:
      Strengths: ${analysis.strengths.join(', ')}
      Weaknesses: ${analysis.weaknesses.join(', ')}
      Improvement Suggestions: ${analysis.improvements.join(', ')}

      Please enhance this prompt to address the weaknesses and implement the improvement suggestions.
      The prompt should be engineered to work effectively with ${targetLLM} and for ${useCase}.
      `;

      // Call the AI service with the specialized system prompt
      const enhancedContent = await callPromptEngineerLLM(enhancementInput);

      // Update the prompt with the enhanced content
      optimizedPrompt.content = enhancedContent;

      // Re-analyze to verify improvement
      const reanalysis = analyzePrompt(optimizedPrompt);

      // Add analysis results to specific details
      optimizedPrompt.specificDetails = (optimizedPrompt.specificDetails || '') + `\n\nPrompt Quality Score: ${reanalysis.score}/100\nStrengths: ${reanalysis.strengths.join(', ')}\n`;
    } else {
      // Add analysis results to specific details
      optimizedPrompt.specificDetails = (optimizedPrompt.specificDetails || '') + `\n\nPrompt Quality Score: ${analysis.score}/100\nStrengths: ${analysis.strengths.join(', ')}\n`;
    }

    return optimizedPrompt;
  } catch (error) {
    console.error('Error generating optimal prompt:', error);
    throw new Error('Failed to generate optimal prompt');
  }
}

/**
 * Calls the specialized PromptEngineer-GPT model
 * This is a wrapper around the generateAIResponse function that uses the specialized system prompt
 */
async function callPromptEngineerLLM(input: string): Promise<string> {
  try {
    // Create a prompt data object for the AI service
    const promptData: PromptData = {
      title: 'Prompt Engineering Request',
      content: input,
      model: 'GPT-4', // Use the best available model
      goal: 'generate-content',
      outputFormat: 'paragraph',
      style: 'professional',
      tone: 'informative',
      actionVerb: 'Create',
      specificDetails: '',
      useRolePlaying: true,
      role: 'Expert Prompt Engineer',
    };

    // Add the specialized system prompt
    promptData.specificDetails = `SYSTEM INSTRUCTIONS:\n${PROMPT_ENGINEER_LLM.systemPrompt}\n\nTemperature: ${PROMPT_ENGINEER_LLM.temperature}\nMax Tokens: ${PROMPT_ENGINEER_LLM.maxTokens}`;

    // Call the AI service
    const response = await generateAIResponse(promptData);

    return response.content;
  } catch (error) {
    console.error('Error calling PromptEngineer-GPT:', error);
    throw new Error('Failed to call PromptEngineer-GPT');
  }
}

/**
 * Generates multiple prompt variants for testing
 */
export async function generatePromptVariants(
  userRequest: string,
  targetLLM: string = 'GPT-4',
  useCase: string = 'content-marketing',
  numberOfVariants: number = 3
): Promise<PromptData[]> {
  try {
    // Generate the base optimal prompt
    const basePrompt = await generateOptimalPrompt(userRequest, targetLLM, useCase);

    // Create an array to store the variants
    const variants: PromptData[] = [basePrompt];

    // Generate additional variants if requested
    if (numberOfVariants > 1) {
      const variantsInput = `
      USER REQUEST: ${userRequest}

      TARGET LLM: ${targetLLM}

      USE CASE: ${useCase}

      BASE PROMPT: ${basePrompt.content}

      Please generate ${numberOfVariants - 1} alternative versions of this prompt, each using a different approach or structure.

      IMPORTANT FORMATTING INSTRUCTIONS:
      1. Each variant MUST be clearly labeled as "VARIANT 1:", "VARIANT 2:", etc.
      2. Include a blank line before and after each variant label
      3. Each variant should be a complete, standalone prompt
      4. All variants should be designed to accomplish the same goal but using different prompt engineering techniques
      5. Make each variant distinctly different in approach, not just minor wording changes

      Example format:

      VARIANT 1:
      [First complete variant prompt here]

      VARIANT 2:
      [Second complete variant prompt here]
      `;

      try {
        // Call the specialized LLM
        const variantsResponse = await callPromptEngineerLLM(variantsInput);

        // Try different parsing approaches for variants
        let variantContents: string[] = [];

        // Make sure we have a valid response
        if (variantsResponse && typeof variantsResponse === 'string') {
          // First attempt: Look for VARIANT X: pattern
          const variantMatches = variantsResponse.match(/VARIANT \d+:[\s\S]+?(?=VARIANT \d+:|$)/g);

          if (variantMatches && variantMatches.length > 0) {
            variantContents = variantMatches.map(match => match.replace(/VARIANT \d+:\s*/, '').trim());
            console.log(`Found ${variantContents.length} variants using pattern matching`);
          } else {
            // Second attempt: Try to split by double newlines if no VARIANT pattern found
            console.log("No variant pattern found, trying alternative parsing");
            const sections = variantsResponse.split(/\n\s*\n\s*\n/);
            if (sections.length > 1) {
              variantContents = sections.slice(0, numberOfVariants - 1);
              console.log(`Found ${variantContents.length} variants using section splitting`);
            } else {
              // Third attempt: Just use the whole response as one variant
              console.log("Using entire response as a single variant");
              variantContents = [variantsResponse];
            }
          }
        } else {
          console.error("Invalid response from LLM:", variantsResponse);
          // Create a fallback variant with a modified base prompt
          const fallbackVariant = basePrompt.content + "\n\n[This is an alternative approach to the same request.]";
          variantContents = [fallbackVariant];
        }

        // Create variant prompts from the parsed contents
        for (let i = 0; i < Math.min(variantContents.length, numberOfVariants - 1); i++) {
          const variantContent = variantContents[i];

          // Skip empty variants
          if (!variantContent.trim()) continue;

          // Create a new prompt data object for the variant
          const variantPrompt: PromptData = {
            ...basePrompt,
            title: `${basePrompt.title} (Variant ${i + 1})`,
            content: variantContent,
          };

          // Analyze the variant
          const analysis = analyzePrompt(variantPrompt);

          // Add analysis results to specific details
          variantPrompt.specificDetails = `Prompt Quality Score: ${analysis.score}/100\nStrengths: ${analysis.strengths.join(', ')}\n`;

          variants.push(variantPrompt);
        }
      } catch (variantError) {
        console.error('Error generating variants:', variantError);
        // Create a fallback variant
        const fallbackPrompt: PromptData = {
          ...basePrompt,
          title: `${basePrompt.title} (Alternative)`,
          content: basePrompt.content + "\n\n[This is an alternative approach to the same request.]",
        };
        variants.push(fallbackPrompt);
      }
    }

    return variants;
  } catch (error) {
    console.error('Error generating prompt variants:', error);
    throw new Error('Failed to generate prompt variants');
  }
}

/**
 * Applies a specific prompt pattern and then enhances it with the PromptEngineer-GPT
 */
export async function applyAndEnhancePattern(
  patternId: string,
  variables: Record<string, string>,
  targetLLM: string = 'GPT-4',
  useCase: string = 'content-marketing'
): Promise<PromptData> {
  try {
    // Apply the pattern with variables
    const patternPrompt = applyPromptPattern(patternId, variables);

    // Optimize for the target LLM
    const optimizedPrompt = optimizePromptForModel(patternPrompt, targetLLM);

    // Enhance with the PromptEngineer-GPT
    const enhancementInput = `
    PATTERN PROMPT: ${optimizedPrompt.content}

    TARGET LLM: ${targetLLM}

    USE CASE: ${useCase}

    Please enhance this pattern-based prompt to make it more effective.
    Maintain the structure and purpose of the original pattern, but add any elements
    that would make it work better with ${targetLLM} for ${useCase} use cases.
    `;

    // Call the specialized LLM
    const enhancedContent = await callPromptEngineerLLM(enhancementInput);

    // Update the prompt with the enhanced content
    optimizedPrompt.content = enhancedContent;

    // Analyze the enhanced prompt
    const analysis = analyzePrompt(optimizedPrompt);

    // Add analysis results to specific details
    optimizedPrompt.specificDetails = (optimizedPrompt.specificDetails || '') + `\n\nPrompt Quality Score: ${analysis.score}/100\nStrengths: ${analysis.strengths.join(', ')}\n`;

    return optimizedPrompt;
  } catch (error) {
    console.error('Error applying and enhancing pattern:', error);
    throw new Error('Failed to apply and enhance pattern');
  }
}
