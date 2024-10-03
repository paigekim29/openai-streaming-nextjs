import { useState } from 'react';
import DOMPurify from 'dompurify';
import parseMarkdown from '@/utils/parseMarkdown';
import MessageForm from './MessageForm';
import ThreadNavigation from './ThreadNavigation';

import { Message } from '@/types/message';

interface MessageComponentProps {
  index: number;
  message: Message;
  isLast: boolean;
  isSubmitting: boolean;
  onSendMessage: (text: string) => Promise<void>;
  nextThread?: string[];
  selectedThreadId: string;
  setSelectedThreadId: React.Dispatch<React.SetStateAction<string>>;
  currentThreadOrder: number;
  onThreadOrderChange: (threadId: string, newOrder: number) => void;
}

export default function MessageComponent({
  index,
  message,
  isLast,
  isSubmitting,
  onSendMessage,
  selectedThreadId,
  setSelectedThreadId,
  currentThreadOrder,
  onThreadOrderChange,
}: MessageComponentProps) {
  const { role, text, nextThread = [] } = message;
  const isUser = role === 'user';

  const htmlContent = parseMarkdown(text);
  const sanitizedContent = DOMPurify.sanitize(htmlContent);

  const [isActive, setIsActive] = useState(false);

  const handleThreadOrderChange = (newOrder: number) => {
    onThreadOrderChange(selectedThreadId, newOrder);
    setSelectedThreadId(newOrder === 1 ? selectedThreadId : nextThread[newOrder - 2]);
  };

  const handlePreviousResponse = () => handleThreadOrderChange(currentThreadOrder - 1);
  const handleNextResponse = () => handleThreadOrderChange(currentThreadOrder + 1);
  const toggleIsActive = () => setIsActive((prev) => !prev);

  return (
    <article className={`${!isLast && 'mb-4'} w-full`}>
      <div className={`flex w-full ${isUser && 'justify-end'} items-center overflow-hidden`}>
        {isUser && (
          <div className='mr-2 cursor-pointer' onClick={toggleIsActive}>
            {isActive ? 'CANCEL' : 'EDIT'}
          </div>
        )}
        {isActive ? (
          <MessageForm
            onSendMessage={onSendMessage}
            isSubmitting={isSubmitting}
            defaultValue={text}
            index={index}
            setIsActive={setIsActive}
          />
        ) : (
          <div className={`${isUser ? 'max-w-[70%] bg-gray-100 sm:max-w-full' : 'max-w-full'} rounded-3xl px-5 py-2.5`}>
            <div className='whitespace-pre-wrap' dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          </div>
        )}
        {!!nextThread.length && isUser && (
          <ThreadNavigation
            nextThread={nextThread}
            currentThreadOrder={currentThreadOrder}
            handlePreviousResponse={handlePreviousResponse}
            handleNextResponse={handleNextResponse}
          />
        )}
      </div>
    </article>
  );
}
