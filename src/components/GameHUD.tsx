import { GameStats } from '../types/game';
import { Target, Zap, Award } from 'lucide-react';

interface GameHUDProps {
  stats: GameStats;
}

export default function GameHUD({ stats }: GameHUDProps) {
  const getAccuracyColor = () => {
    if (stats.accuracy >= 95) return 'text-yellow-400';
    if (stats.accuracy >= 85) return 'text-green-400';
    if (stats.accuracy >= 70) return 'text-blue-400';
    return 'text-red-400';
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-xl">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-cyan-400" />
              <div>
                <div className="text-xs text-gray-400">Puntuación</div>
                <div className="text-3xl font-bold text-white">{stats.score.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            {stats.combo > 0 && (
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border-4 border-yellow-400 shadow-2xl shadow-yellow-500/50">
                <div className="flex items-center justify-center gap-3">
                  <Zap className="w-10 h-10 text-yellow-400" />
                  <div className="text-7xl font-bold text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]">
                    {stats.combo}
                  </div>
                  <Zap className="w-10 h-10 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white">COMBO</div>
              </div>
            )}
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-gray-400">Precisión</div>
                <div className={`text-3xl font-bold ${getAccuracyColor()}`}>
                  {stats.accuracy.toFixed(1)}%
                </div>
              </div>
              <Award className={`w-6 h-6 ${getAccuracyColor()}`} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-6">
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
            <span className="text-green-400 font-bold text-lg">{stats.hits.perfect}</span>
            <span className="text-gray-400 text-sm ml-2">Perfect</span>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
            <span className="text-blue-400 font-bold text-lg">{stats.hits.great}</span>
            <span className="text-gray-400 text-sm ml-2">Great</span>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
            <span className="text-yellow-400 font-bold text-lg">{stats.hits.good}</span>
            <span className="text-gray-400 text-sm ml-2">Good</span>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
            <span className="text-red-400 font-bold text-lg">{stats.hits.miss}</span>
            <span className="text-gray-400 text-sm ml-2">Miss</span>
          </div>
        </div>
      </div>
    </div>
  );
}
