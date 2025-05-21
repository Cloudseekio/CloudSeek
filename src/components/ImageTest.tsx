import React from 'react';

const ImageTest: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Direct Path Test</h2>
          <img 
            src="/images/case-studies/luxe-properties-background.jpg" 
            alt="Luxe Properties" 
            className="max-w-md border border-gray-300"
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Import Test</h2>
          <img 
            src="/test.jpg" 
            alt="Test" 
            className="max-w-md border border-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageTest; 