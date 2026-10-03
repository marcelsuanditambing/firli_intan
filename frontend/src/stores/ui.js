import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({ splashOpen: true }),
  actions: {
    openInvitation() { this.splashOpen = false; },
  },
});
