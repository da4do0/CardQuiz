from flask import Flask
from flask_cors import CORS
from database import app, db
from routes.user_routes import user_bp
from routes.quiz_routes import quiz_bp

# Configura CORS (completamente libero)
CORS(app)


# Registra i blueprints
app.register_blueprint(user_bp)
app.register_blueprint(quiz_bp)

@app.route('/')
def home():
    return """
    <h1>Quiz Game API</h1>
    <p>Server Flask attivo e funzionante!</p>
    
    <h3>API Endpoints disponibili:</h3>
    <ul>
        <li><strong>GET</strong> /api/users - Lista utenti</li>
        <li><strong>POST</strong> /api/user - Crea utente</li>
        <li><strong>GET</strong> /api/user/&lt;id&gt; - Ottieni utente</li>
        <li><strong>POST</strong> /api/auth - Login</li>
        <li><strong>POST</strong> /api/quiz - Crea quiz</li>
        <li><strong>GET</strong> /api/quiz/&lt;id&gt; - Ottieni quiz</li>
        <li><strong>GET</strong> /api/quiz/&lt;id&gt;/lobby - Ottieni lobby info</li>
        <li><strong>POST</strong> /api/quiz/&lt;id&gt;/lobby/join - Unisciti alla lobby</li>
        <li><strong>POST</strong> /api/quiz/&lt;id&gt;/lobby/start - Inizia quiz (solo admin)</li>
        <li><strong>POST</strong> /api/quiz/&lt;id&gt;/lobby/leave - Lascia lobby</li>
    </ul>
    
    <h3>Test veloce:</h3>
    <a href="/api/users">Vedi tutti gli utenti</a><br>
    """

if __name__ == '__main__':
    with app.app_context():
        print("Quiz Game API Server Starting...")
        print("=" * 40)
        print("Server disponibile su: http://localhost:5000")
        print("API Base URL: http://localhost:5000/api")
        print("=" * 40)
        
        app.run(debug=True, host='0.0.0.0', port=5000)