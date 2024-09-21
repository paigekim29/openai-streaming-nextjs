import { useState } from 'react';
import DOMPurify from 'dompurify';
import parseMarkdown from '@/utils/parseMarkdown';
import MessageForm from './MessageForm';

interface MessageComponentProps {
  text: string;
  index: number;
  isLast: boolean;
  isUser: boolean;
  isSubmitting: boolean;
  onSendMessage: (text: string) => Promise<void>;
}

export default function MessageComponent({
  text,
  index,
  isLast,
  isUser,
  isSubmitting,
  onSendMessage,
}: MessageComponentProps) {
  const htmlContent = parseMarkdown(text);
  const sanitizedContent = DOMPurify.sanitize(htmlContent);

  const [isActive, setIsActive] = useState(false);

  return (
    <article className={`${!isLast && 'mb-4'} w-full`}>
      <div className={`flex w-full ${isUser && 'justify-end'} items-baseline overflow-hidden`}>
        <div
          className={`${isUser ? 'block' : 'hidden'} mr-2 cursor-pointer pb-4`}
          onClick={() => {
            if (isActive) {
              setIsActive(false);
            } else {
              setIsActive(true);
            }
          }}
        >
          {isActive ? 'CANCEL' : 'EDIT'}
        </div>
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
      </div>
    </article>
  );
}
