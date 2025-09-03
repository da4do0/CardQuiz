from flask import Flask
from services.user_service import create_user

@app.route("/api/user" methods=["POST"])
def create_user_route():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"error": "Username e password sono obbligatori"}), 400
    
    user, message = create_user(username, password)
    if user:
        return jsonify({"message": message, "user_id": user.id}), 201