import { X } from 'lucide-react';
import { GameSettings, Difficulty, GameMode } from '../types/game';

interface SettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onClose: () => void;
}

export default function Settings({ settings, onSettingsChange, onClose }: SettingsProps) {
  const handleSpeedChange = (speed: number) => {
    onSettingsChange({ ...settings, speed });
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    onSettingsChange({ ...settings, difficulty });
  };

  const handleGameModeChange = (gameMode: GameMode) => {
    onSettingsChange({ ...settings, gameMode });
  };

  const handleVolumeChange = (volume: number) => {
    onSettingsChange({ ...settings, volume });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md border border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-cyan-400">Opciones</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-white font-semibold mb-3">
              Velocidad: {settings.speed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={settings.speed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1x</span>
              <span>5x</span>
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-3">Dificultad</label>
            <div className="grid grid-cols-2 gap-2">
              {(['easy', 'normal', 'hard', 'expert'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleDifficultyChange(diff)}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                    settings.difficulty === diff
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {diff === 'easy' && 'Fácil'}
                  {diff === 'normal' && 'Normal'}
                  {diff === 'hard' && 'Difícil'}
                  {diff === 'expert' && 'Experto'}
                </button>
              ))}
            </div>
            <div className="mt-3 text-sm text-gray-400">
              {settings.difficulty === 'easy' && '• Pocas flechas, tempo lento'}
              {settings.difficulty === 'normal' && '• Flechas moderadas'}
              {settings.difficulty === 'hard' && '• Muchas flechas, patrones complejos'}
              {settings.difficulty === 'expert' && '• Patrones muy rápidos y complejos'}
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-3">Modo de Juego</label>
            <div className="flex flex-col gap-2">
              {(['precision', 'combo', 'free'] as GameMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleGameModeChange(mode)}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all text-left ${
                    settings.gameMode === mode
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-bold">
                    {mode === 'precision' && 'Modo Precisión'}
                    {mode === 'combo' && 'Modo Combo'}
                    {mode === 'free' && 'Modo Libre'}
                  </div>
                  <div className="text-xs mt-1 opacity-80">
                    {mode === 'precision' && 'Enfocado en obtener 100% en cada nota'}
                    {mode === 'combo' && 'Mantener el combo más largo posible'}
                    {mode === 'free' && 'Sin game over, solo práctica'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-3">
              Volumen: {Math.round(settings.volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
