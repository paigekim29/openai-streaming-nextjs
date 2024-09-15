'use client';

import { useEffect, useRef, useState } from 'react';

import LeftMessage from '@/components/message/LeftMessage';
import RightMessage from '@/components/message/RightMessage';
import MessageForm from '@/components/message/MessageForm';

export default function MessageList() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState([{ isUser: true, text: 'Hello World' }]);

  const handleSendMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, { isUser: true, text: message }]);

    // TODO OpenAI API 호출
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className='flex flex-1 flex-col'>
      <div className='flex-1 overflow-auto p-4'>
        {messages.map((message, index) =>
          message.isUser ? (
            <RightMessage key={index} text={message.text} isLast={messages.length === index + 1} />
          ) : (
            <LeftMessage key={index} text={message.text} isLast={messages.length === index + 1} />
          ),
        )}
        <div ref={messagesEndRef} />
      </div>
      <MessageForm onSendMessage={handleSendMessage} />
    </div>
  );
}
