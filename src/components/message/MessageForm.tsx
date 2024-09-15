import { useState, useRef, useEffect, useCallback } from 'react';

interface MessageFormProps {
  onSendMessage: (text: string) => void;
}

export default function MessageForm({ onSendMessage }: MessageFormProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const textArea = paragraphRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${Math.min(textArea.scrollHeight, 150)}px`;

      if (!textArea.textContent?.trim()) {
        textArea.style.height = 'auto';
      }
    }
  }, [input]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSendMessage(input);

      if (paragraphRef.current) {
        paragraphRef.current.innerHTML = '';
      }
      setInput('');
    },
    [input, onSendMessage],
  );

  const handleChange = useCallback(() => {
    const textArea = paragraphRef.current;
    if (textArea) {
      setInput(textArea.innerHTML);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLParagraphElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSendMessage(input);

        if (paragraphRef.current) {
          paragraphRef.current.innerHTML = '';
        }
        setInput('');
        paragraphRef.current?.blur();
      }
    },
    [input, onSendMessage],
  );

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isButtonDisabled = input.trim() === '';

  return (
    <form onSubmit={handleSubmit} className='flex px-4 pb-4'>
      <div className='relative flex w-full items-end'>
        <p
          ref={paragraphRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className='max-h-[150px] w-full overflow-y-auto rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        {!isFocused && !input && (
          <div className='pointer-events-none absolute left-0 top-0 px-4 py-2 text-gray-400'>Message ChatGPT</div>
        )}
        <button
          type='submit'
          disabled={isButtonDisabled}
          className={`ml-2 h-min rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isButtonDisabled ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          SEND
        </button>
      </div>
    </form>
  );
}
