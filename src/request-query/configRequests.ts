// src/auth/configureAuth.ts
import { configureAuth } from "react-query-auth";
import { createAPI } from "../services/api";
import { saveToken, dropToken, getToken } from "../services/token";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { dropIsSeller } from "@/services/userRole";
import { ListGig, Order } from "@/utils/types";

const api = createAPI();

interface UserData {
  email: string;
  username: string;
  fullName: string;
  description: string;
}

interface DashboardData {
  gigsCount: number;
  ordersCount: number;
  unreadMessagesCount: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  annualRevenue: number;
}

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
};
