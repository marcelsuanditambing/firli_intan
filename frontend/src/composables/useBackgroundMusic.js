import { ref, computed } from 'vue';
import { useMusicStore } from '@/stores/music.js';

// Singleton audio controller shared across components.
let audio = null;
const playing = ref(false);
const failed = ref(false); // file lagu tidak bisa dimuat -> tombol musik disembunyikan

export function useBackgroundMusic() {
  const store = useMusicStore();
  const hasTrack = computed(() => !!store.activeTrack && !failed.value);

  async function ensure() {
    await store.fetch();
    const track = store.activeTrack;
    if (track && !audio) {
      audio = new Audio(track.file_url);
      audio.loop = true;
      audio.preload = 'none';
      audio.addEventListener('play', () => (playing.value = true));
      audio.addEventListener('pause', () => (playing.value = false));
      audio.addEventListener('error', () => {
        playing.value = false;
        failed.value = true;
      });
    }
    return audio;
  }

  async function start() {
    const a = await ensure();
    if (a) { try { await a.play(); } catch { playing.value = !a.paused; } }
  }
  async function toggle() {
    const a = await ensure();
    if (!a) return;
    if (a.paused) { try { await a.play(); } catch { /* ignore */ } }
    else a.pause();
  }

  return { playing, hasTrack, start, toggle };
}
