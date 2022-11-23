import cors from 'cors';
import config from 'config';
import cookieParser from 'cookie-parser';

import logger from './utils/logger';
import connect from './utils/connect';
import createServer from './utils/createServer';

const app = createServer();
app.use(
  cors({
    origin: config.get('origin'),
    credentials: true,
  }),
);
app.use(cookieParser());

const port = config.get<number>('port');

app.listen(port, async () => {
  logger.info('app is running');

  await connect();
});
