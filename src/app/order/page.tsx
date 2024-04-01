// Checkout.tsx
"use client";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import { useCreateOrderIntent } from "@/request-query/configRequests";
import { useSearchParams } from "next/navigation";
import withAuth from "@/hoc/withAuth";

const stripePromise = loadStripe(
  "pk_test_51OAeB8D8gl5KJjJk03Gw3QgDsJ1ktdCwZUbSkVXImxQzCENcLkxh1CeYN8SXBaop58e1HmRXuRdwpoUBaEEYxr3Z00azLUiCKr"
);

function Checkout() {
  const searchParams = useSearchParams();
  const gigId = searchParams.get("gigId");
  console.log(gigId);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const createOrderIntentMutation = useCreateOrderIntent();

  useEffect(() => {
    console.log("useEffect called", {
      gigId,
      mutate: createOrderIntentMutation.mutate,
    });
    if (gigId) {
      setIsLoading(true);
      createOrderIntentMutation.mutate(Number(gigId), {
        onSuccess: (data) => {
          setClientSecret(data);
          setIsLoading(false);
        },
      });
    }
  }, [gigId, createOrderIntentMutation.mutate]);

  const appearance = {
    theme: "stripe" as "stripe" | "flat" | "night",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-[80vh] max-w-full mx-20 flex flex-col gap-10 items-center">
      <h1 className="text-3xl">
        Please complete the payment to place the order.
      </h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : null}
    </div>
  );
}

export default withAuth(Checkout);
