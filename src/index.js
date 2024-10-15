import { initMongoConnection } from './db/initMongoConnection.js';
import setupServer from './server.js';
import { TEMP_UPLOADS_DIR, UPLOADS_DIR } from './constants/path.js';
import createDirIfNotExists from './utils/createDirIfNotExists.js';

const startServer = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOADS_DIR);
  await createDirIfNotExists(UPLOADS_DIR);
  setupServer();
};

startServer();
