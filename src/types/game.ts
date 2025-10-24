export type ArrowType = 'up' | 'down' | 'left' | 'right' | 'space';

export type BlockIndex = 0 | 1 | 2 | 3;

export type Difficulty = 'easy' | 'normal' | 'hard' | 'expert';

export type GameMode = 'precision' | 'combo' | 'free';

export type HitQuality = 'perfect' | 'great' | 'good' | 'miss';

export interface Block {
  id: string;
  index: BlockIndex;
  arrows: ArrowType[];
  hit: boolean[];
  active: boolean;
  completed: boolean;
}

export interface GameSettings {
  speed: number;
  difficulty: Difficulty;
  gameMode: GameMode;
  volume: number;
}

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  multiplier: number;
  hits: {
    perfect: number;
    great: number;
    good: number;
    miss: number;
  };
  totalNotes: number;
  accuracy: number;
}

export interface ScorePopup {
  id: string;
  value: number;
  blockIndex: BlockIndex;
  timestamp: number;
}
