from flask import Blueprint, request, jsonify
from services.lobby_service import *

lobby_bp = Blueprint('lobby', __name__)

@lobby_bp.route("/api/quiz/lobby/<int:quiz_id>", methods=["GET"])
def get_lobby_info(quiz_id):
    return "response"

@lobby_bp.route("/api/quiz/create/<int:quiz_id>", methods=["GET"])
def get_lobby_code(quiz_id):
    return create_lobby(quiz_id)