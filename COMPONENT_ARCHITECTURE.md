# Component Architecture Documentation

This document outlines the component architecture and data flow of the AI Prompting Tool's frontend.

## Overview

The application uses a component-based architecture with React, focusing on modular, reusable components. The main state is managed in the parent component (Home), which passes down props to child components.

## Component Hierarchy

```
App
└── Router
    ├── NotFound
    └── Home
        ├── Header
        ├── Sidebar
        ├── InstructionBuilder
        ├── PromptEditor
        │   └── TaskDefinition
        ├── ResponseDisplay
        └── APIStatus
```

## Key Components

### App (client/src/App.tsx)

The root component that sets up routing using wouter.

**Responsibilities**:
- Configure routes
- Render the main layout

### Home (client/src/pages/Home.tsx)

The main page component that manages the state and orchestrates child components.

**Responsibilities**:
- Manage prompt state (title, content, model, etc.)
- Manage instruction builder state (action verb, details, role-playing)
- Handle API requests to generate responses
- Pass state and callbacks to child components

**State**:
```typescript
// Prompt state
const [promptTitle, setPromptTitle] = useState("Generate a blog post outline");
const [promptContent, setPromptContent] = useState("...");
const [aiModel, setAiModel] = useState("GPT-4");
const [promptGoal, setPromptGoal] = useState("generate-content");
const [promptOutputFormat, setPromptOutputFormat] = useState("bullet-points");
const [promptStyle, setPromptStyle] = useState("formal");
const [promptTone, setPromptTone] = useState("informative");

// Response state
const [responseContent, setResponseContent] = useState("");
const [isGenerating, setIsGenerating] = useState(false);
const [generationTime, setGenerationTime] = useState<number | null>(null);

// InstructionBuilder state
const [actionVerb, setActionVerb] = useState('');
const [specificDetails, setSpecificDetails] = useState('');
const [useRolePlaying, setUseRolePlaying] = useState(false);
const [role, setRole] = useState('');
```

### Header (client/src/components/Header.tsx)

The top navigation bar component.

**Props**:
- `onNewPrompt`: Callback function to create a new prompt

**Responsibilities**:
- Display logo and navigation items
- Trigger creation of new prompts

### Sidebar (client/src/components/Sidebar.tsx)

The sidebar navigation component.

**Responsibilities**:
- Display categories and saved prompts
- Provide navigation links

### InstructionBuilder (client/src/components/InstructionBuilder.tsx)

Component for building structured instructions for the AI.

**Props**:
```typescript
interface InstructionBuilderProps {
  onActionVerbChange: (value: string) => void;
  onSpecificDetailsChange: (value: string) => void;
  onUseRolePlayingChange: (value: boolean) => void;
  onRoleChange: (value: string) => void;
  actionVerb: string;
  specificDetails: string;
  useRolePlaying: boolean;
  role: string;
}
```

**Responsibilities**:
- Allow selection of action verbs (e.g., "Summarize", "Explain", "Generate")
- Provide input for specific details
- Toggle role-playing functionality
- Specify AI roles when role-playing is enabled

### PromptEditor (client/src/components/PromptEditor.tsx)

Component for editing the prompt and its parameters.

**Props**:
```typescript
interface PromptEditorProps {
  title: string;
  content: string;
  model: string;
  isGenerating: boolean;
  goal?: string;
  outputFormat?: string;
  style?: string;
  tone?: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onModelChange: (model: string) => void;
  onGoalChange?: (goal: string) => void;
  onOutputFormatChange?: (format: string) => void;
  onStyleChange?: (style: string) => void;
  onToneChange?: (tone: string) => void;
  onGenerate: () => void;
}
```

**Responsibilities**:
- Allow editing of prompt title and content
- Select AI model
- Display TaskDefinition component
- Trigger prompt generation

### TaskDefinition (client/src/components/TaskDefinition.tsx)

Component for defining the task parameters.

**Props**:
```typescript
interface TaskDefinitionProps {
  goal: string;
  outputFormat: string;
  style: string;
  tone: string;
  onGoalChange: (goal: string) => void;
  onOutputFormatChange: (format: string) => void;
  onStyleChange: (style: string) => void;
  onToneChange: (tone: string) => void;
}
```

**Responsibilities**:
- Set goal (e.g., "generate-content", "analyze")
- Define output format (e.g., "bullet-points", "paragraph", "code")
- Set style (e.g., "formal", "casual")
- Set tone (e.g., "informative", "persuasive")

### ResponseDisplay (client/src/components/ResponseDisplay.tsx)

Component for displaying the AI-generated response.

**Props**:
```typescript
interface ResponseDisplayProps {
  content: string;
  generationTime: number | null;
}
```

**Responsibilities**:
- Display formatted AI response
- Show generation time and metadata

### APIStatus (client/src/components/APIStatus.tsx)

Component for displaying the API connection status.

**Props**:
```typescript
interface APIStatusProps {
  status: string;
  isLoading: boolean;
  isError: boolean;
}
```

**Responsibilities**:
- Show API connection status
- Display loading state
- Show error messages

## Data Flow

1. **User Input**:
   - User interacts with UI components (PromptEditor, InstructionBuilder, TaskDefinition)
   - Component event handlers update state in the parent Home component

2. **Generate Request**:
   - User clicks "Generate" button in PromptEditor
   - PromptEditor calls the onGenerate callback
   - Home component sends a POST request to the `/api/generate` endpoint with all prompt parameters

3. **Response Display**:
   - Home component receives response data
   - ResponseDisplay component renders the AI-generated content

4. **Save/Load Flow**:
   - User can save prompts to the database via API endpoints
   - Sidebar displays saved prompts loaded from the database
   - User can click on saved prompts to load them into the editor

## State Management

The application uses React's built-in useState hooks for state management, with the following organization:

1. **Component-Level State**:
   - Each component manages its own UI state (e.g., form inputs, dropdown selections)

2. **Application-Level State**:
   - Main state is managed in the Home component
   - Passed down to child components via props
   - Child components update parent state via callback functions

3. **Server State**:
   - Fetched using TanStack Query
   - API status and responses are stored in query cache

## Enhanced Components

### SmartSelect (client/src/components/ui/smart-select.tsx)

A wrapper around the standard select component that includes smart defaults and preference tracking.

**Props**:
```typescript
interface SmartSelectProps extends React.ComponentPropsWithoutRef<typeof Select> {
  name: string;
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  defaultPreference?: string;
  trackPreference?: boolean;
}
```

**Responsibilities**:
- Track user preferences for frequently used options
- Provide smart defaults based on usage patterns
- Handle empty values safely to prevent UI errors
- Allow customization of select appearance

### SelectItem (client/src/components/ui/select.tsx)

An enhanced version of the Radix UI SelectItem component with safety checks.

**Modifications**:
- Added validation to prevent empty string values
- Provides a default value when empty strings are encountered
- Ensures all SelectItem components have valid values passed to them

### PromptProToggle (client/src/components/PromptProToggle.tsx)

Component for switching between Classic Editor and Prompt Pro modes.

**Props**:
```typescript
interface PromptProToggleProps {
  isPromptProMode: boolean;
  onTogglePromptProMode: (isEnabled: boolean) => void;
}
```

**Responsibilities**:
- Allow switching between editor modes
- Provide visual indication of the current mode
- Ensure proper state handling when switching modes

## Component Architecture Optimizations

### Home Component UI Duplication Fix

The Home component was updated to prevent duplicated UI elements:

- **Issue**: When Prompt Pro mode was activated, some UI components (particularly the instruction builder sections) were being rendered twice
- **Solution**: Restructured the component rendering logic to ensure each component is rendered exactly once
- **Implementation**: Moved conditional rendering to the appropriate level in the component hierarchy

### Select Component Error Handling

The Select and SelectItem components were enhanced with error handling:

- **Issue**: Empty string values in SelectItem components caused React errors
- **Solution**: Added validation logic to ensure all values are non-empty
- **Implementation**: Added a safety check that provides a default value when empty strings are detected

## Adding New Components

When adding new components to the application:

1. Create a new file in `client/src/components/`
2. Define the component's props interface
3. Implement the component using React hooks and Tailwind CSS
4. Import and use the component in the appropriate parent component
5. Ensure proper error handling for any props that could be undefined or empty

## Styling Guidelines

The application uses Tailwind CSS for styling, with some general guidelines:

1. Use utility classes directly in the JSX
2. Follow the existing color scheme and spacing patterns
3. Create responsive layouts that work on mobile, tablet, and desktop
4. Use shadcn components where appropriate
5. Ensure consistent spacing between related UI elements

## Advanced Interactions

For more complex interactions:

1. **Form Validation**:
   - Use the Form component from shadcn with React Hook Form
   - Define validation schemas using Zod
   - Add proper error handling for empty or invalid form values

2. **API Integration**:
   - Use TanStack Query hooks (useQuery, useMutation)
   - Follow the existing pattern in apiRequest function
   - Implement proper error handling for failed API requests

3. **Animations**:
   - Use the Tailwind CSS animation utilities or framer-motion for more complex animations
   - Ensure animations don't interfere with core functionality

4. **Progressive Disclosure**:
   - Implement smart UI that adapts to user behavior
   - Show optional fields only when needed
   - Track user preferences to provide better defaults over time