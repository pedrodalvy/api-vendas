export interface IUpdateProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  oldPassword?: string;
}
