import { useState, useEffect, useCallback } from 'react';
import type { Card } from './types/card';
import CardStack from './components/CardStack';
import InterestMap from './components/InterestMap';

const STORAGE_KEY = 'serendipity_bookmarks';

function loadBookmarks(): number[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function App() {
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>(loadBookmarks);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetch('/data/cards.json')
      .then((res) => res.json())
      .then((data: Card[]) => setAllCards(data))
      .catch(console.error);
  }, []);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      saveBookmarks(next);
      return next;
    });
  }, []);

  return (
    <div className="app-container">
      <CardStack
        allCards={allCards}
        bookmarks={bookmarks}
        onBookmark={toggleBookmark}
        onShowMap={() => setShowMap(true)}
      />
      {showMap && (
        <InterestMap
          bookmarks={bookmarks}
          cards={allCards}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
}
