import { useEffect } from 'react';

export default function NormalCursor() {
  useEffect(() => {
    document.body.classList.remove('cursor-plane');
  }, []);

  return null;
}
