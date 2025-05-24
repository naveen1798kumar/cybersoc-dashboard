import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Update if using a different port or deployed
});

export default api;
