import jwt from 'jsonwebtoken';
import { User } from '../../src/models/user.model.js';

export const loginAsMockUser = (mockUserId = 'mock-123') => {
  const jwtSpy = jest.spyOn(jwt, 'verify').mockReturnValue({ _id: mockUserId } as any);

  const userSpy = jest.spyOn(User, 'findById').mockReturnValue({
    select: jest.fn().mockResolvedValue({
      _id: mockUserId,
      username: 'testuser',
      email: 'test@example.com',
      role: 'developer',
    }),
  } as any);

  return { jwtSpy, userSpy };
};
