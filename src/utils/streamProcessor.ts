import { Message } from "@/types/message";

export async function processStream(reader: ReadableStreamDefaultReader<Uint8Array>, setMessages: React.Dispatch<React.SetStateAction<Message[]>>, handleScrollToBottom: () => void) {
  const decoder = new TextDecoder();
  let accumulatedText = '';

  setMessages((prevMessages: Message[]) => [...prevMessages, { isUser: false, text: '...' }]);
  handleScrollToBottom();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const parsedChunks = chunk.match(/{"response_chunk":"([^"]*)"}?/g) || [];

    for (const parsedChunk of parsedChunks) {
      const { response_chunk } = JSON.parse(parsedChunk);
      accumulatedText += response_chunk;

      setMessages((prevMessages: any) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = { isUser: false, text: accumulatedText };
        return newMessages;
      });
      handleScrollToBottom();
    }
  }
}
