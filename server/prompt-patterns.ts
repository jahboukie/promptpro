import { PromptData } from '../shared/types';

// Define the structure for a prompt pattern
export interface PromptPattern {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  defaultParams: Partial<PromptData>;
  exampleUses: string[];
  bestPractices: string[];
  compatibleModels: string[];
  contentTypes: string[];
  marketingGoals: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  effectiveness: number; // 1-10 rating
  tags: string[];
}

// Content marketing specific prompt patterns
export const PROMPT_PATTERNS: PromptPattern[] = [
  {
    id: 'blog-outline',
    name: 'Blog Post Outline',
    description: 'Creates a structured outline for a blog post with sections and key points',
    category: 'blog',
    template: `You are an expert content strategist specializing in {{industry}}. Your task is to create a comprehensive, engaging, and technically accurate blog post outline titled "{{title}}" targeting {{audience}}. The post should focus on {{topic}} with the goal of {{goal}}.

Create a detailed outline following this specific structure:

I. Introduction
- Begin with a thought-provoking question about {{hook}}
- Include a specific statistic: "{{statistic}}" with source attribution (e.g., "According to [credible source]...")
- Establish authority on the subject with a brief explanation of why this topic matters to the audience
- Clearly state the post's purpose and what specific value readers will gain

II. Background/Context (Setting the Stage)
- Define key terms and concepts in accessible terms while maintaining technical accuracy
- Provide necessary historical or contextual information about {{topic}}
- Explain why this topic is relevant right now with current trends or developments
- Address common misconceptions or challenges related to the topic

III. Main Section 1: {{mainSection1}}
- Key point 1: {{point1_1}} with supporting evidence from specific research or studies
- Key point 2: {{point1_2}} with a concrete real-world example from a named organization
- Key point 3: {{point1_3}} with practical application steps readers can implement
- Transition to next section with a clear connection to the following topic

IV. Main Section 2: {{mainSection2}}
- Key point 1: {{point2_1}} with supporting evidence from specific research or studies
- Key point 2: {{point2_2}} with a concrete real-world example from a named organization
- Key point 3: {{point2_3}} with practical application steps readers can implement
- Transition to next section with a clear connection to the following topic

V. Main Section 3: {{mainSection3}}
- Key point 1: {{point3_1}} with supporting evidence from specific research or studies
- Key point 2: {{point3_2}} with a concrete real-world example from a named organization
- Key point 3: {{point3_3}} with practical application steps readers can implement
- Transition to next section with a clear connection to the following topic

VI. Practical Application/Case Study
- Detailed example of a specific company/organization that successfully implemented strategies related to {{topic}}
- Concrete lessons learned or best practices derived from this case study
- Measurable results with specific metrics (e.g., "increased conversion by 27%", "reduced costs by $50,000")
- Analysis of why these strategies worked and how readers can adapt them

VII. Conclusion
- Synthesize 3-4 key takeaways emphasizing {{keyTakeaway}}
- Reinforce the main value proposition for the reader with a summary of benefits
- End with a forward-looking statement about future developments in this area

VIII. Call-to-Action
- Encourage readers to {{desiredAction}} with specific, actionable next steps
- Suggest 2-3 specific resources (tools, guides, courses) for further learning
- Invite engagement through comments or sharing with a specific question to prompt discussion

FORMATTING AND SEO GUIDANCE:
- The blog post should be approximately 1,500-2,000 words
- Written in a {{tone}} tone that resonates with {{audience}}
- Optimize for SEO with the primary keyword "{{primaryKeyword}}" (use 3-5 times)
- Include secondary keywords: {{secondaryKeywords}} (use each 1-2 times)
- Use descriptive H2 and H3 headings that include keywords where natural
- Include 2-3 relevant statistics from reputable sources with proper attribution
- Recommend using 1-2 relevant images, infographics, or diagrams to illustrate key concepts
- Format with bullet points, numbered lists, and occasional bolded text for skimmability
- Keep paragraphs short (3-5 sentences maximum) for better readability

This outline should provide a comprehensive framework for creating an authoritative, engaging, and valuable blog post that serves both the reader's needs and your content marketing goals.`,
    defaultParams: {
      title: 'Blog Post Outline',
      model: 'GPT-4',
      goal: 'generate-content',
      outputFormat: 'bullet-points',
      style: 'professional',
      tone: 'informative',
      actionVerb: 'Create',
      useRolePlaying: true,
      role: 'Expert Content Strategist'
    },
    exampleUses: [
      'Planning a series of blog posts for a content calendar',
      'Breaking down complex topics into digestible sections',
      'Ensuring comprehensive coverage of a subject'
    ],
    bestPractices: [
      'Be specific about your target audience',
      'Include clear goals for the blog post',
      'Specify SEO keywords for better optimization',
      'Mention the desired tone and style'
    ],
    compatibleModels: ['GPT-4', 'GPT-3.5 Turbo', 'Claude 3 Opus', 'Claude 3 Sonnet'],
    contentTypes: ['Blog Post', 'Article', 'Guide'],
    marketingGoals: ['Brand Awareness', 'Education', 'SEO', 'Thought Leadership'],
    difficulty: 'beginner',
    effectiveness: 9,
    tags: ['blog', 'outline', 'content planning', 'SEO']
  },
  {
    id: 'social-media-campaign',
    name: 'Social Media Campaign',
    description: 'Generates a multi-platform social media campaign with tailored content for each platform',
    category: 'social-media',
    template: `Create a comprehensive social media campaign for {{product/service}} targeting {{audience}}. The campaign should run for {{duration}} with the goal of {{goal}}.

For each of the following platforms, create {{postsPerPlatform}} posts:

1. LinkedIn:
   - Professional tone focusing on {{valueProposition}}
   - Include statistics and industry insights
   - Use hashtags: {{linkedinHashtags}}

2. Twitter/X:
   - Concise, engaging messages under 280 characters
   - Focus on {{twitterFocus}}
   - Use hashtags: {{twitterHashtags}}

3. Instagram:
   - Visual-focused content descriptions
   - Emphasize {{instagramEmphasis}}
   - Include caption ideas and hashtag suggestions: {{instagramHashtags}}

4. Facebook:
   - Community-oriented content focusing on {{facebookFocus}}
   - Include conversation starters and engagement questions
   - Suggest content types (polls, videos, images)

For each platform, include:
- Best times to post
- Content themes
- Call-to-action suggestions
- Engagement strategies

The campaign should maintain brand voice characteristics: {{brandVoice}} while adapting to each platform's unique audience.`,
    defaultParams: {
      title: 'Social Media Campaign',
      model: 'GPT-4',
      goal: 'generate-content',
      outputFormat: 'bullet-points',
      style: 'creative',
      tone: 'engaging',
      actionVerb: 'Create',
      useRolePlaying: true,
      role: 'Social Media Marketing Strategist'
    },
    exampleUses: [
      'Launching a new product across multiple platforms',
      'Creating a cohesive brand message adapted to different channels',
      'Planning a month of social media content'
    ],
    bestPractices: [
      'Specify your target audience demographics',
      'Include your brand voice characteristics',
      'Mention specific campaign goals',
      'Provide relevant hashtags for each platform'
    ],
    compatibleModels: ['GPT-4', 'GPT-3.5 Turbo', 'Claude 3 Opus', 'Jasper', 'CopyAI'],
    contentTypes: ['Social Media', 'Campaign', 'Multi-platform'],
    marketingGoals: ['Brand Awareness', 'Engagement', 'Lead Generation', 'Product Launch'],
    difficulty: 'intermediate',
    effectiveness: 8,
    tags: ['social media', 'campaign', 'multi-platform', 'content calendar']
  },
  {
    id: 'email-sequence',
    name: 'Email Marketing Sequence',
    description: 'Creates a sequence of emails for a nurture campaign or sales funnel',
    category: 'email',
    template: `Create a {{numberOfEmails}}-email sequence for {{purpose}} targeting {{audience}} at the {{funnelStage}} stage of the customer journey. The sequence should guide recipients toward {{conversionGoal}}.

For each email in the sequence, provide:

1. Subject line (with 2-3 variations)
2. Preview text
3. Email body including:
   - Opening hook
   - Main content focusing on {{valueProposition}}
   - Supporting points (benefits, features, testimonials, etc.)
   - Clear call-to-action
4. Recommended send time and day
5. Follow-up strategy if no response

The sequence should follow this progression:
- Email 1: Introduction focusing on {{painPoint}}
- Email 2: Value demonstration through {{valueEvidence}}
- Email 3: Overcome objection regarding {{commonObjection}}
- Email 4: Social proof highlighting {{socialProofExample}}
- Email 5: Urgency/scarcity with {{urgencyElement}}
- Email 6: Final call-to-action with {{incentive}}

The emails should be written in a {{tone}} tone, be {{length}} in length, and include {{personalizationElements}} for personalization.`,
    defaultParams: {
      title: 'Email Marketing Sequence',
      model: 'GPT-4',
      goal: 'generate-content',
      outputFormat: 'paragraph',
      style: 'persuasive',
      tone: 'conversational',
      actionVerb: 'Create',
      useRolePlaying: true,
      role: 'Email Marketing Specialist'
    },
    exampleUses: [
      'Creating a welcome sequence for new subscribers',
      'Developing a sales funnel for a product launch',
      'Building a re-engagement campaign for inactive customers'
    ],
    bestPractices: [
      'Clearly define your audience and their pain points',
      'Include specific conversion goals',
      'Mention personalization elements',
      'Specify the desired tone and length'
    ],
    compatibleModels: ['GPT-4', 'Claude 3 Opus', 'Claude 3 Sonnet', 'Jasper', 'CopyAI'],
    contentTypes: ['Email', 'Sequence', 'Nurture Campaign'],
    marketingGoals: ['Lead Nurturing', 'Conversion', 'Customer Retention', 'Sales'],
    difficulty: 'advanced',
    effectiveness: 9,
    tags: ['email', 'sequence', 'funnel', 'nurture']
  },
  {
    id: 'product-description',
    name: 'E-commerce Product Description',
    description: 'Creates compelling product descriptions for online stores',
    category: 'e-commerce',
    template: `Create a compelling product description for {{productName}}, a {{productType}} designed for {{targetCustomer}}. The description should highlight the following:

1. A captivating headline that emphasizes {{uniqueSellingPoint}}
2. An opening paragraph that hooks the reader by addressing {{painPoint}}
3. Feature-benefit section that includes:
   {{feature1}} → {{benefit1}}
   {{feature2}} → {{benefit2}}
   {{feature3}} → {{benefit3}}
   {{feature4}} → {{benefit4}}
4. Technical specifications presented in a scannable format
5. Social proof element mentioning {{socialProofExample}}
6. Urgency/scarcity element: {{urgencyElement}}
7. Clear call-to-action: {{callToAction}}

The description should be {{length}} words, written in a {{tone}} tone, and optimized for the primary keyword "{{primaryKeyword}}" and secondary keywords {{secondaryKeywords}}.

Include sensory words that appeal to {{senses}} and emotional triggers related to {{emotions}}.`,
    defaultParams: {
      title: 'E-commerce Product Description',
      model: 'GPT-4',
      goal: 'generate-content',
      outputFormat: 'paragraph',
      style: 'persuasive',
      tone: 'enthusiastic',
      actionVerb: 'Create',
      useRolePlaying: true,
      role: 'E-commerce Copywriter'
    },
    exampleUses: [
      'Creating descriptions for new products',
      'Refreshing existing product listings',
      'Developing variant descriptions for A/B testing'
    ],
    bestPractices: [
      'Focus on benefits, not just features',
      'Include specific technical specifications',
      'Use sensory language to help customers imagine using the product',
      'Incorporate SEO keywords naturally'
    ],
    compatibleModels: ['GPT-4', 'GPT-3.5 Turbo', 'Claude 3 Opus', 'Jasper', 'CopyAI'],
    contentTypes: ['Product Description', 'E-commerce Copy', 'Sales Copy'],
    marketingGoals: ['Conversion', 'Sales', 'SEO'],
    difficulty: 'intermediate',
    effectiveness: 8,
    tags: ['e-commerce', 'product description', 'sales copy', 'conversion']
  },
  {
    id: 'seo-article',
    name: 'SEO-Optimized Article',
    description: 'Creates in-depth, SEO-friendly articles designed to rank for specific keywords',
    category: 'seo',
    template: `Create a comprehensive, SEO-optimized article about {{topic}} targeting the primary keyword "{{primaryKeyword}}" and secondary keywords {{secondaryKeywords}}. The article should be {{wordCount}} words and designed to rank well in search engines while providing valuable information to {{targetAudience}}.

The article should include:

1. An engaging introduction that includes the primary keyword and addresses {{painPoint}}
2. {{numberOfSubheadings}} subheadings (H2s) that cover key aspects of the topic
3. At least {{numberOfH3s}} H3 subheadings under relevant H2s
4. A featured snippet-optimized section answering: "{{snippetQuestion}}"
5. {{numberOfBulletLists}} bullet or numbered lists to improve scannability
6. Data and statistics from {{dataSources}} to support key points
7. Expert quotes or insights about {{expertTopics}}
8. Internal linking opportunities to {{relatedContent}}
9. External links to {{authorityReferences}}
10. A conclusion that summarizes key points and includes a call-to-action: {{callToAction}}

The content should be written in a {{tone}} tone, with a {{style}} style, and should be factually accurate and up-to-date as of {{currentDate}}. Include meta description and title tag suggestions optimized for CTR.`,
    defaultParams: {
      title: 'SEO-Optimized Article',
      model: 'GPT-4',
      goal: 'generate-content',
      outputFormat: 'paragraph',
      style: 'informative',
      tone: 'authoritative',
      actionVerb: 'Create',
      useRolePlaying: true,
      role: 'SEO Content Strategist'
    },
    exampleUses: [
      'Creating cornerstone content for important keywords',
      'Developing comprehensive guides on industry topics',
      'Building authoritative resource pages'
    ],
    bestPractices: [
      'Research keywords thoroughly before creating the prompt',
      'Include specific questions to target featured snippets',
      'Specify word count based on competing articles',
      'Include current date for freshness'
    ],
    compatibleModels: ['GPT-4', 'Claude 3 Opus', 'Claude 3 Sonnet', 'Jasper'],
    contentTypes: ['Article', 'Blog Post', 'Guide', 'Resource'],
    marketingGoals: ['SEO', 'Thought Leadership', 'Traffic Generation', 'Lead Generation'],
    difficulty: 'advanced',
    effectiveness: 9,
    tags: ['seo', 'article', 'long-form', 'keyword optimization']
  },
  {
    id: 'llm-prompt-engineering',
    name: 'LLM-Specific Prompt Engineering',
    description: 'Creates optimized prompts tailored for specific LLM architectures',
    category: 'ai',
    template: `You are an expert prompt engineer with deep knowledge of different LLM architectures and their unique characteristics. Your task is to create a highly effective prompt for {{targetLLM}} that will generate content about {{topic}} for {{purpose}}.

PART 1: LLM ANALYSIS (Technical Foundation)
Provide a detailed analysis of {{targetLLM}}'s unique characteristics, including:
- Key strengths and capabilities with specific examples of content types it excels at
- Potential limitations or weaknesses with strategies to mitigate them
- Optimal input formatting preferences based on the model's architecture
- Response tendencies and patterns observed in this model's outputs
- Cite specific research or documentation about this model where available

PART 2: PROMPT STRUCTURE (Framework Design)
Create a comprehensive prompt with these components:

1. ROLE ASSIGNMENT
- Assign the LLM a specific expert role related to {{topic}} that leverages {{targetLLM}}'s strengths
- Explain why this role is particularly effective for this model
- Include any relevant credentials or expertise the role should embody

2. CONTEXT SETTING
- Provide essential background information about {{topic}} that the LLM needs to generate high-quality content
- Include specific facts, data points, or references that should be incorporated
- Establish the scope and boundaries of the knowledge required

3. TASK DEFINITION
Clearly define what the LLM should generate, with specific parameters for:
- Content type (article, analysis, script, etc.) with exact specifications
- Length requirements (word count, section count, time to read)
- Tone and style guidance with concrete examples
- Audience characteristics including knowledge level, interests, and needs
- Primary objective and secondary goals of the content

4. FORMAT SPECIFICATION
Define the exact output format using {{targetLLM}}'s preferred formatting approaches:
- Structure (headings, sections, bullet points) with specific hierarchy
- Required components or elements with their order and relative importance
- Any specific notation or markdown preferences
- Visual elements or formatting considerations

5. CONSTRAINTS AND GUARDRAILS
Establish clear boundaries for the response:
- Specific topics or approaches to avoid with rationale
- Factual accuracy requirements with verification suggestions
- Ethical considerations relevant to the topic
- Bias mitigation strategies specific to this content area
- Handling of controversial or sensitive aspects of the topic

6. EXAMPLES OR DEMONSTRATIONS
Provide a brief example of the expected output format or approach that:
- Illustrates the desired quality and style
- Demonstrates proper handling of the subject matter
- Shows appropriate tone and formatting
- Includes any special elements or techniques

7. EVALUATION CRITERIA
Define specific, measurable criteria for success:
- Content quality indicators (accuracy, depth, originality)
- Structural requirements (organization, flow, completeness)
- Engagement factors (readability, interest, value)
- Technical elements (SEO, formatting, references)

PART 3: MODEL-SPECIFIC OPTIMIZATION (Technical Tuning)
Include 5 specific techniques that optimize this prompt for {{targetLLM}}, such as:
- Instruction phrasing patterns proven effective with this architecture (with examples)
- Formatting approaches that demonstrably improve response quality for this model
- Parameter recommendations (temperature, top_p, etc.) with specific values and rationale
- Chain-of-thought or reasoning strategies tailored to this model's capabilities
- Special features or commands unique to {{targetLLM}} that enhance performance
- Citation of specific research or case studies demonstrating these optimization techniques

PART 4: FINAL PROMPT (Ready to Use)
Combine all elements into a single, ready-to-use prompt optimized for {{targetLLM}}. Format this as a code block that can be copied directly into the model's interface.

PART 5: TESTING STRATEGY (Continuous Improvement)
Suggest 3 specific variations or A/B testing approaches to further refine this prompt:
- Variation 1: A specific alternative approach with rationale
- Variation 2: A different structural organization with expected benefits
- Variation 3: An alternative tone or style approach with potential advantages
- Include specific metrics to track for comparing performance across variations

PART 6: TROUBLESHOOTING GUIDE
Provide solutions for common issues that might arise:
- If the output is too general: specific refinement strategies
- If the output lacks depth: techniques to enhance detail and specificity
- If the output is poorly structured: formatting improvement approaches
- If the model misunderstands the task: clarification techniques

Your complete response should be comprehensive yet practical, balancing technical optimization with usability. The goal is to create a prompt that consistently produces exceptional content about {{topic}} when used with {{targetLLM}}.`,
    defaultParams: {
      title: 'LLM-Specific Prompt Engineering',
      model: 'GPT-4',
      goal: 'generate-content',
      outputFormat: 'paragraph',
      style: 'technical',
      tone: 'professional',
      actionVerb: 'Create',
      useRolePlaying: true,
      role: 'Expert Prompt Engineer'
    },
    exampleUses: [
      'Creating optimized prompts for different AI models',
      'Improving response quality for specific LLMs',
      'Developing model-specific prompt strategies'
    ],
    bestPractices: [
      'Specify the exact LLM you\'re targeting (GPT-4, Claude, Gemini, etc.)',
      'Include the specific purpose or goal of the prompt',
      'Consider the unique strengths and limitations of each model',
      'Test prompts across different parameter settings'
    ],
    compatibleModels: ['GPT-4', 'Claude 3 Opus', 'Claude 3 Sonnet', 'Gemini Pro'],
    contentTypes: ['AI Prompt', 'Technical Content', 'Instruction Design'],
    marketingGoals: ['Content Creation', 'Technical Documentation', 'AI Optimization'],
    difficulty: 'advanced',
    effectiveness: 9,
    tags: ['ai', 'prompt engineering', 'llm optimization', 'technical writing']
  }
];

/**
 * Gets all available prompt patterns
 */
export function getAllPromptPatterns(): PromptPattern[] {
  return PROMPT_PATTERNS;
}

/**
 * Gets prompt patterns filtered by category
 */
export function getPromptPatternsByCategory(category: string): PromptPattern[] {
  return PROMPT_PATTERNS.filter(pattern => pattern.category === category);
}

/**
 * Gets prompt patterns filtered by marketing goal
 */
export function getPromptPatternsByGoal(goal: string): PromptPattern[] {
  return PROMPT_PATTERNS.filter(pattern => pattern.marketingGoals.includes(goal));
}

/**
 * Gets prompt patterns filtered by content type
 */
export function getPromptPatternsByContentType(contentType: string): PromptPattern[] {
  return PROMPT_PATTERNS.filter(pattern => pattern.contentTypes.includes(contentType));
}

/**
 * Gets a prompt pattern by ID
 */
export function getPromptPatternById(id: string): PromptPattern | undefined {
  return PROMPT_PATTERNS.find(pattern => pattern.id === id);
}

/**
 * Applies a prompt pattern to create a new prompt
 */
export function applyPromptPattern(patternId: string, variables: Record<string, string>): PromptData {
  const pattern = getPromptPatternById(patternId);

  if (!pattern) {
    throw new Error(`Prompt pattern with ID ${patternId} not found`);
  }

  // Start with the default parameters from the pattern
  const promptData: PromptData = {
    title: pattern.name,
    content: pattern.template,
    model: pattern.defaultParams.model || 'GPT-4',
    goal: pattern.defaultParams.goal || 'generate-content',
    outputFormat: pattern.defaultParams.outputFormat || 'paragraph',
    style: pattern.defaultParams.style || 'professional',
    tone: pattern.defaultParams.tone || 'informative',
    actionVerb: pattern.defaultParams.actionVerb || 'Create',
    specificDetails: '',
    useRolePlaying: pattern.defaultParams.useRolePlaying || false,
    role: pattern.defaultParams.role || '',
  };

  // Replace variables in the template
  let content = pattern.template;
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });

  // Add best practices as specific details
  const bestPractices = pattern.bestPractices.map(practice => `- ${practice}`).join('\n');
  promptData.specificDetails = `Best practices for this pattern:\n${bestPractices}`;

  // Update the content with the replaced variables
  promptData.content = content;

  return promptData;
}
