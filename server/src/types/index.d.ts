import { TBaseUser } from 'shared';

export interface IRequestUser extends TBaseUser {
  _id: string;
  profileId: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: IRequestUser;
    }
  }
}
