import { ProductProps } from "./product.type";
import { VendorProps } from "./vendor.type";

type Category = {
  id: number | string;
  name: string;
  icon?: string;
  type?: string;
};

export type RootStackParamList = {
  Home: undefined;
  Category: { selectedCategory?: Category; category?: Category; type: string };
  ProductDetails: { product: ProductProps };
  Vendor: { vendor: VendorProps };
  Login: undefined;
  Register: undefined;
  // etc.
};
