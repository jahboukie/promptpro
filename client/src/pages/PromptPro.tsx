import React, { useState } from 'react';
import PromptEditor, { PromptData } from '../components/PromptEditor';
import ResponseDisplay from '../components/ResponseDisplay';
import PromptAnalyzer from '../components/PromptAnalyzer';
import PromptPatternLibrary from '../components/PromptPatternLibrary';
import StrategySelector from '../components/StrategySelector';
import MasterPromptGenerator from '../components/MasterPromptGenerator';
import { generateResponse, ApiResponse } from '../lib/api';

const PromptPro: React.FC = () => {
  const [promptData, setPromptData] = useState<PromptData>({
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

  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'editor' | 'patterns' | 'strategy' | 'analyzer' | 'master'>('editor');

  const handleSubmit = async (data: PromptData) => {
    setPromptData(data);
    setIsLoading(true);
    setError('');

    try {
      const apiResponse: ApiResponse = await generateResponse(data);
      setResponse(apiResponse.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatternSelect = (data: PromptData) => {
    setPromptData(data);
    setActiveTab('editor');
  };

  const handleStrategySelect = (data: PromptData) => {
    setPromptData(data);
    setActiveTab('editor');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">PromptPro AI</h1>
      <p className="text-gray-600 mb-6">Advanced prompt engineering for content marketers</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex border-b border-gray-200 mb-4">
              <button
                type="button"
                className={`py-2 px-4 font-medium ${
                  activeTab === 'editor' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('editor')}
              >
                Prompt Editor
              </button>
              <button
                type="button"
                className={`py-2 px-4 font-medium ${
                  activeTab === 'patterns' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('patterns')}
              >
                Pattern Library
              </button>
              <button
                type="button"
                className={`py-2 px-4 font-medium ${
                  activeTab === 'strategy' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('strategy')}
              >
                Strategy Selector
              </button>
              <button
                type="button"
                className={`py-2 px-4 font-medium ${
                  activeTab === 'analyzer' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('analyzer')}
              >
                Analyzer
              </button>
              <button
                type="button"
                className={`py-2 px-4 font-medium ${
                  activeTab === 'master' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('master')}
              >
                PromptEngineer-GPT
              </button>
            </div>

            {activeTab === 'editor' && (
              <PromptEditor
                onSubmit={handleSubmit}
                isLoading={isLoading}
                initialData={promptData}
              />
            )}

            {activeTab === 'patterns' && (
              <PromptPatternLibrary onSelectPattern={handlePatternSelect} />
            )}

            {activeTab === 'strategy' && (
              <StrategySelector onSelectStrategy={handleStrategySelect} />
            )}

            {activeTab === 'analyzer' && (
              <PromptAnalyzer promptData={promptData} />
            )}

            {activeTab === 'master' && (
              <MasterPromptGenerator onSelectPrompt={setPromptData} />
            )}
          </div>
        </div>

        <div>
          <ResponseDisplay response={response} isLoading={isLoading} />

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-4">About PromptPro</h2>
            <p className="mb-4">
              PromptPro is an advanced prompt engineering tool designed specifically for content marketers.
              It helps you create highly effective prompts for AI writing tools like Jasper AI and Copy AI.
            </p>

            <h3 className="text-lg font-medium mb-2">Key Features:</h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li><span className="font-medium">LLM-Specific Optimization:</span> Tailors prompts to specific AI models</li>
              <li><span className="font-medium">Prompt Pattern Library:</span> Pre-built templates for different content types</li>
              <li><span className="font-medium">Intelligent Strategy Selection:</span> AI-powered recommendations based on your goals</li>
              <li><span className="font-medium">Prompt Analysis:</span> Get feedback and improvement suggestions</li>
            </ul>

            <h3 className="text-lg font-medium mb-2">How to Use:</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Select a tab based on your needs (Editor, Pattern Library, Strategy, or Analyzer)</li>
              <li>Create or customize your prompt</li>
              <li>Generate a response to test your prompt</li>
              <li>Copy the prompt to use with your preferred AI writing tool</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptPro;
