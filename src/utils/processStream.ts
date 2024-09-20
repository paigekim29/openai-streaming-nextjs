import { Message } from "@/types/message";

import { AssistantStream } from "openai/lib/AssistantStream";

export default async function processStream(
  reader: AssistantStream,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>
) {
  reader.on("textCreated", () => {
    setMessages((prevMessages: Message[]) => [...prevMessages, { role: "assistant", text: "" }]);
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
      console.log('thread.run.completed')
      setIsSubmitting(false)
    };
  });
}
