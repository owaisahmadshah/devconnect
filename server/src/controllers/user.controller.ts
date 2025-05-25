import type { Request, Response } from 'express';

import type {
  IUniqueIdentifierResponse,
  TAuthUserClient,
  TForgetPassword,
  TResendOtp,
  TSignInUser,
  TVerifyOtp,
  TUniqueIdentifier,
} from 'shared';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { UserService } from '../services/user.service.js';
import { HttpStatus } from 'shared';

export const signUpUser = asyncHandler(async (req: Request, res: Response) => {
  const userData: TAuthUserClient = req.body;

  await UserService.createUser(userData);

  return res
    .status(HttpStatus.CREATED)
    .json(new ApiResponse(HttpStatus.CREATED, {}, 'Created user successfully.'));
});

export const signInUser = asyncHandler(async (req: Request, res: Response) => {
  const userData: TSignInUser = req.body;

  const { accessToken, refreshToken } = await UserService.signInUser(userData);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(HttpStatus.NO_CONTENT)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .end();
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const userData: TVerifyOtp = req.body;

  await UserService.verifyOtp(userData);

  return res.status(HttpStatus.NO_CONTENT).end();
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const userData: TResendOtp = req.body;

  await UserService.resendOtp(userData);

  return res.status(HttpStatus.NO_CONTENT).end();
});

export const signOutUser = asyncHandler(async (req: Request, res: Response) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(HttpStatus.NO_CONTENT)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .end();
});

export const forgetUserPassword = asyncHandler(async (req: Request, res: Response) => {
  const userData: TForgetPassword = req.body;

  const { accessToken, refreshToken } = await UserService.forgetPassword(userData);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(HttpStatus.OK)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(HttpStatus.OK, {}, ''));
});

export const uniqueIdentifier = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.identifier) {
    // Handle the error case
    throw new Error('Missing required identifier parameter');
  }

  const userData: TUniqueIdentifier = { identifier: req.params.identifier };

  const isUniqueIdentifier = await UserService.isIdentifierUnique(userData);

  const isUniqueRes: IUniqueIdentifierResponse = { isUniqueIdentifier: isUniqueIdentifier };

  return res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, isUniqueRes, 'Success.'));
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.headers['authorization']?.replace(/^Bearer\s+/i, '').trim();

  const { accessToken, refreshToken } = await UserService.generateRefreshAccessToken(
    incommingRefreshToken,
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(HttpStatus.OK)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(HttpStatus.OK, {}, ''));
});
