import mongoose from 'mongoose';

// @ts-ignore
import { User } from '../../src/models/user.model.js';
// @ts-ignore
import { UserRepository } from '../../src/repositories/user.repository.js';
// @ts-ignore
import { setupTestDB } from '../database/mongo-setup.js';

setupTestDB();

describe('UserRepository', () => {
  let repo: UserRepository;

  const baseUser = {
    username: 'abc123',
    firstName: 'Owais',
    lastName: 'Ahmad Shah',
    email: 'example@mail.com',
    password: 'abcd1234',
  };

  beforeEach(async () => {
    repo = new UserRepository();
    await User.deleteMany({});
  });

  describe('create()', () => {
    it('creates a user and returns a persisted document', async () => {
      const user = await repo.create(baseUser);

      expect(user).toBeDefined();
      expect(user._id).toBeDefined();
      expect(mongoose.isValidObjectId(user._id)).toBe(true);

      const dbUser = await User.findById(user._id);
      expect(dbUser).not.toBeNull();
    });

    it('hashes the password before saving', async () => {
      const user = await repo.create(baseUser);

      expect(user.password).not.toBe(baseUser.password);
      const isCorrect = await user.isPasswordCorrect(baseUser.password);
      expect(isCorrect).toBe(true);
    });
  });

  describe('findById()', () => {
    it('returns a user when id exists', async () => {
      const created = await repo.create(baseUser);

      const found = await repo.findById(created._id.toString());

      expect(found).not.toBeNull();
      expect(found!._id.toString()).toBe(created._id.toString());
    });

    it('returns null when user does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const found = await repo.findById(fakeId);

      expect(found).toBeNull();
    });
  });

  describe('findByIdentifier()', () => {
    beforeEach(async () => {
      await repo.create(baseUser);
    });

    it('finds user by username', async () => {
      const user = await repo.findByIdentifier(baseUser.username);

      expect(user).not.toBeNull();
      expect(user!.username).toBe(baseUser.username);
    });

    it('finds user by email', async () => {
      const user = await repo.findByIdentifier(baseUser.email);

      expect(user).not.toBeNull();
      expect(user!.email).toBe(baseUser.email);
    });

    it('returns null when identifier does not exist', async () => {
      const user = await repo.findByIdentifier('non-existent');

      expect(user).toBeNull();
    });
  });

  describe('updateRefreshToken()', () => {
    it('updates refresh token and persists it', async () => {
      const user = await repo.create(baseUser);

      const refreshToken = user.generateRefreshToken();

      await repo.updateRefreshToken(user._id.toString(), refreshToken);

      const updated = await User.findById(user._id);

      expect(updated).not.toBeNull();
      expect(updated!.refreshToken).toBe(refreshToken);
    });
  });

  describe('updateVerificationStatus()', () => {
    it('sets isVerified to true', async () => {
      const user = await repo.create(baseUser);

      await repo.updateVerificationStatus(user._id.toString(), true);

      const updated = await User.findById(user._id);

      expect(updated!.isVerified).toBe(true);
    });

    it('sets isVerified to false', async () => {
      const user = await repo.create(baseUser);

      await repo.updateVerificationStatus(user._id.toString(), false);

      const updated = await User.findById(user._id);

      expect(updated!.isVerified).toBe(false);
    });
  });

  describe('saveWithValidation()', () => {
    it('runs validation and middleware when saving', async () => {
      const user = await repo.create(baseUser);
      const oldPasswordHash = user.password;

      user.password = 'new-password';

      await repo.saveWithValidation(user);

      const updated = await User.findById(user._id);

      expect(updated!.password).not.toBe(oldPasswordHash);
      const isCorrect = await updated!.isPasswordCorrect('new-password');
      expect(isCorrect).toBe(true);
    });
  });
});
