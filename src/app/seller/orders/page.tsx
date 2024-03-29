// В странице продавца
"use client";
import OrdersTable from "@/components/OrdersTable";
import { useSellerOrders } from "@/request-query/configRequests"; // Предположим, что у вас есть такой хук

function SellerOrdersPage() {
  const { data: orders, isLoading, isError } = useSellerOrders();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred</div>;

  return <OrdersTable orders={orders} isSeller={true} />;
}

export default SellerOrdersPage;
