// В странице покупателя
"use client";
import OrdersTable from "@/components/OrdersTable";
import { useBuyerOrders } from "@/request-query/configRequests";

function BuyerOrdersPage() {
  const { data: orders, isLoading, isError } = useBuyerOrders();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred</div>;

  return <OrdersTable orders={orders} isSeller={false} />;
}

export default BuyerOrdersPage;
