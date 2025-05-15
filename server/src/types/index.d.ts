import { IUser } from '../types/user.type.ts';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
