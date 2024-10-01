import { v4 as uuidv4 } from 'uuid';

import { ThreadMessages } from "@/types/message";
import { ChatStreamResponse } from "@/types/chat";

export default async function processStream(
  threadId: string,
  response: ChatStreamResponse | null,
  setThreadMessages: React.Dispatch<React.SetStateAction<ThreadMessages[]>>
) {
  const reader = response?.stream;

  if (reader) {
    reader.on("textCreated", () => {
      setThreadMessages((prevThreads) => prevThreads.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            messages: [
              ...thread.messages,
              {
                id: uuidv4(),
                role: "assistant",
                text: ""
              }
            ]
          };
        }
        return thread;
      }));
    })

    reader.on("textDelta", (delta) => {
      const { value } = delta;

      if (value != null) {
        setThreadMessages((prevThreads) => prevThreads.map((thread) => {
          if (thread.id === threadId) {
            const updatedMessages = [...thread.messages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];

            const updatedLastMessage = {
              ...lastMessage,
              text: lastMessage.text + value,
            };

            updatedMessages[updatedMessages.length - 1] = updatedLastMessage;
            return { ...thread, messages: updatedMessages };
          }
          return thread;
        }));
      }
    })

    reader.on("event", (event) => {
      if (event.event === "thread.run.completed") {
        setThreadMessages((prevThreads) => prevThreads.map((thread) => {
          if (thread.id === threadId) {
            return { ...thread, isSubmitting: false };
          }
          return thread;
        }));
      }
    });
  }
}
