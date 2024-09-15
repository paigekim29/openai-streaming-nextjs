interface LeftMessageProps {
  text: string;
  isLast: boolean;
}

export default function LeftMessage({ text, isLast }: LeftMessageProps) {
  return (
    <article className={`${!isLast && 'mb-4'} w-full`}>
      <div className='flex w-full'>
        <div
          className='relative max-w-[70%] rounded-3xl bg-gray-100 px-5 py-2.5'
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    </article>
  );
}
