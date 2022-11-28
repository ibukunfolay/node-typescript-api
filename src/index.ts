import cors from 'cors';
import config from 'config';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import logger from './utils/logger';
import connect from './utils/connect';
import createServer from './utils/createServer';

const app = createServer();

dotenv.config();
app.use(cookieParser());
app.use(
  cors({
    origin: config.get('origin'),
    credentials: true,
  }),
);

const port = config.get<number>('port');

app.listen(port, async () => {
  logger.info('app is running');

  await connect();
});
