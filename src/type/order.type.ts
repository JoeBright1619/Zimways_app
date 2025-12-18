import { PaymentProps } from './payment.type';
import { VendorSummaryProps } from './vendor.type'; // If you have a VendorSummary type
import { ProductSummaryProps } from './product.type'; // If you have an ItemSummary type

export type OrderProps = {
  id: string;
  customer?: any; // Replace 'any' with your Customer type if available
  cart?: any; // Replace 'any' with your Cart type if available
  deliveryDriver?: any; // Replace 'any' with your DeliveryDriver type if available
  total?: number;
  orderDate: string; // ISO string, or Date if you parse it
  receivedDate?: string; // ISO string, or Date if you parse it
  orderType?: string;
  deliveryAddress?: string;
  status: string;
  payment?: PaymentProps;
  vendors: VendorSummaryProps[];
  items: ProductSummaryProps[];
};
