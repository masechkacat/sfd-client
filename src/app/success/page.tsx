"use client";
import { useConfirmOrder } from "@/request-query/configRequests";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import withAuth from "@/hoc/withAuth";

function Success() {
  const confirmOrder = useConfirmOrder();
  const router = useRouter();
  const searchParams = useSearchParams();
  const payment_intent = searchParams.get("payment_intent");

  useEffect(() => {
    if (payment_intent) {
      confirmOrder.mutate(payment_intent as string);
      setTimeout(() => router.push("/buyer/orders"), 5000);
    } else {
      router.push("/");
    }
  }, [payment_intent, router, confirmOrder]);

  return (
    <div className="h-[80vh] flex items-center px-20 pt-20 flex-col">
      <h1 className="text-4xl text-center">
        Payment successful. You are being redirected to the orders page.
      </h1>
      <h1 className="text-4xl text-center">Please do not close the page.</h1>
    </div>
  );
}

export default withAuth(Success);
