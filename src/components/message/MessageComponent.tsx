import DOMPurify from 'dompurify';
import { parseMarkdown } from '@/utils/markdownParser';

interface MessageComponentProps {
  text: string;
  isLast: boolean;
  isUser: boolean;
}

export default function MessageComponent({ text, isLast, isUser }: MessageComponentProps) {
  const htmlContent = parseMarkdown(text);
  const sanitizedContent = DOMPurify.sanitize(htmlContent);

  return (
    <article className={`${!isLast && 'mb-4'} w-full`}>
      <div className={`flex w-full ${isUser && 'justify-end'} overflow-hidden`}>
        <div className={`${isUser && 'max-w-[70%] bg-gray-100'} rounded-3xl px-5 py-2.5`}>
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>
      </div>
    </article>
  );
}
