import { ProductProps } from './productType';

export type VendorProps = {
  id: string;
  vendorId: string;
  password: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  description: string | null;
  imageUrl: string;
  averageRating: number;
  totalRatings: number;
  vendorType: string;
  status: string;
  items: ProductProps[]; // If items is an array of products
};
