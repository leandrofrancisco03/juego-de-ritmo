import { useState } from 'react';
import { X, Youtube } from 'lucide-react';

interface YouTubeLoaderProps {
  onLoadSong: (url: string) => void;
  onClose: () => void;
}

export default function YouTubeLoader({ onLoadSong, onClose }: YouTubeLoaderProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;

    if (!url.trim()) {
      setError('Por favor ingresa una URL');
      return;
    }

    if (!youtubeRegex.test(url)) {
      setError('URL de YouTube inválida');
      return;
    }

    onLoadSong(url);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md border border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Youtube className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-bold text-cyan-400">YouTube</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">
              URL de YouTube
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4 text-sm text-gray-400">
            <p className="font-semibold text-white mb-2">Instrucciones:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Copia la URL de un video de YouTube</li>
              <li>Pégala en el campo de arriba</li>
              <li>Haz clic en "Cargar Canción"</li>
            </ol>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/50"
          >
            Cargar Canción
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
