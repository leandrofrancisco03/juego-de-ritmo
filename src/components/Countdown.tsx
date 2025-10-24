import { useEffect, useState } from 'react';

interface CountdownProps {
  onComplete: () => void;
}

export default function Countdown({ onComplete }: CountdownProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <div className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none">
      <div className="text-9xl font-bold text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.9)] animate-pulse">
        {count > 0 ? count : 'GO!'}
      </div>
    </div>
  );
}
