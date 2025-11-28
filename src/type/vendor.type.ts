import { ProductProps } from "./product.type";

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


export type VendorSummaryProps = {
    vendorId: string;
    vendorName: string;
    type: string;
    phone: string;
    place: string;
    street: string;
}