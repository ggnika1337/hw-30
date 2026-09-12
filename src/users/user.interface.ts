export interface IUser {
  id: number;
  fullName: string;
  avatar: string;
  phoneNumber: number;
  email: string;
  gender: string;
  age: number;
  password: string;

  subStart: Date;
  subEnd: Date;
  isActive: boolean;
}
