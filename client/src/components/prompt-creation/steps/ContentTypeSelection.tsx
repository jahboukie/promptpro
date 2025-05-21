import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { cn } from '../../../lib/utils';
import { 
  FileText, 
  MessageSquare, 
  Mail, 
  ShoppingBag, 
  Code, 
  Video, 
  Image, 
  FileQuestion 
} from 'lucide-react';

interface ContentTypeSelectionProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

interface ContentTypeOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const contentTypes: ContentTypeOption[] = [
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Long-form content for blogs and articles',
    icon: <FileText className="h-8 w-8" />,
  },
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Short-form content for social platforms',
    icon: <MessageSquare className="h-8 w-8" />,
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Email marketing and newsletters',
    icon: <Mail className="h-8 w-8" />,
  },
  {
    id: 'product-description',
    name: 'Product Description',
    description: 'Compelling product descriptions',
    icon: <ShoppingBag className="h-8 w-8" />,
  },
  {
    id: 'technical-content',
    name: 'Technical Content',
    description: 'Documentation, guides, and technical articles',
    icon: <Code className="h-8 w-8" />,
  },
  {
    id: 'video-script',
    name: 'Video Script',
    description: 'Scripts for videos and presentations',
    icon: <Video className="h-8 w-8" />,
  },
  {
    id: 'image-prompt',
    name: 'Image Prompt',
    description: 'Prompts for image generation AI',
    icon: <Image className="h-8 w-8" />,
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Create a custom prompt type',
    icon: <FileQuestion className="h-8 w-8" />,
  },
];

const ContentTypeSelection: React.FC<ContentTypeSelectionProps> = ({ 
  selectedType, 
  onSelect 
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Select Content Type</h3>
        <p className="text-sm text-muted-foreground">
          Choose the type of content you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contentTypes.map((type) => (
          <Card
            key={type.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedType === type.id 
                ? "border-2 border-primary shadow-sm" 
                : "border border-border hover:border-primary/50"
            )}
            onClick={() => onSelect(type.id)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className={cn(
                "p-3 rounded-full mb-4",
                selectedType === type.id 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted text-muted-foreground"
              )}>
                {type.icon}
              </div>
              <h4 className="font-medium mb-1">{type.name}</h4>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentTypeSelection;
