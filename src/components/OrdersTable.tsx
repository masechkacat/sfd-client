import { useUnreadMessages } from "@/request-query/configRequests";
import { Order, OrdersTableProps } from "@/utils/types";
import Link from "next/link";
import { TiMessages } from "react-icons/ti";

const OrderRow = ({ order, isSeller }: { order: Order; isSeller: boolean }) => {
  const { data: unreadMessages, isLoading } = useUnreadMessages({
    orderId: order.id.toString(),
  });

  return (
    <tr className="bg-white hover:bg-gray-50" key={order.id}>
      <th scope="row" className="px-6 py-4">
        {order.id}
      </th>
      <th scope="row" className="px-6 py-4 font-medium">
        {order.gig.title}
      </th>
      <td className="px-6 py-4">{order.gig.category}</td>
      <td className="px-6 py-4">{order.price}</td>
      <td className="px-6 py-4">{order.gig.deliveryTime}</td>
      {isSeller && (
        <td className="px-6 py-4">
          {order?.buyer.fullName} ({order.buyer.username})
        </td>
      )}
      <td className="px-6 py-4">{order.createdAt.split("T")[0]}</td>
      <td className="px-6 py-4 flex justify-center">
        <Link
          href={`/${isSeller ? "seller" : "buyer"}/orders/messages/${order.id}`}
          className="relative inline-flex items-center p-2 text-xl font-medium text-center text-white bg-[#1DBF73] rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 "
        >
          <TiMessages />

          {!isLoading && unreadMessages && unreadMessages.length > 0 && (
            <>
              <span className="sr-only">Notifications</span>
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 ">
                {unreadMessages.length}
              </div>
            </>
          )}
        </Link>
      </td>
    </tr>
  );
};

function OrdersTable({ orders, isSeller }: OrdersTableProps) {
  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32 pt-28">
      <h3 className="m-5 text-2xl font-semibold">
        All your Orders as {isSeller ? "Seller" : "Buyer"}
      </h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Order Id
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Delivery Time
              </th>
              {isSeller && (
                <th scope="col" className="px-6 py-3">
                  Ordered By
                </th>
              )}
              <th scope="col" className="px-6 py-3">
                Order Date
              </th>
              <th scope="col" className="px-6 py-3">
                Send Message
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <OrderRow order={order} isSeller={isSeller} key={order.id} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTable;
