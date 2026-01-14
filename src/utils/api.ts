// API URL helper - uses /api for production (Vercel), localhost for development
export const getApiUrl = (): string => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return '/api'; // Vercel serverless functions
  }
  return 'http://localhost:5000/api'; // Local development
};

export const API_BASE_URL = getApiUrl();
