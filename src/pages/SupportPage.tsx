import React from 'react';
import PageTemplate from './PageTemplate';

const SupportPage: React.FC = () => {
  return (
    <PageTemplate 
      title="Support" 
      description="Get help with CloudSeek products and services"
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
        <p className="text-gray-600 mb-4">Send us a detailed description of your issue</p>
        <a
          href="mailto:support@cloudseek.io"
          className="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          support@cloudseek.io
        </a>
      </div>
    </PageTemplate>
  );
};

export default SupportPage; 