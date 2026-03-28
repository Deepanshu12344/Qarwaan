import { useEffect, useRef } from 'react';

const TRAIL_LENGTH = 4;
const MIN_DISTANCE = 10;

type Point = { x: number; y: number };

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);


export default function CursorTrail() {
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pointsRef = useRef<Point[]>([]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) {
      return;
    }

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) {
      return;
    }

    const handleMove = (event: MouseEvent) => {
      const nextPoint = { x: event.clientX, y: event.clientY };
      const points = pointsRef.current;
      const last = points[0];
      if (last && distance(last, nextPoint) < MIN_DISTANCE) {
        return;
      }

      points.unshift(nextPoint);
      if (points.length > TRAIL_LENGTH) {
        points.pop();
      }

      points.forEach((point, index) => {
        const el = trailRefs.current[index];
        if (!el) return;
        el.style.transform = `translate(${point.x}px, ${point.y}px)`;
        el.style.opacity = '1';
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
    };
  }, []);

  return (
    <div className="cursor-trail">
      {Array.from({ length: TRAIL_LENGTH }).map((_, index) => (
        <span
          key={`trail-${index}`}
          ref={(el) => {
            trailRefs.current[index] = el;
          }}
          style={{ opacity: 0 }}
        >
          .
        </span>
      ))}
    </div>
  );
}
