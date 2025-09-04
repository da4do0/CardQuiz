import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  showNumbers?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  showNumbers = true, 
  className = '' 
}) => {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      {showNumbers && (
        <div className="flex justify-between text-sm text-white/80 mb-2">
          <span>Progress</span>
          <span>{current} of {total}</span>
        </div>
      )}
      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
        </div>
      </div>
      {showNumbers && (
        <div className="text-center text-xs text-white/60 mt-1">
          {Math.round(percentage)}% Complete
        </div>
      )}
    </div>
  );
};

export default ProgressBar;