import jwt from 'jsonwebtoken';

// @ts-ignore
import { User } from '../../src/models/user.model.js';
// @ts-ignore
import { setupTestDB } from '../database/mongo-setup.js';

setupTestDB();

describe('User schema validation', () => {
  it('should require username', async () => {
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
    });

    await expect(user.save()).rejects.toThrow('Username is required.');
  });

  it('should require email', async () => {
    const user = new User({
      username: 'testuser',
      password: 'password123',
    });

    await expect(user.save()).rejects.toThrow('Email is required');
  });
});

describe('Password Hashing', () => {
  it('should hash password before saving', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'plaintext123',
    });

    await user.save();
    expect(user.password).not.toBe('plaintext123');
    expect(user.password).toMatch(/^\$2[aby]\$/);
  });

  it('should not rehash password when not modified', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'plaintext123',
    });

    await user.save();
    const originalHash = user.password;

    user.email = 'updated@example.com';
    await user.save();

    expect(user.password).toBe(originalHash);
  });
});

describe('User Instance Methods', () => {
  let user: any;

  beforeEach(async () => {
    user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'correctpassword',
    });
    await user.save();
  });

  describe('isPasswordCorrect', () => {
    it('should return true for correct password', async () => {
      const result = await user.isPasswordCorrect('correctpassword');
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const result = await user.isPasswordCorrect('wrongpassword');
      expect(result).toBe(false);
    });
  });

  describe('generateAccessToken', () => {
    beforeEach(() => {
      process.env.ACCESS_TOKEN_SECRET = 'test-access-secret';
    });

    it('should generate a valid JWT token', () => {
      const token = user.generateAccessToken();
      expect(typeof token).toBe('string');

      // Verify token structure
      const parts = token.split('.');
      expect(parts.length).toBe(3); // Header.Payload.Signature
    });

    it('should include user data in token', () => {
      const token = user.generateAccessToken();
      const decoded = jwt.verify(token, 'test-access-secret') as any;

      expect(decoded._id).toBe(user._id.toString());
      expect(decoded.email).toBe(user.email);
      expect(decoded.role).toBe(user.role);
    });
  });

  describe('generateRefreshToken', () => {
    beforeEach(() => {
      process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';
    });

    it('should generate a refresh token', () => {
      const token = user.generateRefreshToken();
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, 'test-refresh-secret') as any;
      expect(decoded._id).toBe(user._id.toString());
    });
  });
});
