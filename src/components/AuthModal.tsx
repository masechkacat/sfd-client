// src/components/AuthModal.tsx
"use client";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect } from "react";
import { useAuthModal } from "../context/AuthModalContext"; // Импорт кастомного хука
import { useUser } from "../auth/configureAuth"; // Импорт хука для доступа к данным пользователя

interface AuthModalProps {
  children: React.ReactNode;
}
const AuthModal: React.FC<AuthModalProps> = ({ children }) => {
  const { isModalOpen, closeModal } = useAuthModal(); // Использование кастомного хука для доступа к состоянию и функциям контекста
  const user = useUser(); // Получение данных пользователя

  useEffect(() => {
    if (user.data) {
      closeModal();
    }
  }, [user.data, closeModal]);

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        {/* Остальной код модального окна, аналогично приведенному ранее */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        {/* Панель и контент модального окна */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AuthModal;
