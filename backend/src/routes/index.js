// API router aggregator. Read-only content routes resolve the active baby via
// attachBaby (req.baby). For write routes, attachBaby is applied per-route
// AFTER validation so malformed requests are rejected before any DB lookup.
import { Router } from 'express';
import attachBaby from '../middlewares/attachBaby.js';

import healthRoutes from './health.routes.js';
import babyRoutes from './baby.routes.js';
import galleryRoutes from './gallery.routes.js';
import timelineRoutes from './timeline.routes.js';
import musicRoutes from './music.routes.js';
import giftRoutes from './gift.routes.js';
import wishRoutes from './wish.routes.js';
import visitorRoutes from './visitor.routes.js';
import statsRoutes from './stats.routes.js';

const router = Router();

router.use('/health', healthRoutes);

// Read-only content endpoints (resolve baby up front)
router.use('/baby', attachBaby, babyRoutes);
router.use('/gallery', attachBaby, galleryRoutes);
router.use('/timeline', attachBaby, timelineRoutes);
router.use('/music', attachBaby, musicRoutes);
router.use('/gift', attachBaby, giftRoutes);
router.use('/stats', attachBaby, statsRoutes);

// Mixed read/write endpoints (attachBaby applied inside, per method)
router.use('/wishes', wishRoutes);
router.use('/visitor', visitorRoutes);

export default router;
