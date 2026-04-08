import type { Request, Response } from 'express';
import crypto from 'crypto';

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
import { ApiError } from '../utils/ApiError.js';
import { UserService } from '../services/user.service.js';
import { HttpStatus } from 'shared';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../config/cookie.config.js';

export class UserController {
  constructor(private service: UserService) {}

  /**
   * Registers a new user.
   *
   * @route POST /api/v1/users/signup
   *
   * @param {Request} req - Contains:
   *   - req.body: TAuthUserClient (user registration data: username, email, password, etc.)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<{}>>} - Returns HTTP 201 Created on success
   *
   * @description
   * Creates a new user in the database, generates OTP for verification,
   * sends the OTP via email, and initializes a user profile.
   */
  signUpUser = asyncHandler(async (req: Request, res: Response) => {
    const userData: TAuthUserClient = req.body;

    await this.service.createUser(userData);

    return res
      .status(HttpStatus.CREATED)
      .json(new ApiResponse(HttpStatus.CREATED, {}, 'Created user successfully.'));
  });

  /**
   * Signs in an existing user.
   *
   * @route POST /api/v1/users/signin
   *
   * @param {Request} req - Contains:
   *   - req.body: TSignInUser (identifier: email/username, password)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<void>} - Returns HTTP 204 No Content on success and sets cookies:
   *   - accessToken
   *   - refreshToken
   *
   * @description
   * Authenticates the user, validates the password, ensures the account is verified,
   * and sets access and refresh tokens in HTTP-only cookies.
   */
  signInUser = asyncHandler(async (req: Request, res: Response) => {
    const userData: TSignInUser = req.body;

    const { accessToken, refreshToken } = await this.service.signInUser(userData);

    return res
      .status(HttpStatus.NO_CONTENT)
      .cookie('accessToken', accessToken, accessTokenCookieOptions)
      .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
      .end();
  });

  /**
   * Verifies OTP for a user.
   *
   * @route POST /api/v1/users/verify-otp
   *
   * @param {Request} req - Contains:
   *   - req.body: TVerifyOtp (identifier: email/username, otp)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<void>} - Returns HTTP 204 No Content on success
   *
   * @description
   * Validates the OTP for the user and marks the account as verified if successful.
   * Throws errors if OTP is invalid or expired.
   */
  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const userData: TVerifyOtp = req.body;

    await this.service.verifyOtp(userData);

    return res.status(HttpStatus.NO_CONTENT).end();
  });

  /**
   * Resends OTP to the user.
   *
   * @route POST /api/v1/users/resend-otp
   *
   * @param {Request} req - Contains:
   *   - req.body: TResendOtp (identifier: email/username)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<void>} - Returns HTTP 204 No Content on success
   *
   * @description
   * Generates a new OTP and sends it via email to the user.
   */
  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const userData: TResendOtp = req.body;

    await this.service.resendOtp(userData);

    return res.status(HttpStatus.NO_CONTENT).end();
  });

  /**
   * Signs out the authenticated user.
   *
   * @route POST /api/v1/users/signout
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<void>} - Returns HTTP 204 No Content on success
   *
   * @description
   * Clears access and refresh tokens cookies to log out the user.
   */
  signOutUser = asyncHandler(async (req: Request, res: Response) => {
    return res
      .status(HttpStatus.NO_CONTENT)
      .clearCookie('accessToken', accessTokenCookieOptions)
      .clearCookie('refreshToken', refreshTokenCookieOptions)
      .end();
  });

  /**
   * Handles password reset for a user.
   *
   * @route POST /api/v1/users/forget-password
   *
   * @param {Request} req - Contains:
   *   - req.body: TForgetPassword (identifier: email/username, otp, new password)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<{}>>} - Returns HTTP 200 OK with new tokens in cookies
   *
   * @description
   * Verifies the OTP, updates the user's password, and issues new access and refresh tokens.
   */
  forgetUserPassword = asyncHandler(async (req: Request, res: Response) => {
    const userData: TForgetPassword = req.body;

    const { accessToken, refreshToken } = await this.service.forgetPassword(userData);

    return res
      .status(HttpStatus.OK)
      .cookie('accessToken', accessToken, accessTokenCookieOptions)
      .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
      .json(new ApiResponse(HttpStatus.OK, {}, 'Password reset successfully.'));
  });

  /**
   * Checks if a username or email is unique.
   *
   * @route GET /api/v1/users/unique-identifier/:identifier
   *
   * @param {Request} req - Contains:
   *   - req.params.identifier: string (username or email to check)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<IUniqueIdentifierResponse>>} - Returns true if identifier is unique
   *
   * @description
   * Checks if the provided username or email is available for registration.
   */
  uniqueIdentifier = asyncHandler(async (req: Request, res: Response) => {
    if (!req.params.identifier) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Missing required identifier parameter');
    }

    const userData: TUniqueIdentifier = { identifier: req.params.identifier };

    const isUniqueIdentifier = await this.service.isIdentifierUnique(userData);

    const isUniqueRes: IUniqueIdentifierResponse = { isUniqueIdentifier: isUniqueIdentifier };

    return res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, isUniqueRes, 'Success.'));
  });

  /**
   * Generates new access and refresh tokens using a refresh token.
   *
   * @route POST /api/v1/users/refresh-token
   *
   * @param {Request} req - Contains:
   *   - req.cookies.refreshToken?: string
   *   - req.headers.authorization?: string (Bearer token)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<{}>>} - Returns HTTP 200 OK with new tokens in cookies
   *
   * @description
   * Validates the provided refresh token and issues a new access token and refresh token.
   */
  refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incommingRefreshToken =
      req.cookies.refreshToken || req.headers['authorization']?.replace(/^Bearer\s+/i, '').trim();

    const { accessToken, refreshToken } =
      await this.service.generateRefreshAccessToken(incommingRefreshToken);

    return res
      .status(HttpStatus.OK)
      .cookie('accessToken', accessToken, accessTokenCookieOptions)
      .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
      .json(new ApiResponse(HttpStatus.OK, {}, 'Tokens refreshed successfully.'));
  });

  /**
   * @desc    Redirects user to Google OAuth consent screen.
   * @route   GET /api/v1/user/google
   * @access  Public
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response that redirects to Google OAuth consent screen
   */
  googleSignIn = asyncHandler(async (req: Request, res: Response) => {
    const state = crypto.randomBytes(16).toString('hex');

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: `${process.env.BACKEND_URL}/api/v1/users/google/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      access_type: 'offline',
    });

    res
      .cookie('oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PRODUCTION',
        sameSite: process.env.NODE_ENV === 'PRODUCTION' ? 'none' : 'lax',
        maxAge: 10 * 60 * 1000, // 10 minutes
      })
      .redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  });

  /**
   * @desc    Handles the Google OAuth callback.
   * @route   GET /api/v1/user/google/callback
   * @access  Public
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response that redirects user to frontend with access and refresh tokens set in cookies
   */
  googleSignInCallback = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { code, state } = req.query;

      const storedState = req.cookies.oauth_state;

      if (!state || state !== storedState) {
        return res.redirect(`${process.env.FRONTEND_BASE_URL}/signin?error=invalid_state`);
      }

      res.clearCookie('oauth_state');

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: code as string,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: `${process.env.BACKEND_URL}/api/v1/users/google/callback`,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenRes.ok) {
        return res.redirect(`${process.env.FRONTEND_BASE_URL}/signin?error=google_token_failed`);
      }

      const tokenResJson = await tokenRes.json();

      //@ts-ignore
      const { id_token } = tokenResJson;

      if (!id_token) {
        return res.redirect(`${process.env.FRONTEND_BASE_URL}/signin?error=no_token`);
      }

      const payload = JSON.parse(Buffer.from(id_token.split('.')[1], 'base64url').toString());

      const { accessToken, refreshToken } = await this.service.createGoogleUser({
        googleId: payload.sub,
        email: payload.email,
        imageUrl: payload.picture,
        displayName: payload.name,
      });

      return res
        .status(200)
        .cookie('accessToken', accessToken, accessTokenCookieOptions)
        .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
        .redirect(`${process.env.FRONTEND_BASE_URL}/`);
    } catch (error) {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/signin?error=google_callback_failed`);
    }
  });
}
