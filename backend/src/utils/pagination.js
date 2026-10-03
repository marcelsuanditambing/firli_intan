// Helpers for pagination & whitelisted filtering/sorting.

export function getPagination(query, { defaultLimit = 12, maxLimit = 100 } = {}) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);
  if (!Number.isInteger(page) || page < 1) page = 1;
  if (!Number.isInteger(limit) || limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;
  return { page, limit, offset: (page - 1) * limit };
}

export function buildMeta(count, page, limit) {
  return {
    total: count,
    page,
    limit,
    total_pages: Math.max(1, Math.ceil(count / limit)),
  };
}

// Build a Sequelize `where` from query params, restricted to an allowed map.
// allowed = { queryKey: 'column' }  (only these keys are honoured)
export function buildWhere(query, allowed = {}) {
  const where = {};
  for (const [key, column] of Object.entries(allowed)) {
    if (query[key] !== undefined && query[key] !== '') {
      let value = query[key];
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      where[column] = value;
    }
  }
  return where;
}

// Build a Sequelize `order` from ?sort=col&order=asc|desc, restricted to allowed columns.
export function buildOrder(query, allowedColumns = [], fallback = [['id', 'ASC']]) {
  const sort = query.sort;
  const dir = String(query.order || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  if (sort && allowedColumns.includes(sort)) return [[sort, dir]];
  return fallback;
}
