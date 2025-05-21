import React, { useState, useEffect } from 'react';
import { PromptData } from './PromptEditor';

interface PromptPattern {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  defaultParams: Partial<PromptData>;
  exampleUses: string[];
  bestPractices: string[];
  compatibleModels: string[];
  contentTypes: string[];
  marketingGoals: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  effectiveness: number;
  tags: string[];
}

interface PromptPatternLibraryProps {
  onSelectPattern: (promptData: PromptData) => void;
}

const PromptPatternLibrary: React.FC<PromptPatternLibraryProps> = ({ onSelectPattern }) => {
  const [patterns, setPatterns] = useState<PromptPattern[]>([]);
  const [filteredPatterns, setFilteredPatterns] = useState<PromptPattern[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedPattern, setSelectedPattern] = useState<PromptPattern | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [goalFilter, setGoalFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);

  // Fetch patterns from the API
  useEffect(() => {
    const fetchPatterns = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch('http://localhost:5000/api/advanced/patterns');
        
        if (!response.ok) {
          throw new Error('Failed to fetch patterns');
        }
        
        const data = await response.json();
        setPatterns(data);
        setFilteredPatterns(data);
        
        // Extract unique categories and goals
        const uniqueCategories = [...new Set(data.map((pattern: PromptPattern) => pattern.category))];
        setCategories(uniqueCategories);
        
        const uniqueGoals = [...new Set(data.flatMap((pattern: PromptPattern) => pattern.marketingGoals))];
        setGoals(uniqueGoals);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatterns();
  }, []);

  // Filter patterns based on category, goal, and search query
  useEffect(() => {
    let filtered = patterns;
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(pattern => pattern.category === categoryFilter);
    }
    
    if (goalFilter !== 'all') {
      filtered = filtered.filter(pattern => pattern.marketingGoals.includes(goalFilter));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pattern => 
        pattern.name.toLowerCase().includes(query) ||
        pattern.description.toLowerCase().includes(query) ||
        pattern.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredPatterns(filtered);
  }, [patterns, categoryFilter, goalFilter, searchQuery]);

  // Extract variables from a template
  const extractVariables = (template: string): string[] => {
    const matches = template.match(/{{([^}]+)}}/g) || [];
    return matches.map(match => match.slice(2, -2));
  };

  // Initialize variables when a pattern is selected
  useEffect(() => {
    if (selectedPattern) {
      const templateVariables = extractVariables(selectedPattern.template);
      const initialVariables: Record<string, string> = {};
      
      templateVariables.forEach(variable => {
        initialVariables[variable] = '';
      });
      
      setVariables(initialVariables);
    }
  }, [selectedPattern]);

  // Handle variable input change
  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  // Apply the selected pattern with variables
  const applyPattern = async () => {
    if (!selectedPattern) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/advanced/apply-pattern', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patternId: selectedPattern.id,
          variables
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to apply pattern');
      }
      
      const promptData = await response.json();
      onSelectPattern(promptData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Render difficulty badge
  const renderDifficultyBadge = (difficulty: string) => {
    let bgColor = 'bg-green-100 text-green-800';
    
    if (difficulty === 'intermediate') {
      bgColor = 'bg-yellow-100 text-yellow-800';
    } else if (difficulty === 'advanced') {
      bgColor = 'bg-red-100 text-red-800';
    }
    
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${bgColor}`}>
        {difficulty}
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Prompt Pattern Library</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Marketing Goal</label>
            <select
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Goals</option>
              {goals.map(goal => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Search patterns..."
            />
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading patterns...</p>
        </div>
      ) : filteredPatterns.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No patterns found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredPatterns.map(pattern => (
            <div
              key={pattern.id}
              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                selectedPattern?.id === pattern.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
              onClick={() => setSelectedPattern(pattern)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{pattern.name}</h3>
                {renderDifficultyBadge(pattern.difficulty)}
              </div>
              <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {pattern.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
                {pattern.tags.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    +{pattern.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedPattern && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-medium mb-4">{selectedPattern.name}</h3>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-gray-700">{selectedPattern.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium mb-2">Example Uses</h4>
              <ul className="list-disc pl-5 space-y-1">
                {selectedPattern.exampleUses.map((example, index) => (
                  <li key={index} className="text-gray-700">{example}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Best Practices</h4>
              <ul className="list-disc pl-5 space-y-1">
                {selectedPattern.bestPractices.map((practice, index) => (
                  <li key={index} className="text-gray-700">{practice}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-3">Template Variables</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(variables).map(variable => (
                <div key={variable}>
                  <label className="block text-gray-700 mb-1">
                    {variable}
                  </label>
                  <input
                    type="text"
                    value={variables[variable]}
                    onChange={(e) => handleVariableChange(variable, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder={`Enter ${variable}...`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={applyPattern}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Apply Pattern
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptPatternLibrary;
