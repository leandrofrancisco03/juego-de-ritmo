interface TimelineBarProps {
  progress: number;
}

export default function TimelineBar({ progress }: TimelineBarProps) {
  return (
    <div className="relative w-full h-4 bg-gray-800/80 backdrop-blur-sm rounded-full overflow-hidden border-2 border-gray-700 shadow-inner">
      <div
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 transition-all duration-100 rounded-full"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.9), 0 0 40px rgba(34, 211, 238, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.5)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>

        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-lg shadow-cyan-400/80 border-2 border-cyan-200"
          style={{
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.9), 0 0 30px rgba(34, 211, 238, 0.8)',
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-cyan-200 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
