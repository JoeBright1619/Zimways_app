export type PaymentProps = {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string; // ISO string
  status: string;
  orderId?: string;
};