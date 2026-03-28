import { useEffect } from 'react';
import CursorTrail from './CursorTrail';

export default function PlaneCursor() {
  useEffect(() => {
    document.body.classList.add('cursor-plane');
    return () => {
      document.body.classList.remove('cursor-plane');
    };
  }, []);

  return <CursorTrail />;
}
