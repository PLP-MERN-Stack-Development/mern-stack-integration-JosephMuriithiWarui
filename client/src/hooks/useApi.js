import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Custom hook for making API requests with loading and error state management.
 * @param {string} initialUrl - The endpoint to call (e.g., '/posts')
 * @returns {object} { data, loading, error, request }
 */
const useApi = (initialUrl = '') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 
  const request = useCallback(async (
    method = 'get', 
    url = initialUrl, 
    payload = null
  ) => {
    setLoading(true);
    setError(null);
    let result = null;

    try {
      const response = await axios({
        method,
        url: `${API_URL}${url}`, // Prepend the base API URL
        data: payload,
      });

      result = response.data;
      setData(result);
      
    } catch (err) {
      // Axios error handling, checking for response object
      const errorMessage = err.response 
        ? err.response.data.message || err.message
        : err.message;
        
      setError(errorMessage);
      console.error("API Error:", errorMessage);
      
    } finally {
      setLoading(false);
    }
    
    
    return result; 
  }, [initialUrl]);

  return { data, loading, error, request, setData };
};

export default useApi;