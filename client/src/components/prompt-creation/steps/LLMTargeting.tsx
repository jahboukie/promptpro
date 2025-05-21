import React, { useState, useEffect } from 'react';
import { PromptData } from '../../PromptEditor';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Card, CardContent } from '../../ui/card';
import { cn } from '../../../lib/utils';

interface LLMTargetingProps {
  initialData: PromptData;
  onSubmit: (data: Partial<PromptData>) => void;
}

interface LLMOption {
  id: string;
  name: string;
  description: string;
  strengths: string[];
  bestFor: string[];
}

const llmOptions: LLMOption[] = [
  {
    id: 'GPT-4',
    name: 'GPT-4',
    description: 'OpenAI\'s most advanced model with strong reasoning capabilities',
    strengths: ['Reasoning', 'Following complex instructions', 'Creative writing'],
    bestFor: ['Complex tasks', 'Detailed content', 'Creative projects'],
  },
  {
    id: 'GPT-3.5 Turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Balanced performance with good speed and cost efficiency',
    strengths: ['Fast responses', 'Cost-effective', 'General knowledge'],
    bestFor: ['Drafting content', 'Quick iterations', 'Simple tasks'],
  },
  {
    id: 'Claude 3 Opus',
    name: 'Claude 3 Opus',
    description: 'Anthropic\'s most capable model with excellent reasoning',
    strengths: ['Nuanced understanding', 'Long context', 'Thoughtful responses'],
    bestFor: ['Detailed analysis', 'Long-form content', 'Nuanced topics'],
  },
  {
    id: 'Claude 3 Sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance with good reasoning capabilities',
    strengths: ['Balanced performance', 'Good reasoning', 'Helpful responses'],
    bestFor: ['General content', 'Balanced tasks', 'Most use cases'],
  },
  {
    id: 'Gemini Pro',
    name: 'Gemini Pro',
    description: 'Google\'s advanced model with strong reasoning capabilities',
    strengths: ['Up-to-date knowledge', 'Reasoning', 'Balanced responses'],
    bestFor: ['Research content', 'Factual writing', 'Balanced tasks'],
  },
];

const LLMTargeting: React.FC<LLMTargetingProps> = ({
  initialData,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Partial<PromptData>>({
    model: initialData.model || 'GPT-4',
    useRolePlaying: initialData.useRolePlaying || false,
    role: initialData.role || '',
  });

  const [targetingApproach, setTargetingApproach] = useState<'single' | 'multiple'>('single');

  const handleModelChange = (value: string) => {
    setFormData(prev => ({ ...prev, model: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      useRolePlaying: value === 'yes',
      role: value === 'yes' ? (prev.role || 'Expert in the field') : '',
    }));
  };

  const handleRoleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, role: e.target.value }));
  };

  // This function is called when the Next button is clicked in the parent component
  useEffect(() => {
    // This effect will run when the component mounts and when formData changes
    // We don't need to do anything on mount, but when formData changes, we want to
    // make sure the parent component has the latest data
    onSubmit(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const selectedLLM = llmOptions.find(llm => llm.id === formData.model);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">LLM Targeting</h3>
        <p className="text-sm text-muted-foreground">
          Optimize your prompt for specific AI models
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Targeting Approach</Label>
          <RadioGroup
            defaultValue={targetingApproach}
            onValueChange={(value) => setTargetingApproach(value as 'single' | 'multiple')}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="single" />
              <Label htmlFor="single" className="cursor-pointer">Target a single LLM</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multiple" id="multiple" />
              <Label htmlFor="multiple" className="cursor-pointer">Optimize for multiple LLMs</Label>
            </div>
          </RadioGroup>
        </div>

        {targetingApproach === 'single' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Target LLM</Label>
              <Select
                value={formData.model}
                onValueChange={handleModelChange}
              >
                <SelectTrigger className="z-10">
                  <SelectValue placeholder="Select an LLM" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4} className="z-[200]">
                  {llmOptions.map(llm => (
                    <SelectItem key={llm.id} value={llm.id}>
                      {llm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedLLM && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 space-y-2">
                  <h4 className="font-medium">{selectedLLM.name}</h4>
                  <p className="text-sm">{selectedLLM.description}</p>

                  <div className="mt-2">
                    <h5 className="text-sm font-medium">Strengths:</h5>
                    <ul className="text-sm list-disc pl-5 mt-1">
                      {selectedLLM.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-2">
                    <h5 className="text-sm font-medium">Best For:</h5>
                    <ul className="text-sm list-disc pl-5 mt-1">
                      {selectedLLM.bestFor.map((use, index) => (
                        <li key={index}>{use}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your prompt will be optimized to work well across multiple LLMs, focusing on common capabilities and avoiding model-specific features.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {llmOptions.slice(0, 4).map(llm => (
                <Card key={llm.id} className={cn(
                  "border-primary/10 bg-primary/5",
                  "cursor-pointer hover:border-primary/30"
                )}>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">{llm.name}</h4>
                    <p className="text-xs text-muted-foreground">{llm.description.substring(0, 60)}...</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Use Role-Playing</Label>
          <RadioGroup
            defaultValue={formData.useRolePlaying ? 'yes' : 'no'}
            onValueChange={handleRoleChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="role-yes" />
              <Label htmlFor="role-yes" className="cursor-pointer">Yes, assign a role to the AI</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="role-no" />
              <Label htmlFor="role-no" className="cursor-pointer">No, don't use role-playing</Label>
            </div>
          </RadioGroup>

          {formData.useRolePlaying && (
            <div className="mt-4">
              <Label htmlFor="role">Role Description</Label>
              <input
                id="role"
                type="text"
                value={formData.role}
                onChange={handleRoleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                placeholder="e.g., Expert content strategist, Technical writer"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Assigning a role can improve the quality and authority of the AI's response
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LLMTargeting;
