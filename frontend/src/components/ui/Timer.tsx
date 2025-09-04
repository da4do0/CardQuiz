import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp?: () => void;
  isActive?: boolean;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, isActive = true }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (): string => {
    if (timeLeft <= 30) return 'text-red-300';
    if (timeLeft <= 60) return 'text-yellow-300';
    return 'text-white';
  };

  const getProgressPercentage = (): number => {
    return (timeLeft / initialTime) * 100;
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="relative w-12 h-12">
        <svg className="transform -rotate-90 w-12 h-12" viewBox="0 0 48 48">
          {/* Background circle */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke={timeLeft <= 30 ? '#f87171' : timeLeft <= 60 ? '#fde047' : '#ffffff'}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - getProgressPercentage() / 100)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={getTimeColor()}>
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              fill="currentColor"
            />
            <path
              d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      <div className={`text-xl font-mono font-bold ${getTimeColor()}`}>
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default Timer;