import { LocationProps } from "./locationType";
export type UserProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string | null;
  firebaseUid: string;
  profileUrl: string | null;
  firebaseToken: string | null;
  tfaSecret: string | null;
  tfaEnabled: boolean;
  locations: LocationProps[];
};
