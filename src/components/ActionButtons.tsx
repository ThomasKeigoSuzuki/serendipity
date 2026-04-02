import type { Card, ArtCard as ArtCardType } from '../types/card';

interface ActionBtnProps {
  icon: 'bookmark' | 'share';
  label: string;
  active?: boolean;
  accent: string;
  onClick: () => void;
}

function ActionBtn({ icon, label, active, accent, onClick }: ActionBtnProps) {
  const color = active ? accent : 'rgba(255,255,255,0.5)';
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="action-btn"
    >
      {icon === 'bookmark' ? (
        <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? accent : 'none'} stroke={color} strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ) : (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      )}
      <span
        className="action-btn-label"
        style={{ color: active ? accent : 'rgba(255,255,255,0.4)' }}
      >
        {label}
      </span>
    </button>
  );
}

interface ActionButtonsProps {
  card: Card;
  isBookmarked: boolean;
  onBookmark: (id: number) => void;
}

export default function ActionButtons({ card, isBookmarked, onBookmark }: ActionButtonsProps) {
  const handleShare = () => {
    const text = card.type === 'art'
      ? `${card.title} -- ${(card as ArtCardType).artist}\n${card.body}`
      : `${card.title}\n${card.body}`;

    if (navigator.share) {
      navigator.share({ title: card.title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('クリップボードにコピーしました');
      }).catch(() => {});
    }
  };

  return (
    <div className="action-buttons">
      <ActionBtn
        icon="bookmark"
        label={isBookmarked ? '保存済み' : '興味あり'}
        active={isBookmarked}
        accent={card.accent}
        onClick={() => onBookmark(card.id)}
      />
      <ActionBtn
        icon="share"
        label="共有"
        accent={card.accent}
        onClick={handleShare}
      />
    </div>
  );
}
