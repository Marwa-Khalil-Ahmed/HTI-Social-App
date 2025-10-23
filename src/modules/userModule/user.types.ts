export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  phone: string;
  profileImage: string;
  coverImages: string[];
  folderId: string;
  isVerified: boolean;
  needToReLogin: boolean;
  changedCredentialsAt: Date;
  emailOtp: {
    otp: string;
    expiredAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
