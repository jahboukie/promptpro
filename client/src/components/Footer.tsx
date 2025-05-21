import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow mt-8 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} PromptPro. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
