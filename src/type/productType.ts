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
