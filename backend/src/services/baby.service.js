import { Baby } from '../models/index.js';
import config from '../config/index.js';
import ApiError from '../utils/ApiError.js';

// Resolve the "active" baby for a request: ?baby=<slug>, else the configured
// default slug, else the first baby. Throws 404 when none exists.
export async function resolveBaby(query = {}, { withParents = false } = {}) {
  const include = withParents
    ? [{ association: 'parents', separate: true, order: [['sort_order', 'ASC']] }]
    : [];

  let baby = null;
  const slug = query.baby || config.app.defaultBabySlug;

  if (slug) baby = await Baby.findOne({ where: { slug }, include });
  if (!baby) baby = await Baby.findOne({ order: [['id', 'ASC']], include });

  if (!baby) throw new ApiError(404, 'Baby profile not found');
  return baby;
}
