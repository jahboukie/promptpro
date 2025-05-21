import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { PromptData } from '../components/PromptEditor';
import { generateResponse, ApiResponse } from '../lib/api';
import PromptCreationFlow from '../components/prompt-creation/PromptCreationFlow';
import ResponseDisplay from '../components/ResponseDisplay';
import PromptPatternLibrary from '../components/PromptPatternLibrary';
import StrategySelector from '../components/StrategySelector';
import PromptAnalyzer from '../components/PromptAnalyzer';
import MasterPromptGenerator from '../components/MasterPromptGenerator';
import { Sparkles, BookOpen, Compass, Microscope, Brain } from 'lucide-react';

const NewPromptPro: React.FC = () => {
  const [promptData, setPromptData] = useState<PromptData>({
    title: '',
    content: '',
    model: 'GPT-4',
    goal: 'generate-content',
    outputFormat: 'paragraph',
    style: 'casual',
    tone: 'informative',
    actionVerb: 'Write',
    specificDetails: '',
    useRolePlaying: false,
    role: '',
  });

  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('create');

  const handleSubmit = async (data: PromptData) => {
    // Update the promptData state with the latest data
    const updatedData = { ...promptData, ...data };
    setPromptData(updatedData);
    setIsLoading(true);
    setError('');

    try {
      // Format the content field based on all the parameters
      let formattedContent = '';

      // Add role if role-playing is enabled
      if (updatedData.useRolePlaying && updatedData.role) {
        formattedContent += `You are a ${updatedData.role}.\n\n`;
      }

      // Add action verb and title
      formattedContent += `${updatedData.actionVerb || 'Write'} ${updatedData.title || 'content'}\n\n`;

      // Add goal if specified
      if (updatedData.goal && updatedData.goal !== 'generate-content') {
        const goalMap: {[key: string]: string} = {
          'educate': 'educate the audience about',
          'persuade': 'persuade the audience about',
          'entertain': 'entertain the audience with',
          'generate-leads': 'generate leads by discussing',
          'build-authority': 'build authority on the topic of',
          'engage': 'engage followers with content about',
          'drive-traffic': 'drive website traffic by discussing',
          'increase-awareness': 'increase awareness about',
          'promote-product': 'promote a product/service related to',
          'explain': 'explain in detail',
          'summarize': 'summarize information about',
          'analyze': 'analyze information about',
          'brainstorm': 'brainstorm ideas about',
        };

        const goalText = goalMap[updatedData.goal] || updatedData.goal;
        formattedContent += `The goal is to ${goalText} this topic.\n\n`;
      }

      // Add specific details if provided
      if (updatedData.specificDetails) {
        formattedContent += `Additional details:\n${updatedData.specificDetails}\n\n`;
      }

      // Add output format if specified
      if (updatedData.outputFormat && updatedData.outputFormat !== 'paragraph') {
        const formatMap: {[key: string]: string} = {
          'bullet-points': 'bullet points',
          'numbered-list': 'a numbered list',
          'table': 'a table format',
          'outline': 'an outline with headings and subheadings',
          'code': 'code with comments',
        };

        const formatText = formatMap[updatedData.outputFormat] || updatedData.outputFormat;
        formattedContent += `Please format your response as ${formatText}.\n\n`;
      }

      // Add style and tone if specified
      if (updatedData.style || updatedData.tone) {
        formattedContent += `Use a ${updatedData.style || 'casual'} style with a ${updatedData.tone || 'informative'} tone.`;
      }

      // Create a copy of the data with the formatted content
      const dataToSend = {
        ...updatedData,
        content: formattedContent
      };

      const apiResponse: ApiResponse = await generateResponse(dataToSend);
      setResponse(apiResponse.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatternSelect = (data: PromptData) => {
    setPromptData(data);
    setActiveTab('create');
  };

  const handleStrategySelect = (data: PromptData) => {
    setPromptData(data);
    setActiveTab('create');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          PromptPro AI
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
          Create expert-level prompts for any AI writing tool
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Create</span>
              </TabsTrigger>
              <TabsTrigger value="patterns" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Patterns</span>
              </TabsTrigger>
              <TabsTrigger value="strategy" className="flex items-center gap-2">
                <Compass className="h-4 w-4" />
                <span className="hidden sm:inline">Strategy</span>
              </TabsTrigger>
              <TabsTrigger value="analyzer" className="flex items-center gap-2">
                <Microscope className="h-4 w-4" />
                <span className="hidden sm:inline">Analyzer</span>
              </TabsTrigger>
              <TabsTrigger value="master" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">PromptEngineer-GPT</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4">
              <PromptCreationFlow
                onSubmit={handleSubmit}
                isLoading={isLoading}
                initialData={promptData}
              />
            </TabsContent>

            <TabsContent value="patterns">
              <Card>
                <CardHeader>
                  <CardTitle>Prompt Pattern Library</CardTitle>
                  <CardDescription>
                    Choose from pre-built prompt templates for different content types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PromptPatternLibrary onSelectPattern={handlePatternSelect} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strategy">
              <Card>
                <CardHeader>
                  <CardTitle>Strategy Selector</CardTitle>
                  <CardDescription>
                    Get AI-powered recommendations based on your content goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StrategySelector onSelectStrategy={handleStrategySelect} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analyzer">
              <Card>
                <CardHeader>
                  <CardTitle>Prompt Analyzer</CardTitle>
                  <CardDescription>
                    Get feedback and improvement suggestions for your prompt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PromptAnalyzer promptData={promptData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="master">
              <Card>
                <CardHeader>
                  <CardTitle>PromptEngineer-GPT</CardTitle>
                  <CardDescription>
                    Let our AI create an optimized prompt based on your request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MasterPromptGenerator onSelectPrompt={setPromptData} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <ResponseDisplay response={response} isLoading={isLoading} />

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>About PromptPro</CardTitle>
              <CardDescription>
                Your pre-cursor tool for AI writing assistants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                PromptPro is an advanced prompt engineering tool designed specifically for content marketers.
                It helps you create highly effective prompts for AI writing tools like Jasper AI and Copy AI.
              </p>

              <div>
                <h3 className="font-medium mb-2">Key Features:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><span className="font-medium">LLM-Specific Optimization:</span> Tailors prompts to specific AI models</li>
                  <li><span className="font-medium">Prompt Pattern Library:</span> Pre-built templates for different content types</li>
                  <li><span className="font-medium">Intelligent Strategy Selection:</span> AI-powered recommendations</li>
                  <li><span className="font-medium">Prompt Analysis:</span> Get feedback and improvement suggestions</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewPromptPro;
