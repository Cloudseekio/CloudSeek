import React from 'react';
import AboutBanner from '../components/AboutBanner';

const Company = () => {
  return (
    <div className="company-page">
      <AboutBanner />
      <section className="values-section">
        <h2>Our Values</h2>
        {/* ... rest of the content ... */}
      </section>
    </div>
  );
};

export default Company; 