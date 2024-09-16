import { useState, useRef, useCallback, useEffect } from 'react';

export function useMessageInput(onSendMessage: (text: string) => void) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const paragraph = paragraphRef.current;
    if (paragraph) {
      paragraph.style.height = 'auto';
      paragraph.style.height = `${Math.min(paragraph.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleChange = useCallback(() => {
    if (isComposing) return;

    const paragraph = paragraphRef.current;
    if (paragraph) {
      setInput(paragraph.innerHTML);
    }
  }, [isComposing]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleChange();

      const paragraph = paragraphRef.current;
      if (paragraph) {
        const content = paragraph.innerHTML.trim();
        if (content) {
          onSendMessage(content);
        }
        paragraph.innerHTML = '';
      }
      setInput('');
    },
    [onSendMessage, handleChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLParagraphElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
        e.preventDefault();

        const paragraph = paragraphRef.current;
        if (paragraph) {
          const content = paragraph.innerHTML.trim();
          if (content) {
            onSendMessage(content);
          }
          paragraph.innerHTML = '';
        }
        setInput('');
        paragraph?.blur();
      }
    },
    [onSendMessage, isComposing]
  );

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => {
    setIsComposing(false);
    handleChange();
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isButtonDisabled = input.trim() === '' && !isComposing;

  return {
    paragraphRef,
    handleChange,
    handleSubmit,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
    handleFocus,
    handleBlur,
    isFocused,
    isButtonDisabled,
  };
}
