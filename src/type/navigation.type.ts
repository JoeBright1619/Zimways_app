import { ProductProps } from './product.type';
import { VendorProps } from './vendor.type';
import { OrderProps } from './order.type';

type Category = {
  id: number | string;
  name: string;
  icon?: string;
  type?: string;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Category: { selectedCategory?: Category; category?: Category; type: string };
  ProductDetails: { product: ProductProps };
  Vendor: { vendor: VendorProps };
  Login: undefined;
  Register: undefined;
  Signup: undefined;
  TwoFactorAuth: { userId?: string; email: string };
  OrderDetails: { order: OrderProps };
  Payment: undefined;
  // etc.
};
