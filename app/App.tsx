import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogPage from './blog/page';
import BlogPostPage from './pages/BlogPostPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/" element={<BlogPage />} />
      </Routes>
    </Router>
  );
}

export default App; 