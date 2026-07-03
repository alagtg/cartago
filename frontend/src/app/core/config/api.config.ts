const useLocalApi = localStorage.getItem('cartago_api_mode') === 'local';

export const API_BASE_URL = useLocalApi
  ? 'http://localhost:5000/api'
  : 'https://cartago.onrender.com/api';
 