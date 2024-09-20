import { Message } from "@/types/message";
import { AssistantStream } from "openai/lib/AssistantStream";

export default async function fetchChatStream(message: string, messages: Message[], controller: AbortController, assistantId: string, threadId: string) {
  const { signal } = controller;

  const response = await fetch(`/api/thread/${threadId}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: message,
      assistantId
    }),
    signal
  });

  return response.body ? AssistantStream.fromReadableStream(response.body) : null;
}
