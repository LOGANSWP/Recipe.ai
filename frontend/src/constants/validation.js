// File upload validation constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  VALID_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  VALID_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
};

// Form validation constants
export const FORM_VALIDATION = {
  NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 20,
  },
};

// Error messages
export const ERROR_MESSAGES = {
  FILE_TYPE: 'Please upload a valid image file (JPG, PNG, GIF, or WebP)',
  FILE_SIZE: 'Image size must be less than 5MB',
  FILE_READ: 'Failed to read image file',
  NETWORK: 'Network error occurred',
  UNKNOWN: 'An unexpected error occurred',
};

