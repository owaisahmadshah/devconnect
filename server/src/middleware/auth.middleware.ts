import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';

interface JwtPayloadWithId extends jwt.JwtPayload {
  _id: string;
}

const auth = async (req: Request, _: Response, next: NextFunction): Promise<void> => {
  const token =
    req.cookies.accessToken || req.headers['authorization']?.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return next(new ApiError(401, 'Unauthorized'));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayloadWithId;

    const user = await User.findById(decodedToken._id).select('-password -refreshToken');

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Unauthorized: Invalid or expired token'));
  }
};

export default auth;
