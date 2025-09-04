import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Quiz, Answer, QuizSession } from '../types';
import Timer from '../components/ui/Timer';
import ProgressBar from '../components/ui/ProgressBar';
import AnswerChoice from '../components/quiz/AnswerChoice';

const QuizGame: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  // Mock quiz data - based on the UI description
  const [quiz] = useState<Quiz>({
    id: quizId || '1',
    title: 'General Knowledge Quiz',
    description: 'Test your knowledge across various topics',
    category: 'General Knowledge',
    timeLimit: 600, // 10 minutes
    createdBy: 'admin',
    createdAt: new Date(),
    questions: [
      {
        id: '1',
        text: 'What is the capital of France?',
        type: 'multiple-choice',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        explanation: 'Paris is the capital and most populous city of France.'
      },
      {
        id: '2',
        text: 'Which planet is known as the Red Planet?',
        type: 'multiple-choice',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
        explanation: 'Mars is known as the Red Planet due to its reddish appearance caused by iron oxide on its surface.'
      },
      {
        id: '3',
        text: 'What is the largest ocean on Earth?',
        type: 'multiple-choice',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correctAnswer: 3,
        explanation: 'The Pacific Ocean is the largest and deepest ocean basin on Earth.'
      },
      {
        id: '4',
        text: 'Who painted the Mona Lisa?',
        type: 'multiple-choice',
        options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
        correctAnswer: 2,
        explanation: 'Leonardo da Vinci painted the Mona Lisa between 1503 and 1519.'
      },
      {
        id: '5',
        text: 'What is the chemical symbol for gold?',
        type: 'multiple-choice',
        options: ['Go', 'Gd', 'Au', 'Ag'],
        correctAnswer: 2,
        explanation: 'Au is the chemical symbol for gold, derived from the Latin word "aurum".'
      },
      {
        id: '6',
        text: 'Which continent is the largest by land area?',
        type: 'multiple-choice',
        options: ['Africa', 'Asia', 'North America', 'Europe'],
        correctAnswer: 1,
        explanation: 'Asia is the largest continent by both land area and population.'
      },
      {
        id: '7',
        text: 'What year did World War II end?',
        type: 'multiple-choice',
        options: ['1944', '1945', '1946', '1947'],
        correctAnswer: 1,
        explanation: 'World War II ended in 1945 with the surrender of Japan in September.'
      },
      {
        id: '8',
        text: 'Which element has the atomic number 1?',
        type: 'multiple-choice',
        options: ['Helium', 'Hydrogen', 'Lithium', 'Carbon'],
        correctAnswer: 1,
        explanation: 'Hydrogen has the atomic number 1, making it the simplest and most abundant element in the universe.'
      },
      {
        id: '9',
        text: 'What is the tallest mountain in the world?',
        type: 'multiple-choice',
        options: ['K2', 'Kangchenjunga', 'Lhotse', 'Mount Everest'],
        correctAnswer: 3,
        explanation: 'Mount Everest is the tallest mountain in the world at 8,848.86 meters above sea level.'
      },
      {
        id: '10',
        text: 'Which programming language was created by James Gosling?',
        type: 'multiple-choice',
        options: ['Python', 'JavaScript', 'Java', 'C++'],
        correctAnswer: 2,
        explanation: 'Java was created by James Gosling at Sun Microsystems in the mid-1990s.'
      }
    ]
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining] = useState(quiz.timeLimit || 600);
  const [, setQuizSession] = useState<QuizSession>({
    id: 'session-1',
    quizId: quiz.id,
    userId: 'user-1',
    startTime: new Date(),
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    timeRemaining: quiz.timeLimit || 600
  });

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  useEffect(() => {
    if (!currentQuestion) {
      navigate('/');
    }
  }, [currentQuestion, navigate]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedOption: selectedAnswer,
      isCorrect,
      timeSpent: 30 // TODO: Calculate actual time spent
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    // Update quiz session
    setQuizSession(prev => ({
      ...prev,
      answers: updatedAnswers,
      score: updatedAnswers.filter(a => a.isCorrect).length,
      currentQuestionIndex: currentQuestionIndex + 1
    }));

    if (isLastQuestion) {
      // Quiz completed
      navigate('/quiz-results', { 
        state: { 
          quiz, 
          answers: updatedAnswers,
          timeSpent: (quiz.timeLimit || 600) - timeRemaining
        } 
      });
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Restore previous answer if exists
      const prevAnswer = answers[currentQuestionIndex - 1];
      if (prevAnswer) {
        setSelectedAnswer(prevAnswer.selectedOption);
      } else {
        setSelectedAnswer(null);
      }
      setShowResult(false);
    }
  };

  const handleTimeUp = () => {
    // Auto-submit current quiz
    navigate('/quiz-results', { 
      state: { 
        quiz, 
        answers,
        timeSpent: quiz.timeLimit || 600,
        timeUp: true
      } 
    });
  };

  const handleShowResult = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Quiz not found</h2>
          <button onClick={goHome} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={goHome}
              className="flex items-center text-white hover:text-purple-200 transition-colors"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            
            <div className="text-center">
              <h1 className="text-lg font-semibold text-white">{quiz.title}</h1>
              <p className="text-sm text-white/70">{quiz.category}</p>
            </div>
            
            <Timer 
              initialTime={timeRemaining} 
              onTimeUp={handleTimeUp}
              isActive={!showResult}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">
              {String(currentQuestionIndex + 1).padStart(2, '0')} of {quiz.questions.length}
            </h2>
            <div className="text-white/70">
              Question {currentQuestionIndex + 1}
            </div>
          </div>
          <ProgressBar 
            current={currentQuestionIndex + 1} 
            total={quiz.questions.length}
            showNumbers={false}
          />
        </div>

        {/* Question Section */}
        <div className="card mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 leading-relaxed">
            {currentQuestion.text}
          </h3>
          
          <div className="space-y-4 mb-6">
            {currentQuestion.options.map((option, index) => (
              <AnswerChoice
                key={index}
                option={option}
                index={index}
                isSelected={selectedAnswer === index}
                isCorrect={showResult && index === currentQuestion.correctAnswer}
                isIncorrect={showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer}
                showResult={showResult}
                onClick={handleAnswerSelect}
                disabled={showResult}
              />
            ))}
          </div>

          {/* Explanation */}
          {showResult && currentQuestion.explanation && (
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 mb-6">
              <h4 className="text-blue-200 font-semibold mb-2">Explanation:</h4>
              <p className="text-blue-100">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Previous
          </button>

          <div className="flex space-x-4">
            {!showResult && selectedAnswer !== null && (
              <button
                onClick={handleShowResult}
                className="btn-secondary"
              >
                Show Answer
              </button>
            )}
            
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLastQuestion ? 'Finish Quiz' : 'Next'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Question Navigation Dots */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setSelectedAnswer(answers[index]?.selectedOption ?? null);
                  setShowResult(false);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-purple-400 scale-125'
                    : index < answers.length
                    ? answers[index].isCorrect
                      ? 'bg-green-400'
                      : 'bg-red-400'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizGame;