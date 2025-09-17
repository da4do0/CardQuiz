import React, { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Quiz } from "../types";
import { useAuth } from "../hooks/useAuth";
import { userApi } from "../services/api";
import Header from "../components/Header"

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { userId, setUserId } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [room, setRoom] = useState<string>("");

  const startQuiz = () => {
    console.log(room)
    navigate(`/quiz/${room.toUpperCase()}`);
  };

  const getUserInfo = async (userId: number) => {
    console.log("User ID:", userId);
    const response = await userApi.getUserById(userId.toString());
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
      <Header/>
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
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch max-w-4xl mx-auto">
            <div className="flex-1">
              <div className="card p-8 text-center group hover:scale-105 transition-all duration-300">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  🚀
                </div>
                <div
                  className="text-2xl font-bold text-white mb-4"
                >
                  Join Quiz Room
                </div>
                <p className="text-white/70 mb-6 text-sm">
                  Have a room code? Join an existing quiz and compete with
                  others!
                </p>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter room code..."
                    onChange={(e) => setRoom(e.target.value)}
                    value={room}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-center font-mono text-lg tracking-widest uppercase"
                  />
                  <button
                    className="btn-secondary w-full py-4 text-lg font-semibold"
                    disabled={!room.trim()}
                    onClick={()=>startQuiz()}
                  >
                    🎯 Join Quiz
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center lg:py-8">
              <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/30 to-transparent hidden lg:block"></div>
              <div className="flex items-center justify-center lg:hidden">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <div className="text-white/60 font-bold px-6 text-lg">OR</div>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>
            </div>

            <div className="flex-1">
              <div className="card p-8 text-center group hover:scale-105 transition-all duration-300">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  ✨
                </div>
                <div className="text-2xl font-bold text-white mb-4">
                  Create Your Quiz
                </div>
                <p className="text-white/70 mb-6 text-sm">
                  Design custom quizzes with your own questions and share them
                  with friends!
                </p>
                <Link
                  to="/create-quiz"
                  className="btn-primary text-lg px-8 py-4 w-full inline-block font-semibold"
                >
                  🎨 Start Creating
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
