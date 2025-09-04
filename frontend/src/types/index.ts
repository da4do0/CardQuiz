export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: Question[];
  createdBy: string;
  createdAt: Date;
  timeLimit?: number; // in seconds
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false';
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export interface QuizSession {
  id: string;
  quizId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  answers: Answer[];
  score: number;
  timeRemaining: number; // in seconds
}

export interface Answer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

export interface QuizResult {
  sessionId: string;
  quiz: Quiz;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  answers: Answer[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateQuizData {
  title: string;
  description: string;
  category: string;
  timeLimit?: number;
  questions: Omit<Question, 'id'>[];
}

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizFilters {
  category?: string;
  difficulty?: QuizDifficulty;
  searchTerm?: string;
}