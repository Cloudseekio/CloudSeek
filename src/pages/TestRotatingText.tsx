import React, { useState, useEffect } from 'react';

const TestRotatingText: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const phrases = [
    {
      company: "ABB",
      metric: "100%",
      text: "ticket resolution"
    },
    {
      company: "Microsoft",
      metric: "30%",
      text: "efficiency improvement"
    },
    {
      company: "Salesforce",
      text: "enhanced customer satisfaction"
    }
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false); // Start fade out
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        setIsVisible(true); // Start fade in
      }, 1500); // Wait for fade out to complete (increased to 1.5 seconds)
      
    }, 5000); // Total time for each phrase (increased to 5 seconds)

    return () => clearInterval(intervalId);
  }, [phrases.length]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div 
        className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <h2 className="text-4xl font-bold text-white text-center">
          We Helped{' '}
          <span className="text-blue-500">{phrases[currentIndex].company}</span>{' '}
          to Achieve{' '}
          {phrases[currentIndex].metric && (
            <span className="text-green-500">{phrases[currentIndex].metric}</span>
          )}{' '}
          {phrases[currentIndex].text}
        </h2>
      </div>
    </div>
  );
};

export default TestRotatingText; 