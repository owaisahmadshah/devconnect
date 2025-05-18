import { TBaseUser } from '@shared/src/index.js';

export interface IRequestUser extends TBaseUser {
  _id: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: IRequestUser;
    }
  }
}
