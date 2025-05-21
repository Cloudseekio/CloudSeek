/**
 * This script analyzes the codebase for potentially unsafe React hook usage
 * that might cause "Cannot read properties of null (reading 'useState')" errors
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Patterns to check for
const UNSAFE_PATTERNS = [
  {
    pattern: /import\s+React\s*,\s*{\s*([^}]*)useState([^}]*)\s*}/,
    message: 'Destructured useState import might cause issues - use namespace import instead'
  },
  {
    pattern: /React\.useState(?!\s*<)/,
    message: 'Missing type parameter on useState'
  },
  {
    pattern: /window\..*\s*=\s*useState/,
    message: 'Unsafe browser API access in useState initializer'
  },
  {
    pattern: /navigator\..*\s*=\s*useState/,
    message: 'Unsafe navigator API access in useState initializer'
  },
  {
    pattern: /document\..*\s*=\s*useState/,
    message: 'Unsafe document API access in useState initializer'
  }
];

// Files/folders to exclude
const EXCLUDES = [
  'node_modules',
  'dist',
  'build',
  '.git',
  'scripts'
];

// Safe pattern example to recommend
const SAFE_PATTERN = `
import * as React from 'react';
const { useState, useEffect } = React;

// Check if in browser environment
const isBrowser = typeof window !== 'undefined';

function MyComponent() {
  const [value, setValue] = useState(isBrowser ? window.someValue : defaultValue);
  // ...
}
`;

// Get all TS/TSX/JS files
const getAllFiles = () => {
  return glob.sync('src/**/*.{ts,tsx,js,jsx}', { ignore: EXCLUDES.map(e => `**/${e}/**`) });
};

// Check file content for issues
const checkFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  UNSAFE_PATTERNS.forEach(({ pattern, message }) => {
    if (pattern.test(content)) {
      issues.push({ message });
    }
  });

  return issues;
};

// Main function
const main = () => {
  console.log('🔍 Checking for unsafe React hook usage...\n');
  
  const files = getAllFiles();
  let issueCount = 0;
  
  files.forEach(file => {
    const issues = checkFile(file);
    if (issues.length > 0) {
      console.log(`❌ ${file}:`);
      issues.forEach(issue => {
        console.log(`   - ${issue.message}`);
        issueCount++;
      });
      console.log('');
    }
  });
  
  if (issueCount === 0) {
    console.log('✅ No unsafe React hook usage detected!');
  } else {
    console.log(`⚠️ Found ${issueCount} potential issues.`);
    console.log('\nRecommended safe pattern:');
    console.log(SAFE_PATTERN);
    
    console.log('\nYou should consider using a safe wrapper hook or check for browser environment before using browser APIs with hooks.');
  }
};

// Run the script
main(); 