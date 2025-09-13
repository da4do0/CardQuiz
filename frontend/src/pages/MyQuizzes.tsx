import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Quiz } from "../types";
import { useAuth } from "../hooks/useAuth";
import { quizApi, handleApiError } from "../services/api";

const MyQuizzes: React.FC = () => {
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchMyQuizzes();
  }, [userId, isAuthenticated, navigate]);

  const fetchMyQuizzes = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError("");

      const response = await quizApi.getQuizzesByUser(userId);
      console.log("Fetched quizzes:", response);
      const userQuizzes = response.quizzes.map((quiz: any) => ({
        ...quiz,
        data: new Date(quiz.data),
        category: "General",
      }));

      setQuizzes(userQuizzes);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Error fetching quizzes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      // TODO: Implement delete API call
      // await quizApi.deleteQuiz(quizId.toString());

      // Remove from local state for now
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Error deleting quiz:", err);
    }
  };

  const handleEditQuiz = (quizId: number) => {
    navigate(`/edit-quiz/${quizId}`);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const createQuizLobby = async ()=>{
    
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white/80">Loading your quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <span className="mr-4">📚</span>
            My Quizzes
          </h1>
          <p className="text-white/80 text-lg">
            Manage and track your created quizzes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex md:grid-cols-3 justify-center gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-white mb-1">
              {quizzes.length}
            </div>
            <div className="text-white/70">Total Quizzes</div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/create-quiz" className="btn-primary flex items-center">
              <span className="mr-2">➕</span>
              Create New Quiz
            </Link>
            <button
              onClick={fetchMyQuizzes}
              className="btn-secondary flex items-center"
            >
              <span className="mr-2">🔄</span>
              Refresh
            </button>
          </div>

          {error && (
            <div className="text-red-300 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}
        </div>

        {/* Quizzes Grid */}
        {quizzes.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-6xl mb-6">📝</div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              No Quizzes Yet
            </h3>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              You haven't created any quizzes yet. Start by creating your first
              quiz to engage your audience!
            </p>
            <Link to="/create-quiz" className="btn-primary text-lg px-8 py-4">
              Create Your First Quiz
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz) => {
              console.log("Rendering quiz:", quiz);
              return (
                <div
                  key={quiz.id}
                  className="card hover:scale-105 transition-all duration-300 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10">
                    {/* Quiz Header */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 text-sm rounded-full backdrop-blur-sm">
                        <span className="mr-2">🏷️</span>
                        {quiz.category || "General"}
                      </span>

                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleEditQuiz(quiz.id)}
                          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Edit quiz"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="p-2 text-white/60 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete quiz"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Quiz Content */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                        {quiz.nome}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
                        A quiz with {quiz?.question_count || 0} questions
                      </p>
                    </div>

                    {/* Quiz Meta */}
                    <div className="flex justify-between items-center mb-6 text-sm text-white/70">
                      <div className="flex items-center">
                        <span className="mr-1">📅</span>
                        <span>{formatDate(quiz.data)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/quiz/${quiz.id}`}
                        className="btn-secondary flex-1 text-center text-xs"
                      >
                        🎮 Solo
                      </Link>

                      {/* todo: crea robe */}
                      <Link
                        to={`/quiz/${quiz.id}`}
                        className="btn-primary flex-1 text-center text-xs"
                      >
                        👥 Lobby
                      </Link>
                      <Link
                        to={`/quiz/${quiz.id}/results`}
                        className="btn-secondary flex-1 text-center text-xs"
                      >
                        📊 Results
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuizzes;
