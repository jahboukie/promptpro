import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'wouter';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Settings from './pages/Settings';
import PromptPro from './pages/PromptPro';
import NewPromptPro from './pages/NewPromptPro';

function App() {
  const [apiStatus, setApiStatus] = useState<string>('Loading...');

  useEffect(() => {
    // Check API status
    fetch('/api/hello')
      .then(response => response.json())
      .then(data => {
        setApiStatus(data.message);
      })
      .catch(error => {
        console.error('API Error:', error);
        setApiStatus('Error connecting to API');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/prompts" component={PromptsList} />
              <Route path="/categories" component={Categories} />
              <Route path="/settings" component={Settings} />
              <Route path="/prompt-pro" component={NewPromptPro} />
              <Route path="/prompt-pro-old" component={PromptPro} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function PromptsList() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Prompts</h2>
      <p className="mb-4">
        This page will display your saved prompts.
      </p>
      <div className="text-center py-8">
        <p className="text-gray-500">No prompts saved yet.</p>
        <button type="button" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Create Your First Prompt
        </button>
      </div>
    </div>
  );
}

function Categories() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <p className="mb-4">
        Organize your prompts by categories.
      </p>
      <div className="text-center py-8">
        <p className="text-gray-500">No categories created yet.</p>
        <button type="button" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Create Your First Category
        </button>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

export default App;
