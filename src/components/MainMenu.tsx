import { useState } from 'react';
import { Music, TrendingUp } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import Leaderboard from './Leaderboard';

interface MainMenuProps {
  onPlay: () => void;
  onSettings: () => void;
  onLoadSong: () => void;
}

export default function MainMenu({ onPlay, onSettings, onLoadSong }: MainMenuProps) {
  const { isLoaded } = useUser();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative">
      <div className="absolute top-6 right-6 flex items-center gap-4">
        {isLoaded && (
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-12 h-12"
                }
              }}
            />
          </SignedIn>
        )}
      </div>

      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Music className="w-12 h-12 text-cyan-400" strokeWidth={1.5} />
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Ritm0 R0mántica
          </h1>
        </div>
        <p className="text-gray-400 text-lg">Press the arrows at the perfect moment</p>
      </div>

      <SignedOut>
        <div className="max-w-md text-center space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-3">Bienvenido a Ritm0 R0mántica</h2>
            <p className="text-gray-400 mb-6">
              Inicia sesión para jugar, competir en el leaderboard y guardar tus mejores puntuaciones.
            </p>
            <SignInButton mode="modal">
              <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105">
                Iniciar Sesión
              </button>
            </SignInButton>
          </div>

          <div className="mt-8 text-gray-500 text-sm space-y-2">
            <p className="text-center font-semibold text-gray-400">Controles del Juego:</p>
            <div className="flex gap-6 justify-center">
              <span>↑ ↓ ← →</span>
              <span>|</span>
              <span>ESPACIO</span>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col gap-4 w-80">
          <button
            onClick={onPlay}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-cyan-500/50"
          >
            Jugar
          </button>

          <button
            onClick={onLoadSong}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 border border-gray-700 hover:border-cyan-500"
          >
            Cargar Canción de YouTube
          </button>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 border border-gray-700 hover:border-yellow-500 flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Leaderboard
          </button>

          <button
            onClick={onSettings}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 border border-gray-700 hover:border-cyan-500"
          >
            Opciones
          </button>
        </div>

        <div className="mt-16 text-gray-500 text-sm space-y-2">
          <p className="text-center font-semibold text-gray-400">Controles:</p>
          <div className="flex gap-6 justify-center">
            <span>↑ ↓ ← →</span>
            <span>|</span>
            <span>ESPACIO</span>
          </div>
        </div>
      </SignedIn>

      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
}
