import React from 'react';

interface AnswerChoiceProps {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  showResult?: boolean;
  onClick: (index: number) => void;
  disabled?: boolean;
}

const AnswerChoice: React.FC<AnswerChoiceProps> = ({
  option,
  index,
  isSelected,
  isCorrect,
  isIncorrect,
  showResult = false,
  onClick,
  disabled = false
}) => {
  const getOptionLetter = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const getClassName = (): string => {
    let className = 'quiz-option ';
    
    if (showResult) {
      if (isCorrect) {
        className += 'quiz-option-correct ';
      } else if (isIncorrect) {
        className += 'quiz-option-incorrect ';
      } else {
        className += 'quiz-option-default ';
      }
    } else {
      if (isSelected) {
        className += 'quiz-option-selected ';
      } else {
        className += 'quiz-option-default ';
      }
    }
    
    if (disabled) {
      className += 'cursor-not-allowed opacity-50 ';
    } else if (!showResult) {
      className += 'hover:bg-white/20 hover:scale-105 active:scale-100 ';
    }
    
    return className;
  };

  const getIcon = () => {
    if (showResult) {
      if (isCorrect) {
        return (
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      } else if (isIncorrect) {
        return (
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      }
    }
    
    if (isSelected) {
      return (
        <div className="w-5 h-5 rounded-full bg-purple-400 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white"></div>
        </div>
      );
    }
    
    return (
      <div className="w-5 h-5 rounded-full border-2 border-white/50"></div>
    );
  };

  return (
    <button
      onClick={() => !disabled && onClick(index)}
      disabled={disabled}
      className={getClassName()}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-semibold text-sm">
            {getOptionLetter(index)}
          </div>
          {getIcon()}
        </div>
        <div className="flex-1 text-left">
          {option}
        </div>
      </div>
    </button>
  );
};

export default AnswerChoice;