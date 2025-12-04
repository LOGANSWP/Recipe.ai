import { FILE_UPLOAD, ERROR_MESSAGES } from '../constants/validation';

/**
 * Validate image file type
 */
export const validateImageType = (file) => {
  return FILE_UPLOAD.VALID_TYPES.includes(file.type);
};

/**
 * Validate image file size
 */
export const validateImageSize = (file) => {
  return file.size <= FILE_UPLOAD.MAX_SIZE;
};

/**
 * Convert file to Base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(ERROR_MESSAGES.FILE_READ));
    reader.readAsDataURL(file);
  });
};

/**
 * Validate and convert image file
 * @param {File} file - The image file to validate and convert
 * @returns {Promise<string>} Base64 string of the image
 * @throws {Error} If validation fails
 */
export const processImageFile = async (file) => {
  if (!validateImageType(file)) {
    throw new Error(ERROR_MESSAGES.FILE_TYPE);
  }

  if (!validateImageSize(file)) {
    throw new Error(ERROR_MESSAGES.FILE_SIZE);
  }

  return await fileToBase64(file);
};

/**
 * Format file size to human-readable string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Check if URL is a valid HTTP(S) URL
 */
export const isHttpUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
};

/**
 * Check if string is a Base64 data URL
 */
export const isBase64DataUrl = (str) => {
  return str && str.startsWith('data:');
};

