"use client";
import { getToken } from "../services/token";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { ComponentType } from "react";
import { NextPage } from "next";

export default function withAuth(Component: NextPage | ComponentType<any>) {
  return function WrappedComponent(props: any) {
    const token = getToken();

    useEffect(() => {
      if (!token) {
        return redirect("/?signin=true");
      }
    }, []);

    return <Component {...props} />;
  };
}
