import { ThreadMessages, Message } from '@/types/message';
import { v4 as uuidv4 } from 'uuid';
import { createThread } from '../queries/api';

export function createMessage(text: string): Message {
  return { id: uuidv4(), role: 'user', text, nextThread: [] };
}

export async function createNewThread(
  setThreadList: React.Dispatch<React.SetStateAction<string[]>>,
  setSelectedThreadId: React.Dispatch<React.SetStateAction<string>>,
): Promise<string | undefined> {
  try {
    const threadData = await createThread();

    if (threadData) {
      setThreadList((prev) => [...prev, threadData.threadId]);
      setSelectedThreadId(threadData.threadId);

      return threadData.threadId;
    }
  } catch (e) {
    console.error('Error in createNewThread', e);
  }
}

export async function handleNewThread(
  setThreadList: React.Dispatch<React.SetStateAction<string[]>>,
  setSelectedThreadId: React.Dispatch<React.SetStateAction<string>>,
  message: string,
  setThreadsMessages: React.Dispatch<React.SetStateAction<ThreadMessages[]>>
): Promise<string | undefined> {
  try {
    const newThreadId = await createNewThread(setThreadList, setSelectedThreadId) ?? '';

    setThreadsMessages(() => [{
      id: newThreadId,
      messages: [createMessage(message)],
      isSubmitting: true,
      currentThreadOrder: 1,
    }]);

    return newThreadId;
  } catch (e) {
    console.error('Error in handleNewThread', e);
  }
}

export function handleNewThreadWithMessage(
  threadId: string,
  message: string,
  setThreadList: React.Dispatch<React.SetStateAction<string[]>>,
  setThreadsMessages: React.Dispatch<React.SetStateAction<ThreadMessages[]>>
): void {
  setThreadList((prev) => [...prev, threadId]);
  setThreadsMessages((prevThreads) => [
    ...prevThreads,
    {
      id: threadId,
      messages: [createMessage(message)],
      isSubmitting: true,
      currentThreadOrder: 1
    }
  ]);
}

export async function handleEditMessage(
  selectedThreadId: string,
  message: string,
  index: number,
  setThreadList: React.Dispatch<React.SetStateAction<string[]>>,
  setSelectedThreadId: React.Dispatch<React.SetStateAction<string>>,
  setThreadsMessages: React.Dispatch<React.SetStateAction<ThreadMessages[]>>
): Promise<string | undefined> {
  try {
    const newThreadId = await createNewThread(setThreadList, setSelectedThreadId) ?? '';

    setThreadsMessages((prevThreads) => {
      const updatedThreads = prevThreads.map((thread) => {
        if (thread.id === selectedThreadId) {
          const updatedMessages = [...thread.messages];
          updatedMessages[index] = {
            ...updatedMessages[index],
            nextThread: [...(updatedMessages[index].nextThread ?? []), newThreadId],
          };
          return { ...thread, messages: updatedMessages, isSubmitting: false };
        }
        return thread;
      });
      return [
        ...updatedThreads,
        {
          id: newThreadId,
          messages: [createMessage(message)],
          isSubmitting: true,
          currentThreadOrder: 1,
        },
      ];
    });

    return newThreadId;
  } catch (e) {
    console.error('Error in handleEditMessage', e);
  }
}

export function addMessageToExistingThread(
  threadId: string,
  message: string,
  setThreadsMessages: React.Dispatch<React.SetStateAction<ThreadMessages[]>>
): void {
  setThreadsMessages((prevThreads) =>
    prevThreads.map((thread) =>
      thread.id === threadId
        ? { ...thread, messages: [...thread.messages, createMessage(message)], isSubmitting: true }
        : thread
    )
  );
}

export function handleAbort(
  selectedThreadId: string,
  setThreadsMessages: React.Dispatch<React.SetStateAction<ThreadMessages[]>>,
  abortController: AbortController | null
): void {
  setThreadsMessages((prev) =>
    prev.map((thread) =>
      thread.id === selectedThreadId ? { ...thread, isSubmitting: false } : thread
    )
  );
  abortController?.abort();
}
