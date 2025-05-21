import React, { useState, useEffect } from 'react';
import { PromptData } from '../../PromptEditor';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface AdvancedOptionsProps {
  initialData: PromptData;
  contentType: string;
  onSubmit: (data: Partial<PromptData>) => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  initialData,
  contentType,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Partial<PromptData>>({
    style: initialData.style || 'casual',
    actionVerb: initialData.actionVerb || 'Write',
    specificDetails: initialData.specificDetails || '',
  });

  const [seoOptions, setSeoOptions] = useState({
    useSeo: false,
    primaryKeyword: '',
    secondaryKeywords: '',
  });

  const [formatOptions, setFormatOptions] = useState({
    wordCount: '',
    includeHeadings: true,
    includeBulletPoints: false,
    includeNumberedLists: false,
    includeExamples: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSeoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSeoOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleSeoCheckboxChange = (checked: boolean) => {
    setSeoOptions(prev => ({ ...prev, useSeo: checked }));
  };

  const handleFormatChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormatOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleFormatCheckboxChange = (name: string, checked: boolean) => {
    setFormatOptions(prev => ({ ...prev, [name]: checked }));
  };

  // This function prepares the data and submits it to the parent component
  const prepareAndSubmitData = () => {
    // Combine all data
    const combinedData = {
      ...formData,
    };

    // Add SEO details if enabled
    if (seoOptions.useSeo) {
      combinedData.specificDetails = (combinedData.specificDetails || '') +
        `\n\nSEO Optimization:\nPrimary Keyword: ${seoOptions.primaryKeyword}\nSecondary Keywords: ${seoOptions.secondaryKeywords}`;
    }

    // Add format options if any are set
    const formatDetails = [];
    if (formatOptions.wordCount) formatDetails.push(`Target word count: ${formatOptions.wordCount}`);
    if (formatOptions.includeHeadings) formatDetails.push('Include clear headings and subheadings');
    if (formatOptions.includeBulletPoints) formatDetails.push('Use bullet points where appropriate');
    if (formatOptions.includeNumberedLists) formatDetails.push('Include numbered lists for steps or processes');
    if (formatOptions.includeExamples) formatDetails.push('Include examples to illustrate key points');

    if (formatDetails.length > 0) {
      combinedData.specificDetails = (combinedData.specificDetails || '') +
        `\n\nFormatting Requirements:\n${formatDetails.join('\n')}`;
    }

    onSubmit(combinedData);
  };

  // Call prepareAndSubmitData whenever any of the form data changes
  useEffect(() => {
    prepareAndSubmitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, seoOptions, formatOptions]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Advanced Options</h3>
        <p className="text-sm text-muted-foreground">
          Fine-tune your prompt with additional parameters
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="style">Content Style</Label>
          <Select
            value={formData.style}
            onValueChange={(value) => handleSelectChange('style', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="persuasive">Persuasive</SelectItem>
              <SelectItem value="informative">Informative</SelectItem>
              <SelectItem value="conversational">Conversational</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            The overall style of the content
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="actionVerb">Action Verb</Label>
          <Input
            id="actionVerb"
            name="actionVerb"
            value={formData.actionVerb}
            onChange={handleChange}
            placeholder="e.g., Write, Create, Analyze"
          />
          <p className="text-sm text-muted-foreground">
            The main action for the AI to perform
          </p>
        </div>

        <Collapsible className="space-y-2 border rounded-md p-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">SEO Optimization</Label>
            <CollapsibleTrigger className="hover:bg-muted p-1 rounded-md">
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useSeo"
              checked={seoOptions.useSeo}
              onCheckedChange={handleSeoCheckboxChange}
            />
            <label
              htmlFor="useSeo"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Optimize for SEO
            </label>
          </div>

          <CollapsibleContent className="space-y-4 pt-2">
            {seoOptions.useSeo && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="primaryKeyword">Primary Keyword</Label>
                  <Input
                    id="primaryKeyword"
                    name="primaryKeyword"
                    value={seoOptions.primaryKeyword}
                    onChange={handleSeoChange}
                    placeholder="e.g., prompt engineering"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryKeywords">Secondary Keywords</Label>
                  <Input
                    id="secondaryKeywords"
                    name="secondaryKeywords"
                    value={seoOptions.secondaryKeywords}
                    onChange={handleSeoChange}
                    placeholder="e.g., AI writing, content creation"
                  />
                  <p className="text-sm text-muted-foreground">
                    Separate multiple keywords with commas
                  </p>
                </div>
              </>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible className="space-y-2 border rounded-md p-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Formatting Options</Label>
            <CollapsibleTrigger className="hover:bg-muted p-1 rounded-md">
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="wordCount">Target Word Count</Label>
              <Input
                id="wordCount"
                name="wordCount"
                value={formatOptions.wordCount}
                onChange={handleFormatChange}
                placeholder="e.g., 500-800"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeHeadings"
                  checked={formatOptions.includeHeadings}
                  onCheckedChange={(checked) =>
                    handleFormatCheckboxChange('includeHeadings', checked as boolean)
                  }
                />
                <label
                  htmlFor="includeHeadings"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include headings and subheadings
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeBulletPoints"
                  checked={formatOptions.includeBulletPoints}
                  onCheckedChange={(checked) =>
                    handleFormatCheckboxChange('includeBulletPoints', checked as boolean)
                  }
                />
                <label
                  htmlFor="includeBulletPoints"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Use bullet points where appropriate
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeNumberedLists"
                  checked={formatOptions.includeNumberedLists}
                  onCheckedChange={(checked) =>
                    handleFormatCheckboxChange('includeNumberedLists', checked as boolean)
                  }
                />
                <label
                  htmlFor="includeNumberedLists"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include numbered lists for steps or processes
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeExamples"
                  checked={formatOptions.includeExamples}
                  onCheckedChange={(checked) =>
                    handleFormatCheckboxChange('includeExamples', checked as boolean)
                  }
                />
                <label
                  htmlFor="includeExamples"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include examples to illustrate key points
                </label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="space-y-2">
          <Label htmlFor="specificDetails">Additional Instructions</Label>
          <Textarea
            id="specificDetails"
            name="specificDetails"
            value={formData.specificDetails}
            onChange={handleChange}
            placeholder="Add any specific details or instructions for the AI"
            rows={4}
          />
          <p className="text-sm text-muted-foreground">
            Any additional context, constraints, or special requirements
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedOptions;
