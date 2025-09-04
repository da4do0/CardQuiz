import React, { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Quiz } from "../types";
import { useAuth } from "../hooks/useAuth";
import { userApi } from "../services/api";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [username, setUsername] = useState<string>("");

  // Mock data for featured quizzes
  const [featuredQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "General Knowledge Challenge",
      description:
        "Test your knowledge across various topics including history, science, and culture.",
      category: "General Knowledge",
      questions: [],
      createdBy: "admin",
      createdAt: new Date(),
      timeLimit: 300,
    },
    {
      id: "2",
      title: "Science Fundamentals",
      description: "Explore the basics of physics, chemistry, and biology.",
      category: "Science",
      questions: [],
      createdBy: "admin",
      createdAt: new Date(),
      timeLimit: 600,
    },
    {
      id: "3",
      title: "World History Quiz",
      description: "Journey through important historical events and figures.",
      category: "History",
      questions: [],
      createdBy: "admin",
      createdAt: new Date(),
      timeLimit: 450,
    },
  ]);

  const startQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min${mins !== 1 ? "s" : ""}`;
  };

  const getUserInfo = async (userId: string) => {
    console.log("User ID:", userId);
    const response = await userApi.getUserById(userId);
    console.log("User Info:", response);
    if (response?.user?.username) {
      setUsername(response?.user?.username);
    }
  };

  useEffect(() => {
    console.log("Current User ID:", userId);
    if (userId) {
      getUserInfo(userId);
    }
  }, [userId]);

  useEffect(() => {
    console.log("Username updated:", username);
  }, [username]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">CardQuiz</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="text-white hover:text-purple-200 transition-colors"
              >
                Home
              </Link>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Challenge Your Mind
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Discover amazing quizzes, test your knowledge, and compete with
            friends. Create custom quizzes or choose from our extensive library.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-quiz" className="btn-primary text-lg px-8 py-4">
              Create Your Quiz
            </Link>
            <button
              onClick={() => startQuiz(featuredQuizzes[0]?.id)}
              className="btn-secondary text-lg px-8 py-4"
            >
              Take a Quick Quiz
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card text-center">
            <div className="text-3xl font-bold text-white mb-2">1,000+</div>
            <div className="text-white/80">Quizzes Available</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-white mb-2">50,000+</div>
            <div className="text-white/80">Questions Answered</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-white mb-2">5,000+</div>
            <div className="text-white/80">Active Users</div>
          </div>
        </div>

        {/* Featured Quizzes */}
        <section>
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Featured Quizzes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="card hover:scale-105 transition-transform duration-200"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-purple-500/30 text-purple-200 text-sm rounded-full mb-2">
                    {quiz.category}
                  </span>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {quiz.title}
                  </h4>
                  <p className="text-white/80 text-sm mb-4 line-clamp-3">
                    {quiz.description}
                  </p>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4 text-sm text-white/70">
                    <span>
                      ⏱️{" "}
                      {quiz.timeLimit ? formatTime(quiz.timeLimit) : "No limit"}
                    </span>
                    <span>
                      📊 {Math.floor(Math.random() * 1000) + 100} plays
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => startQuiz(quiz.id)}
                  className="btn-primary w-full"
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mt-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Browse by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Science", icon: "🔬", count: 120 },
              { name: "History", icon: "📚", count: 95 },
              { name: "Sports", icon: "⚽", count: 80 },
              { name: "Movies", icon: "🎬", count: 150 },
              { name: "Music", icon: "🎵", count: 70 },
              { name: "Technology", icon: "💻", count: 110 },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase()}`}
                className="card text-center hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-white font-semibold">{category.name}</div>
                <div className="text-white/60 text-sm">
                  {category.count} quizzes
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-white/60">
            <p>&copy; 2025 CardQuiz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
