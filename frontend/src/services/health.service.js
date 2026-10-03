import http from './http.js';

// Example service wrapping an API resource. Mirrors backend /api/health.
export const healthService = {
  check() {
    return http.get('/health');
  },
};
