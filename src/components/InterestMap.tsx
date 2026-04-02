import type { Card, TextCard } from '../types/card';

interface InterestMapProps {
  bookmarks: number[];
  cards: Card[];
  onClose: () => void;
}

export default function InterestMap({ bookmarks, cards, onClose }: InterestMapProps) {
  const tagCounts: Record<string, number> = {};
  bookmarks.forEach((id) => {
    const card = cards.find((c) => c.id === id);
    if (card) card.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
  });
  const tags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...tags.map(([, c]) => c), 1);
  const bookmarkedCards = cards.filter((c) => bookmarks.includes(c.id));
  const artCount = bookmarkedCards.filter((c) => c.type === 'art').length;
  const textCount = bookmarkedCards.filter((c) => c.type === 'text').length;

  return (
    <div className="interest-map">
      <div className="interest-map-header">
        <h2 className="interest-map-title">知的関心マップ</h2>
        <button onClick={onClose} className="interest-map-close">✕</button>
      </div>

      {bookmarks.length === 0 ? (
        <div className="interest-map-empty">
          まだブックマークがありません。<br />
          カードの「興味あり」を押して<br />
          あなたの知的関心マップを作りましょう。
        </div>
      ) : (
        <>
          <div className="interest-map-counts">
            <div className="interest-map-count-box interest-map-count-text">
              <div className="interest-map-count-number" style={{ color: '#7f5af0' }}>{textCount}</div>
              <div className="interest-map-count-label">知識</div>
            </div>
            <div className="interest-map-count-box interest-map-count-art">
              <div className="interest-map-count-number" style={{ color: '#d4af37' }}>{artCount}</div>
              <div className="interest-map-count-label">名画</div>
            </div>
          </div>

          <div className="interest-map-tags">
            {tags.map(([tag, count]) => {
              const ratio = count / maxCount;
              const size = 14 + ratio * 18;
              return (
                <span
                  key={tag}
                  className="interest-map-tag"
                  style={{
                    fontSize: `${size}px`,
                    fontWeight: ratio > 0.5 ? 800 : 400,
                    padding: `${6 + ratio * 4}px ${14 + ratio * 6}px`,
                    background: `rgba(127, 90, 240, ${0.1 + ratio * 0.3})`,
                    border: `1px solid rgba(127, 90, 240, ${0.2 + ratio * 0.4})`,
                    color: `rgba(255,255,255, ${0.5 + ratio * 0.5})`,
                  }}
                >
                  {tag}<span className="interest-map-tag-count">{count}</span>
                </span>
              );
            })}
          </div>

          <div className="interest-map-list">
            {bookmarkedCards.map((card) => (
              <div
                key={card.id}
                className="interest-map-card"
                style={{
                  background: `${card.color}cc`,
                  border: `1px solid ${card.accent}33`,
                }}
              >
                {card.type === 'art' ? (
                  <div className="interest-map-card-thumb">
                    <img src={card.imageUrl} alt="" />
                  </div>
                ) : (
                  <div
                    className="interest-map-card-emoji"
                    style={{ background: `${card.accent}22` }}
                  >
                    {(card as TextCard).emoji}
                  </div>
                )}
                <div className="interest-map-card-info">
                  <div className="interest-map-card-title">{card.title}</div>
                  <span className="interest-map-card-meta" style={{ color: card.accent }}>
                    {card.source} · {card.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
