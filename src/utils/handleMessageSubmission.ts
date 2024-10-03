import fetchChatStream from '@/utils/fetchChatStream';
import processStream from '@/utils/processStream';

import { ThreadMessages } from '@/types/message';

export const handleMessageSubmission = async (
  message: string,
  threadId: string,
  assistantId: string,
  setThreadsMessages: React.Dispatch<React.SetStateAction<ThreadMessages[]>>,
  abortController: AbortController | null
) => {
  const controller = abortController || new AbortController();

  try {
    const response = await fetchChatStream(message, controller, assistantId, threadId);

    setThreadsMessages((prevThreads) =>
      prevThreads.map((thread) => {
        if (thread.id === threadId) {
          const updatedMessages = [...thread.messages];
          const lastMessage = thread.messages[thread.messages.length - 1];
          updatedMessages[thread.messages.length - 1] = { ...lastMessage, id: response.id };
          return { ...thread, messages: updatedMessages };
        }
        return thread;
      }),
    );

    await processStream(threadId, response, setThreadsMessages);
  } catch (error) {
    console.error(error);
  }
};