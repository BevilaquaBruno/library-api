/**
 * Interfaces for user
 */

export interface UserData {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface UserDataComplete extends UserData {
  password: string;
}

export interface UserAuth {
  username: string;
  password: string;
}

export interface PasswordList {
  password: string;
  passwordConfirm: string;
}
