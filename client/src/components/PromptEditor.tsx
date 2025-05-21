import React, { useState } from 'react';

interface PromptEditorProps {
  onSubmit: (promptData: PromptData) => void;
  isLoading: boolean;
  initialData?: PromptData;
}

export interface PromptData {
  title: string;
  content: string;
  model: string;
  goal: string;
  outputFormat: string;
  style: string;
  tone: string;
  actionVerb: string;
  specificDetails: string;
  useRolePlaying: boolean;
  role: string;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ onSubmit, isLoading, initialData }) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPromptData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPromptData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(promptData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create Your Prompt</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Prompt Title</label>
          <input
            type="text"
            name="title"
            value={promptData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter a title for your prompt"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Prompt Content</label>
          <textarea
            name="content"
            value={promptData.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={5}
            placeholder="Enter your prompt content"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="model" className="block text-gray-700 mb-2">Model</label>
            <select
              id="model"
              name="model"
              value={promptData.model}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              aria-label="Select AI model"
            >
              <option value="GPT-4">GPT-4</option>
              <option value="GPT-3.5 Turbo">GPT-3.5 Turbo</option>
              <option value="Claude 3 Opus">Claude 3 Opus</option>
              <option value="Claude 3 Sonnet">Claude 3 Sonnet</option>
              <option value="Grok-1">Grok-1</option>
            </select>
          </div>

          <div>
            <label htmlFor="goal" className="block text-gray-700 mb-2">Goal</label>
            <select
              id="goal"
              name="goal"
              value={promptData.goal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              aria-label="Select content goal"
            >
              <option value="generate-content">Generate Content</option>
              <option value="explain">Explain</option>
              <option value="summarize">Summarize</option>
              <option value="analyze">Analyze</option>
              <option value="brainstorm">Brainstorm</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="outputFormat" className="block text-gray-700 mb-2">Output Format</label>
            <select
              id="outputFormat"
              name="outputFormat"
              value={promptData.outputFormat}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              aria-label="Select output format"
            >
              <option value="paragraph">Paragraph</option>
              <option value="bullet-points">Bullet Points</option>
              <option value="numbered-list">Numbered List</option>
              <option value="table">Table</option>
              <option value="code">Code</option>
            </select>
          </div>

          <div>
            <label htmlFor="style" className="block text-gray-700 mb-2">Style</label>
            <select
              id="style"
              name="style"
              value={promptData.style}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              aria-label="Select content style"
            >
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="technical">Technical</option>
              <option value="creative">Creative</option>
              <option value="persuasive">Persuasive</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Action Verb</label>
          <input
            type="text"
            name="actionVerb"
            value={promptData.actionVerb}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., Write, Create, Analyze"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Specific Details</label>
          <textarea
            name="specificDetails"
            value={promptData.specificDetails}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Add specific details or instructions"
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="useRolePlaying"
              checked={promptData.useRolePlaying}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <span className="text-gray-700">Use Role Playing</span>
          </label>
        </div>

        {promptData.useRolePlaying && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role</label>
            <input
              type="text"
              name="role"
              value={promptData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Marketing Expert, Tech Writer"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Response'}
        </button>
      </form>
    </div>
  );
};

export default PromptEditor;
