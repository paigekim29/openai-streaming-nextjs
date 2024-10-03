import { ThreadMessages } from '@/types/message';

interface ThreadListSidebarProps {
  threadList: string[];
  selectedThreadId: string;
  setSelectedThreadId: (threadId: string) => void;
  onCreateThread: () => void;
  threadMessages: ThreadMessages[];
}

const ThreadListSidebar: React.FC<ThreadListSidebarProps> = ({
  threadList,
  selectedThreadId,
  setSelectedThreadId,
  onCreateThread,
  threadMessages,
}) => {
  return (
    <div className='border-r'>
      <nav className='flex flex-wrap items-center justify-between bg-blue-500 p-6'>
        <div className='mr-6 flex flex-shrink-0 items-center text-white'>
          <span className='text-xl font-semibold tracking-tight'>Frontend Chat Application</span>
        </div>
        <button className='bg-white px-2 text-xl' onClick={onCreateThread}>
          +
        </button>
      </nav>
      <div className='h-full overflow-y-auto'>
        {threadList.map((id) => {
          const title = threadMessages.find((thread) => thread.id === id)?.messages[0]?.text || 'New Thread';
          return (
            <div
              key={id}
              className={`flex w-full cursor-pointer flex-col border-b p-6 ${
                selectedThreadId === id ? 'bg-gray-300' : ''
              }`}
              onClick={() => setSelectedThreadId(id)}
            >
              {title}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThreadListSidebar;
