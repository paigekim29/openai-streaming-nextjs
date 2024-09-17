'use client';

import { useRef, useState, useEffect } from 'react';
import MessageForm from '@/components/message/MessageForm';
import MessageComponent from '@/components/message/MessageComponent';
import useScrollToBottom from '@/hooks/useScrollToBottom';
import fetchChatStream from '@/utils/fetchChatStream';
import processStream from '@/utils/processStream';

import { Message } from '@/types/message';

export default function MessageList() {
  const messageListRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollToBottom = useScrollToBottom(messageListRef);

  const handleSendMessage = async (type: string, message?: string) => {
    if (type === 'submit' && message) {
      setMessages((prevMessages) => [...prevMessages, { isUser: true, text: message }]);
      setIsSubmitting(true);

      try {
        const reader = await fetchChatStream(message);
        await processStream(reader, setMessages);
      } catch (error) {
        console.error('Failed to send message:', error);
        alert(`Error: ${error}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // TODO cancel submission
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className='flex flex-1 flex-col'>
      <div ref={messageListRef} className='flex-1 overflow-auto p-4'>
        {messages.map((message, index) => (
          <MessageComponent
            key={index}
            text={message.text}
            isLast={messages.length === index + 1}
            isUser={message.isUser}
          />
        ))}
      </div>
      <MessageForm onSendMessage={handleSendMessage} isSubmitting={isSubmitting} />
    </div>
  );
}
