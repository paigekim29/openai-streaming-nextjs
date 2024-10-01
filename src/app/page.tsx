'use client';

import { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MessageForm from '@/components/message/MessageForm';
import MessageComponent from '@/components/message/MessageComponent';
import ThreadListSidebar from '@/components/ThreadListSidebar';
import useScrollToBottom from '@/hooks/useScrollToBottom';
import fetchChatStream from '@/utils/fetchChatStream';
import processStream from '@/utils/processStream';
import { createAssistant, createThread } from '@/utils/api';

import { ThreadMessages } from '@/types/message';

export default function MessageList() {
  const [assistantId, setAssistantId] = useState('');
  const [threadsMessages, setThreadsMessages] = useState<ThreadMessages[]>([]);
  const [threadList, setThreadList] = useState<string[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState('');
  const selectedThread = threadsMessages.find((thread) => thread.id === selectedThreadId);

  const messageListRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useScrollToBottom(messageListRef);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleMessageSubmission = async (message: string, threadId: string, isEdit: boolean, index?: number) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const messageId = index !== undefined ? selectedThread?.messages?.[index]?.id : undefined;

    try {
      const response = await fetchChatStream(message, controller, assistantId, threadId, messageId);

      setThreadsMessages((prevThreads) =>
        prevThreads.map((thread) => {
          if (thread.id === threadId) {
            const updatedMessages = [...thread.messages];
            if (isEdit && index !== undefined) {
              updatedMessages[index] = { ...updatedMessages[index], id: response.id };
            }

            const lastMessage = thread.messages[thread.messages.length - 1];
            updatedMessages[thread.messages.length - 1] = { ...lastMessage, id: response.id };

            return { ...thread, messages: updatedMessages };
          }
          return thread;
        }),
      );

      await processStream(threadId, response, setThreadsMessages);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== 'AbortError') {
          setThreadsMessages((prev) =>
            prev.map((thread) => {
              if (thread.id === threadId) {
                return {
                  ...thread,
                  isSubmitting: false,
                };
              }
              return thread;
            }),
          );
          console.error('Failed to send message:', error);
          alert(`Error: ${error}`);
        }
      }
    }
  };

  const handleSendMessage = async (type: string, message?: string, index?: number) => {
    const isEdit = index !== undefined && !isNaN(index);
    let newThreadId = selectedThreadId;

    if (type === 'submit' && message) {
      if (!selectedThreadId) {
        // 처음 메시지 발송할 때는 thread 생성 필요
        const threadData = await createThread();
        if (threadData) {
          setThreadList([threadData.threadId]);
          setSelectedThreadId(threadData.threadId);
          setThreadsMessages(() => [
            { id: threadData.threadId, messages: [{ id: uuidv4(), role: 'user', text: message }], isSubmitting: true },
          ]);
        }
        newThreadId = threadData?.threadId || '';
      } else {
        if (!threadList.includes(selectedThreadId)) {
          // 플러스 버튼으로 thread 생성 후 메시지 발송하는 경우
          setThreadList((prev) => [...prev, selectedThreadId]);
          setThreadsMessages((prev) => [
            ...prev,
            { id: selectedThreadId, messages: [{ id: uuidv4(), role: 'user', text: message }], isSubmitting: true },
          ]);
        } else {
          // 기존 thread에 메시지 추가
          setThreadsMessages((prevThreads) =>
            prevThreads.map(({ id, isSubmitting, messages }) => {
              if (id === selectedThreadId) {
                const updatedMessages = [...messages, { id: uuidv4(), role: 'user', text: message }];
                if (isEdit) {
                  updatedMessages[index] = { ...updatedMessages[index], text: message };
                }

                return { id, messages: updatedMessages, isSubmitting: true };
              }
              return { id, isSubmitting, messages };
            }),
          );
        }
      }

      await handleMessageSubmission(message, newThreadId, isEdit, index);
    } else if (type === 'abort') {
      setThreadsMessages((prev) =>
        prev.map((thread) => {
          if (thread.id === selectedThreadId) {
            return {
              ...thread,
              isSubmitting: false,
            };
          }
          return thread;
        }),
      );

      abortControllerRef.current?.abort();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [threadsMessages, selectedThreadId]);

  useEffect(() => {
    const initialize = async () => {
      const assistantData = await createAssistant();

      if (assistantData) {
        setAssistantId(assistantData.assistantId);
      }
    };

    initialize();
  }, []);

  const handleClickCreateThread = async () => {
    const threadData = await createThread();

    if (threadData) {
      setSelectedThreadId(threadData.threadId);
    }
  };

  return (
    <div className='flex w-full'>
      <ThreadListSidebar
        threadList={threadList}
        selectedThreadId={selectedThreadId}
        setSelectedThreadId={setSelectedThreadId}
        onCreateThread={handleClickCreateThread}
        threadMessages={threadsMessages}
      />
      <div className='flex flex-1 flex-col'>
        <div ref={messageListRef} className='flex-1 overflow-auto p-4'>
          {selectedThread?.messages.map((message, index) => (
            <MessageComponent
              key={index}
              index={index}
              text={message.text}
              isLast={selectedThread?.messages.length === index + 1}
              isUser={message.role === 'user'}
              isSubmitting={!!selectedThread?.isSubmitting}
              onSendMessage={handleSendMessage}
            />
          ))}
        </div>
        <MessageForm onSendMessage={handleSendMessage} isSubmitting={!!selectedThread?.isSubmitting} />
      </div>
    </div>
  );
}
