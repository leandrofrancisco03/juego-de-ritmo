import { ArrowType, HitQuality, Difficulty, BlockIndex, Block } from '../types/game';

export const ARROW_KEYS: { [key: string]: ArrowType } = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ' ': 'space',
};

export const BLOCK_POSITIONS = [15, 38, 62, 85];

export const PERFECT_RANGE = 3;
export const GREAT_RANGE = 6;
export const GOOD_RANGE = 10;

export const getHitQuality = (scannerPosition: number, blockPosition: number): HitQuality | null => {
  const distance = Math.abs(scannerPosition - blockPosition);

  if (distance <= PERFECT_RANGE) return 'perfect';
  if (distance <= GREAT_RANGE) return 'great';
  if (distance <= GOOD_RANGE) return 'good';
  return null;
};

export const getScoreForQuality = (quality: HitQuality, multiplier: number): number => {
  const baseScores = {
    perfect: 1000,
    great: 600,
    good: 300,
    miss: 0,
  };
  return baseScores[quality] * multiplier;
};

export const getMultiplier = (combo: number): number => {
  if (combo >= 50) return 5;
  if (combo >= 30) return 4;
  if (combo >= 20) return 3;
  if (combo >= 10) return 2;
  return 1;
};

export const generateBlockArrows = (difficulty: Difficulty): ArrowType[] => {
  const arrows: ArrowType[] = ['up', 'down', 'left', 'right'];

  if (difficulty === 'easy') {
    return [arrows[Math.floor(Math.random() * arrows.length)]];
  }

  if (difficulty === 'normal') {
    const count = Math.random() < 0.7 ? 1 : 2;
    const selected: ArrowType[] = [];

    for (let i = 0; i < count; i++) {
      const arrow = arrows[Math.floor(Math.random() * arrows.length)];
      if (!selected.includes(arrow)) {
        selected.push(arrow);
      }
    }

    return selected;
  }

  if (difficulty === 'hard') {
    const includeSpace = Math.random() < 0.3;
    if (includeSpace) {
      return ['space'];
    }

    const count = Math.random() < 0.5 ? 2 : Math.random() < 0.7 ? 1 : 3;
    const selected: ArrowType[] = [];

    for (let i = 0; i < count; i++) {
      const arrow = arrows[Math.floor(Math.random() * arrows.length)];
      if (!selected.includes(arrow)) {
        selected.push(arrow);
      }
    }

    return selected;
  }

  const includeSpace = Math.random() < 0.4;
  if (includeSpace) {
    return ['space'];
  }

  const count = Math.random() < 0.3 ? 3 : Math.random() < 0.6 ? 2 : 1;
  const selected: ArrowType[] = [];

  for (let i = 0; i < count; i++) {
    const arrow = arrows[Math.floor(Math.random() * arrows.length)];
    if (!selected.includes(arrow)) {
      selected.push(arrow);
    }
  }

  return selected;
};

export const createBlock = (index: BlockIndex, difficulty: Difficulty): Block => {
  const arrows = generateBlockArrows(difficulty);

  return {
    id: `block-${Date.now()}-${Math.random()}`,
    index,
    arrows,
    hit: new Array(arrows.length).fill(false),
    active: false,
    completed: false,
  };
};

export const getScannerSpeed = (speed: number): number => {
  return 0.12 * speed;
};
