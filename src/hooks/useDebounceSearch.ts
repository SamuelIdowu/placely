'use client';

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function useDebounceSearch(delay = 300) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = React.useState<string>(
    searchParams.get('keyword') || ''
  );

  React.useEffect(() => {
    const handler = setTimeout(() => {
      const currentKeyword = searchParams.get('keyword') || '';
      if (keyword !== currentKeyword) {
        const params = new URLSearchParams(searchParams.toString());
        if (keyword.trim()) {
          params.set('keyword', keyword.trim());
        } else {
          params.delete('keyword');
        }
        params.set('page', '1'); // reset to page 1 on filter change
        router.replace(`${pathname}?${params.toString()}`);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [keyword, delay, router, pathname, searchParams]);

  return { keyword, setKeyword };
}
