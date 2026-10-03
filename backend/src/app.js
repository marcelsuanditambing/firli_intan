import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import config from './config/index.js';
import routes from './routes/index.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Behind the nginx reverse proxy: trust X-Forwarded-* so req.ip is the client.
app.set('trust proxy', true);

app.use(helmet());
app.use(compression());
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

app.get('/', (req, res) => res.json({ success: true, message: 'API is running' }));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
