import { v4 as uuidv4 } from 'uuid';

import { ThreadMessages } from '@/types/message';

export const updateThreadMessages = (
  selectedThreadId: string,
  message: string,
  index: number | undefined,
  isEdit: boolean,
  setThreadsMessages: React.Dispatch<React.SetStateAction<ThreadMessages[]>>
) => {
  setThreadsMessages((prevThreads) =>
    prevThreads.map(({ id, isSubmitting, messages, currentThreadOrder }) => {
      if (id === selectedThreadId) {
        const updatedMessages = [...messages, { id: uuidv4(), role: 'user', text: message, nextThread: [] }];
        return { id, messages: updatedMessages, isSubmitting: true, currentThreadOrder };
      }
      return { id, isSubmitting, messages, currentThreadOrder };
    }),
  );
};