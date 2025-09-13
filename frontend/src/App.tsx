import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateQuiz from './pages/CreateQuiz';
import QuizGame from './pages/QuizGame';
import QuizResults from './pages/QuizResults';
import MyQuizzes from './pages/MyQuizzes';
import QuizLobby from './pages/QuizLobby';
import Logout from './pages/Logout';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-gradient min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/my-quizzes" element={<MyQuizzes />} />
            <Route path="/quiz/:quizId" element={<QuizLobby />} />
            <Route path="/quiz/:quizId" element={<QuizGame />} />
            <Route path="/quiz-results" element={<QuizResults />} />
            <Route path="/logout" element={<Logout />} />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
