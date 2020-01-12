export interface User {
  id: number;
  username: string;
  username_canonical: string;
  email: string;
  email_canonical: string;
  enabled: boolean;
  salt: string;
  password: string;
  groups: string[];
  roles: string[];
}



