import React from 'react';
import { PromptData } from '../../PromptEditor';
import { Button } from '../../ui/button';
import { Copy, Check, Sparkles } from 'lucide-react';

interface PromptPreviewProps {
  promptData: PromptData;
  isLoading: boolean;
  onSubmit: () => void;
}

const PromptPreview: React.FC<PromptPreviewProps> = ({
  promptData,
  isLoading,
  onSubmit
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format the prompt for display
  const formatPrompt = () => {
    let formattedPrompt = '';

    // Add role if role-playing is enabled
    if (promptData.useRolePlaying && promptData.role) {
      formattedPrompt += `You are a ${promptData.role}.\n\n`;
    }

    // Add action verb and title
    formattedPrompt += `${promptData.actionVerb || 'Write'} ${promptData.title || 'content'}\n\n`;

    // Add goal if specified
    if (promptData.goal && promptData.goal !== 'generate-content') {
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

      const goalText = goalMap[promptData.goal] || promptData.goal;
      formattedPrompt += `The goal is to ${goalText} this topic.\n\n`;
    }

    // Add main content if provided
    if (promptData.content) {
      formattedPrompt += promptData.content + '\n\n';
    }

    // Add specific details if provided
    if (promptData.specificDetails) {
      formattedPrompt += `Additional details:\n${promptData.specificDetails}\n\n`;
    }

    // Add output format if specified
    if (promptData.outputFormat && promptData.outputFormat !== 'paragraph') {
      const formatMap: {[key: string]: string} = {
        'bullet-points': 'bullet points',
        'numbered-list': 'a numbered list',
        'table': 'a table format',
        'outline': 'an outline with headings and subheadings',
        'code': 'code with comments',
      };

      const formatText = formatMap[promptData.outputFormat] || promptData.outputFormat;
      formattedPrompt += `Please format your response as ${formatText}.\n\n`;
    }

    // Add style and tone if specified
    if (promptData.style || promptData.tone) {
      formattedPrompt += `Use a ${promptData.style || 'casual'} style with a ${promptData.tone || 'informative'} tone.`;
    }

    return formattedPrompt;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Preview Your Prompt</h3>
        <p className="text-sm text-muted-foreground">
          Review and generate a response or copy to use elsewhere
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-muted/50 rounded-md p-4 relative">
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Title:</h4>
            <p className="text-sm">{promptData.title}</p>
          </div>

          <div className="space-y-2 mt-4">
            <h4 className="font-medium text-sm text-muted-foreground">Model:</h4>
            <p className="text-sm">{promptData.model}</p>
          </div>

          <div className="space-y-2 mt-4">
            <h4 className="font-medium text-sm text-muted-foreground">Prompt:</h4>
            <div className="whitespace-pre-wrap text-sm border border-border bg-background p-3 rounded-md">
              {formatPrompt()}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {isLoading ? 'Generating...' : 'Generate Response'} <Sparkles className="ml-2 h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={isLoading}
          >
            {copied ? 'Copied!' : 'Copy to Clipboard'} {copied ? <Check className="ml-2 h-4 w-4" /> : <Copy className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptPreview;
