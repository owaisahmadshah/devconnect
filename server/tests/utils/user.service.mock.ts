export const createMockUser = (overrides = {}) => ({
  _id: 'user-id',
  email: 'test@example.com',
  username: 'testuser',
  otp: '123456',
  otpExpiry: new Date(Date.now() + 10000),
  isVerified: true,
  isPasswordCorrect: jest.fn().mockResolvedValue(true),
  generateAccessToken: jest.fn().mockReturnValue('access-token'),
  generateRefreshToken: jest.fn().mockReturnValue('refresh-token'),
  ...overrides,
});

export const createMockSession = () => ({
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
});
