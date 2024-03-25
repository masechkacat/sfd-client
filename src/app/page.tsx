// src/app/page.tsx
"use client";
import LoginForm from "@/components/LoginForm";
import Companies from "../static/Companies";
import Everything from "../static/Everything";
import FiverrBusiness from "../static/FiverrBusiness";
import HeroBanner from "../static/HeroBanner";
import JoinFiverr from "../static/JoinFiverr";
import PopularServices from "../static/PopularServices";
import Services from "../static/Services";
import { useAuthModal } from "@/context/AuthModalContext";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import AuthModal from "@/components/AuthModal";

export default function HomePage() {
  const searchParams = useSearchParams();
  const { openModal, closeModal, isModalOpen } = useAuthModal();

  useEffect(() => {
    if (searchParams.get("signin") || searchParams.get("signup")) {
      openModal();
    } else if (isModalOpen) {
      closeModal();
    }
  }, [searchParams, openModal, closeModal, isModalOpen]);

  return (
    <>
      <HeroBanner />
      <Companies />
      <PopularServices />
      <Everything />
      <Services />
      <FiverrBusiness />
      <JoinFiverr />
      <AuthModal>
        <LoginForm isRegisterMode={searchParams.get("signup") === "true"} />
      </AuthModal>
    </>
  );
}
