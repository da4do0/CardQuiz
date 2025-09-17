import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { username } = useAuth();
  return (
    <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">CardQuiz</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/create-quiz"
              className="text-white hover:text-purple-200 transition-colors"
            >
              Create Quiz
            </Link>
            <Link
              to="/my-quizzes"
              className="text-white hover:text-purple-200 transition-colors"
            >
              My Quizzes
            </Link>
          </nav>
          {username ? (
            <div className="flex items-center space-x-4">
              <div className="text-white">
                Welcome, <span className="font-semibold">{username}</span>
              </div>
              <Link to="/logout" className="btn-secondary">
                Logout
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn-secondary">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
