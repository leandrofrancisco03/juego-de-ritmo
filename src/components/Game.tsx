import { useState, useEffect, useRef, useCallback } from 'react';
import { Block, GameSettings, GameStats, HitQuality, ScorePopup as ScorePopupType, BlockIndex } from '../types/game';
import {
  ARROW_KEYS,
  BLOCK_POSITIONS,
  getHitQuality,
  getScoreForQuality,
  createBlock,
  getScannerSpeed,
  getMultiplier,
} from '../utils/gameLogic';
import GameBlock from './GameBlock';
import ScannerBar from './ScannerBar';
import TimelineBar from './TimelineBar';
import GameHUD from './GameHUD';
import Countdown from './Countdown';
import ResultsScreen from './ResultsScreen';
import ComboDisplay from './ComboDisplay';
import DancingCharacter from './DancingCharacter';
import { Volume2, VolumeX, X, Star } from 'lucide-react';

interface GameProps {
  settings: GameSettings;
  youtubeUrl?: string;
  onExit: () => void;
}

export default function Game({ settings, youtubeUrl, onExit }: GameProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [scannerPosition, setScannerPosition] = useState(0);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    multiplier: 1,
    hits: { perfect: 0, great: 0, good: 0, miss: 0 },
    totalNotes: 0,
    accuracy: 100,
  });
  const [scorePopups, setScorePopups] = useState<ScorePopupType[]>([]);
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'finished'>('countdown');
  const [isMuted, setIsMuted] = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(0);

  const animationFrameRef = useRef<number>();
  const gameStartTimeRef = useRef<number>(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const hitSoundRef = useRef<HTMLAudioElement | null>(null);
  const missSoundRef = useRef<HTMLAudioElement | null>(null);
  const completedBlocksRef = useRef<Set<string>>(new Set());
  const youtubePlayerRef = useRef<any>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  const gameDuration = videoDuration ? videoDuration * 1000 : 120000;

  useEffect(() => {
    hitSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSt+zPLTgjMGHm7A7+OZURE');
    missSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA');

    if (hitSoundRef.current) hitSoundRef.current.volume = settings.volume * 0.3;
    if (missSoundRef.current) missSoundRef.current.volume = settings.volume * 0.3;

    return () => {
      if (hitSoundRef.current) hitSoundRef.current.pause();
      if (missSoundRef.current) missSoundRef.current.pause();
    };
  }, [settings.volume]);

  const extractYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  useEffect(() => {
    if (youtubeUrl && gameState === 'countdown') {
      const videoId = extractYouTubeVideoId(youtubeUrl);
      if (videoId) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);

        (window as any).onYouTubeIframeAPIReady = () => {
          youtubePlayerRef.current = new (window as any).YT.Player('youtube-player', {
            videoId: videoId,
            playerVars: {
              autoplay: 0,
              controls: 0,
              showinfo: 0,
              modestbranding: 1,
              enablejsapi: 1,
            },
            events: {
              onReady: (event: any) => {
                const duration = event.target.getDuration();
                setVideoDuration(duration);
              },
              onStateChange: (event: any) => {
                if (event.data === (window as any).YT.PlayerState.ENDED) {
                  setGameState('finished');
                }
              },
            },
          });
        };
      }
    }

    if (gameState === 'playing' && youtubePlayerRef.current) {
      youtubePlayerRef.current.playVideo();
    }
  }, [youtubeUrl, gameState]);

  const playSound = useCallback(
    (type: 'hit' | 'miss') => {
      if (isMuted) return;

      const sound = type === 'hit' ? hitSoundRef.current : missSoundRef.current;
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }
    },
    [isMuted]
  );

  const addScorePopup = useCallback((value: number, blockIndex: BlockIndex) => {
    const popup: ScorePopupType = {
      id: `${Date.now()}-${Math.random()}`,
      value,
      blockIndex,
      timestamp: Date.now(),
    };
    setScorePopups((prev) => [...prev, popup]);
    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== popup.id));
    }, 1200);
  }, []);

  const updateStats = useCallback(
    (quality: HitQuality, blockIndex: BlockIndex) => {
      setStats((prev) => {
        const newHits = { ...prev.hits, [quality]: prev.hits[quality] + 1 };
        const newCombo = quality === 'miss' ? 0 : prev.combo + 1;
        const newMaxCombo = Math.max(prev.maxCombo, newCombo);
        const newMultiplier = getMultiplier(newCombo);
        const scoreGained = getScoreForQuality(quality, newMultiplier);
        const newScore = prev.score + scoreGained;
        const newTotalNotes = prev.totalNotes + 1;

        const totalAccuracy =
          (newHits.perfect * 100 + newHits.great * 80 + newHits.good * 60 + newHits.miss * 0) /
          newTotalNotes;

        if (quality !== 'miss') {
          addScorePopup(scoreGained, blockIndex);
        }

        return {
          score: newScore,
          combo: newCombo,
          maxCombo: newMaxCombo,
          multiplier: newMultiplier,
          hits: newHits,
          totalNotes: newTotalNotes,
          accuracy: totalAccuracy,
        };
      });
    },
    [addScorePopup]
  );

  const initializeBlocks = useCallback(() => {
    const newBlocks: Block[] = [];
    for (let i = 0; i < 4; i++) {
      const block = createBlock(i as BlockIndex, settings.difficulty);
      newBlocks.push(block);
    }
    setBlocks(newBlocks);
  }, [settings.difficulty]);

  useEffect(() => {
    if (gameState === 'countdown') {
      initializeBlocks();
    }
  }, [gameState, initializeBlocks]);

  const handleKeyPress = useCallback(
    (key: string) => {
      const arrowType = ARROW_KEYS[key];
      if (!arrowType || gameState !== 'playing') return;

      const activeBlock = blocks.find((b) => b.active && !b.completed);
      if (!activeBlock) return;

      const arrowIndex = activeBlock.arrows.findIndex(
        (arrow, idx) => arrow === arrowType && !activeBlock.hit[idx]
      );

      if (arrowIndex === -1) return;

      const blockPosition = BLOCK_POSITIONS[activeBlock.index];
      const quality = getHitQuality(scannerPosition, blockPosition);

      if (quality) {
        setBlocks((prev) =>
          prev.map((b) => {
            if (b.id === activeBlock.id) {
              const newHit = [...b.hit];
              newHit[arrowIndex] = true;
              const allHit = newHit.every((h) => h);
              return { ...b, hit: newHit, completed: allHit };
            }
            return b;
          })
        );

        updateStats(quality, activeBlock.index);
        playSound('hit');
      }
    },
    [blocks, scannerPosition, gameState, updateStats, playSound]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (ARROW_KEYS[key]) {
        e.preventDefault();
        if (!activeKeys.has(key)) {
          setActiveKeys((prev) => new Set(prev).add(key));
          handleKeyPress(key);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key;
      if (ARROW_KEYS[key]) {
        setActiveKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyPress, activeKeys]);

  const gameLoop = useCallback(
    (timestamp: number) => {
      if (gameState !== 'playing') return;

      if (!gameStartTimeRef.current) {
        gameStartTimeRef.current = timestamp;
      }

      const elapsedTime = timestamp - gameStartTimeRef.current;
      const progress = (elapsedTime / gameDuration) * 100;
      setTimelineProgress(progress);

      if (elapsedTime >= gameDuration) {
        setGameState('finished');
        return;
      }

      const scannerSpeed = getScannerSpeed(settings.speed);
      setScannerPosition((prev) => {
        const newPos = prev + scannerSpeed;
        return newPos > 100 ? 0 : newPos;
      });

      setBlocks((prevBlocks) => {
        return prevBlocks.map((block) => {
          const blockPosition = BLOCK_POSITIONS[block.index];
          const distanceToBlock = Math.abs(scannerPosition - blockPosition);

          if (distanceToBlock < 15 && !block.active) {
            return { ...block, active: true };
          }

          if (block.active && !block.completed && scannerPosition > blockPosition + 15) {
            if (!completedBlocksRef.current.has(block.id)) {
              completedBlocksRef.current.add(block.id);

              if (settings.gameMode !== 'free') {
                block.arrows.forEach((_, index) => {
                  if (!block.hit[index]) {
                    updateStats('miss', block.index);
                    playSound('miss');
                  }
                });
              }

              return { ...block, completed: true, active: false };
            }
          }

          return block;
        });
      });

      if (scannerPosition > 95) {
        completedBlocksRef.current.clear();
        initializeBlocks();
        setScannerPosition(0);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [gameState, settings.speed, settings.gameMode, scannerPosition, updateStats, playSound, initializeBlocks]
  );

  useEffect(() => {
    if (gameState === 'playing') {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, gameLoop]);

  const handleCountdownComplete = () => {
    setGameState('playing');
    gameStartTimeRef.current = performance.now();
  };

  const handleRetry = () => {
    setBlocks([]);
    setScannerPosition(0);
    setStats({
      score: 0,
      combo: 0,
      maxCombo: 0,
      multiplier: 1,
      hits: { perfect: 0, great: 0, good: 0, miss: 0 },
      totalNotes: 0,
      accuracy: 100,
    });
    setScorePopups([]);
    setTimelineProgress(0);
    setGameState('countdown');
    gameStartTimeRef.current = 0;
    completedBlocksRef.current.clear();
    if (iframeRef.current) {
      iframeRef.current.src = '';
    }
  };

  if (gameState === 'finished') {
    return <ResultsScreen stats={stats} settings={settings} youtubeUrl={youtubeUrl} onRetry={handleRetry} onMenu={onExit} />;
  }

  const videoId = youtubeUrl ? extractYouTubeVideoId(youtubeUrl) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {videoId && (
        <div
          id="youtube-player"
          className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none"
        />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-transparent"></div>

      {stats.combo >= 50 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <Star
              key={i}
              className="absolute w-4 h-4 text-yellow-400 opacity-60"
              fill="currentColor"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${1 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="absolute top-4 right-4 flex gap-2 z-50">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg transition-all border border-gray-700 pointer-events-auto"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <button
          onClick={onExit}
          className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg transition-all border border-gray-700 pointer-events-auto"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {gameState === 'playing' && <GameHUD stats={stats} />}

      <ComboDisplay stats={stats} />

      <DancingCharacter speed={settings.speed} isPlaying={gameState === 'playing'} />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-5xl px-4">
          <div className="relative">
            <div className="relative bg-gradient-to-br from-black/80 via-gray-900/70 to-black/80 backdrop-blur-sm rounded-3xl border-8 border-yellow-500/60 shadow-2xl h-32 overflow-visible">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-yellow-500/5"></div>

              {blocks.map((block) => (
                <GameBlock
                  key={block.id}
                  block={block}
                  position={BLOCK_POSITIONS[block.index]}
                />
              ))}

              <ScannerBar position={scannerPosition} />

              {scorePopups.map((popup) => (
                <div
                  key={popup.id}
                  className="absolute pointer-events-none z-50"
                  style={{
                    left: `${BLOCK_POSITIONS[popup.blockIndex]}%`,
                    top: '-80px',
                    animation: 'float-up 1.2s ease-out forwards',
                  }}
                >
                  <div className="relative flex flex-col items-center -translate-x-1/2">
                    <div
                      className="text-4xl font-black text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,1)]"
                      style={{
                        textShadow: '3px 3px 0px rgba(234, 88, 12, 1), -1px -1px 0px rgba(251, 191, 36, 1)',
                        WebkitTextStroke: '2px rgba(234, 88, 12, 0.8)',
                      }}
                    >
                      +{popup.value}
                    </div>
                  </div>
                </div>
              ))}

              {gameState === 'countdown' && <Countdown onComplete={handleCountdownComplete} />}
            </div>

            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 border-4 border-yellow-300 shadow-lg shadow-yellow-500/50 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" fill="white" />
              </div>
            </div>
          </div>

          <div className="mt-8 px-8">
            <TimelineBar progress={timelineProgress} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-40px) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(0.8);
          }
        }
      `}</style>
    </div>
  );
}
