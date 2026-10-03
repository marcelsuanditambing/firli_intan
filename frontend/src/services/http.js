import axios from 'axios';
import { site } from '@/config';

// Pre-configured Axios instance. Components/stores import this, not axios.
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setiap request membawa ?baby=<slug> dari site.config.js, sehingga backend
// selalu menyajikan data bayi yang benar (tidak bergantung DEFAULT_BABY_SLUG).
http.interceptors.request.use((config) => {
  config.params = { baby: site.site.slug, ...(config.params || {}) };
  return config;
});

// Response interceptor: normalise errors in one place.
http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default http;
