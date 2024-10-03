import { handleMessageSubmission } from '@/utils/handleMessageSubmission';
import {
  handleNewThread,
  handleNewThreadWithMessage,
  handleEditMessage,
  addMessageToExistingThread,
  handleAbort
} from './sendMessageHelpers';

import { ThreadMessages } from '@/types/message';

export default async function sendMessage(
  type: string,
  message: string | undefined,
  index: number | undefined,
  selectedThreadId: string,
  threadList: string[],
  setThreadList: React.Dispatch<React.SetStateAction<string[]>>,
  setSelectedThreadId: React.Dispatch<React.SetStateAction<string>>,
  setThreadsMessages: React.Dispatch<React.SetStateAction<ThreadMessages[]>>,
  assistantId: string,
  abortController: AbortController | null
): Promise<void> {
  if (type === 'submit' && message) {
    const isEdit = index !== undefined && !isNaN(index);
    let newThreadId = selectedThreadId;

    if (!selectedThreadId) {
      newThreadId = (await handleNewThread(setThreadList, setSelectedThreadId, message, setThreadsMessages) ?? '');
    } else if (!threadList.includes(selectedThreadId)) {
      handleNewThreadWithMessage(selectedThreadId, message, setThreadList, setThreadsMessages);
    } else if (isEdit) {
      newThreadId = (await handleEditMessage(selectedThreadId, message, index, setThreadList, setSelectedThreadId, setThreadsMessages) ?? '');
    } else {
      addMessageToExistingThread(selectedThreadId, message, setThreadsMessages);
    }

    await handleMessageSubmission(message, newThreadId, assistantId, setThreadsMessages, abortController);
  } else if (type === 'abort') {
    handleAbort(selectedThreadId, setThreadsMessages, abortController);
  }
}