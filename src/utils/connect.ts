import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

const connect = async () => {
  const URI = config.get<string>('dbURI');

  try {
    await mongoose.connect(URI);
    logger.info('Db Connected');
  } catch (error) {
    logger.error('Db not connected');
    process.exit(1);
  }
};

export default connect;
