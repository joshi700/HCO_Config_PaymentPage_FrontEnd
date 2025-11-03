/**
 * Image Upload Utility
 * Helper functions for processing, validating, and optimizing logo images
 */

export const ImageUtils = {
  /**
   * Validate image file
   */
  validateImage: (file) => {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Invalid file type. Please upload PNG, JPG, GIF, WebP, or SVG.' 
      };
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: `File too large. Maximum size is 2MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.` 
      };
    }

    return { valid: true, error: null };
  },

  /**
   * Convert image file to base64
   */
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * Validate image URL
   */
  validateUrl: (url) => {
    if (!url) return false;
    
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || url.startsWith('data:');
    } catch {
      return false;
    }
  },

  /**
   * Get image dimensions
   */
  getImageDimensions: (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.onerror = reject;
      img.src = url;
    });
  },

  /**
   * Format file size for display
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Check if image meets recommended specs
   */
  checkRecommendedSpecs: (width, height) => {
    const recommendedWidth = 200;
    const recommendedHeight = 60;
    const tolerance = 0.3;
    
    const widthDiff = Math.abs(width - recommendedWidth) / recommendedWidth;
    const heightDiff = Math.abs(height - recommendedHeight) / recommendedHeight;
    
    if (widthDiff <= tolerance && heightDiff <= tolerance) {
      return { 
        optimal: true, 
        message: '✓ Image dimensions are optimal!' 
      };
    }
    
    if (width > recommendedWidth * 2 || height > recommendedHeight * 2) {
      return { 
        optimal: false, 
        message: `⚠️ Image is quite large (${width}×${height}px). Recommended: ${recommendedWidth}×${recommendedHeight}px` 
      };
    }
    
    if (width < recommendedWidth * 0.5 || height < recommendedHeight * 0.5) {
      return { 
        optimal: false, 
        message: `⚠️ Image might be too small (${width}×${height}px). Recommended: ${recommendedWidth}×${recommendedHeight}px` 
      };
    }
    
    return { 
      optimal: false, 
      message: `ℹ️ Current size: ${width}×${height}px. Recommended: ${recommendedWidth}×${recommendedHeight}px` 
    };
  }
};

export default ImageUtils;
