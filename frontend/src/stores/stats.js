import { defineStore } from 'pinia';
import api from '@/services/api.js';
import { texts } from '@/config';

export const useStatsStore = defineStore('stats', {
  state: () => ({ data: null, loading: false, error: null, _promise: null }),
  actions: {
    async fetch(force = false) {
      if (this.data && !force) return this.data;
      if (this._promise) return this._promise;
      this.loading = true; this.error = null;
      this._promise = api.getStats()
        .then(({ data }) => { this.data = data.data; return this.data; })
        .catch((err) => { this.error = texts.loadError; throw err; })
        .finally(() => { this.loading = false; this._promise = null; });
      return this._promise.catch(() => null);
    },
  },
});
