/**
 * Interfaces for login
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

export interface UserLogin {
  username: string;
  password: string;
}