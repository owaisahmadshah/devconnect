import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const setupTestDB = () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    if (mongoose.connection.readyState === 1) {
      const collections = mongoose.connection.collections;

      await Promise.all(
        Object.values(collections).map(async collection => {
          await collection.deleteMany({});
        }),
      );
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }

    if (mongoServer) {
      await mongoServer.stop();
    }
  });
};
