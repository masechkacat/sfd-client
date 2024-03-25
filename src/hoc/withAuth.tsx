"use client";
import { getToken } from "../services/token";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { ComponentType } from "react";

export default function withAuth(Component: ComponentType) {
  return function WrappedComponent(props: any) {
    const token = getToken();

    useEffect(() => {
      if (!token) {
        return redirect("/");
      }
    }, []);

    return <Component {...props} />;
  };
}
