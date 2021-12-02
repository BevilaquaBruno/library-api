/**
 * Interfaces for user
 */

/**
 * @UserData
 * Interface for user pattern data
 */
export interface UserData {
  id: number;
  name: string;
  username: string;
  email: string;
}

/**
 * @UserDataComplete
 * Extends @UserData interface adding the password (sometimes password is not necessary)
 */
export interface UserDataComplete extends UserData {
  password: string;
}

/**
 * @UserAuth
 * Interface for login data pattern
 */
export interface UserAuth {
  username: string;
  password: string;
}

/**
 * @PasswordList
 * Interface for pattern password verification
 */
export interface PasswordList {
  password: string;
  passwordConfirm: string;
}
