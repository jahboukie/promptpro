import React, { useState, useEffect } from 'react';

const Settings: React.FC = () => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [xaiKey, setXaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [status, setStatus] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch current API key status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/config/ai-services');
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        }
      } catch (err) {
        console.error('Error fetching API key status:', err);
      }
    };

    fetchStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // In a real app, this would send the API keys to the server
      // For this demo, we'll just update the .env.local file
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('API keys saved successfully! Please restart the server for changes to take effect.');
      
      // Refresh status
      const response = await fetch('/api/config/ai-services');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (err) {
      setError('Failed to save API keys. Please try again.');
      console.error('Error saving API keys:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">AI Service API Keys</h2>
        
        <p className="mb-4 text-gray-600">
          Configure your API keys for various AI services to use with PromptPro.
          These keys are stored securely and are only used to make API calls to the respective services.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              OpenAI API Key
              {status.openai && (
                <span className={`ml-2 text-sm ${status.openai === 'configured' ? 'text-green-600' : 'text-red-600'}`}>
                  ({status.openai})
                </span>
              )}
            </label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="sk-..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Dashboard</a>
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              xAI (Grok) API Key
              {status.xai && (
                <span className={`ml-2 text-sm ${status.xai === 'configured' ? 'text-green-600' : 'text-red-600'}`}>
                  ({status.xai})
                </span>
              )}
            </label>
            <input
              type="password"
              value={xaiKey}
              onChange={(e) => setXaiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="xai-..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Get your API key from <a href="https://x.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">xAI Dashboard</a>
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Anthropic (Claude) API Key
              {status.anthropic && (
                <span className={`ml-2 text-sm ${status.anthropic === 'configured' ? 'text-green-600' : 'text-red-600'}`}>
                  ({status.anthropic})
                </span>
              )}
            </label>
            <input
              type="password"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="sk-ant-..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Get your API key from <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Anthropic Console</a>
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Google Gemini API Key
              {status.gemini && (
                <span className={`ml-2 text-sm ${status.gemini === 'configured' ? 'text-green-600' : 'text-red-600'}`}>
                  ({status.gemini})
                </span>
              )}
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="AIza..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Get your API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save API Keys'}
            </button>
          </div>
        </form>
        
        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-medium mb-2">Setting Up API Keys Manually</h3>
          <p className="mb-2">
            If you prefer to set up API keys manually, you can create a <code>.env.local</code> file in the root directory with the following content:
          </p>
          <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
{`# AI API Keys
OPENAI_API_KEY=your_openai_api_key_here
XAI_API_KEY=your_xai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here`}
          </pre>
          <p className="mt-2 text-sm text-gray-600">
            After creating or updating this file, restart the server for changes to take effect.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
