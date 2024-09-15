import DefaultLayout from '@/components/layout/DefaultLayout';

import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frontend Chat Application',
  description: 'A chat application powered by the OpenAI Chat API',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <DefaultLayout>{children}</DefaultLayout>
      </body>
    </html>
  );
}
