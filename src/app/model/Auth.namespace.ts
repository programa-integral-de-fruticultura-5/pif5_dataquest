export namespace Authentication {
  export interface User {
    id: number,
    name: string,
    email: string,
    emailVerifiedAt: string,
    idCard: string,
    role: string,
    type: string,
    zone: string,
    creationDate: string,
    updatedDate: string,
  }

  export type AuthResponse = {
    token: string;
    user: UserResponse
  }

  export type UserResponse = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    cedula: string;
    roles: string;
    types: string;
    zone: string;
    created_at: string;
    updated_at: string;
  }

  export type AuthParams = {
    email: string;
    password: string;
  }

  export interface AuthManagement {
    login: (credentials: AuthParams) => Promise<AuthResponse>;
    logout: () => void;
  }
}
