import { defineStore } from 'pinia';
import api from '@/services/api.js';

export const useTimelineStore = defineStore('timeline', {
  state: () => ({ items: [], meta: null, loading: false, error: null, _promise: null }),
  getters: { isEmpty: (s) => !s.loading && !s.error && s.items.length === 0 },
  actions: {
    async fetch(params = {}, force = false) {
      if (this.items.length && !force) return this.items;
      if (this._promise) return this._promise;
      this.loading = true; this.error = null;
      this._promise = api.getTimeline(params)
        .then(({ data }) => { this.items = data.data ?? []; this.meta = data.meta ?? null; return this.items; })
        .catch((err) => { this.error = err?.response?.data?.message || 'Gagal memuat timeline.'; throw err; })
        .finally(() => { this.loading = false; this._promise = null; });
      return this._promise.catch(() => []);
    },
  },
});
