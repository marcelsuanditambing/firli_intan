import { ref, computed } from 'vue';
import { useMusicStore } from '@/stores/music.js';

// Singleton audio controller shared across components.
let audio = null;
const playing = ref(false);

export function useBackgroundMusic() {
  const store = useMusicStore();
  const hasTrack = computed(() => !!store.activeTrack);

  async function ensure() {
    await store.fetch();
    const track = store.activeTrack;
    if (track && !audio) {
      audio = new Audio(track.file_url);
      audio.loop = true;
      audio.preload = 'none';
      audio.addEventListener('play', () => (playing.value = true));
      audio.addEventListener('pause', () => (playing.value = false));
    }
    return audio;
  }

  async function start() {
    const a = await ensure();
    if (a) { try { await a.play(); } catch { /* autoplay blocked */ } }
  }
  async function toggle() {
    const a = await ensure();
    if (!a) return;
    if (a.paused) { try { await a.play(); } catch { /* ignore */ } }
    else a.pause();
  }

  return { playing, hasTrack, start, toggle };
}
