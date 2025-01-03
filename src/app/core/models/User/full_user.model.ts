import { User } from "./user.model.";

export interface FullUser{
    user: User;
    token: string;
}