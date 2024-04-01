// src/auth/configureAuth.ts
import { configureAuth } from "react-query-auth";
import { createAPI } from "../services/api";
import { saveToken, dropToken, getToken } from "../services/token";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { dropIsSeller } from "@/services/userRole";
import {
  CreateReviewDto,
  DashboardData,
  ListGig,
  MessagesResponse,
  Order,
  SendMessageParams,
  UnreadMessage,
  UserData,
} from "@/utils/types";

const api = createAPI();

const authConfig = {
  loginFn: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/auth/signin", credentials);
    saveToken(response.data.access_token);
    const data = { ...response.data.userId };
    return data;
  },
  registerFn: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/auth/signup", credentials);
    saveToken(response.data.access_token);
    const data = { ...response.data.userId };
    return data;
  },
  logoutFn: async () => {
    dropToken();
    dropIsSeller();
    return Promise.resolve();
  },
  userFn: async () => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    const response = await api.get("/users/me");
    const data = { ...response.data };
    return data;
  },
};

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: UserData) => api.patch("/users", userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

const useUploadAvatar = () => {
  const token = getToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) =>
      axios.post(
        "https://apiforspotfordev.onrender.com/users/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовки
          },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

const useCreateGig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = getToken();
      return axios.post(
        "https://apiforspotfordev.onrender.com/gigs/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["searchGigs"] });
      queryClient.invalidateQueries({ queryKey: ["userGigs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["gigDetails"] });
    },
  });
};

const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await api.get("/dashboard");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // данные будут считаться устаревшими через 5 минут
  });
};

const useSearchGigs = (q: string = "", category: string = "") => {
  return useQuery<ListGig[]>({
    queryKey: ["searchGigs", q, category],
    queryFn: async () => {
      const response = await api.get(
        `/gigs?searchTerm=${q}&category=${category}`
      );
      return response.data;
    },
    enabled: true, // всегда включать запрос
  });
};

const useUserGigs = () => {
  return useQuery<ListGig[]>({
    queryKey: ["userGigs"],
    queryFn: async () => {
      const response = await api.get("/gigs/user/me");
      return response.data;
    },
    enabled: true, // всегда включать запрос
  });
};

const useBuyerOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["buyerOrders"],
    queryFn: async () => {
      const response = await api.get("/orders/buyer");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });
};

const useSellerOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["sellerOrders"],
    queryFn: async () => {
      const response = await api.get("/orders/seller");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });
};

const useGigDetails = (id: string) => {
  return useQuery<ListGig>({
    queryKey: ["gigDetails", id],
    queryFn: async () => {
      const response = await api.get(`/gigs/${id}`);
      return response.data;
    },
    enabled: !!id, // выполнять запрос только если id определен
  });
};

const useCreateOrderIntent = () => {
  return useMutation<string, Error, number>({
    mutationFn: async (gigId: number) => {
      console.log("from reaxt quert", gigId);
      const { data } = await api.post(`/orders/create`, { gigId });
      return data.clientSecret;
    },
  });
};

const useConfirmOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentIntent: string) =>
      api.post("/orders/confirm", { paymentIntent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

// Запрос для получения сообщений
const useMessages = (orderId: string) => {
  return useQuery<MessagesResponse>({
    queryKey: ["messages", orderId],
    queryFn: async () => {
      const { data } = await api.get(`/messages/orders/${orderId}`);
      return data;
    },
  });
};

// Мутация для отправки сообщений
const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, text, recipientId }: SendMessageParams) => {
      const { data } = await api.post(`/messages/${recipientId}`, {
        orderId,
        text,
      });
      return data;
    },
    onSuccess: () => {
      // After a successful message send, we need to update the message cache
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

const useUnreadMessages = ({ orderId = "" }) => {
  return useQuery<UnreadMessage[]>({
    queryKey: ["unreadMessages", orderId],
    queryFn: async () => {
      // orderId добавляется к запросу только если он не пустой
      const endpoint = orderId
        ? `/messages/unread?orderId=${orderId}`
        : `/messages/unread`;
      const { data } = await api.get(endpoint);
      return data;
    },
    enabled: !!orderId || orderId === "", // Запрос активен, если orderId предоставлен или интересуют все сообщения
  });
};

const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (messageId: number) => {
      const { data } = await api.put(`/messages/read/${messageId}`);
      return data;
    },
    onSuccess: () => {
      // После успешного обновления сообщения, мы должны обновить кэш сообщений
      queryClient.invalidateQueries({ queryKey: ["unreadMessages"] });
    },
  });
};

const useCheckOrder = (gigId: number) => {
  return useQuery({
    queryKey: ["checkOrder", gigId],
    queryFn: async () => {
      // Проверяем, что gigId предоставлен перед выполнением запроса
      if (!gigId) {
        throw new Error("gigId is required to check order");
      }
      const { data } = await api.get(`/gigs/checkOrder/${gigId}`);
      return data.hasUserOrderedGig;
    },
    enabled: !!gigId, // Запускаем запрос, только если gigId предоставлен
  });
};

const useAddReview = (gigId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: CreateReviewDto) =>
      api.post(`/reviews/${gigId}`, review),
    onSuccess: () => {
      // После успешного добавления отзыва, мы должны обновить кэш отзывов
      queryClient.invalidateQueries({
        queryKey: ["gigDetails", gigId.toString()],
      });
    },
  });
};

export const { useUser, useLogin, useRegister, useLogout } =
  configureAuth(authConfig);
export {
  useUpdateProfile,
  useUploadAvatar,
  useDashboardData,
  useSearchGigs,
  useGigDetails,
  useCreateOrderIntent,
  useConfirmOrder,
  useUserGigs,
  useBuyerOrders,
  useSellerOrders,
  useMessages,
  useSendMessage,
  useUnreadMessages,
  useMarkMessageAsRead,
  useCheckOrder,
  useAddReview,
  useCreateGig,
};
