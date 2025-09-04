from flask import Blueprint, request, jsonify
from services.quiz_service import create_quiz, get_quiz_by_id, get_quizzes_by_user, get_quiz_with_questions

quiz_bp = Blueprint('quizzes', __name__)

@quiz_bp.route("/api/quiz", methods=["POST"])
def create_quiz_route():
    data = request.get_json()
    print("Received data for quiz creation:", data)
    title = data.get("title") or data.get("nome")  # Support both field names
    questions = data.get("questions")
    userId = data.get("userId") or data.get("user_id")  # Support both field names
    
    if not title or not questions:
        return jsonify({"error": "Title and questions are required"}), 400
    
    if not userId:
        return jsonify({"error": "User ID is required"}), 400
    
    quiz, message = create_quiz(userId, title, questions)
    if quiz:
        return jsonify({"message": message, "quiz_id": quiz.id}), 201
    else:
        return jsonify({"error": message}), 500

@quiz_bp.route("/api/quiz/<int:quiz_id>", methods=["GET"])
def get_quiz_route(quiz_id):
    quiz, questions, message = get_quiz_with_questions(quiz_id)
    if quiz:
        quiz_data = {
            "id": quiz.id,
            "nome": quiz.nome,
            "data": quiz.data.isoformat(),
            "user_id": quiz.user_id,
            "questions": [{
                "id": q.id,
                "testo": q.testo,
                "risposta_1": q.risposta_1,
                "risposta_2": q.risposta_2,
                "risposta_3": q.risposta_3,
                "risposta_4": q.risposta_4,
                "risposta_corretta": q.risposta_corretta,
                "quiz_id": q.quiz_id
            } for q in questions] if questions else []
        }
        return jsonify({"message": message, "quiz": quiz_data}), 200
    else:
        return jsonify({"error": message}), 404

@quiz_bp.route("/api/user/<int:user_id>/quizzes", methods=["GET"])
def get_user_quizzes_route(user_id):
    quizzes, message = get_quizzes_by_user(user_id)
    if quizzes is not None:
        quizzes_data = [{
            "id": quiz.id,
            "nome": quiz.nome,
            "data": quiz.data.isoformat(),
            "user_id": quiz.user_id
        } for quiz in quizzes]
        return jsonify({"message": message, "quizzes": quizzes_data}), 200
    else:
        return jsonify({"error": message}), 500

