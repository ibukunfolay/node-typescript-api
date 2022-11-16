import express from 'express';
import config from 'config';

import routes from './routes';
import logger from '../utils/logger';
import connect from '../utils/connect';
import deserializeUser from './middleware/deserializeUser';

const app = express();
app.use(express.json());
app.use(deserializeUser);

const port = config.get<number>('port');

app.listen(port, async () => {
  logger.info('app is running');

  await connect();
  routes(app);
});
