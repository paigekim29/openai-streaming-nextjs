import useMessageInput from '@/hooks/useMessageInput';

interface MessageFormProps {
  onSendMessage: (text: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function MessageForm({ onSendMessage, isSubmitting }: MessageFormProps) {
  const {
    input,
    textAreaRef,
    handleChange,
    handleSubmit,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
  } = useMessageInput(onSendMessage);

  return (
    <form onSubmit={handleSubmit} className='flex px-4 pb-4'>
      <div className='relative flex w-full items-end'>
        <textarea
          ref={textAreaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Message ChatGPT'
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
        <button
          type='submit'
          className={`ml-2 transform rounded-lg px-4 py-2 text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 ${!!input.length || isSubmitting ? 'cursor-pointer bg-blue-500' : 'cursor-default bg-gray-500'}`}
          disabled={!input.length && !isSubmitting}
        >
          {isSubmitting ? 'CANCEL' : 'SEND'}
        </button>
      </div>
    </form>
  );
}
