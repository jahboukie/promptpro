import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { ThumbsUp, ThumbsDown, Copy, Save, Loader2, Check } from 'lucide-react';

interface ResponseDisplayProps {
  response: string;
  isLoading: boolean;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">AI Response</CardTitle>

        {response && (
          <Button
            onClick={handleCopyToClipboard}
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground"
          >
            {copied ? <span className="flex items-center">Copied <Check className="h-4 w-4 ml-1" /></span> :
            <span className="flex items-center">Copy <Copy className="h-4 w-4 ml-1" /></span>}
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary/70" />
          </div>
        ) : response ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }} />
          </div>
        ) : (
          <div className="text-muted-foreground italic h-64 flex items-center justify-center text-center">
            Your response will appear here after you generate it
          </div>
        )}
      </CardContent>

      {response && (
        <CardFooter className="flex justify-between pt-2">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <ThumbsUp className="h-3.5 w-3.5 mr-1" />
              Helpful
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <ThumbsDown className="h-3.5 w-3.5 mr-1" />
              Not Helpful
            </Button>
          </div>

          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Save className="h-3.5 w-3.5 mr-1" />
            Save Prompt
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ResponseDisplay;
