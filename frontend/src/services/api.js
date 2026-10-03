// Thin API layer over the shared Axios instance. Stores call these.
import http from './http.js';

export const api = {
  getBaby: (params) => http.get('/baby', { params }),
  getGallery: (params) => http.get('/gallery', { params }),
  getTimeline: (params) => http.get('/timeline', { params }),
  getMusic: (params) => http.get('/music', { params }),
  getGifts: (params) => http.get('/gift', { params }),
  getWishes: (params) => http.get('/wishes', { params }),
  createWish: (payload) => http.post('/wishes', payload),
  getStats: (params) => http.get('/stats', { params }),
  logVisit: (payload) => http.post('/visitor', payload),
};

export default api;
