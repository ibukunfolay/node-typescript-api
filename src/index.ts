import config from 'config';

import logger from './utils/logger';
import connect from './utils/connect';
import createServer from './utils/createServer';

const app = createServer();

const port = config.get<number>('port');

app.listen(port, async () => {
  logger.info('app is running');

  await connect();
});
