import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { QuizLobby} from '../types';
import { useSocket } from '../hooks/useSocket';
import  CardInformation from '../components/CardInformation';
import {useQuiz} from '../hooks/Quiz.hook';

const QuizLobbyPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { userId, username} = useAuth();
  const { socket, isConnected } = useSocket();
  const {isAdmin} = useQuiz();

  // State
  const [lobby, setLobby] = useState<QuizLobby | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);

  // Check if user has already joined the lobby
  const isParticipant = lobby && userId && 
    lobby.participants.some(p => p.id === userId);

  // Socket handlers
  useEffect(() => {
    if (socket && isConnected && quizId) {
      socket.emit('join_room', {
        room_id: `quiz_${quizId}`,
        username: username
      });

      socket.on('user_joined', (data: any) => {
        console.log("User joined room:", data);
        // Check if this is our own join confirmation
        if (data.username === 'User_' + userId) {
          setIsInRoom(true);
          console.log("Successfully joined room!");
        }
      });

      socket.on('user_left', (data: any) => {
        console.log("User left room:", data);
      });

      socket.on('room_message', (data: any) => {
        console.log("Room message received:", data);
        alert(`Message from ${data.username}: ${data.message}`);
      });

      socket.on('test_event', (data: any) => {
        console.log("test web socket ricevuto dal server:", data);
      });

      return () => {
        socket.emit('leave_room', {
          room_id: `quiz_${quizId}`,
          username: 'User_' + userId
        });
        setIsInRoom(false);

        socket.off('user_joined');
        socket.off('user_left');
        socket.off('room_message');
        socket.off('test_event');
        socket.off('test_response');
      };
    }
  }, [socket, isConnected, quizId, userId]);

  // Function to send test message to room
  const sendTestMessage = () => {
    if (socket && testMessage.trim() && isInRoom) {
      socket.emit('room_message', {
        room_id: `quiz_${quizId}`,
        message: testMessage,
        username: 'User_' + userId
      });
      setTestMessage('');
    } else if (!isInRoom) {
      alert('Not connected to room yet!');
    }
  };


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
              <CardInformation>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-bold text-white mb-4">Join the Quiz</h3>
                <p className="text-white/70 mb-6 text-sm">
                  Click below to join this quiz lobby and wait for the admin to start.
                </p>
                <button
                  onClick={()=> {}}
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
              </CardInformation>
            )}

              <CardInformation>
                <div className="text-4xl mb-4">👑</div>
                <h3 className="text-lg font-bold text-white mb-4">Admin Controls</h3>
                <p className="text-white/70 mb-6 text-sm">
                  You can start the quiz when you're ready. All participants will be notified.
                </p>
                <button
                  onClick={()=> {}}
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
              </CardInformation>

            {/* Waiting for Admin */}
            {hasJoined && !isAdmin && (
              <CardInformation>
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
              </CardInformation>
            )}

            {/* Test Room Messages */}
            <CardInformation>
              <h3 className="text-lg font-bold text-white mb-4">🧪 Test Room Messages</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Enter test message..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
                />
                <button
                  onClick={sendTestMessage}
                  disabled={!testMessage.trim() || !isConnected || !isInRoom}
                  className="btn-secondary w-full text-sm"
                >
                  Send to Room
                </button>
                <div className="flex items-center justify-center text-xs">
                  <div className={`w-2 h-2 rounded-full mr-2 ${isInRoom ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-white/60">
                    {isInRoom ? 'Connected to room' : 'Connecting to room...'}
                  </span>
                </div>
                <p className="text-white/60 text-xs text-center">
                  Messages will only be sent to users in this quiz room
                </p>
              </div>
            </CardInformation>

            {/* Quiz Info */}
            <CardInformation>
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
            </CardInformation>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizLobbyPage;