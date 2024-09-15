interface RightMessageProps {
  text: string;
  isLast: boolean;
}

export default function RightMessage({ text, isLast }: RightMessageProps) {
  return (
    <article className={`${!isLast && 'mb-4'} w-full`}>
      <div className='flex w-full justify-end'>
        <div
          className='relative max-w-[70%] rounded-3xl bg-gray-200 px-5 py-2.5'
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    </article>
  );
}
