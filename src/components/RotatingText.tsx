import React, { useEffect, useState } from 'react';

const RotatingText: React.FC<{ items: string[] }> = ({ items }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <span className="rotating-text">
      {items[index]}
    </span>
  );
};

export default RotatingText; 