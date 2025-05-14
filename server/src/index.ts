import { connectDb } from './db/connectDb.js';
import logger from './utils/logger.js';
import { app } from './app.js';

const PORT = process.env.PORT;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    logger.error(`Mongodb connection error: ${error}`);
  });
