import { LocationProps } from "./location.type";
export interface UserProps {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  firebaseUid: string;
  firebaseToken: string;
  profileUrl?: string;
  tfaSecret?: string;
  tfaEnabled?: boolean;
  locations?: LocationProps[];
  createdAt?: Date;
}



