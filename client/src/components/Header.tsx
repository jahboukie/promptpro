import React from 'react';
import { Link } from 'wouter';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  <path d="M12 7v6"></path>
                  <path d="M9 10h6"></path>
                </svg>
                <span className="text-2xl font-bold text-gray-900">PromptPro</span>
              </div>
            </Link>
          </div>

          <nav className="flex space-x-4">
            <Link href="/">
              <div className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 cursor-pointer">
                Home
              </div>
            </Link>
            <Link href="/prompts">
              <div className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 cursor-pointer">
                My Prompts
              </div>
            </Link>
            <Link href="/categories">
              <div className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 cursor-pointer">
                Categories
              </div>
            </Link>
            <Link href="/prompt-pro">
              <div className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 bg-blue-50 border border-blue-200 cursor-pointer">
                PromptPro
              </div>
            </Link>
            <Link href="/settings">
              <div className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 cursor-pointer">
                Settings
              </div>
            </Link>
          </nav>

          <div>
            <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
