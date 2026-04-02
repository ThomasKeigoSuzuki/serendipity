import type { TextCard as TextCardType } from '../types/card';
import ActionButtons from './ActionButtons';

interface TextCardProps {
  card: TextCardType;
  isActive: boolean;
  offset: number;
  isBookmarked: boolean;
  onBookmark: (id: number) => void;
}

export default function TextCard({ card, isActive, offset, isBookmarked, onBookmark }: TextCardProps) {
  return (
    <div
      className="card text-card"
      style={{
        background: `linear-gradient(160deg, ${card.color} 0%, ${card.color}ee 60%, ${card.accent}33 100%)`,
        transform: `translateY(${offset}px)`,
        opacity: isActive ? 1 : 0.5,
      }}
    >
      <div className="text-card-emoji-bg">{card.emoji}</div>

      <div className="card-header">
        <span className="card-source" style={{ color: card.accent }}>
          {card.source}
        </span>
        <span className="card-category">{card.category}</span>
      </div>

      <div className="text-card-content">
        <div className="text-card-emoji">{card.emoji}</div>
        <h2 className="text-card-title">{card.title}</h2>
        <p className="text-card-body">{card.body}</p>
        <div className="card-tags">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="card-tag"
              style={{
                background: `${card.accent}22`,
                border: `1px solid ${card.accent}44`,
                color: card.accent,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="card-actions">
        <ActionButtons card={card} isBookmarked={isBookmarked} onBookmark={onBookmark} />
      </div>
    </div>
  );
}
