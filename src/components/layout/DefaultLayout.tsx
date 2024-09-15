import { PropsWithChildren } from 'react';

export default function DefaultLayout({ children }: PropsWithChildren) {
  return <div className='flex h-screen max-w-full overflow-hidden text-sm'>{children}</div>;
}
