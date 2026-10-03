import { defineStore } from 'pinia';
import api from '@/services/api.js';
import { site } from '@/config';

export const useBabyStore = defineStore('baby', {
  state: () => ({ data: null, loading: false, error: null, _promise: null }),
  getters: {
    parents: (s) => s.data?.parents ?? [],
    // Orang tua saja (untuk "Dengan cinta" dan footer) — dokter dikecualikan.
    familyParents: (s) => (s.data?.parents ?? []).filter((p) => p.role !== 'doctor'),
    // Tenaga medis yang menangani kelahiran.
    doctors: (s) => (s.data?.parents ?? []).filter((p) => p.role === 'doctor'),
    // false selama tanggal lahir masih di masa depan (mode penantian).
    isBorn: (s) => {
      const d = s.data?.birth_date;
      if (!d) return true;
      const t = s.data?.birth_time || '00:00:00';
      return new Date(`${d}T${t}${site.site.timezone.offset}`).getTime() <= Date.now();
    },
  },
  actions: {
    async fetch(force = false) {
      if (this.data && !force) return this.data;
      if (this._promise) return this._promise;
      this.loading = true;
      this.error = null;
      this._promise = api
        .getBaby()
        .then(({ data }) => { this.data = data.data; return this.data; })
        .catch((err) => { this.error = err?.response?.data?.message || 'Gagal memuat data.'; throw err; })
        .finally(() => { this.loading = false; this._promise = null; });
      return this._promise.catch(() => null);
    },
  },
});
