import React from 'react';
import TestImage1 from '../assets/images/card-image-1.jpg'; // Adjust the path as necessary
import TestImage2 from '../assets/images/card-image-2.jpg'; // Adjust the path as necessary
import TestImage3 from '../assets/images/card-image-3.jpg'; // Adjust the path as necessary
import './TestPage.css'; // Adjust the path as necessary

function TestPage() {
  return (
    <div>
      <h1>Image Upload Test Page</h1>
      <div className="card-container">
        <div className="card">
          <img src={TestImage1} alt="Test Image 1" />
          <h3>Test Card 1</h3>
          <p>This is a description for Test Card 1.</p>
        </div>
        <div className="card">
          <img src={TestImage2} alt="Test Image 2" />
          <h3>Test Card 2</h3>
          <p>This is a description for Test Card 2.</p>
        </div>
        <div className="card">
          <img src={TestImage3} alt="Test Image 3" />
          <h3>Test Card 3</h3>
          <p>This is a description for Test Card 3.</p>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
