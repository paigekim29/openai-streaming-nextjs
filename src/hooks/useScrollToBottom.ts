import { useCallback } from 'react';

export default function useScrollToBottom(ref: React.RefObject<HTMLDivElement>) {
  const scrollToBottom = useCallback(() => {
    const element = ref.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [ref]);

  return scrollToBottom;
}
