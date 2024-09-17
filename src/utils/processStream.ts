import { Message } from "@/types/message";

export default async function processStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  const decoder = new TextDecoder();
  let accumulatedText = '';

  setMessages((prevMessages: Message[]) => [...prevMessages, { isUser: false, text: '...' }]);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    accumulatedText += chunk;

    setMessages((prevMessages: Message[]) => {
      const newMessages = [...prevMessages];
      newMessages[newMessages.length - 1] = { isUser: false, text: accumulatedText };
      return newMessages;
    });
  }
}
