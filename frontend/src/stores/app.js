import { defineStore } from 'pinia';

// Global app store (foundation). Add domain stores in their own files.
export const useAppStore = defineStore('app', {
  state: () => ({
    ready: true,
  }),
  actions: {},
});
