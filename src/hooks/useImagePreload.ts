import { useEffect } from 'react';

export function useImagePreload(urls: string[]) {
  useEffect(() => {
    urls.forEach(url => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [urls]);
}
