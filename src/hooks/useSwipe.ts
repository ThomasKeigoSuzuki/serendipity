import { useRef, useState, useCallback, useEffect, type TouchEvent } from 'react';

interface UseSwipeOptions {
  onNext: () => void;
  onPrev: () => void;
  enabled?: boolean;
}

export function useSwipe({ onNext, onPrev, enabled = true }: UseSwipeOptions) {
  const startY = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastWheel = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  }, [enabled]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !isDragging) return;
    setDragOffset((e.touches[0].clientY - startY.current) * 0.4);
  }, [enabled, isDragging]);

  const onTouchEnd = useCallback(() => {
    if (!enabled) return;
    setIsDragging(false);
    if (dragOffset < -50) onNext();
    else if (dragOffset > 50) onPrev();
    setDragOffset(0);
  }, [enabled, dragOffset, onNext, onPrev]);

  useEffect(() => {
    const handleWheel = (e: globalThis.WheelEvent) => {
      if (!enabled) return;
      const now = Date.now();
      if (now - lastWheel.current < 400) return;
      lastWheel.current = now;
      if (e.deltaY > 20) onNext();
      else if (e.deltaY < -20) onPrev();
    };
    const el = containerRef.current;
    if (el) el.addEventListener('wheel', handleWheel, { passive: true });
    return () => { el?.removeEventListener('wheel', handleWheel); };
  }, [onNext, onPrev, enabled]);

  return {
    containerRef,
    dragOffset,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
