import { useState, useRef, useEffect, useCallback } from 'react';

export default function useMessageInput(
  onSendMessage: (type: string, text?: string, index?: number)
    => Promise<void>,
  setIsActive?: React.Dispatch<React.SetStateAction<boolean>>,
  defaultValue?: string,
  index?: number,
) {
  const [isComposing, setIsComposing] = useState(false);
  const [input, setInput] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    defaultValue && setInput(defaultValue);
  }, [defaultValue])

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${Math.min(textArea.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);
  
  const handleFormSubmission = useCallback((type: string) => {
    if (input.trim()) {
      onSendMessage(type, input, index);
      if (index && setIsActive) setIsActive(false);
      setInput('');
      textAreaRef.current?.blur();
    } else {
      onSendMessage('abort');
    }
  }, [input, onSendMessage]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleFormSubmission('submit');
  }, [handleFormSubmission]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleFormSubmission('submit');
    }
  }, [isComposing, handleFormSubmission]);

  const handleCompositionStart = useCallback(() => setIsComposing(true), []);
  const handleCompositionEnd = useCallback(() => setIsComposing(false), []);

  return {
    input,
    textAreaRef,
    handleSubmit,
    handleChange,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
  };
}
