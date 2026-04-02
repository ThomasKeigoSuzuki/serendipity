export interface BaseCard {
  id: number;
  type: 'text' | 'art';
  source: string;
  category: string;
  title: string;
  body: string;
  color: string;
  accent: string;
  tags: string[];
}

export interface TextCard extends BaseCard {
  type: 'text';
  emoji: string;
}

export interface ArtCard extends BaseCard {
  type: 'art';
  artist: string;
  year: string;
  imageUrl: string;
  zoomRegion: { x: number; y: number; size: number };
  hint: string;
}

export type Card = TextCard | ArtCard;
