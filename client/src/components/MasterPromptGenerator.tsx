import React, { useState } from 'react';
import { PromptData } from './PromptEditor';
import { Dialog } from '@headlessui/react';

interface MasterPromptGeneratorProps {
  onSelectPrompt: (promptData: PromptData) => void;
}

const MasterPromptGenerator: React.FC<MasterPromptGeneratorProps> = ({ onSelectPrompt }) => {
  const [userRequest, setUserRequest] = useState<string>('');
  const [targetLLM, setTargetLLM] = useState<string>('GPT-4');
  const [useCase, setUseCase] = useState<string>('content-marketing');
  const [additionalContext, setAdditionalContext] = useState<string>('');
  const [numberOfVariants, setNumberOfVariants] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [promptVariants, setPromptVariants] = useState<PromptData[]>([]);
  const [activeTab, setActiveTab] = useState<'optimal' | 'variants'>('optimal');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptData | null>(null);

  const llmOptions = [
    { value: 'GPT-4', label: 'GPT-4 (OpenAI)' },
    { value: 'GPT-3.5 Turbo', label: 'GPT-3.5 Turbo (OpenAI)' },
    { value: 'Claude 3 Opus', label: 'Claude 3 Opus (Anthropic)' },
    { value: 'Claude 3 Sonnet', label: 'Claude 3 Sonnet (Anthropic)' },
    { value: 'Grok-1', label: 'Grok-1 (xAI)' },
    { value: 'Gemini Pro', label: 'Gemini Pro (Google)' },
    { value: 'Jasper', label: 'Jasper AI' },
    { value: 'CopyAI', label: 'Copy AI' }
  ];

  const useCaseOptions = [
    { value: 'content-marketing', label: 'Content Marketing' },
    { value: 'creative-writing', label: 'Creative Writing' },
    { value: 'technical-writing', label: 'Technical Writing' },
    { value: 'academic-writing', label: 'Academic Writing' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'email-marketing', label: 'Email Marketing' },
    { value: 'seo', label: 'SEO Content' },
    { value: 'product-description', label: 'Product Descriptions' },
    { value: 'advertising', label: 'Advertising Copy' },
    { value: 'data-analysis', label: 'Data Analysis' },
    { value: 'coding', label: 'Coding & Programming' }
  ];

  const generateOptimalPrompt = async () => {
    if (!userRequest) {
      setError('Please enter a request');
      return;
    }

    setIsLoading(true);
    setError('');
    setPromptVariants([]);

    try {
      const response = await fetch('http://localhost:5000/api/advanced/optimal-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userRequest,
          targetLLM,
          useCase,
          additionalContext
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate optimal prompt');
      }

      const optimalPrompt = await response.json();
      setPromptVariants([optimalPrompt]);
      onSelectPrompt(optimalPrompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePromptVariants = async () => {
    if (!userRequest) {
      setError('Please enter a request');
      return;
    }

    setIsLoading(true);
    setError('');
    setPromptVariants([]);

    try {
      const response = await fetch('http://localhost:5000/api/advanced/prompt-variants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userRequest,
          targetLLM,
          useCase,
          numberOfVariants
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt variants');
      }

      const variants = await response.json();
      setPromptVariants(variants);

      // Select the first variant by default
      if (variants.length > 0) {
        onSelectPrompt(variants[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'optimal') {
      generateOptimalPrompt();
    } else {
      generatePromptVariants();
    }
  };

  const handleVariantSelect = (variant: PromptData) => {
    onSelectPrompt(variant);
  };

  const openFullPromptModal = (variant: PromptData) => {
    setSelectedPrompt(variant);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">PromptEngineer-GPT</h2>
      <p className="text-gray-600 mb-6">
        Leverage our advanced AI system specifically fine-tuned to create optimal prompts for other AI systems.
      </p>

      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            className={`py-2 px-4 font-medium ${
              activeTab === 'optimal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('optimal')}
          >
            Optimal Prompt
          </button>
          <button
            type="button"
            className={`py-2 px-4 font-medium ${
              activeTab === 'variants' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('variants')}
          >
            Prompt Variants
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="userRequest" className="block text-gray-700 mb-2">
            What prompt do you need?
          </label>
          <textarea
            id="userRequest"
            value={userRequest}
            onChange={(e) => setUserRequest(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Describe what you want the AI to do. Example: Create a blog post about sustainable fashion trends for 2024."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="targetLLM" className="block text-gray-700 mb-2">
              Target AI Model
            </label>
            <select
              id="targetLLM"
              value={targetLLM}
              onChange={(e) => setTargetLLM(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {llmOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Select the AI model you'll be using with this prompt
            </p>
          </div>

          <div>
            <label htmlFor="useCase" className="block text-gray-700 mb-2">
              Use Case
            </label>
            <select
              id="useCase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {useCaseOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Select the domain or purpose for this prompt
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="additionalContext" className="block text-gray-700 mb-2">
            Additional Context (Optional)
          </label>
          <textarea
            id="additionalContext"
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={2}
            placeholder="Any additional information that might help create a better prompt (audience, tone, specific requirements, etc.)"
          />
        </div>

        {activeTab === 'variants' && (
          <div className="mb-4">
            <label htmlFor="numberOfVariants" className="block text-gray-700 mb-2">
              Number of Variants
            </label>
            <input
              id="numberOfVariants"
              type="number"
              min={1}
              max={5}
              value={numberOfVariants}
              onChange={(e) => setNumberOfVariants(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="mt-1 text-sm text-gray-500">
              Generate multiple prompt variations to test different approaches (1-5)
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading
              ? 'Generating...'
              : activeTab === 'optimal'
              ? 'Generate Optimal Prompt'
              : 'Generate Prompt Variants'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {promptVariants.length > 0 && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">
            {activeTab === 'optimal' ? 'Optimal Prompt' : `Prompt Variants (${promptVariants.length})`}
          </h3>

          {promptVariants.map((variant, index) => (
            <div
              key={index}
              className={`border rounded-md p-4 mb-4 cursor-pointer transition-colors ${
                index === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
              onClick={() => handleVariantSelect(variant)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{variant.title || `Variant ${index + 1}`}</h4>
                {variant.specificDetails && variant.specificDetails.includes('Prompt Quality Score') && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {variant.specificDetails.match(/Prompt Quality Score: (\d+)\/100/)?.[1] || '?'}/100
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-3">{variant.content.substring(0, 150)}...</p>
              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {variant.model}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {variant.outputFormat}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {variant.tone}
                  </span>
                </div>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFullPromptModal(variant);
                  }}
                >
                  View Full Prompt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Prompt Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-3xl rounded bg-white p-6 shadow-xl w-full max-h-[80vh] overflow-y-auto">
            <Dialog.Title className="text-lg font-medium mb-2">
              {selectedPrompt?.title || 'Prompt Details'}
            </Dialog.Title>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Prompt Content:</h3>
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                {selectedPrompt?.content}
              </div>
            </div>

            {selectedPrompt?.specificDetails && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Additional Details:</h3>
                <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                  {selectedPrompt.specificDetails}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Model:</h3>
                <p>{selectedPrompt?.model}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Output Format:</h3>
                <p>{selectedPrompt?.outputFormat}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Style:</h3>
                <p>{selectedPrompt?.style}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Tone:</h3>
                <p>{selectedPrompt?.tone}</p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={() => {
                  if (selectedPrompt) {
                    onSelectPrompt(selectedPrompt);
                    setIsModalOpen(false);
                  }
                }}
              >
                Use This Prompt
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MasterPromptGenerator;
