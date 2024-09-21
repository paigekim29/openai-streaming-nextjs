'use client';

import { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MessageForm from '@/components/message/MessageForm';
import MessageComponent from '@/components/message/MessageComponent';
import useScrollToBottom from '@/hooks/useScrollToBottom';
import fetchChatStream from '@/utils/fetchChatStream';
import processStream from '@/utils/processStream';
import { createAssistant, createThread } from '@/utils/api';

import { Message } from '@/types/message';

export default function MessageList() {
  const messageListRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openAiInfo, setOpenAiInfo] = useState<{ [key: string]: string }>({});

  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useScrollToBottom(messageListRef);

  const handleMessageSubmission = async (message: string, isEdit: boolean, index?: number) => {
    setIsSubmitting(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const { assistantId, threadId } = openAiInfo;
    const messageId = index !== undefined ? messages[index]?.id : undefined;

    try {
      const response = await fetchChatStream(message, controller, assistantId, threadId, messageId);

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        if (isEdit && index !== undefined) {
          updatedMessages[index] = { ...updatedMessages[index], id: response.id };
        }

        const lastMessage = prevMessages[prevMessages.length - 1];
        updatedMessages[prevMessages.length - 1] = { ...lastMessage, id: response.id };

        return updatedMessages;
      });

      await processStream(response, setMessages, setIsSubmitting);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== 'AbortError') {
          setIsSubmitting(false);
          console.error('Failed to send message:', error);
          alert(`Error: ${error}`);
        }
      }
    }
  };

  const handleSendMessage = async (type: string, message?: string, index?: number) => {
    const isEdit = index !== undefined && !isNaN(index);

    if (type === 'submit' && message) {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, { id: uuidv4(), role: 'user', text: message }];
        if (isEdit) {
          updatedMessages[index] = { ...updatedMessages[index], text: message };
        }

        return updatedMessages;
      });

      await handleMessageSubmission(message, isEdit, index);
    } else if (type === 'abort') {
      setIsSubmitting(false);
      abortControllerRef.current?.abort();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initialize = async () => {
      const assistantData = await createAssistant();
      const threadData = await createThread();

      if (assistantData && threadData) {
        setOpenAiInfo({
          assistantId: assistantData.assistantId,
          threadId: threadData.threadId,
        });
      }
    };

    initialize();
  }, []);

  return (
    <div className='flex flex-1 flex-col'>
      <div ref={messageListRef} className='flex-1 overflow-auto p-4'>
        {messages.map((message, index) => (
          <MessageComponent
            key={index}
            index={index}
            text={message.text}
            isLast={messages.length === index + 1}
            isUser={message.role === 'user'}
            isSubmitting={isSubmitting}
            onSendMessage={handleSendMessage}
          />
        ))}
      </div>
      <MessageForm onSendMessage={handleSendMessage} isSubmitting={isSubmitting} />
    </div>
  );
}
