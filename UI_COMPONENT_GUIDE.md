# UI Component Development Guide

This guide provides best practices and patterns for creating new UI components in the AI Prompting Tool.

## Component Structure

### Basic Component Template

When creating a new component, use the following template:

```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  // Define your props here
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function MyComponent({
  label,
  value,
  onChange,
  className,
}: MyComponentProps) {
  // Component logic here
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
  );
}
```

### Key Elements

1. **Imports**: Import React and any necessary utilities or components
2. **Interface**: Define a TypeScript interface for the component props
3. **Default Export**: Export the component as default
4. **Props Destructuring**: Destructure props in the function arguments
5. **Event Handlers**: Define event handlers inside the component
6. **Classnames**: Use the `cn` utility for combining classes
7. **JSX Structure**: Return the JSX structure of the component

## Shadcn UI Components

The application uses shadcn UI components extensively. These are stored in `client/src/components/ui/`.

### How to Use Shadcn Components

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MyForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter your name" />
      </div>
      <Button type="submit">Submit</Button>
    </div>
  );
}
```

### Recommended Shadcn Components

- `Button`: For buttons with different variants
- `Input`: For text input fields
- `Textarea`: For multi-line text input
- `Select`: For dropdown selections
- `Checkbox`: For boolean inputs
- `RadioGroup`: For option selections
- `Switch`: For toggle controls
- `Card`: For content containers
- `Tabs`: For tabbed interfaces
- `Dialog`: For modal dialogs
- `Form`: For form handling with React Hook Form

## Forms with React Hook Form

For forms, use React Hook Form with the shadcn Form components:

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define your form schema
const formSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.string().min(10),
});

export default function PromptForm() {
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormDescription>
                Give your prompt a descriptive title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* More form fields... */}
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Styling Guidelines

### Using Tailwind CSS

The application uses Tailwind CSS for styling. Follow these guidelines:

1. Use utility classes directly in the JSX
2. Use the `cn` utility for conditional classes
3. Follow a mobile-first approach
4. Use consistent spacing and color patterns

### Example of Responsive Design

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <div className="p-4 bg-white rounded shadow">Item 1</div>
  <div className="p-4 bg-white rounded shadow">Item 2</div>
  <div className="p-4 bg-white rounded shadow">Item 3</div>
</div>
```

### Color Palette

Use the following color classes for consistency:

- Primary: `text-primary`, `bg-primary`, `border-primary`
- Secondary: `text-secondary`, `bg-secondary`, `border-secondary`
- Background: `bg-background`
- Foreground: `text-foreground`
- Accents: `bg-accent`, `text-accent-foreground`

### Common UI Patterns

#### Card Layout

```tsx
<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
  <div className="p-6 space-y-4">
    <h3 className="text-lg font-medium">Card Title</h3>
    <p className="text-sm text-muted-foreground">Card content goes here.</p>
  </div>
  <div className="p-6 pt-0 flex justify-end">
    <Button>Action</Button>
  </div>
</div>
```

#### Form Group

```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="m@example.com" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="password">Password</Label>
    <Input id="password" type="password" />
  </div>
  <Button className="w-full">Submit</Button>
</div>
```

#### Navigation

```tsx
<nav className="flex space-x-4">
  <a
    href="#"
    className="px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground"
  >
    Dashboard
  </a>
  <a
    href="#"
    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
  >
    Settings
  </a>
</nav>
```

## Icons

The application uses Lucide React for icons:

```tsx
import { Search, Settings, User } from "lucide-react";

export default function IconDemo() {
  return (
    <div className="flex space-x-4">
      <Search className="h-5 w-5" />
      <Settings className="h-5 w-5" />
      <User className="h-5 w-5" />
    </div>
  );
}
```

For brand icons, use React Icons (specifically the SI set for company logos):

```tsx
import { SiOpenai, SiGithub, SiGoogle } from "react-icons/si";

export default function BrandIcons() {
  return (
    <div className="flex space-x-4">
      <SiOpenai className="h-5 w-5" />
      <SiGithub className="h-5 w-5" />
      <SiGoogle className="h-5 w-5" />
    </div>
  );
}
```

## Data Fetching

Use TanStack Query for data fetching:

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function DataFetchingExample() {
  const queryClient = useQueryClient();
  
  // Fetch data
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/prompts"],
  });
  
  // Mutation for creating new data
  const mutation = useMutation({
    mutationFn: (newPrompt) => apiRequest("/api/prompts", {
      method: "POST",
      body: JSON.stringify(newPrompt),
      headers: {
        "Content-Type": "application/json",
      },
    }),
    onSuccess: () => {
      // Invalidate cache to refetch prompts
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
    },
  });
  
  const handleCreate = () => {
    mutation.mutate({ title: "New Prompt", content: "Content..." });
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
      <Button onClick={handleCreate}>Create New</Button>
    </div>
  );
}
```

## Loading States

Always show loading states for better user experience:

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDemo() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <Skeleton className="h-[125px] w-full rounded-xl" />
    </div>
  );
}
```

## Error Handling

Handle errors gracefully in components:

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function ErrorAlert({ title, message }: { title: string; message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
```

## Toast Notifications

Use the toast hook for notifications:

```tsx
import { useToast } from "@/hooks/use-toast";

export function ToastDemo() {
  const { toast } = useToast();
  
  return (
    <Button
      onClick={() => {
        toast({
          title: "Prompt Created",
          description: "Your prompt has been successfully created.",
        });
      }}
    >
      Create Prompt
    </Button>
  );
}
```

## Accessibility

Follow these accessibility guidelines:

1. Use semantic HTML elements (`button`, `nav`, `main`, `section`, etc.)
2. Include proper ARIA attributes when needed
3. Ensure sufficient color contrast
4. Make sure all interactive elements are keyboard accessible
5. Add descriptive alt text to images

Example of accessible button:

```tsx
<Button 
  aria-label="Close dialog"
  onClick={onClose}
>
  <X className="h-4 w-4" />
</Button>
```

## Component Testing

Write tests for components using Vitest and React Testing Library:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent label="Test" value="" onChange={() => {}} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
  
  it("calls onChange when input changes", () => {
    const handleChange = vi.fn();
    render(<MyComponent label="Test" value="" onChange={handleChange} />);
    
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "new value" } });
    expect(handleChange).toHaveBeenCalledWith("new value");
  });
});
```

## Performance Optimization

1. Memoize expensive calculations with `useMemo`
2. Optimize re-renders with `React.memo` and `useCallback`
3. Virtualize long lists with libraries like react-window
4. Use appropriate keys for list items
5. Lazy load components with React.lazy and Suspense

Example of memoization:

```tsx
import { useMemo, useCallback } from "react";

function ExpensiveComponent({ items, onItemClick }) {
  // Memoize expensive calculation
  const processedItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      processed: someExpensiveOperation(item)
    }));
  }, [items]);
  
  // Memoize callback
  const handleItemClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);
  
  return (
    <ul>
      {processedItems.map(item => (
        <li key={item.id} onClick={() => handleItemClick(item.id)}>
          {item.processed}
        </li>
      ))}
    </ul>
  );
}
```

## Adding New Components

When adding a new component to the application:

1. Create a new file in `client/src/components/`
2. Define the component's props interface
3. Implement the component following the guidelines in this document
4. Import and use the component in the appropriate parent component
5. Add any necessary tests

Follow these best practices for component organization:

1. Keep components focused on a single responsibility
2. Break down complex components into smaller ones
3. Use composition to build up complex UIs
4. Extract reusable logic into custom hooks