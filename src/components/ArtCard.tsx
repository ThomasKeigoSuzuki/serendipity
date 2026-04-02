import { useState, useEffect } from 'react';
import type { ArtCard as ArtCardType } from '../types/card';
import ActionButtons from './ActionButtons';

interface ArtCardProps {
  card: ArtCardType;
  isActive: boolean;
  offset: number;
  isBookmarked: boolean;
  onBookmark: (id: number) => void;
}

export default function ArtCard({ card, isActive, offset, isBookmarked, onBookmark }: ArtCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!isActive) setRevealed(false);
  }, [isActive]);

  const z = card.zoomRegion;

  return (
    <div
      className="card art-card"
      style={{
        background: `linear-gradient(160deg, ${card.color} 0%, ${card.color}ee 60%, ${card.accent}22 100%)`,
        transform: `translateY(${offset}px)`,
        opacity: isActive ? 1 : 0.5,
      }}
    >
      <div className="card-header" style={{ zIndex: 5 }}>
        <span className="card-source" style={{ color: card.accent }}>
          🖼 {card.source}
        </span>
        <span className="card-category">{card.category}</span>
      </div>

      <div className="art-card-main">
        <div
          onClick={(e) => { e.stopPropagation(); setRevealed(!revealed); }}
          className={`art-card-image-container ${revealed ? 'revealed' : ''}`}
          style={{
            borderColor: `${card.accent}44`,
            boxShadow: `0 0 60px ${card.accent}22`,
          }}
        >
          <img
            src={card.imageUrl}
            alt={card.title}
            onLoad={() => setImgLoaded(true)}
            className="art-card-image"
            style={{
              objectPosition: revealed ? 'center' : `${z.x}% ${z.y}%`,
              transform: revealed ? 'scale(1)' : `scale(${100 / z.size})`,
              transformOrigin: `${z.x}% ${z.y}%`,
              opacity: imgLoaded ? 1 : 0,
            }}
          />
          {!imgLoaded && (
            <div className="art-card-loader">
              <div className="spinner" style={{ borderColor: `${card.accent}44`, borderTopColor: card.accent }} />
            </div>
          )}
          {!revealed && imgLoaded && (
            <div className="art-card-tap-hint">
              <span>TAP TO REVEAL</span>
            </div>
          )}
        </div>

        <div className="art-card-info">
          {!revealed ? (
            <>
              <p className="art-card-question">この名画は？</p>
              <p className="art-card-hint">{card.hint}</p>
            </>
          ) : (
            <>
              <h2 className="art-card-title">{card.title}</h2>
              <p className="art-card-artist" style={{ color: card.accent }}>
                {card.artist}　·　{card.year}
              </p>
              <p className="art-card-body">{card.body}</p>
            </>
          )}
        </div>

        <div className="card-tags" style={{ justifyContent: 'center' }}>
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

      <div className="card-actions" style={{ zIndex: 5 }}>
        <ActionButtons card={card} isBookmarked={isBookmarked} onBookmark={onBookmark} />
      </div>
    </div>
  );
}
