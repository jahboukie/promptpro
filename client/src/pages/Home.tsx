import React, { useState } from 'react';
import PromptEditor, { PromptData } from '../components/PromptEditor';
import ResponseDisplay from '../components/ResponseDisplay';
import { generateResponse, ApiResponse } from '../lib/api';

const Home: React.FC = () => {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (promptData: PromptData) => {
    setIsLoading(true);
    setError('');

    try {
      const data: ApiResponse = await generateResponse(promptData);
      setResponse(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">PromptPro AI</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PromptEditor onSubmit={handleSubmit} isLoading={isLoading} />

        <div>
          <ResponseDisplay response={response} isLoading={isLoading} />

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
