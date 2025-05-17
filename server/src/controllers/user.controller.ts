import type { Request, Response } from 'express';

import type { TAuthUser, TResendOtp, TSignInUser, TVerifyOtp } from 'shared';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { UserService } from '../services/user.service.js';
import { HttpStatus } from 'shared';

export const signUpUser = asyncHandler(async (req: Request, res: Response) => {
  const userData: TAuthUser = req.body;

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
    .json(new ApiResponse(HttpStatus.NO_CONTENT, {}, 'Logged In user sucessfully.'));
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const userData: TVerifyOtp = req.body;

  await UserService.verifyOtp(userData);

  return res
    .status(HttpStatus.NO_CONTENT)
    .json(new ApiResponse(HttpStatus.NO_CONTENT, {}, 'Verified OTP sucessfully.'));
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const userData: TResendOtp = req.body;

  await UserService.resendOtp(userData);

  return res
    .status(HttpStatus.NO_CONTENT)
    .json(new ApiResponse(HttpStatus.NO_CONTENT, {}, 'Resend OTP successfully.'));
});
