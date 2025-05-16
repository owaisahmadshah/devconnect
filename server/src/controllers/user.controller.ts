import type { Request, Response } from 'express';

import type { TAuthUser } from 'shared';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { UserService } from '../../services/user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const signUpUser = asyncHandler(async (req: Request, res: Response) => {
  const userData: TAuthUser = req.body;

  await UserService.createUser(userData);

  return res.status(201).json(new ApiResponse(201, {}, 'Created user successfully.'));
});
