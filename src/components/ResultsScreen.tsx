import { useState, useEffect } from 'react';
import { GameStats, GameSettings } from '../types/game';
import { Trophy, Target, Zap, Award, Save, Loader2, Share2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';

interface ResultsScreenProps {
  stats: GameStats;
  settings: GameSettings;
  youtubeUrl?: string;
  onRetry: () => void;
  onMenu: () => void;
}

export default function ResultsScreen({ stats, settings, youtubeUrl, onRetry, onMenu }: ResultsScreenProps) {
  const { user, isLoaded } = useUser();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isLoaded && user && !saved) {
      saveScore();
    }
  }, [isLoaded, user]);

  const saveScore = async () => {
    if (!user || saved || saving) return;

    setSaving(true);
    try {
      const { error } = await supabase.from('game_scores').insert({
        user_id: user.id,
        username: user.username || user.firstName || 'Anonymous',
        score: stats.score,
        max_combo: stats.maxCombo,
        perfect_hits: stats.hits.perfect,
        good_hits: stats.hits.good + stats.hits.great,
        miss_hits: stats.hits.miss,
        accuracy: stats.accuracy,
        speed: settings.speed,
        youtube_url: youtubeUrl,
      });

      if (error) throw error;
      setSaved(true);
    } catch (error) {
      console.error('Error saving score:', error);
    } finally {
      setSaving(false);
    }
  };

  const getShareText = () => {
    const username = user?.username || user?.firstName || 'Jugador';
    return `¡${username} acaba de obtener ${stats.score.toLocaleString()} puntos en Ritm0 R0mántica! 🎵\n\nRank: ${getRank().rank}\nPrecisión: ${stats.accuracy.toFixed(1)}%\nCombo máximo: ${stats.maxCombo}x\n\n¿Puedes superarlo?`;
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'whatsapp') => {
    const text = getShareText();
    const url = window.location.origin;

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
        break;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    const text = getShareText();
    navigator.clipboard.writeText(text + '\n' + window.location.origin);
    alert('¡Texto copiado al portapapeles!');
  };
  const getRank = () => {
    if (stats.accuracy >= 95) return { rank: 'S', color: 'text-yellow-400', glow: 'shadow-yellow-500/50' };
    if (stats.accuracy >= 85) return { rank: 'A', color: 'text-green-400', glow: 'shadow-green-500/50' };
    if (stats.accuracy >= 75) return { rank: 'B', color: 'text-blue-400', glow: 'shadow-blue-500/50' };
    if (stats.accuracy >= 65) return { rank: 'C', color: 'text-purple-400', glow: 'shadow-purple-500/50' };
    return { rank: 'D', color: 'text-gray-400', glow: 'shadow-gray-500/50' };
  };

  const rank = getRank();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 w-full max-w-2xl border border-gray-700 shadow-2xl">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
            ¡Juego Terminado!
          </h2>
          <div className={`text-8xl font-bold ${rank.color} drop-shadow-[0_0_20px] ${rank.glow}`}>
            {rank.rank}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-cyan-400" />
              <span className="text-gray-400 font-semibold">Puntuación Final</span>
            </div>
            <div className="text-4xl font-bold text-white">{stats.score.toLocaleString()}</div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-cyan-400" />
              <span className="text-gray-400 font-semibold">Precisión</span>
            </div>
            <div className="text-4xl font-bold text-cyan-400">{stats.accuracy.toFixed(1)}%</div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-400 font-semibold">Combo Máximo</span>
            </div>
            <div className="text-4xl font-bold text-yellow-400">{stats.maxCombo}x</div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-purple-400" />
              <span className="text-gray-400 font-semibold">Notas Totales</span>
            </div>
            <div className="text-4xl font-bold text-purple-400">{stats.totalNotes}</div>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700 mb-8">
          <h3 className="text-white font-bold mb-4 text-center">Desglose de Precisión</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{stats.hits.perfect}</div>
              <div className="text-sm text-gray-400 mt-1">Perfect</div>
              <div className="text-xs text-gray-500">100%</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{stats.hits.great}</div>
              <div className="text-sm text-gray-400 mt-1">Great</div>
              <div className="text-xs text-gray-500">80%</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{stats.hits.good}</div>
              <div className="text-sm text-gray-400 mt-1">Good</div>
              <div className="text-xs text-gray-500">60%</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{stats.hits.miss}</div>
              <div className="text-sm text-gray-400 mt-1">Miss</div>
              <div className="text-xs text-gray-500">0%</div>
            </div>
          </div>
        </div>

        {user && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 mb-4 text-center">
            {saving ? (
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Guardando puntuación...</span>
              </div>
            ) : saved ? (
              <div className="flex items-center justify-center gap-2 text-green-400">
                <Save className="w-5 h-5" />
                <span>Puntuación guardada en el leaderboard</span>
              </div>
            ) : null}
          </div>
        )}

        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700 mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-bold text-center">Comparte tu Puntuación</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleShare('facebook')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>

            <button
              onClick={() => handleShare('twitter')}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </button>

            <button
              onClick={() => handleShare('whatsapp')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </button>

            <button
              onClick={handleCopyLink}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onRetry}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-cyan-500/50"
          >
            Reintentar
          </button>
          <button
            onClick={onMenu}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 border border-gray-600"
          >
            Menú Principal
          </button>
        </div>
      </div>
    </div>
  );
}
