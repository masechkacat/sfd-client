"use client";
import {
  useMarkMessageAsRead,
  useUnreadMessages,
} from "@/request-query/configRequests";
import { UnreadMessage } from "@/utils/types";
import Link from "next/link";

function UnreadMessages() {
  const { data: messages, refetch } = useUnreadMessages({ orderId: "" });
  const markAsReadMutation = useMarkMessageAsRead();

  const markAsRead = async (id: number) => {
    await markAsReadMutation.mutateAsync(id);
    refetch();
  };

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32 pt-28">
      <h3 className="m-5 text-2xl font-semibold">All your Unread Messages</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Text
              </th>
              <th scope="col" className="px-6 py-3">
                Sender Name
              </th>
              <th scope="col" className="px-6 py-3">
                Order Id
              </th>
              <th scope="col" className="px-6 py-3">
                Mark as Read
              </th>
              <th scope="col" className="px-6 py-3">
                View Conversation
              </th>
            </tr>
          </thead>
          <tbody>
            {messages?.map((message: UnreadMessage) => {
              return (
                <tr className="bg-white hover:bg-gray-50" key={message.text}>
                  <th scope="row" className="px-6 py-4 ">
                    {message?.text}
                  </th>
                  <th scope="row" className="px-6 py-4 ">
                    {message?.sender?.fullName}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium">
                    {message.orderId}
                  </th>
                  <td className="px-6 py-4 ">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        markAsRead(message.id);
                      }}
                      className="font-medium text-blue-600  hover:underline"
                    >
                      Mark as Read
                    </Link>
                  </td>
                  <td className="px-6 py-4 ">
                    <Link
                      href={`/seller/orders/messages/${message.orderId}`}
                      className="font-medium text-blue-600  hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UnreadMessages;
