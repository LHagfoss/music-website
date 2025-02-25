'use client';

import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((res) => res.json()),
        revalidateOnFocus: false,
      }}
    >
      <SessionProvider>{children}</SessionProvider>
    </SWRConfig>
  );
}