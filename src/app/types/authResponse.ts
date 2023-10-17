import { UserResponse } from "./userResponse";

export type AuthResponse = {
  token: string;
  user: UserResponse
}
