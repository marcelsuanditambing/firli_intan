import { defineStore } from 'pinia';
import api from '@/services/api.js';

export const useMusicStore = defineStore('music', {
  state: () => ({ items: [], loading: false, error: null, playing: false, _promise: null }),
  getters: {
    activeTrack: (s) => s.items.find((t) => t.is_active) || s.items[0] || null,
  },
  actions: {
    async fetch(params = {}, force = false) {
      if (this.items.length && !force) return this.items;
      if (this._promise) return this._promise;
      this.loading = true; this.error = null;
      this._promise = api.getMusic(params)
        .then(({ data }) => { this.items = data.data ?? []; return this.items; })
        .catch((err) => { this.error = err?.response?.data?.message || 'Gagal memuat musik.'; throw err; })
        .finally(() => { this.loading = false; this._promise = null; });
      return this._promise.catch(() => []);
    },
    setPlaying(v) { this.playing = v; },
  },
});
