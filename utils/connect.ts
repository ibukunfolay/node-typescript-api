import mongoose from 'mongoose';
import config from 'config';
import log from './logger';

const connect = async () => {
  const URI = config.get<string>('dbURI');

  try {
    await mongoose.connect(URI);
    log.info('Db Connected');
  } catch (error) {
    log.error('Db not connected');
    process.exit(1);
  }
};

export default connect;
