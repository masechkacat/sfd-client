"use client";
import MessageContainer from "@/components/MessagesContainer";
import {
  useMessages,
  useUnreadMessages,
  useUser,
} from "@/request-query/configRequests";

function SellerMessagePage({
  params,
}: {
  params: {
    orderId: string;
  };
}) {
  const orderId = params.orderId;
  const user = useUser(); // Получите информацию о пользователе
  const { data: messages, isLoading } = useMessages(orderId);

  isLoading && <div>Loading...</div>;

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

export default SellerMessagePage;
