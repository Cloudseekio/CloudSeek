import React from 'react';
import PageTemplate from './PageTemplate';
import { Mail, Linkedin } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <PageTemplate 
      title="About Us" 
      description="Learn about our mission and values at CloudSeek"
    >
      <div className="flex items-center space-x-4 mt-4">
        <a href="mailto:sami.azam@cloudseek.io" className="text-gray-400 hover:text-blue-500">
          <Mail size={20} />
        </a>
        <a href="https://linkedin.com/in/samiazam" className="text-gray-400 hover:text-blue-500">
          <Linkedin size={20} />
        </a>
      </div>

      <div className="flex items-center space-x-4 mt-4">
        <a href="mailto:kaleem.azam@cloudseek.io" className="text-gray-400 hover:text-blue-500">
          <Mail size={20} />
        </a>
        <a href="https://linkedin.com/in/kaleemzam" className="text-gray-400 hover:text-blue-500">
          <Linkedin size={20} />
        </a>
      </div>
    </PageTemplate>
  );
};

export default AboutPage; 