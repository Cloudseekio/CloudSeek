import React, { useState, useEffect } from 'react';

interface RotatingTextSliderProps {
  children: React.ReactNode[];
}

const RotatingTextSlider: React.FC<RotatingTextSliderProps> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === React.Children.count(children) - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change text every 5 seconds

    return () => clearInterval(interval);
  }, [children]);

  return (
    <div className="relative min-h-[60px] md:min-h-[60px] overflow-hidden">
      {React.Children.map(children, (child, index) => (
        <div
          className={`absolute w-full transition-all duration-500 transform ${
            index === currentIndex 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default RotatingTextSlider; 