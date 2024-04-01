"use client";
import { useEffect, useRef, useState } from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import { BsCheckAll } from "react-icons/bs";
import { useSendMessage } from "@/request-query/configRequests";
import { MessageContainerProps } from "@/utils/types";

function MessageContainer({ messages, orderId, user }: MessageContainerProps) {
  const [recipientId, setRecipientId] = useState<number | undefined>(undefined);
  const [messageText, setMessageText] = useState("");
  const sendMessage = useSendMessage();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages && user) {
      setRecipientId(messages.recipientId);
    }
  }, [messages, user]);

  useEffect(() => {
    // Прокрутка к последнему сообщению
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Функция для отправки сообщения
  const handleSendMessage = (text: string) => {
    if (text.trim()) {
      // Убедитесь, что сообщение не пустое
      sendMessage.mutate(
        {
          orderId: Number(orderId),
          text,
          recipientId: recipientId || 0,
        },
        {
          // В колбэке onSuccess очищаем поле ввода и прокручиваем к последнему сообщению
          onSuccess: () => {
            setMessageText(""); // Очищаем поле ввода
          },
        }
      );
    }
  };

  function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    let hours: number | string = date.getHours();
    let minutes: number | string = date.getMinutes();
    const ampm: string = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedTime: string = `${hours}:${minutes} ${ampm}`;
    return formattedTime;
  }

  return (
    <div className="h-[80vh] pt-28">
      <div className="max-h-[80vh] flex flex-col justify-center items-center">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 w-[80vw] border flex flex-col">
          <div className="mt-8">
            <div className="space-y-4 h-[50vh] overflow-y-auto pr-4 ">
              {messages?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    user && message.senderId === user.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`inline-block rounded-lg ${
                      user && message.senderId === user.id
                        ? "bg-[#1DBF73] text-white"
                        : "bg-gray-100 text-gray-800"
                    } px-4 py-2 max-w-xs break-all`}
                  >
                    <p>{message.text}</p>
                    <span className="text-sm text-gray-600">
                      {formatTime(message.createdAt)}
                    </span>
                    <span>
                      {message.senderId === user?.id && message.isRead && (
                        <BsCheckAll />
                      )}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>
          </div>

          <div className="mt-8 flex">
            <input
              type="text"
              className="rounded-full py-2 px-4 mr-2 w-full"
              placeholder="Type a message..."
              name="message"
              onChange={(e) => setMessageText(e.target.value)}
              value={messageText}
            />
            <button
              type="submit"
              className="bg-[#1DBF73] text-white rounded-full px-4 py-2"
              onClick={() => handleSendMessage(messageText)}
            >
              <FaRegPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageContainer;
