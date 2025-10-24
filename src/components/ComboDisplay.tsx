import { GameStats } from '../types/game';
import { Zap, Star } from 'lucide-react';

interface ComboDisplayProps {
  stats: GameStats;
}

export default function ComboDisplay({ stats }: ComboDisplayProps) {
  if (stats.combo === 0) return null;

  const getComboColor = () => {
    if (stats.combo >= 100) return 'text-red-400';
    if (stats.combo >= 50) return 'text-orange-400';
    if (stats.combo >= 30) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getBorderColor = () => {
    if (stats.combo >= 100) return 'border-red-400';
    if (stats.combo >= 50) return 'border-orange-400';
    if (stats.combo >= 30) return 'border-yellow-400';
    return 'border-green-400';
  };

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30">
      <div className="relative">
        <div
          className={`text-center px-4 py-2 bg-gradient-to-br from-gray-900/40 to-black/40 backdrop-blur-sm rounded-2xl border-4 ${getBorderColor()} shadow-xl`}
          style={{
            boxShadow: `0 0 20px ${stats.combo >= 50 ? 'rgba(251, 146, 60, 0.4)' : 'rgba(74, 222, 128, 0.3)'}`,
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap className={`w-5 h-5 ${getComboColor()}`} fill="currentColor" />
            <div
              className={`text-4xl font-black ${getComboColor()}`}
              style={{
                textShadow: '2px 2px 0px rgba(0, 0, 0, 0.6), -1px -1px 0px rgba(255, 255, 255, 0.2)',
                WebkitTextStroke: '1.5px rgba(0, 0, 0, 0.4)',
              }}
            >
              {stats.combo}
            </div>
            <Zap className={`w-5 h-5 ${getComboColor()}`} fill="currentColor" />
          </div>

          <div
            className="text-lg font-black text-white"
            style={{
              textShadow: '2px 2px 0px rgba(0, 0, 0, 0.6), -1px -1px 0px rgba(255, 255, 255, 0.1)',
              WebkitTextStroke: '1px rgba(0, 0, 0, 0.4)',
            }}
          >
            COMBO
          </div>

          {stats.multiplier > 1 && (
            <div className="mt-1 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 animate-pulse" fill="currentColor" />
              <div
                className="text-2xl font-black text-yellow-400"
                style={{
                  textShadow: '2px 2px 0px rgba(234, 88, 12, 0.8), -1px -1px 0px rgba(251, 191, 36, 0.3)',
                  WebkitTextStroke: '1px rgba(234, 88, 12, 0.6)',
                }}
              >
                x{stats.multiplier}
              </div>
              <Star className="w-4 h-4 text-yellow-400 animate-pulse" fill="currentColor" />
            </div>
          )}
        </div>

        {stats.combo >= 30 && (
          <div className="absolute -top-2 -left-2 -right-2 -bottom-2 animate-ping opacity-30">
            <div className={`w-full h-full rounded-2xl border-2 ${getBorderColor()}`}></div>
          </div>
        )}
      </div>
    </div>
  );
}
