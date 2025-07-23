export type ProductProps = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  discountPercentage: number;
  averageRating: number;
  totalRatings: number;
  reviewCount: number;
  vendorName: string;
  categoryNames: string[];
  available: boolean;
};

export type ProductSummaryProps = {
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  vendorId: string;
  vendorName: string;
}
