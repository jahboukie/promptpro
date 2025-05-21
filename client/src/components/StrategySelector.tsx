import React, { useState, useEffect } from 'react';
import { PromptData } from './PromptEditor';

interface ContentGoal {
  id: string;
  name: string;
  description: string;
}

interface ContentType {
  id: string;
  name: string;
  description: string;
  averageLength: string;
}

interface PromptPattern {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface StrategyRecommendation {
  recommendedPatterns: PromptPattern[];
  recommendedModels: string[];
  recommendedOutputFormats: string[];
  recommendedTones: string[];
  recommendedStyles: string[];
  additionalTips: string[];
}

interface StrategySelectorProps {
  onSelectStrategy: (promptData: PromptData) => void;
}

const StrategySelector: React.FC<StrategySelectorProps> = ({ onSelectStrategy }) => {
  const [contentGoals, setContentGoals] = useState<ContentGoal[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [recommendation, setRecommendation] = useState<StrategyRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [mode, setMode] = useState<'guided' | 'ai'>('guided');

  // Fetch content goals and types
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Fetch content goals
        const goalsResponse = await fetch('http://localhost:5000/api/advanced/content-goals');
        
        if (!goalsResponse.ok) {
          throw new Error('Failed to fetch content goals');
        }
        
        const goalsData = await goalsResponse.json();
        setContentGoals(goalsData);
        
        // Fetch content types
        const typesResponse = await fetch('http://localhost:5000/api/advanced/content-types');
        
        if (!typesResponse.ok) {
          throw new Error('Failed to fetch content types');
        }
        
        const typesData = await typesResponse.json();
        setContentTypes(typesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Get strategy recommendation based on selected goal and type
  const getRecommendation = async () => {
    if (!selectedGoalId || !selectedTypeId) {
      setError('Please select both a content goal and type');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:5000/api/advanced/recommend-strategy?contentGoalId=${selectedGoalId}&contentTypeId=${selectedTypeId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get recommendation');
      }
      
      const data = await response.json();
      setRecommendation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Get AI-based recommendation from user input
  const getAIRecommendation = async () => {
    if (!userInput) {
      setError('Please enter a description of your content needs');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/advanced/analyze-input', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userInput }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze input');
      }
      
      const data = await response.json();
      setRecommendation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a complete prompt based on the recommendation
  const generatePrompt = async () => {
    if (!recommendation) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const input = mode === 'guided'
        ? `${getGoalName(selectedGoalId)} for ${getTypeName(selectedTypeId)}`
        : userInput;
      
      const model = recommendation.recommendedModels[0] || 'GPT-4';
      
      const response = await fetch('http://localhost:5000/api/advanced/recommend-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input, model }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }
      
      const promptData = await response.json();
      onSelectStrategy(promptData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to get names from IDs
  const getGoalName = (id: string): string => {
    const goal = contentGoals.find(g => g.id === id);
    return goal ? goal.name : '';
  };

  const getTypeName = (id: string): string => {
    const type = contentTypes.find(t => t.id === id);
    return type ? type.name : '';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Content Strategy Selector</h2>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium ${
              mode === 'guided' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setMode('guided')}
          >
            Guided Selection
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              mode === 'ai' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setMode('ai')}
          >
            AI-Powered
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {mode === 'guided' ? (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Content Goal</label>
              <select
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a goal</option>
                {contentGoals.map(goal => (
                  <option key={goal.id} value={goal.id}>{goal.name}</option>
                ))}
              </select>
              {selectedGoalId && (
                <p className="mt-1 text-sm text-gray-500">
                  {contentGoals.find(g => g.id === selectedGoalId)?.description}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Content Type</label>
              <select
                value={selectedTypeId}
                onChange={(e) => setSelectedTypeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a type</option>
                {contentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              {selectedTypeId && (
                <p className="mt-1 text-sm text-gray-500">
                  {contentTypes.find(t => t.id === selectedTypeId)?.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={getRecommendation}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isLoading || !selectedGoalId || !selectedTypeId}
            >
              {isLoading ? 'Getting Recommendations...' : 'Get Recommendations'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Describe Your Content Needs</label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Example: I need to create a blog post about sustainable fashion to increase brand awareness..."
          />
          
          <div className="flex justify-end mt-4">
            <button
              onClick={getAIRecommendation}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isLoading || !userInput}
            >
              {isLoading ? 'Analyzing...' : 'Analyze & Recommend'}
            </button>
          </div>
        </div>
      )}
      
      {recommendation && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Strategy Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium mb-2">Recommended Patterns</h4>
              {recommendation.recommendedPatterns.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {recommendation.recommendedPatterns.map((pattern, index) => (
                    <li key={index} className="text-gray-700">
                      <span className="font-medium">{pattern.name}</span>: {pattern.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No patterns recommended</p>
              )}
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Additional Tips</h4>
              {recommendation.additionalTips.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {recommendation.additionalTips.map((tip, index) => (
                    <li key={index} className="text-gray-700">{tip}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No additional tips</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Models</h4>
              <ul className="list-disc pl-5 space-y-1">
                {recommendation.recommendedModels.map((model, index) => (
                  <li key={index} className="text-gray-700">{model}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Output Formats</h4>
              <ul className="list-disc pl-5 space-y-1">
                {recommendation.recommendedOutputFormats.map((format, index) => (
                  <li key={index} className="text-gray-700">{format}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tones</h4>
              <ul className="list-disc pl-5 space-y-1">
                {recommendation.recommendedTones.map((tone, index) => (
                  <li key={index} className="text-gray-700">{tone}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Styles</h4>
              <ul className="list-disc pl-5 space-y-1">
                {recommendation.recommendedStyles.map((style, index) => (
                  <li key={index} className="text-gray-700">{style}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={generatePrompt}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-400"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Complete Prompt'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategySelector;
