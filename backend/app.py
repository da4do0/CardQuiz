from flask import Flask
from database import app, db
from routes.user_routes import user_bp

# Registra i blueprints
app.register_blueprint(user_bp)

if __name__ == '__main__':
    app.run(debug=True)