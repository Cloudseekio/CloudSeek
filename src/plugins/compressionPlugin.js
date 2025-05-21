// compressionPlugin.js
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';

const brotliCompress = promisify(zlib.brotliCompress);
const gzipCompress = promisify(zlib.gzip);

// File types that should be compressed
const COMPRESSABLE_EXTENSIONS = [
  '.js', '.css', '.html', '.json', '.svg', 
  '.xml', '.txt', '.ttf', '.otf', '.eot'
];

// Default Brotli compression options
const BROTLI_OPTIONS = {
  params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: 11, // Maximum compression (0-11)
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT, // Text mode optimized for web
    [zlib.constants.BROTLI_PARAM_SIZE_HINT]: 0 // Auto size hint
  }
};

// Default Gzip compression options for fallback
const GZIP_OPTIONS = {
  level: 9, // Maximum compression
  memLevel: 9 // Maximum memory for compression
};

/**
 * Vite plugin for compressing assets with Brotli and Gzip
 */
export function compressionPlugin() {
  return {
    name: 'vite-plugin-compression',
    apply: 'build',
    enforce: 'post',
    
    writeBundle(outputOptions, bundle) {
      const dir = outputOptions.dir || 'dist';
      const files = Object.values(bundle);
      
      const compressionTasks = [];
      
      for (const file of files) {
        if (!file.fileName || !isCompressableFile(file.fileName)) continue;
        
        const filePath = path.join(dir, file.fileName);
        
        if (!fs.existsSync(filePath)) continue;
        
        const fileContent = fs.readFileSync(filePath);
        if (fileContent.length < 1024) continue; // Skip small files (less than 1KB)
        
        // Add Brotli compression task
        compressionTasks.push(
          compressFile(fileContent, filePath, '.br', brotliCompress, BROTLI_OPTIONS)
        );
        
        // Add Gzip compression task for fallback
        compressionTasks.push(
          compressFile(fileContent, filePath, '.gz', gzipCompress, GZIP_OPTIONS)
        );
      }
      
      // Run all compression tasks
      return Promise.all(compressionTasks)
        .then(() => {
          const totalFiles = compressionTasks.length / 2; // Divide by 2 because we have Brotli and Gzip for each file
          console.log(`✅ Compressed ${totalFiles} files with Brotli and Gzip`);
        })
        .catch(error => {
          console.error('Error compressing files:', error);
        });
    }
  };
}

/**
 * Check if file should be compressed based on extension
 */
function isCompressableFile(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return COMPRESSABLE_EXTENSIONS.includes(ext);
}

/**
 * Compress a file with the specified algorithm and write it to disk
 */
async function compressFile(content, filePath, ext, compressFunction, options) {
  try {
    const compressedContent = await compressFunction(content, options);
    const outputPath = filePath + ext;
    
    fs.writeFileSync(outputPath, compressedContent);
    
    // Log compression ratio
    const originalSize = content.length;
    const compressedSize = compressedContent.length;
    const ratio = Math.round((1 - compressedSize / originalSize) * 100);
    
    console.log(`${path.basename(filePath)}${ext}: ${formatBytes(originalSize)} → ${formatBytes(compressedSize)} (${ratio}% smaller)`);
  } catch (error) {
    console.error(`Error compressing ${filePath}${ext}:`, error);
  }
}

/**
 * Format bytes to human-readable format
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
} 