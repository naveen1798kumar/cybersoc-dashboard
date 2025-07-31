import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cybersoc-backend.onrender.com/api', // Update if using a different port or deployed
});

export default api;
