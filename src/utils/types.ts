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

export type Order = {
  id: number;
  createdAt: string;
  buyerId: number;
  paymentIntent: string;
  isCompleted: boolean;
  gigId: number;
  price: number;
  buyer: User;
  gig: ListGig;
};

export type OrdersTableProps = {
  orders: Order[] | undefined;
  isSeller: boolean;
};

export type SendMessageParams = {
  orderId: number;
  text: string;
  recipientId: number;
};

export type UserData = {
  email: string;
  username: string;
  fullName: string;
  description: string;
};

export type DashboardData = {
  gigsCount: number;
  ordersCount: number;
  unreadMessagesCount: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  annualRevenue: number;
};

export type Message = {
  id: number;
  text: string;
  createdAt: string;
  isRead: boolean;
  senderId: number;
  recipientId: number;
  orderId: number;
};

export type UnreadMessage = Message & {
  sender: User;
};

export type MessagesResponse = {
  messages: Message[];
  recipientId: number;
};
