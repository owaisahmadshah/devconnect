import type { Request, Response, NextFunction } from 'express';
import { ZodError, type AnyZodObject } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export const validateSchema = (schema: AnyZodObject) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        file: req.file,
        files: req.files,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        }));

        throw new ApiError(400, 'Validation failed.', validationError);
      }

      next(error);
      return;
    }
  };
};
