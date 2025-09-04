from flask import Blueprint, request, jsonify
from services.user_service import *

user_bp = Blueprint('users', __name__)

@user_bp.route("/api/user", methods=["POST"])
def create_user_route():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"error": "Username e password sono obbligatori"}), 400
    
    user, message = create_user(username, password)
    if user:
        return jsonify({"message": message, "user_id": user.id}), 201

@user_bp.route("/api/users", methods=["GET"])
def get_all_users_route():
    users, message = get_all_users()
    users_data = [{"id": user.id, "username": user.username} for user in users]
    return jsonify({"message": message, "users": users_data}), 200

@user_bp.route("/api/auth", methods=["POST"])
def login_route():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"error": "Username e password sono obbligatori"}), 400
    
    user, message = authenticate_user(username, password)
    if user:
        return jsonify({"message": message, "user_id": user.id}), 200
    else:
        return jsonify({"error": message}), 401