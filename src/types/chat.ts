import { AssistantStream } from "openai/lib/AssistantStream";

export interface ChatStreamResponse {
  id: string;
  stream: AssistantStream | null;
}