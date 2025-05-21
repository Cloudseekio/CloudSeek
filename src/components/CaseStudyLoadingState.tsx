import React from 'react';

const CaseStudyLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white animate-pulse">
      {/* Header placeholder */}
      <div className="bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-10 bg-gray-800 rounded w-40"></div>
        </div>
      </div>
      
      {/* Hero section placeholder */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-10 bg-gray-800 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-800 rounded w-2/4 mb-8"></div>
          <div className="h-64 bg-gray-800 rounded w-full"></div>
        </div>
      </div>
      
      {/* Content section placeholder */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer placeholder */}
      <div className="bg-gray-900 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i}>
                <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyLoadingState; 