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

  const handleSendMessage = async (type: string, message?: string, index?: number) => {
    const isEdit = index && !isNaN(index);
    if (type === 'submit' && message) {
      if (isEdit) {
        setMessages((prevMessages) => {
          const updatedMessage = {
            ...prevMessages[index],
            text: message,
          };

          const updatedMessages = [...prevMessages, { id: uuidv4(), role: 'user', text: message }];
          updatedMessages[index] = updatedMessage;

          return updatedMessages;
        });
      } else {
        setMessages((prevMessages) => [...prevMessages, { id: uuidv4(), role: 'user', text: message }]);
      }
      setIsSubmitting(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const { assistantId, threadId } = openAiInfo;
      try {
        const messageId = messages.find((_, i) => i === index)?.id;
        const response = await fetchChatStream(message, controller, assistantId, threadId, messageId);

        if (isEdit) {
          setMessages((prevMessages) => {
            const editedMessage = {
              ...prevMessages[index],
              id: response.id,
            };

            const updatedMessages = [...prevMessages];
            updatedMessages[index] = editedMessage;

            return updatedMessages;
          });
        }

        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const updatedLastMessage = {
            ...lastMessage,
            id: response.id,
          };
          return [...prevMessages.slice(0, -1), updatedLastMessage];
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

      if (assistantData?.assistantId) {
        setOpenAiInfo((prev) => ({ ...prev, assistantId: assistantData.assistantId }));
      }

      if (threadData?.threadId) {
        setOpenAiInfo((prev) => ({ ...prev, threadId: threadData.threadId }));
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
