export interface User {
  id: number;
  username: string;
}

export interface UserInfoResponse {
  message: string;
  user: User;
}

export interface Quiz {
  id: number;
  nome: string; // Quiz name from database
  data: Date; // Creation date from database
  user_id: number; // Creator ID from database
  questions?: Question[]; // Optional for quiz lists
  category?: string; // Optional category field for UI
  timeLimit?: number; // in seconds
}

export interface CreateQuizResponse {
  message: string;
  quiz_id: string;
}

export interface Question {
  id: number;
  testo: string; // Question text from database
  risposta_1: string; // First option
  risposta_2: string; // Second option
  risposta_3?: string; // Third option (optional)
  risposta_4?: string; // Fourth option (optional)
  risposta_corretta: string; // Correct answer
  quiz_id: number; // Quiz reference
  
  // Helper properties for frontend compatibility
  text?: string; // Alias for testo
  options?: string[]; // Computed from risposta fields
  correctAnswer?: number; // Index of correct option
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

// Database Risposta model interface
export interface Risposta {
  id: number;
  risposta_data: string; // User's answer
  quiz_id: number; // Quiz reference
  user_id: number; // User who answered
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
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface CreateQuizData {
  userId: number;
  title: string;
  questions: Omit<Question, "id">[];
}

export type QuizDifficulty = "easy" | "medium" | "hard";

export interface QuizFilters {
  category?: string;
  difficulty?: QuizDifficulty;
  searchTerm?: string;
}
