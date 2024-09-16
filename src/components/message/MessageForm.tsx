import { useMessageInput } from '@/hooks/useMessageInput';

interface MessageFormProps {
  onSendMessage: (text: string) => void;
}

export default function MessageForm({ onSendMessage }: MessageFormProps) {
  const {
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
  } = useMessageInput(onSendMessage);

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
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          className='max-h-[150px] w-full overflow-y-auto rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        {!isFocused && !paragraphRef.current?.innerHTML && (
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
