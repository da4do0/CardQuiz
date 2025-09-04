from flask import Blueprint, request, jsonify
from services.lobby_service import *

lobby_bp = Blueprint('lobby', __name__)

@lobby_bp.route("/api/quiz/<int:quiz_id>/lobby", methods=["GET"])
def get_lobby_info(quiz_id):
    try:
        lobby_info, message = get_lobby_by_quiz_id(quiz_id)
        if lobby_info:
            return jsonify({"message": message, "lobby": lobby_info}), 200
        else:
            return jsonify({"error": message}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@lobby_bp.route("/api/quiz/<int:quiz_id>/lobby/join", methods=["POST"])
def join_lobby(quiz_id):
    try:
        data = request.get_json()
        user_id = data.get("userId")
        
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
            
        result, message = add_user_to_lobby(quiz_id, user_id)
        if result:
            return jsonify({"message": message, "lobby": result}), 200
        else:
            return jsonify({"error": message}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@lobby_bp.route("/api/quiz/<int:quiz_id>/lobby/start", methods=["POST"])
def start_quiz_from_lobby(quiz_id):
    try:
        data = request.get_json()
        admin_user_id = data.get("userId")
        
        if not admin_user_id:
            return jsonify({"error": "Admin User ID is required"}), 400
            
        result, message = start_quiz_session(quiz_id, admin_user_id)
        if result:
            return jsonify({"message": message, "session": result}), 200
        else:
            return jsonify({"error": message}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@lobby_bp.route("/api/quiz/<int:quiz_id>/lobby/leave", methods=["POST"])
def leave_lobby(quiz_id):
    try:
        data = request.get_json()
        user_id = data.get("userId")
        
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
            
        result, message = remove_user_from_lobby(quiz_id, user_id)
        if result:
            return jsonify({"message": message}), 200
        else:
            return jsonify({"error": message}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500