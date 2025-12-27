import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../src/app.js';
import { userService } from '../../src/di/user.container.js';
import { HttpStatus, type TAuthUserServer, type TResendOtp, type TSignInUser } from 'shared';
import { loginAsMockUser } from '../utils/auth.mock.js';

jest.mock('../../src/services/user.service.js');

describe('User Controller Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('POST /api/v1/users/signup', () => {
    it('should return BAD_REQUEST (400) if validation fails (Zod milddleware check)', async () => {
      const response = await request(app).post('/api/v1/users/signup').send({});

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return CREATED (201) and success message when data is valid', async () => {
      const validUserData: TAuthUserServer = {
        email: 'owais@gmail.com',
        username: 'owais',
        firstName: 'Owais',
        lastName: 'Ahmad',
        password: '12345678',
        role: 'developer',
      };

      userService.createUser = jest.fn().mockResolvedValue(undefined);

      const response = await request(app).post('/api/v1/users/signup').send(validUserData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.message).toBe('Created user successfully.');

      expect(userService.createUser).toHaveBeenCalledWith(validUserData);
    });
  });

  describe('POST /api/v1/users/signin', () => {
    it('should return BAD_REQUEST (400) if validation fails (Zod middleware check)', async () => {
      const response = await request(app).post('/api/v1/users/signin').send({});

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe('Validation failed.');
    });

    it('should return NO_CONTENT (204) and success message when sign in data is valid', async () => {
      const validUserData: TSignInUser = {
        identifier: 'owais',
        password: '12345678',
      };

      userService.signInUser = jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const response = await request(app).post('/api/v1/users/signin').send(validUserData);
      const cookies = response.get('Set-Cookie');

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      // Verify the array contains strings that PARTIALLY match what we want
      expect(cookies).toEqual(
        expect.arrayContaining([
          expect.stringContaining('accessToken=access-token'),
          expect.stringContaining('refreshToken=refresh-token'),
        ]),
      );

      expect(userService.signInUser).toHaveBeenCalledWith(validUserData);
    });
  });

  describe('POST /api/v1/users/resend-otp', () => {
    it('should throw BAD_REQUEST (404) if validation fails', async () => {
      const response = await request(app).post('/api/v1/users/resend-otp').send({});

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe('Validation failed.');
    });

    it('should generate and send new OTP', async () => {
      const validUserData: TResendOtp = {
        identifier: 'owais@email.com',
      };

      userService.resendOtp = jest.fn().mockResolvedValue(undefined);

      const response = await request(app).post('/api/v1/users/resend-otp').send(validUserData);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      expect(userService.resendOtp).toHaveBeenCalledWith(validUserData);
    });
  });

  describe('POST /api/v1/users/signout', () => {
    it('should return UNAUTHORIZED (401) if token is not provided', async () => {
      const response = await request(app).post('/api/v1/users/signout');

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return NO_CONTENT (204) and clear cookies when signout', async () => {
      loginAsMockUser();

      const response = await request(app)
        .post('/api/v1/users/signout')
        .set('Authorization', 'Bearer dummy');

      expect(response.status).toBe(204);
      // @ts-ignore
      expect(response.get('Set-Cookie')[0]).toContain('Expires=Thu, 01 Jan 1970');
    });
  });
});
