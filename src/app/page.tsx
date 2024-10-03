'use client';

import { useRef, useState, useEffect } from 'react';
import MessageForm from '@/components/message/MessageForm';
import MessageComponent from '@/components/message/MessageComponent';
import ThreadListSidebar from '@/components/ThreadListSidebar';
import useScrollToBottom from '@/hooks/useScrollToBottom';
import { createAssistant, createThread } from '@/queries/api';
import sendMessage from '@/utils/sendMessage';

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

  const handleSendMessage = async (type: string, message?: string, index?: number) => {
    await sendMessage(
      type,
      message,
      index,
      selectedThreadId,
      threadList,
      setThreadList,
      setSelectedThreadId,
      setThreadsMessages,
      assistantId,
      abortControllerRef.current,
    );
  };

  const handleThreadOrderChange = (threadId: string, newOrder: number, index: number) => {
    setThreadsMessages((prevThreads) => prevThreads.map((thread) => {
        if(thread.id === threadId) {
          return { ...thread, currentThreadOrder: (newOrder - 1 === (thread.messages[index]?.nextThread ?? []).length) ? 1 : newOrder };
        } else return thread;
      })
    )
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
              message={message}
              isLast={selectedThread?.messages.length === index + 1}
              isSubmitting={!!selectedThread?.isSubmitting}
              onSendMessage={handleSendMessage}
              selectedThreadId={selectedThreadId}
              setSelectedThreadId={setSelectedThreadId}
              currentThreadOrder={selectedThread?.currentThreadOrder || 1}
              onThreadOrderChange={handleThreadOrderChange}
            />
          ))}
        </div>
        <MessageForm onSendMessage={handleSendMessage} isSubmitting={!!selectedThread?.isSubmitting} />
      </div>
    </div>
  );
}
