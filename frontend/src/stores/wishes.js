import { defineStore } from 'pinia';
import api from '@/services/api.js';
import { texts } from '@/config';

export const useWishesStore = defineStore('wishes', {
  state: () => ({
    items: [], meta: null, loading: false, error: null, _promise: null,
    submitting: false, submitError: null, fieldErrors: {}, submitted: false, submitMessage: '',
  }),
  getters: { isEmpty: (s) => !s.loading && !s.error && s.items.length === 0 },
  actions: {
    async fetch(params = {}, force = false) {
      if (this.items.length && !force) return this.items;
      if (this._promise) return this._promise;
      this.loading = true; this.error = null;
      this._promise = api.getWishes(params)
        .then(({ data }) => { this.items = data.data ?? []; this.meta = data.meta ?? null; return this.items; })
        .catch((err) => { this.error = texts.loadError; throw err; })
        .finally(() => { this.loading = false; this._promise = null; });
      return this._promise.catch(() => []);
    },
    async submit(payload) {
      this.submitting = true; this.submitError = null; this.fieldErrors = {}; this.submitted = false;
      // Validasi ringan di sisi browser (pesan mengikuti bahasa situs).
      const local = {};
      if (!String(payload.guest_name || '').trim()) local.guest_name = texts.wishesNameRequired;
      if (!String(payload.message || '').trim()) local.message = texts.wishesMessageRequired;
      if (Object.keys(local).length) {
        this.fieldErrors = local;
        this.submitting = false;
        return false;
      }
      try {
        const { data } = await api.createWish(payload);
        const wish = data?.data;
        // Bila langsung disetujui (WISH_AUTO_APPROVE=true), tampilkan paling atas.
        if (wish?.status === 'approved') {
          this.items.unshift(wish);
          if (this.meta) this.meta.total = (this.meta.total || 0) + 1;
        }
        this.submitMessage = wish?.status === 'approved' ? texts.wishesSuccess : texts.wishesPending;
        this.submitted = true;
        return true;
      } catch (err) {
        const res = err?.response?.data;
        if (res?.errors?.length) {
          const msg = { guest_name: texts.wishesNameRequired, message: texts.wishesMessageRequired };
          this.fieldErrors = res.errors.reduce((acc, e) => { acc[e.field] = msg[e.field] || e.message; return acc; }, {});
        }
        this.submitError = texts.wishesSubmitError;
        return false;
      } finally {
        this.submitting = false;
      }
    },
    resetSubmit() { this.submitted = false; this.submitMessage = ''; this.submitError = null; this.fieldErrors = {}; },
  },
});
