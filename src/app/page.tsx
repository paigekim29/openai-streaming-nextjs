'use client';

import { useRef, useState, useEffect } from 'react';
import LeftMessage from '@/components/message/LeftMessage';
import RightMessage from '@/components/message/RightMessage';
import MessageForm from '@/components/message/MessageForm';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import { sendMessageToAPI } from '@/utils/api';
import { processStream } from '@/utils/streamProcessor';

import { Message } from '@/types/message';

export default function MessageList() {
  const messageListRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollToBottom = useScrollToBottom(messageListRef);

  const handleSendMessage = async (message: string) => {
    setMessages((prevMessages) => [...prevMessages, { isUser: true, text: message }]);

    try {
      const reader = await sendMessageToAPI(message);
      await processStream(reader, setMessages);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className='flex flex-1 flex-col'>
      <div ref={messageListRef} className='flex-1 overflow-auto p-4'>
        {messages.map((message, index) =>
          message.isUser ? (
            <RightMessage key={index} text={message.text} isLast={messages.length === index + 1} />
          ) : (
            <LeftMessage key={index} text={message.text} isLast={messages.length === index + 1} />
          ),
        )}
      </div>
      <MessageForm onSendMessage={handleSendMessage} />
    </div>
  );
}
