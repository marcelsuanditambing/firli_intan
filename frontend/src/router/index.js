import { createRouter, createWebHistory } from 'vue-router';
import { site } from '@/config';

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  // Halaman semua ucapan: /ucapan (id) atau /wishes (en); alamat lain tetap diarahkan.
  {
    path: site.site.wishesPath || '/ucapan',
    alias: ['/ucapan', '/wishes'].filter((p) => p !== (site.site.wishesPath || '/ucapan')),
    name: 'wishes',
    component: () => import('@/views/WishesView.vue'),
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
