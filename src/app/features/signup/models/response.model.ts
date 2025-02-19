import { User } from "../../../core/models/User/user.model.";

export interface ResponseModel {
    user: User;
    token: string;
  }
  