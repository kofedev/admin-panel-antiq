export interface User {
  email: string;
  password: string;
  confirmed: boolean;
  initial: boolean;
  roles: string[];
}
