// Update document title + key meta/OG tags dynamically.
function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, key, val] = selector.match(/\[(.+?)="(.+?)"\]/) || [];
    if (key && val) el.setAttribute(key, val);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function useSeo() {
  const apply = ({ title, description }) => {
    if (title) {
      document.title = title;
      setMeta('meta[property="og:title"]', 'content', title);
      setMeta('meta[name="twitter:title"]', 'content', title);
    }
    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
      setMeta('meta[name="twitter:description"]', 'content', description);
    }
    setMeta('meta[property="og:url"]', 'content', window.location.href);
  };
  return { apply };
}
