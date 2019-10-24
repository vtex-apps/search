import axios from 'axios';

const axionsInstance = axios.create({
  baseURL: 'https://search.biggylabs.com.br/search-api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axionsInstance;
