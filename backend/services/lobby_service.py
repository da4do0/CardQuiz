from flask import Flask, request, jsonify
from database import app, db
from models import Quiz, User
from datetime import datetime

# In-memory storage for lobbies (in production, use Redis or database)
active_lobbies = {}

def get_lobby_by_quiz_id(quiz_id):
    try:
        # Get quiz info first
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return None, "Quiz not found"
        
        # Initialize lobby if it doesn't exist
        if quiz_id not in active_lobbies:
            active_lobbies[quiz_id] = {
                "quiz_id": quiz_id,
                "quiz_title": quiz.nome,
                "admin_id": quiz.user_id,
                "participants": [],
                "status": "waiting",
                "created_at": datetime.utcnow().isoformat()
            }
        
        lobby_info = active_lobbies[quiz_id]
        
        # Get participant details
        participants_with_details = []
        for user_id in lobby_info["participants"]:
            user = User.query.get(user_id)
            if user:
                participants_with_details.append({
                    "id": user.id,
                    "username": user.username
                })
        
        lobby_response = {
            **lobby_info,
            "participants": participants_with_details
        }
        
        return lobby_response, "Lobby found"
        
    except Exception as e:
        return None, f"Error getting lobby: {str(e)}"

def add_user_to_lobby(quiz_id, user_id):
    try:
        # Check if quiz exists
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return None, "Quiz not found"
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return None, "User not found"
        
        # Initialize lobby if it doesn't exist
        if quiz_id not in active_lobbies:
            active_lobbies[quiz_id] = {
                "quiz_id": quiz_id,
                "quiz_title": quiz.nome,
                "admin_id": quiz.user_id,
                "participants": [],
                "status": "waiting",
                "created_at": datetime.utcnow().isoformat()
            }
        
        lobby = active_lobbies[quiz_id]
        
        # Check if lobby is still accepting participants
        if lobby["status"] != "waiting":
            return None, "Quiz has already started"
        
        # Add user to lobby if not already present
        if user_id not in lobby["participants"]:
            lobby["participants"].append(user_id)
        
        # Return updated lobby info
        return get_lobby_by_quiz_id(quiz_id)[0], "Successfully joined lobby"
        
    except Exception as e:
        return None, f"Error joining lobby: {str(e)}"

def remove_user_from_lobby(quiz_id, user_id):
    try:
        if quiz_id not in active_lobbies:
            return None, "Lobby not found"
        
        lobby = active_lobbies[quiz_id]
        
        # Remove user from participants
        if user_id in lobby["participants"]:
            lobby["participants"].remove(user_id)
            return True, "Successfully left lobby"
        else:
            return None, "User not in lobby"
            
    except Exception as e:
        return None, f"Error leaving lobby: {str(e)}"

def start_quiz_session(quiz_id, admin_user_id):
    try:
        if quiz_id not in active_lobbies:
            return None, "Lobby not found"
        
        lobby = active_lobbies[quiz_id]
        
        # Check if user is admin
        if lobby["admin_id"] != admin_user_id:
            return None, "Only the quiz creator can start the quiz"
        
        # Check if there are participants
        if len(lobby["participants"]) == 0:
            return None, "Cannot start quiz with no participants"
        
        # Update lobby status
        lobby["status"] = "started"
        lobby["started_at"] = datetime.utcnow().isoformat()
        
        session_info = {
            "quiz_id": quiz_id,
            "participants": lobby["participants"],
            "started_at": lobby["started_at"],
            "status": "active"
        }
        
        return session_info, "Quiz started successfully"
        
    except Exception as e:
        return None, f"Error starting quiz: {str(e)}"

def cleanup_lobby(quiz_id):
    """Clean up lobby after quiz completion"""
    try:
        if quiz_id in active_lobbies:
            del active_lobbies[quiz_id]
        return True
    except Exception as e:
        return False