import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PromptData } from '../PromptEditor';
import ContentTypeSelection from './steps/ContentTypeSelection';
import CoreParameters from './steps/CoreParameters';
import LLMTargeting from './steps/LLMTargeting';
import AdvancedOptions from './steps/AdvancedOptions';
import PromptPreview from './steps/PromptPreview';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface PromptCreationFlowProps {
  onSubmit: (promptData: PromptData) => void;
  isLoading: boolean;
  initialData?: PromptData;
}

const PromptCreationFlow: React.FC<PromptCreationFlowProps> = ({
  onSubmit,
  isLoading,
  initialData
}) => {
  const [currentStep, setCurrentStep] = useState<string>('content-type');
  const [promptData, setPromptData] = useState<PromptData>(initialData || {
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

  const [contentType, setContentType] = useState<string>('blog-post');

  const updatePromptData = (newData: Partial<PromptData>) => {
    setPromptData(prev => ({ ...prev, ...newData }));
  };

  const handleContentTypeSelect = (type: string) => {
    setContentType(type);
    // Move to next step
    setCurrentStep('core-parameters');
  };

  const handleCoreParametersSubmit = (data: Partial<PromptData>) => {
    updatePromptData(data);
  };

  const handleLLMTargetingSubmit = (data: Partial<PromptData>) => {
    updatePromptData(data);
  };

  const handleAdvancedOptionsSubmit = (data: Partial<PromptData>) => {
    updatePromptData(data);
  };

  const handleSubmit = () => {
    onSubmit(promptData);
  };

  const goBack = () => {
    switch (currentStep) {
      case 'core-parameters':
        setCurrentStep('content-type');
        break;
      case 'llm-targeting':
        setCurrentStep('core-parameters');
        break;
      case 'advanced-options':
        setCurrentStep('llm-targeting');
        break;
      case 'preview':
        setCurrentStep('advanced-options');
        break;
      default:
        break;
    }
  };

  const goForward = () => {
    switch (currentStep) {
      case 'content-type':
        setCurrentStep('core-parameters');
        break;
      case 'core-parameters':
        setCurrentStep('llm-targeting');
        break;
      case 'llm-targeting':
        setCurrentStep('advanced-options');
        break;
      case 'advanced-options':
        setCurrentStep('preview');
        break;
      default:
        break;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Your Prompt</CardTitle>
        <CardDescription>
          Follow these steps to create an optimized prompt for any AI writing tool
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {/* Progress indicator */}
        <div className="w-full mb-6">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{
                width:
                  currentStep === 'content-type' ? '20%' :
                  currentStep === 'core-parameters' ? '40%' :
                  currentStep === 'llm-targeting' ? '60%' :
                  currentStep === 'advanced-options' ? '80%' :
                  '100%'
              }}
            />
          </div>
        </div>

        <Tabs value={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger
              value="content-type"
              onClick={() => setCurrentStep('content-type')}
              disabled={isLoading}
              className={`
                data-[state=active]:bg-primary
                data-[state=active]:text-primary-foreground
                ${currentStep !== 'content-type' ? 'border-l-4 border-primary/50' : ''}
              `}
            >
              <div className="flex flex-col items-center">
                <span className="font-medium">Step 1</span>
                <span className="text-xs mt-1 hidden sm:inline">Content Type</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="core-parameters"
              onClick={() => setCurrentStep('core-parameters')}
              disabled={isLoading}
              className={`
                data-[state=active]:bg-primary
                data-[state=active]:text-primary-foreground
                ${currentStep === 'llm-targeting' || currentStep === 'advanced-options' || currentStep === 'preview' ? 'border-l-4 border-primary/50' : ''}
              `}
            >
              <div className="flex flex-col items-center">
                <span className="font-medium">Step 2</span>
                <span className="text-xs mt-1 hidden sm:inline">Core Details</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="llm-targeting"
              onClick={() => setCurrentStep('llm-targeting')}
              disabled={isLoading}
              className={`
                data-[state=active]:bg-primary
                data-[state=active]:text-primary-foreground
                ${currentStep === 'advanced-options' || currentStep === 'preview' ? 'border-l-4 border-primary/50' : ''}
              `}
            >
              <div className="flex flex-col items-center">
                <span className="font-medium">Step 3</span>
                <span className="text-xs mt-1 hidden sm:inline">LLM Target</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="advanced-options"
              onClick={() => setCurrentStep('advanced-options')}
              disabled={isLoading}
              className={`
                data-[state=active]:bg-primary
                data-[state=active]:text-primary-foreground
                ${currentStep === 'preview' ? 'border-l-4 border-primary/50' : ''}
              `}
            >
              <div className="flex flex-col items-center">
                <span className="font-medium">Step 4</span>
                <span className="text-xs mt-1 hidden sm:inline">Advanced</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              onClick={() => setCurrentStep('preview')}
              disabled={isLoading}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <div className="flex flex-col items-center">
                <span className="font-medium">Preview</span>
                <span className="text-xs mt-1 hidden sm:inline">& Generate</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Scrollable container with fixed height */}
          <div className="overflow-y-auto max-h-[400px] pr-2 mb-4 rounded-md">
            <TabsContent value="content-type">
              <ContentTypeSelection
                selectedType={contentType}
                onSelect={handleContentTypeSelect}
              />
            </TabsContent>

            <TabsContent value="core-parameters">
              <CoreParameters
                initialData={promptData}
                contentType={contentType}
                onSubmit={handleCoreParametersSubmit}
              />
            </TabsContent>

            <TabsContent value="llm-targeting">
              <LLMTargeting
                initialData={promptData}
                onSubmit={handleLLMTargetingSubmit}
              />
            </TabsContent>

            <TabsContent value="advanced-options">
              <AdvancedOptions
                initialData={promptData}
                contentType={contentType}
                onSubmit={handleAdvancedOptionsSubmit}
              />
            </TabsContent>

            <TabsContent value="preview">
              <PromptPreview
                promptData={promptData}
                isLoading={isLoading}
                onSubmit={handleSubmit}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={currentStep === 'content-type' || isLoading}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {currentStep !== 'preview' ? (
          <Button onClick={goForward} disabled={isLoading}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {isLoading ? 'Generating...' : 'Generate Response'} <Sparkles className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PromptCreationFlow;
