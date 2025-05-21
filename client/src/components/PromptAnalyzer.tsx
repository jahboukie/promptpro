import React, { useState } from 'react';
import { PromptData } from './PromptEditor';

interface PromptAnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  modelRecommendations: string[];
  contentRecommendations: string[];
  structureRecommendations: string[];
  seoRecommendations: string[];
  readabilityScore: number;
  clarity: number;
  specificity: number;
  engagement: number;
  persuasiveness: number;
  completeness: number;
}

interface PromptAnalyzerProps {
  promptData: PromptData;
}

const PromptAnalyzer: React.FC<PromptAnalyzerProps> = ({ promptData }) => {
  const [analysis, setAnalysis] = useState<PromptAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  const analyzePrompt = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/advanced/analyze-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promptData }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze prompt');
      }
      
      const data = await response.json();
      setAnalysis(data);
      setShowAnalysis(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComponentScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Prompt Analyzer</h2>
        <button
          onClick={analyzePrompt}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Prompt'}
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {showAnalysis && analysis && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Analysis Results</h3>
            <div className="flex items-center">
              <span className="mr-2">Overall Score:</span>
              <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}/100
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Strengths</h4>
              {analysis.strengths.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="text-green-700">{strength}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No strengths identified</p>
              )}
              
              <h4 className="font-medium mt-4 mb-2">Weaknesses</h4>
              {analysis.weaknesses.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-red-700">{weakness}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No weaknesses identified</p>
              )}
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Suggested Improvements</h4>
              {analysis.improvements.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index} className="text-blue-700">{improvement}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No improvements suggested</p>
              )}
              
              <h4 className="font-medium mt-4 mb-2">Model Recommendations</h4>
              {analysis.modelRecommendations.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.modelRecommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No model recommendations</p>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-3">Component Scores</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-600">Clarity</div>
                <div className={`text-xl font-bold ${getComponentScoreColor(analysis.clarity)}`}>
                  {analysis.clarity}/10
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-600">Specificity</div>
                <div className={`text-xl font-bold ${getComponentScoreColor(analysis.specificity)}`}>
                  {analysis.specificity}/10
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-600">Engagement</div>
                <div className={`text-xl font-bold ${getComponentScoreColor(analysis.engagement)}`}>
                  {analysis.engagement}/10
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-600">Persuasiveness</div>
                <div className={`text-xl font-bold ${getComponentScoreColor(analysis.persuasiveness)}`}>
                  {analysis.persuasiveness}/10
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-600">Completeness</div>
                <div className={`text-xl font-bold ${getComponentScoreColor(analysis.completeness)}`}>
                  {analysis.completeness}/10
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-600">Readability</div>
                <div className={`text-xl font-bold ${getScoreColor(analysis.readabilityScore)}`}>
                  {analysis.readabilityScore}/100
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-3">Additional Recommendations</h4>
            
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Structure Recommendations</h5>
              {analysis.structureRecommendations.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.structureRecommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No structure recommendations</p>
              )}
            </div>
            
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Content Recommendations</h5>
              {analysis.contentRecommendations.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.contentRecommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No content recommendations</p>
              )}
            </div>
            
            {analysis.seoRecommendations.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">SEO Recommendations</h5>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.seoRecommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptAnalyzer;
