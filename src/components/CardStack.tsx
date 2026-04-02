import { useState, useCallback, useEffect } from 'react';
import type { Card } from '../types/card';
import { useSwipe } from '../hooks/useSwipe';
import TextCard from './TextCard';
import ArtCard from './ArtCard';

interface CardStackProps {
  onShowMap: () => void;
  bookmarks: number[];
  onBookmark: (id: number) => void;
  allCards: Card[];
}

function pickRandom(cards: Card[], count: number): Card[] {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function CardStack({ onShowMap, bookmarks, onBookmark, allCards }: CardStackProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (allCards.length > 0) {
      setCards(pickRandom(allCards, 10));
      setCurrentIndex(0);
    }
  }, [allCards]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, cards.length - 1));
  }, [cards.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const shuffle = useCallback(() => {
    setCards(pickRandom(allCards, 10));
    setCurrentIndex(0);
  }, [allCards]);

  const { containerRef, dragOffset, onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
    onNext: goNext,
    onPrev: goPrev,
    enabled: true,
  });

  const currentCard = cards[currentIndex];

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="card-stack"
    >
      {cards.map((card, i) => {
        const calcOffset = i === currentIndex
          ? dragOffset
          : i < currentIndex
            ? -window.innerHeight
            : window.innerHeight;
        const isActive = i === currentIndex;
        const isBookmarked = bookmarks.includes(card.id);

        if (card.type === 'art') {
          return (
            <ArtCard
              key={card.id}
              card={card}
              isActive={isActive}
              offset={calcOffset}
              isBookmarked={isBookmarked}
              onBookmark={onBookmark}
            />
          );
        }
        return (
          <TextCard
            key={card.id}
            card={card}
            isActive={isActive}
            offset={calcOffset}
            isBookmarked={isBookmarked}
            onBookmark={onBookmark}
          />
        );
      })}

      {/* Progress dots */}
      <div className="progress-dots">
        {cards.map((c, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`progress-dot ${i === currentIndex ? 'active' : ''} ${c.type === 'art' ? 'art' : ''}`}
            style={i === currentIndex ? { background: currentCard?.accent || '#fff' } : undefined}
          />
        ))}
      </div>

      {/* Map button */}
      <button
        onClick={onShowMap}
        className={`map-button ${bookmarks.length > 0 ? 'has-bookmarks' : ''}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={bookmarks.length > 0 ? '#7f5af0' : 'rgba(255,255,255,0.5)'} strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
        {bookmarks.length > 0 && (
          <span className="map-button-count">{bookmarks.length}</span>
        )}
      </button>

      {/* Shuffle button */}
      {currentIndex === cards.length - 1 && cards.length > 0 && (
        <button onClick={shuffle} className="shuffle-button">
          Shuffle
        </button>
      )}

      {/* Hint */}
      <div className="swipe-hint">
        {currentIndex < cards.length - 1 ? '↑ swipe to discover' : '— end —'}
      </div>
    </div>
  );
}
