import React, { useState, useEffect } from 'react';
import { PromptData } from '../../PromptEditor';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface CoreParametersProps {
  initialData: PromptData;
  contentType: string;
  onSubmit: (data: Partial<PromptData>) => void;
}

const CoreParameters: React.FC<CoreParametersProps> = ({
  initialData,
  contentType,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Partial<PromptData>>({
    title: initialData.title || '',
    goal: initialData.goal || 'generate-content',
    outputFormat: initialData.outputFormat || 'paragraph',
    tone: initialData.tone || 'informative',
  });

  // Set default title based on content type if empty
  useEffect(() => {
    if (!formData.title) {
      let defaultTitle = '';
      switch (contentType) {
        case 'blog-post':
          defaultTitle = 'Blog Post About [Topic]';
          break;
        case 'social-media':
          defaultTitle = 'Social Media Post About [Topic]';
          break;
        case 'email':
          defaultTitle = 'Email Campaign About [Topic]';
          break;
        case 'product-description':
          defaultTitle = 'Description for [Product]';
          break;
        case 'technical-content':
          defaultTitle = 'Technical Guide for [Topic]';
          break;
        case 'video-script':
          defaultTitle = 'Video Script About [Topic]';
          break;
        case 'image-prompt':
          defaultTitle = 'Image Generation Prompt for [Subject]';
          break;
        default:
          defaultTitle = 'Custom Prompt About [Topic]';
      }
      setFormData(prev => ({ ...prev, title: defaultTitle }));
    }
  }, [contentType, formData.title]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // This function is called when the Next button is clicked in the parent component
  useEffect(() => {
    // This effect will run when the component mounts and when formData changes
    // We don't need to do anything on mount, but when formData changes, we want to
    // make sure the parent component has the latest data
    onSubmit(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  // Content-type specific goal options
  const getGoalOptions = () => {
    switch (contentType) {
      case 'blog-post':
        return [
          { value: 'educate', label: 'Educate the audience' },
          { value: 'persuade', label: 'Persuade the audience' },
          { value: 'entertain', label: 'Entertain the audience' },
          { value: 'generate-leads', label: 'Generate leads' },
          { value: 'build-authority', label: 'Build authority' },
        ];
      case 'social-media':
        return [
          { value: 'engage', label: 'Engage followers' },
          { value: 'drive-traffic', label: 'Drive website traffic' },
          { value: 'increase-awareness', label: 'Increase brand awareness' },
          { value: 'generate-leads', label: 'Generate leads' },
          { value: 'promote-product', label: 'Promote a product/service' },
        ];
      default:
        return [
          { value: 'generate-content', label: 'Generate content' },
          { value: 'explain', label: 'Explain a concept' },
          { value: 'summarize', label: 'Summarize information' },
          { value: 'analyze', label: 'Analyze information' },
          { value: 'brainstorm', label: 'Brainstorm ideas' },
        ];
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Define Core Parameters</h3>
        <p className="text-sm text-muted-foreground">
          Set the basic parameters for your {contentType.replace('-', ' ')}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title/Topic</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title or topic for your content"
          />
          <p className="text-sm text-muted-foreground">
            Be specific about what you want to create
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Primary Goal</Label>
          <Select
            value={formData.goal}
            onValueChange={(value) => handleSelectChange('goal', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a goal" />
            </SelectTrigger>
            <SelectContent>
              {getGoalOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            What do you want to achieve with this content?
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="outputFormat">Output Format</Label>
          <Select
            value={formData.outputFormat}
            onValueChange={(value) => handleSelectChange('outputFormat', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="bullet-points">Bullet Points</SelectItem>
              <SelectItem value="numbered-list">Numbered List</SelectItem>
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="code">Code</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            How should the content be structured?
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select
            value={formData.tone}
            onValueChange={(value) => handleSelectChange('tone', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="informative">Informative</SelectItem>
              <SelectItem value="conversational">Conversational</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="persuasive">Persuasive</SelectItem>
              <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
              <SelectItem value="humorous">Humorous</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            What tone should the content have?
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoreParameters;
