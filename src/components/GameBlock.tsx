import { Block, ArrowType } from '../types/game';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface GameBlockProps {
  block: Block;
  position: number;
}

export default function GameBlock({ block, position }: GameBlockProps) {
  const getIcon = (type: ArrowType, index: number) => {
    const isHit = block.hit[index];
    const iconProps = {
      className: `w-8 h-8 transition-all ${isHit ? 'scale-110' : ''}`,
      strokeWidth: 3
    };

    if (type === 'space') {
      return (
        <div className={`text-sm font-bold ${isHit ? 'scale-110' : ''}`}>
          SPACE
        </div>
      );
    }

    switch (type) {
      case 'up':
        return <ArrowUp {...iconProps} />;
      case 'down':
        return <ArrowDown {...iconProps} />;
      case 'left':
        return <ArrowLeft {...iconProps} />;
      case 'right':
        return <ArrowRight {...iconProps} />;
    }
  };

  const getColor = (type: ArrowType, index: number) => {
    const isHit = block.hit[index];

    if (isHit) {
      return 'bg-white border-white shadow-white/90';
    }

    if (block.completed) {
      return 'bg-gray-600/50 border-gray-500 shadow-gray-600/30';
    }

    if (!block.active) {
      return 'bg-gray-700/50 border-gray-600 shadow-gray-700/30';
    }

    switch (type) {
      case 'up':
        return 'bg-pink-500 border-pink-300 shadow-pink-500/70';
      case 'down':
        return 'bg-blue-500 border-blue-300 shadow-blue-500/70';
      case 'left':
        return 'bg-purple-500 border-purple-300 shadow-purple-500/70';
      case 'right':
        return 'bg-green-500 border-green-300 shadow-green-500/70';
      case 'space':
        return 'bg-cyan-500 border-cyan-300 shadow-cyan-500/70';
    }
  };

  const isSpaceOnly = block.arrows.length === 1 && block.arrows[0] === 'space';

  const barBottomPosition = block.active && !block.completed ? -68 : -500;

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-200"
      style={{ left: `${position}%` }}
    >
      {!block.completed && (
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-1200 ease-linear"
          style={{
            width: '100px',
            height: '6px',
            bottom: `${barBottomPosition}px`,
          }}
        >
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.3) 20%, rgba(34, 211, 238, 0.8) 40%, rgba(34, 211, 238, 1) 60%, rgba(34, 211, 238, 0.8) 80%, rgba(34, 211, 238, 0.3) 100%)',
              boxShadow: '0 0 15px rgba(34, 211, 238, 0.8), 0 0 30px rgba(34, 211, 238, 0.4)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
          </div>

          {block.active && (
            <div className="absolute inset-0 bg-cyan-400/30 blur-md"></div>
          )}
        </div>
      )}

      <div className={`flex ${isSpaceOnly ? 'flex-col' : 'flex-row'} gap-2 items-center justify-center relative z-10`}>
        {block.arrows.map((arrow, index) => (
          <div
            key={`${block.id}-${index}`}
            className={`${isSpaceOnly ? 'w-24 h-16' : 'w-16 h-16'} rounded-xl border-4 flex items-center justify-center text-white font-bold shadow-2xl transition-all duration-150 ${getColor(arrow, index)}`}
          >
            {getIcon(arrow, index)}
            {block.hit[index] && (
              <div className="absolute inset-0 rounded-xl bg-white/30 animate-ping"></div>
            )}
          </div>
        ))}
      </div>

      {block.active && !block.completed && (
        <div className="absolute inset-0 rounded-xl animate-pulse bg-yellow-400/20 blur-xl" style={{ margin: '-20px' }}></div>
      )}
    </div>
  );
}
