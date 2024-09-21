import { v4 as uuidv4 } from 'uuid';

import { Message } from "@/types/message";
import { ChatStreamResponse } from "@/types/chat";

export default async function processStream(
  response: ChatStreamResponse | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>
) {
  const reader = response?.stream;

  if (reader) {
    reader.on("textCreated", () => {
      setMessages((prevMessages: Message[]) => [...prevMessages, {
        id: uuidv4(),
        role: "assistant",
        text: ""
      }]);
    });
    reader.on("textDelta", (delta) => {
      const { value } = delta;

      if (value != null) {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const updatedLastMessage = {
            ...lastMessage,
            text: lastMessage.text + value,
          };
          return [...prevMessages.slice(0, -1), updatedLastMessage];
        });
      };
    });

    reader.on("event", (event) => {
      if (event.event === "thread.run.completed") {
        setIsSubmitting(false)
      };
    });
  }

}
