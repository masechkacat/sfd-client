export type ListGig = {
  id: number;
  title: string;
  description: string;
  category: string;
  deliveryTime: number;
  revisions: number;
  features: string[];
  price: number;
  shortDesc: string;
  createdAt: string;
  images: string[];
  userId: number;
  reviews: any[]; // замените any на ваш тип отзыва
  createdBy: User;
  averageRating: number;
  totalReviewsCount: number;
};

export type User = {
  id: number;
  email: string;
  password: string;
  isSocialLogin: boolean;
  username: string | null;
  fullName: string | null;
  description: string | null;
  profileImage: string | null;
  createdAt: string;
};
