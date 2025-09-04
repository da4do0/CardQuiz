import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Quiz, Answer } from '../types';

interface LocationState {
  quiz: Quiz;
  answers: Answer[];
  timeSpent: number;
  timeUp?: boolean;
}

const QuizResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state || !state.quiz || !state.answers) {
    navigate('/');
    return null;
  }

  const { quiz, answers, timeSpent, timeUp = false } = state;
  const totalQuestions = quiz.questions.length;
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (): string => {
    if (scorePercentage >= 80) return 'text-green-300';
    if (scorePercentage >= 60) return 'text-yellow-300';
    return 'text-red-300';
  };

  const getScoreMessage = (): string => {
    if (scorePercentage >= 90) return 'Excellent! Outstanding performance!';
    if (scorePercentage >= 80) return 'Great job! You did very well!';
    if (scorePercentage >= 70) return 'Good work! Nice performance!';
    if (scorePercentage >= 60) return 'Not bad! Keep practicing!';
    return 'Keep learning and try again!';
  };

  const playAgain = () => {
    navigate(`/quiz/${quiz.id}`);
  };

  const goHome = () => {
    navigate('/');
  };

  const shareResults = () => {
    // TODO: Implement sharing functionality
    if (navigator.share) {
      navigator.share({
        title: 'Quiz Results',
        text: `I scored ${scorePercentage}% on the ${quiz.title} quiz!`,
        url: window.location.origin
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `I scored ${scorePercentage}% on the ${quiz.title} quiz! ${window.location.origin}`
      );
      alert('Results copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Main Results Card */}
        <div className="card text-center mb-6">
          {timeUp && (
            <div className="bg-orange-500/20 border border-orange-400 text-orange-200 px-4 py-3 rounded-lg mb-6">
              <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Time's up! Quiz auto-submitted.
            </div>
          )}

          <div className="mb-8">
            <div className={`text-6xl font-bold ${getScoreColor()} mb-4`}>
              {scorePercentage}%
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h1>
            <p className="text-lg text-white/80">{getScoreMessage()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{correctAnswers}</div>
              <div className="text-white/70">Correct Answers</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{totalQuestions - correctAnswers}</div>
              <div className="text-white/70">Incorrect Answers</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{formatTime(timeSpent)}</div>
              <div className="text-white/70">Time Spent</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={playAgain} className="btn-primary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Play Again
            </button>
            <button onClick={shareResults} className="btn-secondary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share Results
            </button>
            <button onClick={goHome} className="btn-secondary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10M9 21h6" />
              </svg>
              Home
            </button>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Question Review</h2>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer?.isCorrect ?? false;
              
              return (
                <div key={question.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isCorrect 
                        ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-400/30'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-2">{question.text}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`px-3 py-2 rounded ${
                              optIndex === question.correctAnswer
                                ? 'bg-green-500/20 text-green-200 border border-green-400/30'
                                : userAnswer && optIndex === userAnswer.selectedOption && !isCorrect
                                ? 'bg-red-500/20 text-red-200 border border-red-400/30'
                                : 'bg-white/5 text-white/70'
                            }`}
                          >
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            {option}
                            {optIndex === question.correctAnswer && (
                              <svg className="w-4 h-4 inline ml-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            {userAnswer && optIndex === userAnswer.selectedOption && !isCorrect && (
                              <svg className="w-4 h-4 inline ml-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;