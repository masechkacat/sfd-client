// src/context/AuthModalContext.jsx или AuthModalContext.tsx
"use client";
import { createContext, useState, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";

const AuthModalContext = createContext({
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    router.push("/");
  };

  return (
    <AuthModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
};

// Хук для удобства использования контекста
export const useAuthModal = () => useContext(AuthModalContext);
