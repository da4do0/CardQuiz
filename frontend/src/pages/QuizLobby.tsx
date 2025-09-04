import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { lobbyApi, handleApiError } from '../services/api';
import type { QuizLobby, LobbyParticipant } from '../types';

const QuizLobbyPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useAuth();

  // State
  const [lobby, setLobby] = useState<QuizLobby | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasJoined, setHasJoined] = useState(false);

  // Check if current user is the quiz admin
  const isAdmin = lobby && userId && lobby.adminId === userId;

  // Check if user has already joined the lobby
  const isParticipant = lobby && userId && 
    lobby.participants.some(p => p.id === userId);

  // Fetch lobby information
  const fetchLobby = async () => {
    if (!quizId) return;

    try {
      setIsLoading(true);
      setError(null);
      const lobbyData = await lobbyApi.getLobby(quizId);
      setLobby(lobbyData);
      
      // Check if current user is already in the lobby
      if (userId && lobbyData.participants.some(p => p.id === userId)) {
        setHasJoined(true);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Failed to fetch lobby:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Join lobby
  const handleJoinLobby = async () => {
    if (!quizId || !userId || isJoining || hasJoined) return;

    try {
      setIsJoining(true);
      setError(null);
      
      const response = await lobbyApi.joinLobby(quizId, userId);
      
      if (response.success && response.lobby) {
        setLobby(response.lobby);
        setHasJoined(true);
      } else {
        setError(response.message || 'Failed to join lobby');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Failed to join lobby:', err);
    } finally {
      setIsJoining(false);
    }
  };

  // Start quiz (admin only)
  const handleStartQuiz = async () => {
    if (!quizId || !userId || !isAdmin || isStarting) return;

    try {
      setIsStarting(true);
      setError(null);
      
      const response = await lobbyApi.startQuiz(quizId, userId);
      
      if (response.success) {
        // Navigate to quiz game
        if (response.gameSessionId) {
          navigate(`/quiz/${quizId}/game/${response.gameSessionId}`);
        } else {
          navigate(`/quiz/${quizId}/game`);
        }
      } else {
        setError(response.message || 'Failed to start quiz');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Failed to start quiz:', err);
    } finally {
      setIsStarting(false);
    }
  };

  // Poll for lobby updates
  useEffect(() => {
    if (!quizId || !hasJoined) return;

    const pollInterval = setInterval(fetchLobby, 3000);
    return () => clearInterval(pollInterval);
  }, [quizId, hasJoined]);

  // Initial fetch
  useEffect(() => {
    if (quizId) {
      fetchLobby();
    }
  }, [quizId]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Auto-redirect when quiz starts (for participants)
  useEffect(() => {
    if (lobby?.startedAt && hasJoined && !isAdmin) {
      navigate(`/quiz/${quizId}/game`);
    }
  }, [lobby?.startedAt, hasJoined, isAdmin, navigate, quizId]);

  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading Lobby...</h2>
            <p className="text-white/70">Please wait while we prepare your quiz lobby.</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-white hover:text-purple-200 transition-colors mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          
          <div className="card text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Quiz name</h1>
            <p className="text-white/80 text-lg mb-4">Quiz Lobby</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Participants List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  Participants 0/10
                </h2>
                <div className="flex items-center text-white/70">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  Live
                </div>
              </div>

                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Waiting for participants...</h3>
                  <p className="text-white/70">Share the quiz link with others to get started!</p>
                </div>
            </div>
          </div>

          {/* Actions Panel */}
          <div className="space-y-6">
            {/* Join Lobby Card */}
            {!hasJoined && !isParticipant && (
              <div className="card text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-bold text-white mb-4">Join the Quiz</h3>
                <p className="text-white/70 mb-6 text-sm">
                  Click below to join this quiz lobby and wait for the admin to start.
                </p>
                <button
                  onClick={handleJoinLobby}
                  disabled={isJoining}
                  className="btn-primary w-full"
                >
                  {isJoining ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Joining...
                    </span>
                  ) : (
                    'Join Lobby'
                  )}
                </button>
              </div>
            )}

              <div className="card text-center">
                <div className="text-4xl mb-4">👑</div>
                <h3 className="text-lg font-bold text-white mb-4">Admin Controls</h3>
                <p className="text-white/70 mb-6 text-sm">
                  You can start the quiz when you're ready. All participants will be notified.
                </p>
                <button
                  onClick={handleStartQuiz}
                  className="btn-primary w-full mb-3"
                >
                  {isStarting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Starting...
                    </span>
                  ) : (
                    '🚀 Start Quiz'
                  )}
                </button>
                  <p className="text-white/60 text-xs">
                    Waiting for participants to join...
                  </p>
              </div>

            {/* Waiting for Admin */}
            {hasJoined && !isAdmin && (
              <div className="card text-center">
                <div className="text-4xl mb-4">⏳</div>
                <h3 className="text-lg font-bold text-white mb-4">Ready to Play!</h3>
                <p className="text-white/70 mb-6 text-sm">
                  You've successfully joined the lobby. Waiting for the quiz admin to start the game.
                </p>
                <div className="flex items-center justify-center text-white/60">
                  <div className="animate-pulse flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animation-delay-200"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animation-delay-400"></div>
                  </div>
                  <span className="ml-2">Waiting...</span>
                </div>
              </div>
            )}

            {/* Quiz Info */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">Quiz Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Created by:</span>
                  <span className="text-white">Quiz Admin
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Lobby created:</span>
                  <span className="text-white">05 September at 22:30</span>
                </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Max participants:</span>
                    <span className="text-white">10</span>
                  </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Status:</span>
                  <span className='text-green-400'>
                    🟢 Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizLobbyPage;