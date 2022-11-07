export interface User {
  id: string;
  email: string;
  fullname: string;
  role: string;
  approved: boolean;
  enabled: boolean;
  photo?: string;
  favorites: {
    [key: string]: boolean;
  };
  [key: string]: any;
};