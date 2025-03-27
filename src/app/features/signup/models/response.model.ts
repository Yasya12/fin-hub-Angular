import { User } from '../../../core/models/interfaces/user/user.interface';

export interface ResponseModel {
  user: User;
  token: string;
}
