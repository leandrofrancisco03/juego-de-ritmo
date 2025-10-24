import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

interface DancingCharacterProps {
  speed: number;
  isPlaying: boolean;
}

type DanceMove = 'bounce' | 'twist' | 'jump' | 'slide' | 'spin' | 'wave' | 'dab' | 'floss';

export default function DancingCharacter({ speed, isPlaying }: DancingCharacterProps) {
  const [frame, setFrame] = useState(0);
  const [currentMove, setCurrentMove] = useState<DanceMove>('bounce');
  const [moveProgress, setMoveProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const bpm = speed * 120;
    const beatDuration = 60000 / bpm;

    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 8);
      setMoveProgress((prev) => {
        const next = prev + 1;
        if (next >= 16) {
          const moves: DanceMove[] = ['bounce', 'twist', 'jump', 'slide', 'spin', 'wave', 'dab', 'floss'];
          setCurrentMove(moves[Math.floor(Math.random() * moves.length)]);
          return 0;
        }
        return next;
      });
    }, beatDuration / 2);

    return () => clearInterval(interval);
  }, [speed, isPlaying]);

  const getDancePosition = () => {
    const cycle = frame % 4;

    switch (currentMove) {
      case 'bounce':
        if (cycle === 0) return 'translate-y-0';
        if (cycle === 1) return '-translate-y-4 scale-105';
        if (cycle === 2) return 'translate-y-0';
        return 'translate-y-2 scale-95';

      case 'twist':
        if (cycle === 0) return 'rotate-0';
        if (cycle === 1) return 'rotate-12';
        if (cycle === 2) return 'rotate-0';
        return '-rotate-12';

      case 'jump':
        if (cycle === 0) return 'translate-y-0 scale-100';
        if (cycle === 1) return '-translate-y-8 scale-110';
        if (cycle === 2) return '-translate-y-6 scale-105';
        return 'translate-y-0 scale-100';

      case 'slide':
        if (cycle === 0) return 'translate-x-0';
        if (cycle === 1) return '-translate-x-4';
        if (cycle === 2) return 'translate-x-0';
        return 'translate-x-4';

      case 'spin':
        if (cycle === 0) return 'rotate-0';
        if (cycle === 1) return 'rotate-45';
        if (cycle === 2) return 'rotate-90';
        return 'rotate-180';

      case 'wave':
        if (cycle === 0) return 'translate-y-0 -translate-x-2';
        if (cycle === 1) return '-translate-y-3 translate-x-0';
        if (cycle === 2) return 'translate-y-0 translate-x-2';
        return 'translate-y-3 translate-x-0';

      case 'dab':
        if (cycle === 0 || cycle === 2) return 'translate-y-0 rotate-0';
        return '-translate-y-2 -rotate-12';

      case 'floss':
        if (cycle === 0) return 'translate-x-0';
        if (cycle === 1) return '-translate-x-3';
        if (cycle === 2) return 'translate-x-0';
        return 'translate-x-3';

      default:
        return 'translate-y-0';
    }
  };

  const getLeftArmRotation = () => {
    const cycle = frame % 4;

    switch (currentMove) {
      case 'bounce':
        return cycle % 2 === 0 ? 'rotate-12' : '-rotate-12';
      case 'twist':
        return cycle === 1 ? 'rotate-45' : cycle === 3 ? '-rotate-45' : 'rotate-0';
      case 'jump':
        return cycle === 1 ? '-rotate-90' : 'rotate-0';
      case 'wave':
        if (cycle === 0) return '-rotate-90';
        if (cycle === 1) return '-rotate-45';
        if (cycle === 2) return 'rotate-0';
        return 'rotate-45';
      case 'dab':
        return cycle % 2 === 0 ? 'rotate-0' : '-rotate-90';
      case 'floss':
        return cycle % 2 === 0 ? 'rotate-45' : '-rotate-90';
      case 'spin':
        return 'rotate-45';
      case 'slide':
        return cycle % 2 === 0 ? 'rotate-12' : '-rotate-45';
      default:
        return 'rotate-0';
    }
  };

  const getRightArmRotation = () => {
    const cycle = frame % 4;

    switch (currentMove) {
      case 'bounce':
        return cycle % 2 === 0 ? '-rotate-12' : 'rotate-12';
      case 'twist':
        return cycle === 1 ? '-rotate-45' : cycle === 3 ? 'rotate-45' : 'rotate-0';
      case 'jump':
        return cycle === 1 ? 'rotate-90' : 'rotate-0';
      case 'wave':
        if (cycle === 0) return 'rotate-45';
        if (cycle === 1) return 'rotate-0';
        if (cycle === 2) return '-rotate-45';
        return '-rotate-90';
      case 'dab':
        return cycle % 2 === 0 ? 'rotate-0' : 'rotate-90';
      case 'floss':
        return cycle % 2 === 0 ? '-rotate-45' : 'rotate-90';
      case 'spin':
        return '-rotate-45';
      case 'slide':
        return cycle % 2 === 0 ? '-rotate-12' : 'rotate-45';
      default:
        return 'rotate-0';
    }
  };

  const getLeftLegRotation = () => {
    const cycle = frame % 4;

    switch (currentMove) {
      case 'bounce':
        return cycle === 1 ? '-rotate-12' : cycle === 3 ? 'rotate-6' : 'rotate-0';
      case 'jump':
        return cycle === 1 ? '-rotate-45' : 'rotate-0';
      case 'slide':
        return cycle === 1 ? '-rotate-30' : 'rotate-0';
      case 'floss':
        return cycle % 2 === 0 ? 'rotate-12' : '-rotate-12';
      case 'spin':
        return 'rotate-12';
      default:
        return 'rotate-0';
    }
  };

  const getRightLegRotation = () => {
    const cycle = frame % 4;

    switch (currentMove) {
      case 'bounce':
        return cycle === 1 ? 'rotate-6' : cycle === 3 ? '-rotate-12' : 'rotate-0';
      case 'jump':
        return cycle === 1 ? 'rotate-45' : 'rotate-0';
      case 'slide':
        return cycle === 3 ? 'rotate-30' : 'rotate-0';
      case 'floss':
        return cycle % 2 === 0 ? '-rotate-12' : 'rotate-12';
      case 'spin':
        return '-rotate-12';
      default:
        return 'rotate-0';
    }
  };

  const getHeadRotation = () => {
    const cycle = frame % 4;

    switch (currentMove) {
      case 'twist':
        return cycle === 1 ? 'rotate-12' : cycle === 3 ? '-rotate-12' : 'rotate-0';
      case 'dab':
        return cycle % 2 === 0 ? 'rotate-0' : '-rotate-12';
      case 'wave':
        return cycle === 1 ? 'rotate-6' : cycle === 3 ? '-rotate-6' : 'rotate-0';
      default:
        return 'rotate-0';
    }
  };

  return (
    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-0 opacity-40">
      <div
        className={`transition-all duration-200 ease-in-out ${getDancePosition()}`}
        style={{ transitionDuration: `${200}ms` }}
      >
        <div className="relative w-32 h-48">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl"></div>

          <div className="relative flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-yellow-300 shadow-2xl flex items-center justify-center transition-transform duration-200 ${getHeadRotation()}`}>
              <User className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>

            <div className="w-16 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl mt-2 relative border-4 border-yellow-400 shadow-xl">
              <div className={`absolute -left-6 top-2 w-12 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full origin-right transition-transform duration-200 ${getLeftArmRotation()}`}></div>

              <div className={`absolute -right-6 top-2 w-12 h-3 bg-gradient-to-l from-yellow-500 to-orange-500 rounded-full origin-left transition-transform duration-200 ${getRightArmRotation()}`}></div>
            </div>

            <div className="flex gap-3 mt-1">
              <div className={`w-3 h-16 bg-gradient-to-b from-yellow-500 to-orange-600 rounded-full transition-transform duration-200 origin-top ${getLeftLegRotation()}`}></div>
              <div className={`w-3 h-16 bg-gradient-to-b from-yellow-500 to-orange-600 rounded-full transition-transform duration-200 origin-top ${getRightLegRotation()}`}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-2 bg-black/30 rounded-full blur-md"></div>

      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-yellow-500/50">
        <div className="text-xs font-bold text-yellow-400 uppercase">{currentMove}</div>
      </div>
    </div>
  );
}
