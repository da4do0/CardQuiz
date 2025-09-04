from flask import Flask
from database import app, db
from routes.user_routes import user_bp

# Registra i blueprints
app.register_blueprint(user_bp)

@app.route('/')
def home():
    return """
    <h1>🎮 Quiz Game API</h1>
    <p>Server Flask attivo e funzionante!</p>
    
    <h3>📋 API Endpoints disponibili:</h3>
    <ul>
        <li><strong>GET</strong> /api/users - Lista utenti</li>
        <li><strong>POST</strong> /api/users - Crea utente</li>
        <li><strong>GET</strong> /api/users/&lt;id&gt; - Ottieni utente</li>
        <li><strong>DELETE</strong> /api/users/&lt;id&gt; - Elimina utente</li>
        <li><strong>POST</strong> /api/auth/login - Login</li>
        <li><strong>GET</strong> /api/health - Health check</li>
    </ul>
    
    <h3>🧪 Test veloce:</h3>
    <a href="/api/users">📋 Vedi tutti gli utenti</a><br>
    <a href="/api/health">💚 Health check</a>
    """

if __name__ == '__main__':
    with app.app_context():
        print("🚀 Quiz Game API Server Starting...")
        print("=" * 40)
        print("Server disponibile su: http://localhost:5000")
        print("API Base URL: http://localhost:5000/api")
        print("=" * 40)
        
        app.run(debug=True, host='0.0.0.0', port=5000)