import { ChatStreamResponse } from "@/types/chat";
import { AssistantStream } from "openai/lib/AssistantStream";

export default async function fetchChatStream(
  message: string,
  controller: AbortController,
  assistantId: string,
  threadId?: string,
): Promise<ChatStreamResponse> {
  const { signal } = controller;

  const response = await fetch(`/api/thread/${threadId}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: message,
      assistantId,
    }),
    signal
  });


  if (response.ok) {
    const messageId = response.headers.get('X-Message-ID') || '';
    const stream = response.body ? AssistantStream.fromReadableStream(response.body) : null;

    return {
      id: messageId,
      stream
    };
  }

  throw new Error("Failed to fetch the chat stream");
}
