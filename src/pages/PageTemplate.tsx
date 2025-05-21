import React from 'react';

interface PageProps {
  title: string;
  description?: string;
}

const PageTemplate: React.FC<PageProps> = ({ title, description }) => {
  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-900">{title}</h1>
        {description && (
          <p className="mt-4 text-center text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
};

export default PageTemplate; 