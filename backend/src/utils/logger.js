const ts = () => new Date().toISOString();
const logger = {
  info: (m) => console.log(`[${ts()}] [INFO] ${m}`),
  warn: (m) => console.warn(`[${ts()}] [WARN] ${m}`),
  error: (m) => console.error(`[${ts()}] [ERROR] ${m}`),
  debug: (m) => {
    if (process.env.NODE_ENV === 'development') console.debug(`[${ts()}] [DEBUG] ${m}`);
  },
};
export default logger;
