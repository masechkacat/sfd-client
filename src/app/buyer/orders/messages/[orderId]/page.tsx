"use client";
import MessageContainer from "@/components/MessagesContainer";
import {
  useMessages,
  useUnreadMessages,
  useUser,
} from "@/request-query/configRequests";

function BuyerMessagePage({
  params,
}: {
  params: {
    orderId: string;
  };
}) {
  const orderId = params.orderId;
  const user = useUser(); // Получите информацию о пользователе
  const { data: messages, isLoading } = useMessages(orderId);

  return (
    <div>
      {messages && (
        <MessageContainer
          messages={messages}
          orderId={orderId}
          user={user.data}
        />
      )}
    </div>
  );
}
//
export default BuyerMessagePage;
